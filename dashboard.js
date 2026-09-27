function msToPretty(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function computeProductivityScore({ totalYouTubeMs, focusModeMs }) {
  const total = totalYouTubeMs || 0;
  const focus = focusModeMs || 0;
  if (total <= 0) return 0;
  const ratio = focus / total;
  return clamp(Math.round(ratio * 100), 0, 100);
}

function computeDistractionRate({ relevantCount, distractingCount }) {
  const total = (relevantCount || 0) + (distractingCount || 0);
  if (total <= 0) return 0;
  return clamp(Math.round(((distractingCount || 0) / total) * 100), 0, 100);
}

function summarizeBehaviorLogs(logs) {
  let relevantCount = 0;
  let distractingCount = 0;
  const categoryCounts = {
    Learning: 0,
    Entertainment: 0,
    News: 0,
    Other: 0,
  };

  for (const item of logs) {
    if (!item || typeof item !== "object") continue;

    const relevance = item.relevanceCategory || item.category;
    if (relevance === "relevant") relevantCount += 1;
    if (relevance === "distracting") distractingCount += 1;

    const videoCategory = ["Learning", "Entertainment", "News"].includes(item.category)
      ? item.category
      : "Other";
    categoryCounts[videoCategory] += 1;
  }

  return { relevantCount, distractingCount, categoryCounts };
}

function toDayKey(ts) {
  const d = new Date(Number(ts || 0));
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(dayKey) {
  if (!dayKey) return "";
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function aggregateDailySeries(logs) {
  const dayMap = new Map();

  for (const item of logs) {
    if (!item || typeof item !== "object") continue;
    const key = toDayKey(item.timestamp);
    if (!key) continue;
    if (!dayMap.has(key)) {
      dayMap.set(key, { watchSeconds: 0, scoreTotal: 0, count: 0 });
    }

    const row = dayMap.get(key);
    row.watchSeconds += Number(item.duration || 0);
    row.scoreTotal += Number(item.score || 0);
    row.count += 1;
  }

  const sortedDays = Array.from(dayMap.keys()).sort();
  const labels = sortedDays.map(formatDayLabel);
  const watchMinutes = sortedDays.map((d) =>
    Math.round((dayMap.get(d).watchSeconds / 60) * 10) / 10
  );
  const focusScoreTrend = sortedDays.map((d) => {
    const row = dayMap.get(d);
    if (!row || row.count <= 0) return 0;
    return Math.round(row.scoreTotal / row.count);
  });

  return {
    labels,
    watchMinutes,
    focusScoreTrend,
  };
}

function aggregateHourlySeries(logs) {
  const buckets = Array(24).fill(0);
  for (const item of logs) {
    if (!item) continue;
    const dt = new Date(Number(item.timestamp || 0));
    if (isNaN(dt.getTime())) continue;
    buckets[dt.getHours()] += Number(item.duration || 0);
  }
  const labels = buckets.map((_, i) => i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i-12} PM`);
  const values = buckets.map(sec => Math.round(sec / 60));
  return { labels, values };
}

function getPeakFocusHour(logs) {
  const hourBuckets = new Map();

  for (const item of logs) {
    if (!item || typeof item !== "object") continue;
    const relevance = item.relevanceCategory || item.category;
    if (relevance !== "relevant") continue;

    const ts = Number(item.timestamp || 0);
    const dt = new Date(ts);
    if (Number.isNaN(dt.getTime())) continue;
    const hour = dt.getHours();
    const duration = Number(item.duration || 0);
    hourBuckets.set(hour, (hourBuckets.get(hour) || 0) + Math.max(duration, 0));
  }

  let bestHour = -1;
  let bestValue = 0;
  for (const [hour, value] of hourBuckets.entries()) {
    if (value > bestValue) {
      bestValue = value;
      bestHour = hour;
    }
  }

  return bestHour;
}

function formatHourRange(hour) {
  if (hour < 0 || hour > 23) return "";
  const start = new Date();
  start.setHours(hour, 0, 0, 0);
  const end = new Date();
  end.setHours((hour + 1) % 24, 0, 0, 0);
  const formatOpts = { hour: "numeric" };
  return `${start.toLocaleTimeString([], formatOpts)} - ${end.toLocaleTimeString([], formatOpts)}`;
}

function hasLongContinuousUsage(logs) {
  const sorted = [...logs]
    .filter((item) => item && typeof item === "object")
    .sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));

  let streakSeconds = 0;
  let prevTs = null;
  for (const item of sorted) {
    const ts = Number(item.timestamp || 0);
    const duration = Math.max(0, Number(item.duration || 0));
    if (Number.isNaN(ts) || duration <= 0) continue;

    if (prevTs == null) {
      streakSeconds = duration;
      prevTs = ts;
      if (streakSeconds >= 3600) return true;
      continue;
    }

    const gapSeconds = (ts - prevTs) / 1000;
    if (gapSeconds <= 600) {
      streakSeconds += duration;
    } else {
      streakSeconds = duration;
    }
    prevTs = ts;

    if (streakSeconds >= 3600) return true;
  }

  return false;
}

function buildChartData(metrics, logs) {
  const daily = aggregateDailySeries(logs);
  const hourly = aggregateHourlySeries(logs);
  
  const categoryLabels = Object.keys(metrics.categoryCounts).filter(k => metrics.categoryCounts[k] > 0);
  const categoryValues = categoryLabels.map(k => metrics.categoryCounts[k]);

  return {
    pie: {
      labels: ["Relevant", "Distracting"],
      values: [metrics.relevantCount, metrics.distractingCount],
    },
    categoryPie: {
      labels: categoryLabels.length ? categoryLabels : ["None"],
      values: categoryValues.length ? categoryValues : [1],
    },
    bar: {
      labels: daily.labels,
      values: daily.watchMinutes,
      label: "Minutes watched",
    },
    hourlyBar: {
      labels: hourly.labels,
      values: hourly.values,
      label: "Total Minutes by Hour",
    },
    line: {
      labels: daily.labels,
      values: daily.focusScoreTrend,
      label: "Focus score",
    },
    scoreCards: {
      focusScore: metrics.focusScore,
      distractionRate: metrics.distractionRate,
    },
  };
}

function buildDashboardMetrics(storageData) {
  const totalYouTubeMs = Number(storageData.totalYouTubeMs || 0);
  const focusModeMs = Number(storageData.focusModeMs || 0);
  const behaviorLogs = Array.isArray(storageData.behaviorLogs)
    ? storageData.behaviorLogs
    : [];

  const { relevantCount, distractingCount, categoryCounts } = summarizeBehaviorLogs(
    behaviorLogs
  );
  const focusScore = computeProductivityScore({ totalYouTubeMs, focusModeMs });
  const distractionRate = computeDistractionRate({ relevantCount, distractingCount });

  const metrics = {
    totalYouTubeMs,
    focusModeMs,
    relevantCount,
    distractingCount,
    categoryCounts,
    focusScore,
    distractionRate,
  };

  return {
    metrics,
    charts: buildChartData(metrics, behaviorLogs)
  };
}

function generateAdvancedLocalInsights(metrics, logs) {
  const validLogs = logs.filter((l) => l && typeof l === "object" && l.title);
  
  if (validLogs.length < 5) {
    return "<p style='color: #a1a1aa; margin-top: 0;'>Insufficient behavioral data volume generated. Watch at least 6 videos for the advanced local NLP engine to activate.</p>";
  }

  const posRegex = /(positive|focus|study|learn|code|build|success|motivat|happy|love|relax|chill|tutorial|guide|course|develop)/i;
  const negRegex = /(drama|angry|sad|fail|hate|worst|scary|horror|war|news|depress|fight|doom|anxiety|stress|bad|toxic)/i;
  let totalScore = 0;

  validLogs.forEach(log => {
    const title = log.title || "";
    if (posRegex.test(title)) { totalScore += 1; }
    if (negRegex.test(title)) { totalScore -= 1; }
  });

  const dominantCategory = Object.keys(metrics.categoryCounts).sort((a,b) => metrics.categoryCounts[b] - metrics.categoryCounts[a])[0];

  let behaviorVibe = "";
  if (totalScore > 1) {
    behaviorVibe = "Your overarching cognitive pattern reveals a strong lean toward <b>positive, educational, or highly motivating material</b>. You are exhibiting high-performance consumption.";
  } else if (totalScore < -1) {
    behaviorVibe = "Warning: The NLP engine detected a significant volume of potentially <b>stressful, provocative, or 'doomscrolling' content</b>. You may want to consider taking a short mental baseline break.";
  } else {
    behaviorVibe = "Your clickstream demonstrates a highly <b>balanced and emotionally neutral</b> pattern without notable emotional polarity.";
  }

  let focusPattern = "";
  if (metrics.distractionRate < 30) {
    focusPattern = `You are maintaining a <b>stellar focus state</b>, devoting only ${metrics.distractionRate}% of your attention to distracting elements. Your primary category driver is ${dominantCategory}.`;
  } else if (metrics.distractionRate < 60) {
    focusPattern = `You are blending productivity and leisure. About <b>${metrics.distractionRate}%</b> of your watch session leans distractive, heavily driven by ${dominantCategory} videos.`;
  } else {
    focusPattern = `<b>High Distraction Alert:</b> You are actively dedicating <b>${metrics.distractionRate}%</b> of your processing time to off-topic content. Your algorithmic focus score reflects this severe drop in productivity.`;
  }

  const peakHour = getPeakFocusHour(validLogs);
  let timeNote = "Your viewing sessions are relatively scattered.";
  if (peakHour >= 0) {
    timeNote = `Data models indicate your cognitive <b>Peak Productivity Window</b> typically aligns strongly around <b>${formatHourRange(peakHour)}</b>. Optimize your deep work schedules around this time.`;
  }

  return `
    <p style="margin-top: 0;">${behaviorVibe}</p>
    <p>${focusPattern}</p>
    <p>${timeNote}</p>
    <div style="margin-top: 14px; font-size: 12px; color: #a855f7; font-weight: 700;">✨ Processed Locally (0ms Latency | Zero External APIs)</div>
  `;
}

function renderClickstreamTable(logs) {
  const tbody = document.querySelector("#clickstreamTable tbody");
  if (!tbody) return;

  const validLogs = logs.filter(l => l && typeof l === "object" && l.timestamp);
  if (!validLogs.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #71717a;">No clickstream data recorded yet.</td></tr>`;
    return;
  }

  const recent = validLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 25);

  tbody.innerHTML = recent.map(log => {
    const title = log.title || "Unknown Video";
    const cat = log.category || "Other";
    const rel = log.relevanceCategory || "other";
    const duration = log.duration ? Math.round(log.duration / 60) + "m" : "<1m";
    const score = typeof log.score === "number" ? Math.round(log.score) : "N/A";
    
    let pillClass = "score-pill ";
    if (rel === "relevant") pillClass += "score-relevant";
    else if (rel === "distracting") pillClass += "score-distracting";
    else pillClass += "score-other";

    return `
      <tr>
        <td class="title-cell" title="${title.replace(/"/g, '&quot;')}">${title}</td>
        <td>${cat}</td>
        <td><span class="${pillClass}">${rel.charAt(0).toUpperCase() + rel.slice(1)}</span></td>
        <td>${duration}</td>
        <td style="font-weight: 700;">${score}</td>
      </tr>
    `;
  }).join("");
}



function createPieChart(canvasEl, chartData) {
  const values = chartData.values.some((v) => v > 0) ? chartData.values : [1, 1];
  return new Chart(canvasEl, {
    type: "pie",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(34,197,94,0.9)",
            "rgba(239,68,68,0.9)",
            "rgba(59,130,246,0.9)",
            "rgba(168,85,247,0.9)",
            "rgba(234,179,8,0.9)",
          ],
          borderColor: "rgba(11,11,11,0.7)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#d5d5d5" },
        },
      },
    },
  });
}

