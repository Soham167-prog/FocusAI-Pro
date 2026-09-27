/**
 * Shared scoring + summary helpers for Focus AI Pro (content script).
 * Loaded before content.js via manifest order.
 */
(function initFocusCore(global) {
  const POSITIVE_WORDS = [
    "learn",
    "tutorial",
    "course",
    "guide",
    "explained",
  ];
  const NEGATIVE_WORDS = [
    "funny",
    "prank",
    "song",
    "shorts",
    "comedy",
  ];
  const FOCUS_PHRASES = [
    "machine learning",
    "data science",
    "deep learning",
    "web development",
    "system design",
  ];
  const KEYWORD_EXPANSION_MAP = {
    learn: ["study", "understand", "master"],
    tutorial: ["walkthrough", "step by step", "how to"],
    course: ["bootcamp", "lesson", "curriculum"],
    guide: ["handbook", "playbook", "blueprint"],
    explained: ["breakdown", "overview", "fundamentals"],
    "machine learning": ["ml", "model training", "neural network"],
    "data science": ["data analysis", "analytics", "statistics"],
  };
  const CATEGORY_KEYWORDS = {
    Learning: [
      "learn",
      "tutorial",
      "course",
      "guide",
      "explained",
      "lecture",
      "lesson",
      "coding",
      "programming",
      "education",
    ],
    Entertainment: [
      "funny",
      "comedy",
      "prank",
      "song",
      "music",
      "movie",
      "trailer",
      "vlog",
      "gaming",
      "shorts",
    ],
    News: [
      "news",
      "headline",
      "breaking",
      "report",
      "politics",
      "economy",
      "election",
      "update",
      "live",
      "world",
    ],
  };

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildExpandedKeywordSet() {
    const set = new Set(POSITIVE_WORDS);
    for (const [base, expansions] of Object.entries(KEYWORD_EXPANSION_MAP)) {
      set.add(base);
      for (const item of expansions || []) {
        if (item) set.add(item);
      }
    }
    return Array.from(set);
  }

  function hasExactPhraseMatch(phrase, text) {
    if (!phrase || !text) return false;
    const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
    return re.test(text);
  }

  function hasKeywordMatch(keyword, text) {
    if (!keyword || !text) return false;
    const re = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
    return re.test(text);
  }

  function hasPartialMatch(keyword, text) {
    if (!keyword || !text) return false;
    const token = keyword.split(/\s+/)[0];
    if (!token || token.length < 4) return false;
    return text.includes(token);
  }

  function classifyVideoCategory(title, transcript) {
    const text = normalizeText(`${title || ""} ${transcript || ""}`);
    if (!text) return "Other";

    let bestCategory = "Other";
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        if (hasKeywordMatch(kw, text)) score += 2;
        else if (hasPartialMatch(kw, text)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    return bestScore > 0 ? bestCategory : "Other";
  }

  /**
   * @param {string} title
   * @param {string} transcript
   * @returns {number} 0–100
   */
  function getFocusScore(title, transcript) {
    const text = normalizeText(`${title || ""} ${transcript || ""}`);
    if (!text) return 0;

    let weightedScore = 0;
    const matchedKeywords = new Set();
    const expandedKeywords = buildExpandedKeywordSet();

    for (const phrase of FOCUS_PHRASES) {
      if (hasExactPhraseMatch(phrase, text)) {
        weightedScore += 40;
      }
    }

    for (const keyword of expandedKeywords) {
      if (hasKeywordMatch(keyword, text)) {
        weightedScore += 20;
        matchedKeywords.add(keyword);
      } else if (hasPartialMatch(keyword, text)) {
        weightedScore += 10;
      }
    }

    for (const bad of NEGATIVE_WORDS) {
      if (hasKeywordMatch(bad, text)) {
        weightedScore -= 20;
      } else if (hasPartialMatch(bad, text)) {
        weightedScore -= 10;
      }
    }

    // Lightweight normalization to 0-100 with soft cap.
    const normalized = Math.round(weightedScore);
    if (normalized < 0) return 0;
    if (normalized > 100) return 100;
    return normalized;
  }

  function splitSentences(text) {
    const normalized = String(text).replace(/\s+/g, " ").trim();
    if (!normalized) return [];
    return normalized
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function scoreSentenceForSummary(sentence) {
    const words = sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const unique = new Set(words);
    const len = sentence.length;
    return unique.size * 2 + Math.min(len / 40, 6);
  }

  /**
   * Extractive summary: 3 bullets + short explanation from transcript text.
   * @param {string} text
   * @returns {{ bullets: string[], explanation: string }}
   */
  function buildTranscriptSummary(text) {
    const sentences = splitSentences(text);
    if (!sentences.length) {
      return { bullets: [], explanation: "" };
    }

    const ranked = sentences
      .map((s, i) => ({ s, i, score: scoreSentenceForSummary(s) }))
      .sort((a, b) => b.score - a.score || a.i - b.i);

    const picked = [];
    const used = new Set();
    for (const item of ranked) {
      if (picked.length >= 3) break;
      if (used.has(item.s)) continue;
      picked.push(item.s);
      used.add(item.s);
    }

    const bullets = picked.map((s) => s.replace(/^[-•*]\s*/, "").trim());

    const explainSource = sentences.slice(0, 3).join(" ");
    let explanation = explainSource;
    if (explanation.length > 320) {
      explanation = `${explanation.slice(0, 317)}…`;
    }

    return { bullets, explanation };
  }

  function formatSummaryOutput(summary) {
    if (!summary || !summary.bullets.length) {
      return "No summary available.";
    }
    const bulletBlock = summary.bullets.map((b) => `• ${b}`).join("\n");
    return `${bulletBlock}\n\n${summary.explanation}`.trim();
  }

  global.__FocusAIProCore = {
    getFocusScore,
    buildTranscriptSummary,
    formatSummaryOutput,
    POSITIVE_WORDS,
    NEGATIVE_WORDS,
    FOCUS_PHRASES,
    KEYWORD_EXPANSION_MAP,
    CATEGORY_KEYWORDS,
    classifyVideoCategory,
  };
})(typeof window !== "undefined" ? window : self);
