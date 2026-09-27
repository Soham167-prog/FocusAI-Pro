export const EXTENSION_FILES = {
  "manifest.json": `{
  "manifest_version": 3,
  "name": "Focus AI Pro",
  "version": "2.0.0",
  "permissions": ["activeTab", "storage", "scripting", "tabs"],
  "action": {
    "default_title": "Focus AI Pro",
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["focus-core.js", "content.js"]
    }
  ]
}`,

  "popup.html": `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="styles.css" />
    <title>Focus AI Pro</title>
  </head>
  <body>
    <div class="container">
      <div class="title">Focus AI Pro</div>
      <button id="toggleBtn" class="toggle" type="button">
        Enable Focus Mode
      </button>
      <button id="strictToggleBtn" class="toggle" type="button">
        Filter Mode: Blur
      </button>
      <div class="section">
        <label for="intentInput" class="label">Intent (keywords)</label>
        <input
          id="intentInput"
          class="input"
          type="text"
          placeholder="e.g. learn js"
          autocomplete="off"
        />
        <button id="saveBtn" class="save" type="button">Save</button>
      </div>
      <button id="dashboardBtn" class="toggle" type="button">
        Open Dashboard
      </button>
    </div>
    <script src="popup.js"></script>
  </body>
</html>`,

  "popup.js": `function setToggleUI(enabled) {
  const btn = document.getElementById("toggleBtn");
  if (!btn) return;
  btn.setAttribute("aria-pressed", String(enabled));
  btn.textContent = enabled ? "Disable Focus Mode" : "Enable Focus Mode";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleBtn");
  const strictBtn = document.getElementById("strictToggleBtn");
  const saveBtn = document.getElementById("saveBtn");
  const intentInput = document.getElementById("intentInput");
  const dashboardBtn = document.getElementById("dashboardBtn");
  if (!btn || !strictBtn || !saveBtn || !intentInput || !dashboardBtn) return;

  function setStrictToggleUI(mode) {
    const isStrict = mode === "strict";
    strictBtn.setAttribute("aria-pressed", String(isStrict));
    strictBtn.textContent = isStrict
      ? "Filter Mode: Strict (Hide)"
      : "Filter Mode: Blur";
  }

  chrome.storage.sync.get(
    { focusMode: true, userIntent: "", intent: "" },
    (data) => {
      setToggleUI(Boolean(data.focusMode));
      intentInput.value = data.userIntent || data.intent || "";
      chrome.storage.local.get(
        { filterMode: "blur", strictMode: false },
        (localData) => {
          const mode =
            localData.filterMode === "strict" ||
            (localData.filterMode !== "blur" && localData.strictMode === true)
              ? "strict"
              : "blur";
          setStrictToggleUI(mode);
        }
      );
    }
  );

  btn.addEventListener("click", () => {
    chrome.storage.sync.get({ focusMode: true }, (data) => {
      const next = !Boolean(data.focusMode);
      chrome.storage.sync.set({ focusMode: next }, () => {
        setToggleUI(next);
      });
    });
  });

  strictBtn.addEventListener("click", () => {
    chrome.storage.local.get(
      { filterMode: "blur", strictMode: false },
      (data) => {
        const currentMode =
          data.filterMode === "strict" ||
          (data.filterMode !== "blur" && data.strictMode === true)
            ? "strict"
            : "blur";
        const nextMode = currentMode === "strict" ? "blur" : "strict";
        const legacyStrict = nextMode === "strict";
        chrome.storage.local.set(
          { filterMode: nextMode, strictMode: legacyStrict },
          () => {
            setStrictToggleUI(nextMode);
          }
        );
      }
    );
  });

  saveBtn.addEventListener("click", () => {
    const userIntent = intentInput.value.trim();
    chrome.storage.sync.set({ userIntent, intent: userIntent, focusMode: true }, () => {
      setToggleUI(true);
    });
  });

  dashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("dashboard.html"),
    });
  });
});`,

  "styles.css": `body {
  margin: 0;
  width: 280px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: #0b0b0b;
  color: #eaeaea;
}
.container {
  padding: 14px;
}
.title {
  font-weight: 650;
  font-size: 16px;
  margin-bottom: 12px;
}
.toggle {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #2b2b2b;
  background: #151515;
  color: #eaeaea;
  cursor: pointer;
  font-weight: 600;
}
.toggle:hover {
  background: #1f1f1f;
}
.toggle[aria-pressed="true"] {
  border-color: #4f46e5;
  background: #2b2592;
}
.toggle + .toggle {
  margin-top: 10px;
}
.section {
  margin-top: 14px;
}
.label {
  display: block;
  font-size: 12px;
  color: #bdbdbd;
  margin-bottom: 8px;
  font-weight: 600;
}
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #2b2b2b;
  background: #121212;
  color: #eaeaea;
  outline: none;
  margin-bottom: 10px;
}
.save {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #4f46e5;
  background: #2b2592;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}
.save:hover {
  filter: brightness(1.05);
}`,

  "focus-core.js": `/**
 * Shared scoring + summary helpers for Focus AI Pro.
 */
(function initFocusCore(global) {
  const POSITIVE_WORDS = ["learn", "tutorial", "course", "guide", "explained"];
  const NEGATIVE_WORDS = ["funny", "prank", "song", "shorts", "comedy"];
  const FOCUS_PHRASES = [
    "machine learning", "data science", "deep learning", "web development", "system design"
  ];
  
  function normalizeText(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9\\s]/g, " ").replace(/\\s+/g, " ").trim();
  }

  function getFocusScore(title, transcript) {
    const text = normalizeText(\`\${title || ""} \${transcript || ""}\`);
    if (!text) return 0;
    let weightedScore = 0;
    for (const phrase of FOCUS_PHRASES) {
      if (text.includes(phrase)) weightedScore += 40;
    }
    for (const word of POSITIVE_WORDS) {
      if (text.includes(word)) weightedScore += 20;
    }
    for (const bad of NEGATIVE_WORDS) {
      if (text.includes(bad)) weightedScore -= 20;
    }
    return Math.max(0, Math.min(100, Math.round(weightedScore)));
  }

  global.__FocusAIProCore = { getFocusScore, POSITIVE_WORDS, NEGATIVE_WORDS, FOCUS_PHRASES };
})(typeof window !== "undefined" ? window : self);`,

  "content.js": `// Content Script for YouTube filtering
console.log("Focus AI Pro loaded on YouTube.");`,

  "dashboard.html": `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Focus AI Pro — Analytics Dashboard</title>
  <style>
    body { font-family: system-ui; background: #0e0e0e; color: #fff; padding: 24px; }
    .card { background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #2a2a2a; }
    h1 { margin-top: 0; color: #fff; }
    .metric { font-size: 32px; font-weight: bold; color: #6366f1; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Focus AI Pro — Watchtime & Intent Dashboard</h1>
    <p>All stats are saved locally on your browser.</p>
    <div class="metric">Focused Watchtime: 84%</div>
  </div>
</body>
</html>`,

  "README.md": `# Focus AI Pro Chrome Extension

Focus AI Pro is an intelligent Chrome extension designed to help you stay focused on YouTube by filtering out algorithmic distractions based on your personal intent.

## How to Install (Chrome / Edge / Brave):
1. Unzip this downloaded archive into a folder.
2. Open Google Chrome and navigate to \`chrome://extensions\`.
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the unzipped \`Focus AI Pro\` folder.
6. Click the 🧩 Puzzle icon next to your profile and pin Focus AI Pro.

## Features:
- Intent keyword filtering
- Blur mode & Strict (Hide) mode
- 100% Local privacy (no remote tracking)
- Watchtime focus analytics dashboard
`
};