function createBarChart(canvasEl, chartData) {
  return new Chart(canvasEl, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.label,
          data: chartData.values,
          backgroundColor: "rgba(79,70,229,0.85)",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#bdbdbd" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: {
          beginAtZero: true,
          ticks: { color: "#bdbdbd" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
      plugins: {
        legend: { labels: { color: "#d5d5d5" } },
      },
    },
  });
}

function createLineChart(canvasEl, chartData) {
  return new Chart(canvasEl, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: chartData.label,
          data: chartData.values,
          borderColor: "rgba(34,197,94,1)",
          backgroundColor: "rgba(34,197,94,0.18)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#bdbdbd" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#bdbdbd" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
      plugins: {
        legend: { labels: { color: "#d5d5d5" } },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    { totalYouTubeMs: 0, focusModeMs: 0, behaviorLogs: [] },
    (data) => {
      const pipeline = buildDashboardMetrics(data);
      const { metrics, charts } = pipeline;

      const totalTime = msToPretty(metrics.totalYouTubeMs);
      const focusTime = msToPretty(metrics.focusModeMs);

      document.getElementById("totalTime").textContent = totalTime;
      document.getElementById("focusTime").textContent = focusTime;
      document.getElementById("productivityScore").textContent =
        metrics.focusScore === 0
          ? "0 / 100"
          : `🔥 ${metrics.focusScore} / 100`;
      renderClickstreamTable(data.behaviorLogs);

      const pieCanvas = document.getElementById("focusDistractionPie");
      const categoryCanvas = document.getElementById("categoryPie");
      const barCanvas = document.getElementById("dailyWatchBar");
      const hourlyCanvas = document.getElementById("hourlyActivityBar");
      const lineCanvas = document.getElementById("focusTrendLine");

      if (window.Chart) {
        if (pieCanvas) createPieChart(pieCanvas, charts.pie);
        if (categoryCanvas) createPieChart(categoryCanvas, charts.categoryPie);
        if (barCanvas) createBarChart(barCanvas, charts.bar);
        if (hourlyCanvas) createBarChart(hourlyCanvas, charts.hourlyBar);
        if (lineCanvas) createLineChart(lineCanvas, charts.line);
      }
      
      const aiOutput = document.getElementById("aiOutput");
      if (aiOutput) {
        aiOutput.innerHTML = generateAdvancedLocalInsights(metrics, data.behaviorLogs);
      }

      window.__focusAIDashboardData = {
        ...pipeline,
        summary: {
          totalWatchTimeLabel: totalTime,
          focusWatchTimeLabel: focusTime,
          relevantCount: metrics.relevantCount,
          distractingCount: metrics.distractingCount,
          categoryCounts: metrics.categoryCounts,
          focusScore: metrics.focusScore,
          distractionRate: metrics.distractionRate,
        },
      };

      console.debug("Focus AI dashboard pipeline", { metrics, charts });
    }
  );
});

