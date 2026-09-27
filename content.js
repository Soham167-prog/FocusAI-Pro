(function () {
  if (window.__focusAIProContentInitialized) return;
  window.__focusAIProContentInitialized = true;

  const Core = window.__FocusAIProCore;
  if (!Core || typeof Core.getFocusScore !== "function") {
    console.warn("Focus AI Pro: focus-core.js missing or invalid.");
    return;
  }

  const badgeStyleId = "focusai-badge-style";
  const badgeWrapClass = "focusai-score-badge-wrap";
  const scoreAppliedClass = "focusai-score-applied";
  const filterAppliedClass = "focusai-filter-applied";
  const warningOverlayId = "focusai-intent-warning-overlay";
  const STATS_INTERVAL_MS = 5000;
  const STATS_MAX_DELTA_MS = 60000;
  const MIN_INTENT_MATCH_PERCENT = 40;

  const FocusAI = {
    focusMode: true,
    filterMode: "blur",
    shortsStyleId: "focusai-shorts-style",
    recommendStyleId: "focusai-recommendations-style",
    pipUIId: "focusai-floating-pip",
    _observer: null,
    _debounceTimer: null,
    _mutationNodes: new Set(),
    _runSeq: 0,
    _homepageFilterTimer: null,
    _isFiltering: false,
    _statsTimer: null,
    _statsLastTick: 0,
    _clickGuardAttached: false,
    _warningOverlayTimer: null,
    _intentText: "",
    _videoSession: null,

    init() {
      try {
        if (chrome?.storage?.onChanged) {
          chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === "sync") {
              if (!changes.focusMode && !changes.intent && !changes.userIntent) return;
              this.run();
              return;
            }

            if (areaName === "local") {
              if (!changes.filterMode && !changes.strictMode) return;
              this.run();
            }
          });
        }
      } catch (e) {
        // Ignore; content scripts can still function without the storage listener.
      }

      this.observe();
      this.attachClickGuard();
      window.addEventListener("pagehide", () => this._finalizeVideoSession());
      window.addEventListener("beforeunload", () => this._finalizeVideoSession());
      window.addEventListener("yt-navigate-finish", () => this.run());
      window.addEventListener("popstate", () => this.run());
      this.run();

      // Fallback polling loop to guarantee consistency across SPA and dynamic lazy loads
      setInterval(() => {
        if (!this.focusMode) return;
        this.applyHomepageFilter(this._intentText, null, true);
        this.applyHomepageFocusBadges(this._intentText, null);
      }, 1000);
    },

    run() {
      if (this._isFiltering) return;
      this._isFiltering = true;

      const seq = ++this._runSeq;
      chrome.storage.sync.get(["focusMode", "userIntent", "intent"], (data) => {
        if (seq !== this._runSeq) {
          this._isFiltering = false;
          return;
        }

        this.focusMode = data.focusMode ?? true;
        this._ensureStatsTracking();
        chrome.storage.local.get(
          { filterMode: "blur", strictMode: false },
          (localData) => {
            if (seq !== this._runSeq) {
              this._isFiltering = false;
              return;
            }

            this.filterMode = this.normalizeFilterMode(
              localData.filterMode,
              localData.strictMode
            );

            if (!this.focusMode) {
              this.disableEffects();
              this._isFiltering = false;
              return;
            }

            this.hideShorts();
            this.hideRecommendations();
            this.renderFloatingPiP();

            if (this._homepageFilterTimer) {
              clearTimeout(this._homepageFilterTimer);
              this._homepageFilterTimer = null;
            }

            const intent = data.userIntent || data.intent || "";
            this._intentText = typeof intent === "string" ? intent : "";
            this._homepageFilterTimer = setTimeout(() => {
              this.applyHomepageFilter(intent);
              this.applyHomepageFocusBadges(intent);
            }, 1500);

            this._isFiltering = false;
          }
        );
      });
    },

    normalizeFilterMode(modeValue, strictLegacy) {
      if (modeValue === "strict" || modeValue === "blur") return modeValue;
      if (strictLegacy === true) return "strict";
      return "blur";
    },

    observe() {
      if (!document.body) return;
      if (this._observer) return;

      this._observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (!mutation.addedNodes || mutation.addedNodes.length === 0) continue;
          for (const node of mutation.addedNodes) {
            if (node && node.nodeType === 1) {
              this._mutationNodes.add(node);
            }
          }
        }

        if (this._mutationNodes.size === 0) return;
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => this.processAddedNodes(), 180);
      });

      this._observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    processAddedNodes() {
      const nodes = Array.from(this._mutationNodes);
      this._mutationNodes.clear();
      if (!nodes.length) return;
      if (!this.focusMode) return;

      // Incremental path: process only newly inserted cards/UI.
      const cards = this.collectCardsFromNodes(nodes);
      if (cards.length) {
        this.applyHomepageFilter(this._intentText, cards, true);
        this.applyHomepageFocusBadges(this._intentText, cards);
      }

      // Keep watch-page utilities resilient to dynamic player DOM.
      if (window.location.pathname === "/watch") {
        this.renderFloatingPiP();
      }
    },

    collectCardsFromNodes(nodes) {
      const cards = [];
      const seen = new Set();
      for (const node of nodes) {
        if (!(node instanceof Element)) continue;

        if (
          node.matches &&
          node.matches("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model")
        ) {
          if (!seen.has(node)) {
            seen.add(node);
            cards.push(node);
          }
        }

        const nested = node.querySelectorAll
          ? node.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model")
          : [];
        for (const card of nested) {
          if (!seen.has(card)) {
            seen.add(card);
            cards.push(card);
          }
        }
      }
      return cards;
    },

    attachClickGuard() {
      if (this._clickGuardAttached) return;
      document.addEventListener(
        "click",
        (event) => this.handlePotentialVideoClick(event),
        true
      );
      this._clickGuardAttached = true;
    },

    async handlePotentialVideoClick(event) {
      if (!event || event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target.toLowerCase() === "_blank") return;

      const href = anchor.getAttribute("href") || "";
      if (!href.includes("/watch")) return;

      const card =
        anchor.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model") || null;
      const titleRaw = this.extractClickedVideoTitle(anchor, card);
      if (!titleRaw) return;

      const settings = await this.getSyncSettings();
      if (!settings.focusMode) return;

      const activeIntent = settings.userIntent || settings.intent || "";
      const matchPercent = this.computeIntentMatchPercent(titleRaw, activeIntent);
      if (matchPercent >= MIN_INTENT_MATCH_PERCENT) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.showIntentWarningOverlay(
        "Stay focused. This video is distracting your intent."
      );
      window.location.href = "https://www.youtube.com/";
    },

    getSyncSettings() {
      return new Promise((resolve) => {
        chrome.storage.sync.get(
          { focusMode: true, userIntent: "", intent: "" },
          (data) =>
            resolve(
              data || { focusMode: true, userIntent: "", intent: "" }
            )
        );
      });
    },

    extractClickedVideoTitle(anchor, card) {
      if (card) {
        const fromCard = this.extractCardTitleRaw(card);
        if (fromCard) return fromCard;
      }

      const aria = anchor.getAttribute("aria-label")?.trim();
      if (aria) return aria;

      const title = anchor.getAttribute("title")?.trim();
      if (title) return title;

      const text = anchor.textContent?.trim();
      if (text) return text;

      return "";
    },

    computeIntentMatchPercent(title, intent) {
      const keywords = this.normalizeIntentToKeywords(intent);
      if (!keywords.length) return 100;

      const normalizedTitle = String(title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, " ");
      if (!normalizedTitle.trim()) return 0;

      const keywordHitRatio =
        keywords.filter((kw) => normalizedTitle.includes(kw)).length /
        keywords.length;

      const intentTokens = this.tokenizeForSimilarity(keywords.join(" "));
      const titleTokens = this.tokenizeForSimilarity(normalizedTitle);
      const cosine = this.computeCosineSimilarity(intentTokens, titleTokens);

      // Blend direct keyword hit-ratio with cosine semantic overlap.
      const blended = keywordHitRatio * 0.6 + cosine * 0.4;
      return Math.round(Math.max(0, Math.min(1, blended)) * 100);
    },

    tokenizeForSimilarity(text) {
      return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, " ")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2)
        .map((t) => this.stemToken(t));
    },

    stemToken(token) {
      let t = String(token || "");
      if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
      else if (t.length > 4 && t.endsWith("ed")) t = t.slice(0, -2);
      else if (t.length > 4 && t.endsWith("es")) t = t.slice(0, -2);
      else if (t.length > 3 && t.endsWith("s")) t = t.slice(0, -1);
      return t;
    },

    toTermFrequency(tokens) {
      const tf = new Map();
      for (const token of tokens) {
        if (!token) continue;
        tf.set(token, (tf.get(token) || 0) + 1);
      }
      return tf;
    },

    computeCosineSimilarity(tokensA, tokensB) {
      if (!tokensA.length || !tokensB.length) return 0;

      const tfA = this.toTermFrequency(tokensA);
      const tfB = this.toTermFrequency(tokensB);
      const terms = new Set([...tfA.keys(), ...tfB.keys()]);

      let dot = 0;
      let magA = 0;
      let magB = 0;
      for (const term of terms) {
        const a = tfA.get(term) || 0;
        const b = tfB.get(term) || 0;
        dot += a * b;
        magA += a * a;
        magB += b * b;
      }

      if (magA === 0 || magB === 0) return 0;
      return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    },

    showIntentWarningOverlay(message) {
      let overlay = document.getElementById(warningOverlayId);
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = warningOverlayId;
        Object.assign(overlay.style, {
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "2147483647",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(157, 23, 77, 0.95)",
          color: "#fff",
          fontWeight: "800",
          fontSize: "13px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
        });
        document.body.appendChild(overlay);
      }

      overlay.textContent =
        message || "Stay focused. This video is distracting your intent.";
      overlay.style.display = "block";

      if (this._warningOverlayTimer) {
        clearTimeout(this._warningOverlayTimer);
      }
      this._warningOverlayTimer = setTimeout(() => {
        const el = document.getElementById(warningOverlayId);
        if (el) el.style.display = "none";
      }, 2500);
    },

    _ensureBadgeStyles() {
      if (document.getElementById(badgeStyleId)) return;
      const style = document.createElement("style");
      style.id = badgeStyleId;
      style.textContent = `
        .${badgeWrapClass} {
          position: absolute;
          left: 8px;
          bottom: 8px;
          z-index: 6;
          padding: 4px 8px;
          border-radius: 8px;
          font: 700 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: #fff;
          pointer-events: none;
          max-width: calc(100% - 16px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        }
        .${badgeWrapClass}.focusai-badge-relevant {
          background: rgba(34, 197, 94, 0.92);
        }
        .${badgeWrapClass}.focusai-badge-neutral {
          background: rgba(234, 179, 8, 0.92);
          color: #111111;
        }
        .${badgeWrapClass}.focusai-badge-distract {
          background: rgba(220, 38, 38, 0.92);
        }
        ytd-thumbnail #thumbnail,
        #thumbnail {
          position: relative;
        }
      `;
      document.head.appendChild(style);
    },

    removeBadgeStyles() {
      this.removeStyleEl(badgeStyleId);
    },

    removeHomepageFocusBadges() {
      document.querySelectorAll(`.${badgeWrapClass}`).forEach((el) => {
        el.remove();
      });
      document.querySelectorAll(`.${scoreAppliedClass}`).forEach((el) => {
        el.classList.remove(scoreAppliedClass);
      });
    },

    applyHomepageFocusBadges(intent, inputCards) {
      if (!this.focusMode) return;

      this._ensureBadgeStyles();

      const cards =
        inputCards ||
        document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model");

      cards.forEach((card) => {
        const titleRaw = this.extractCardTitleRaw(card);
        if (!titleRaw) return;

        const score = this.computeIntentMatchPercent(titleRaw, intent);
        const label = `${score}%`;

        const thumbHost =
          card.querySelector("ytd-thumbnail #thumbnail") ||
          card.querySelector("#thumbnail") ||
          card;

        if (getComputedStyle(thumbHost).position === "static") {
          thumbHost.style.position = "relative";
        }

        let wrap = card.querySelector(`.${badgeWrapClass}`);
        if (!wrap) {
          wrap = document.createElement("div");
          wrap.className = badgeWrapClass;
          thumbHost.appendChild(wrap);
        }

        wrap.textContent = label;
        wrap.classList.remove(
          "focusai-badge-relevant",
          "focusai-badge-neutral",
          "focusai-badge-distract"
        );
        if (score >= 70) {
          wrap.classList.add("focusai-badge-relevant");
        } else if (score >= 40) {
          wrap.classList.add("focusai-badge-neutral");
        } else {
          wrap.classList.add("focusai-badge-distract");
        }

        card.classList.add(scoreAppliedClass);
      });
    },

    _ensureStatsTracking() {
      if (this._statsTimer) return;
      this._statsLastTick = Date.now();
      this._statsTimer = setInterval(() => this._statsTick(), STATS_INTERVAL_MS);
      document.addEventListener("visibilitychange", () => {
        this._statsLastTick = Date.now();
      });
    },

    _statsTick() {
      const now = Date.now();
      let dt = now - (this._statsLastTick || now);
      this._statsLastTick = now;
      if (dt < 0) dt = 0;
      if (dt > STATS_MAX_DELTA_MS) dt = STATS_MAX_DELTA_MS;

      if (document.visibilityState !== "visible") return;
      if (!document.hasFocus || !document.hasFocus()) return;

      chrome.storage.local.get(
        { totalYouTubeMs: 0, focusModeMs: 0 },
        (stored) => {
          const nextTotal = (stored.totalYouTubeMs || 0) + dt;
          const nextFocus =
            (stored.focusModeMs || 0) + (this.focusMode ? dt : 0);
          chrome.storage.local.set({
            totalYouTubeMs: nextTotal,
            focusModeMs: nextFocus,
          });
        }
      );

      this._trackCurrentVideo(dt);
    },

    _getActiveVideoId() {
      if (window.location.pathname !== "/watch") return "";
      const params = new URLSearchParams(window.location.search || "");
      return params.get("v") || "";
    },

    _getActiveVideoTitle() {
      const h1Title = document.querySelector(
        "ytd-watch-metadata h1 yt-formatted-string"
      );
      const title =
        h1Title?.textContent?.trim() ||
        document.querySelector("h1.title yt-formatted-string")?.textContent?.trim() ||
        document.title.replace(/\s*-\s*YouTube\s*$/i, "").trim();
      return title || "";
    },

    _trackCurrentVideo(dtMs) {
      const videoId = this._getActiveVideoId();
      if (!videoId) {
        this._finalizeVideoSession();
        return;
      }

      const title = this._getActiveVideoTitle();
      if (!title) return;

      if (!this._videoSession || this._videoSession.videoId !== videoId) {
        this._finalizeVideoSession();
        this._videoSession = {
          videoId,
          title,
          watchedMs: 0,
          startedAt: Date.now(),
        };
      } else if (this._videoSession.title !== title) {
        this._videoSession.title = title;
      }

      const isPlaying = this._isActiveVideoPlaying();
      if (isPlaying) {
        this._videoSession.watchedMs += dtMs;
      }
    },

    _isActiveVideoPlaying() {
      const activeVideo = this.findEligibleVideo();
      if (!activeVideo) return false;
      return !activeVideo.paused && !activeVideo.ended && activeVideo.readyState > 2;
    },

    _finalizeVideoSession() {
      const session = this._videoSession;
      this._videoSession = null;
      if (!session || !session.title) return;

      const durationSeconds = Math.max(0, Math.round((session.watchedMs || 0) / 1000));
      if (durationSeconds <= 0) return;

      const score = this.computeIntentMatchPercent(session.title, this._intentText);
      const relevanceCategory =
        score >= MIN_INTENT_MATCH_PERCENT ? "relevant" : "distracting";
      const category =
        typeof Core.classifyVideoCategory === "function"
          ? Core.classifyVideoCategory(session.title, "")
          : "Other";
      const log = {
        title: session.title,
        duration: durationSeconds,
        score,
        relevanceCategory,
        category,
        timestamp: Date.now(),
      };

      this._appendBehaviorLog(log);
    },

    _appendBehaviorLog(logEntry) {
      chrome.storage.local.get({ behaviorLogs: [] }, (stored) => {
        const existing = Array.isArray(stored.behaviorLogs) ? stored.behaviorLogs : [];
        const next = existing.concat(logEntry).slice(-500);
        chrome.storage.local.set({ behaviorLogs: next });
      });
    },

    disableEffects() {
      if (this._homepageFilterTimer) {
        clearTimeout(this._homepageFilterTimer);
        this._homepageFilterTimer = null;
      }
      this.removeStyleEl(this.shortsStyleId);
      this.removeStyleEl(this.recommendStyleId);
      this.removeBadgeStyles();

      this.resetHomepageFilter();
      this.removeHomepageFocusBadges();

      const fPip = document.getElementById(this.pipUIId);
      if (fPip) fPip.remove();
    },

    removeStyleEl(styleId) {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    },

    hideShorts() {
      if (document.getElementById(this.shortsStyleId)) return;

      const css = `
        a#endpoint[title="Shorts"],
        a#endpoint[title="Shorts"] * {
          display: none !important;
        }

        ytd-shorts.ytd-page-manager {
          display: none !important;
        }

        ytd-rich-section-renderer ytd-rich-shelf-renderer[is-shorts] {
          display: none !important;
        }

        ytd-reel-shelf-renderer,
        ytd-reel-video-renderer,
        ytm-reel-shelf-renderer,
        ytd-rich-shelf-renderer[is-shorts],
        yt-lockup-view-model[data-content-type="shorts"],
        [is-shorts] {
          display: none !important;
        }
      `;

      const style = document.createElement("style");
      style.id = this.shortsStyleId;
      style.textContent = css;
      document.head.appendChild(style);
    },

    hideRecommendations() {
      if (window.location.pathname !== "/watch") return;
      if (document.getElementById(this.recommendStyleId)) return;

      const css = `
        ytd-watch-engagement-panel-section-renderer,
        ytd-player-legacy-watch-engagement-panel-renderer,
        #engagement-panel,
        ytd-engagement-panel-section-renderer {
          display: none !important;
        }
      `;

      const style = document.createElement("style");
      style.id = this.recommendStyleId;
      style.textContent = css;
      document.head.appendChild(style);
    },

    findEligibleVideo() {
      const videos = Array.from(document.querySelectorAll("video"))
        .filter((v) => v && v.disablePictureInPicture == false)
        .filter((v) => v.readyState !== 0);

      if (!videos.length) return null;

      videos.sort((v1, v2) => {
        const r1 = v1.getClientRects()[0] || { width: 0, height: 0 };
        const r2 = v2.getClientRects()[0] || { width: 0, height: 0 };
        return r2.width * r2.height - r1.width * r1.height;
      });

      return videos[0] || null;
    },

    renderFloatingPiP() {
      if (window.location.pathname !== "/watch") return;
      if (!this.focusMode) return;
      if (document.getElementById(this.pipUIId)) return;

      const btn = document.createElement("button");
      btn.id = this.pipUIId;
      btn.type = "button";
      btn.title = "Drag to reposition. Click to toggle Picture-in-Picture.";
      btn.innerHTML = `
        <span style="display:flex;align-items:center;gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="11" y="11" width="8" height="6" rx="1" ry="1"></rect>
          </svg>
          PiP Mode
        </span>
      `;

      Object.assign(btn.style, {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: "2147483647",
        background: "linear-gradient(135deg, #4f46e5, #9333ea)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        padding: "12px 20px",
        cursor: "grab",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "transform 0.1s ease, box-shadow 0.1s ease"
      });

      btn.addEventListener("mouseenter", () => {
        btn.style.boxShadow = "0 14px 28px rgba(0,0,0,0.6)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
      });

      let isDragging = false;
      let startX, startY, initialRight, initialBottom;
      
      btn.addEventListener("mousedown", (e) => {
        isDragging = false;
        btn.style.cursor = "grabbing";
        startX = e.clientX;
        startY = e.clientY;
        const rect = btn.getBoundingClientRect();
        initialRight = window.innerWidth - rect.right;
        initialBottom = window.innerHeight - rect.bottom;
        
        const onMouseMove = (moveEvent) => {
          const dx = startX - moveEvent.clientX;
          const dy = startY - moveEvent.clientY;
          if (!isDragging && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
          isDragging = true;
          btn.style.right = `${initialRight + dx}px`;
          btn.style.bottom = `${initialBottom + dy}px`;
        };
        const onMouseUp = () => {
          btn.style.cursor = "grab";
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      btn.addEventListener("click", async (e) => {
        if (isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        try {
          const video = this.findEligibleVideo();
          if (!video) return;

          if (window.documentPictureInPicture && window.documentPictureInPicture.window) {
            window.documentPictureInPicture.window.close();
            return;
          }

          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
            return;
          }

          if ("documentPictureInPicture" in window) {
            const pipWindow = await window.documentPictureInPicture.requestWindow({
              width: video.clientWidth || 640,
              height: video.clientHeight || 360,
            });

            const originalContainer = video.parentElement;
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "contain";
            video.style.maxHeight = "100vh";
            pipWindow.document.body.style.margin = "0";
            pipWindow.document.body.style.backgroundColor = "#000";
            
            pipWindow.document.body.appendChild(video);

            pipWindow.addEventListener("pagehide", () => {
              video.style.width = "";
              video.style.height = "";
              video.style.objectFit = "";
              video.style.maxHeight = "";
              if (originalContainer) originalContainer.appendChild(video);
            });
          } else if (!video.disablePictureInPicture) {
            await video.requestPictureInPicture();
          }
        } catch (err) {
          console.warn("Focus AI Pro: Failed to toggle native PiP", err);
        }
      });

      document.body.appendChild(btn);
    },

    applyHomepageFilter(intent, videosInput, incremental) {
      if (!this.focusMode) return;

      const videos =
        videosInput ||
        document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model");

      const modeSignature = this.filterMode === "strict" ? "strict" : "blur";
      const intentSignature = String(intent || "").trim().toLowerCase();
      const filterSignature = `${modeSignature}::${intentSignature}`;

      if (!incremental) {
        videos.forEach((video) => {
          video.style.opacity = "";
          video.style.filter = "";
          video.style.pointerEvents = "";
          video.style.display = "";
          video.classList.remove(filterAppliedClass);
          delete video.dataset.focusaiFilterSignature;
        });
      }

      const intentText = typeof intent === "string" ? intent : String(intent ?? "");
      if (!intentText.trim()) return;

      const keywords = intentText
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, " ")
        .split(/\s+/)
        .filter((w) => w);

      if (!keywords.length) return;

      videos.forEach((video) => {
        const prevSig = video.dataset.focusaiFilterSignature || "";
        if (incremental && prevSig === filterSignature) return;

        const title = this.extractCardTitle(video);
        if (!title) return;

        const matchScore = this.computeIntentMatchPercent(title, intentText);
        const match = matchScore >= MIN_INTENT_MATCH_PERCENT;

        if (this.filterMode === "strict") {
          video.style.display = match ? "" : "none";
        } else {
          video.style.display = "";
          video.style.opacity = match ? "1" : "0.5";
          video.style.filter = match ? "" : "blur(8px)";
          video.style.pointerEvents = match ? "" : "none";
          video.style.cursor = match ? "" : "not-allowed";
        }

        video.dataset.focusaiFilterSignature = filterSignature;
        video.classList.add(filterAppliedClass);
      });
    },

    normalizeIntentToKeywords(intent) {
      if (!intent) return [];

      const stopWords = new Set([
        "learn",
        "how",
        "what",
        "best",
        "tutorial",
        "guide",
        "video",
      ]);

      const toWords = (s) =>
        String(s)
          .toLowerCase()
          .replace(/[^a-z0-9\s]+/g, " ")
          .split(/[,]+/)
          .flatMap((chunk) => chunk.split(/\s+/))
          .map((w) => w.trim())
          .filter((w) => w.length >= 1 && !stopWords.has(w));

      const parts = Array.isArray(intent) ? intent.flatMap(toWords) : toWords(intent);
      return Array.from(new Set(parts));
    },

    extractCardTitle(card) {
      const raw = this.extractCardTitleRaw(card);
      return raw ? raw.toLowerCase() : "";
    },

    extractCardTitleRaw(card) {
      const pickers = [
        card.querySelector("a#video-title"),
        card.querySelector("h3 a"),
        card.querySelector("yt-formatted-string#video-title"),
      ];

      for (const el of pickers) {
        const t = el?.textContent?.trim();
        if (t) return t;
      }

      return "";
    },

    resetHomepageFilter() {
      const videos = document.querySelectorAll(
        "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model"
      );

      videos.forEach((video) => {
        video.style.opacity = "";
        video.style.filter = "";
        video.style.pointerEvents = "";
        video.style.display = "";
      });
    },

  };

  FocusAI.init();
})();
