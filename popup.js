function setToggleUI(enabled) {
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

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (!changes.filterMode && !changes.strictMode) return;

    chrome.storage.local.get(
      { filterMode: "blur", strictMode: false },
      (data) => {
        const mode =
          data.filterMode === "strict" ||
          (data.filterMode !== "blur" && data.strictMode === true)
            ? "strict"
            : "blur";
        setStrictToggleUI(mode);
      }
    );
  });

  saveBtn.addEventListener("click", () => {
    const userIntent = intentInput.value.trim();
    // User flow: Save intent and enable Focus Mode immediately.
    chrome.storage.sync.set({ userIntent, intent: userIntent, focusMode: true }, () => {
      setToggleUI(true);
    });
  });

  dashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("dashboard.html"),
    });
  });
});
