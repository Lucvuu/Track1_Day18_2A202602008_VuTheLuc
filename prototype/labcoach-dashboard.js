// labcoach-dashboard.js — bản dùng thật cho Lab Coach, chỉ Option C
// (Proactive Support Agent with Guardrails). Không có tab A/B, không có
// outcome-task banner hay giải thích cơ chế — chỉ những gì coach cần để
// theo dõi và xử lý case trong một phiên lab.
//
// Dùng chung data fixture với prototype so sánh A/B/C (data.js) và cùng
// stylesheet gốc (styles.css) để đồng nhất giao diện. Không gọi model AI
// thật — "phân tích" đọc từ data.js (canned fixture).

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const groupById = (id) => GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === id);

const PRIORITY_CLASS = { "Cao": "priority-high", "Trung bình": "priority-mid", "Thấp": "priority-low" };

// Ngưỡng để so sánh thời gian dừng của một nhóm với trung vị lớp, hiển thị
// thẳng trên case-card — coach không cần bấm vào mới biết mức độ bất thường.
function thresholdChip(g) {
  const median = CHECKPOINTS.find((c) => c.id === "cp-install").medianMinutesToPass;
  const ratio = g.stalledMinutes / median;
  let cmp;
  if (ratio >= 1.6) cmp = `gấp ~${ratio.toFixed(1)}x trung vị`;
  else if (ratio <= 0.8) cmp = "dưới trung vị";
  else cmp = "xấp xỉ trung vị";
  return `Dừng ${g.stalledMinutes} phút — ${cmp} (${median} phút)`;
}

const ACTIVITY_TONE = {
  auto_checkin: "tone-success",
  escalate_direct: "tone-warning",
  monitor: "tone-calm",
  coach_decision: "tone-accent",
  undo: "tone-danger",
  policy_change: "tone-calm",
};

// ---------- Theme ----------
const THEME_KEY = "asr-theme";

function prefersLight() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
}

function currentTheme() {
  const forced = document.documentElement.getAttribute("data-theme");
  if (forced === "light" || forced === "dark") return forced;
  return prefersLight() ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    /* file:// có thể chặn localStorage — chỉ mất việc nhớ lựa chọn */
  }
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (e) {
    /* bỏ qua */
  }
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
}

// ---------- Prose → bullets (giống app.js, giữ nguyên hành vi) ----------
function sentenceBullets(text) {
  const parts = String(text)
    .split(/(?<=\.)\s+|\s+(?=—\s)/)
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}

function proseHTML(text, { tag = "p", cls = "", bulletCls = "bullets" } = {}) {
  const items = sentenceBullets(text);
  if (!items.length) return `<${tag} class="${cls}">${esc(text)}</${tag}>`;
  return `<ul class="${bulletCls}">${items
    .map((i) => `<li>${esc(i.replace(/^—\s*/, ""))}</li>`)
    .join("")}</ul>`;
}

function ruleBulletsHTML(part) {
  return `
    <p class="rule-lead">${esc(part.lead)}</p>
    <ul class="bullets bullets-md">
      ${part.conditions.map((c) => `<li>${esc(c.replace(/[,.]$/, ""))}</li>`).join("")}
    </ul>`;
}

function evidenceHTML(groupId, heading) {
  const ev = EVIDENCE_BY_GROUP[groupId];
  return `
    <div class="evidence">
      <h3>${esc(heading)}</h3>
      <div class="metrics">
        ${ev.signals
          .map(
            (s) => `
          <div class="metric">
            <span class="metric-label">${esc(s.label)}</span>
            <span class="metric-value">${esc(s.value)}</span>
            ${proseHTML(s.note, { tag: "span", cls: "metric-note" })}
          </div>`
          )
          .join("")}
      </div>
      <div class="uncertainty">
        <span class="overline">Mức độ chắc chắn của evidence</span>
        ${proseHTML(ev.uncertainty, { bulletCls: "bullets bullets-md" })}
      </div>
    </div>`;
}

// Bản rút gọn của evidenceHTML dùng trong panel modal: chỉ giữ 3 tín hiệu
// đầu (bỏ "lịch sử hỗ trợ trong buổi" — luôn là "chưa có lượt nào" ở cả
// hai nhóm, không giúp coach quyết định gì) và gộp uncertainty thành 1
// đoạn ngắn thay vì tách nhiều bullet, để coach nắm trong vài giây.
function quickEvidenceHTML(groupId) {
  const ev = EVIDENCE_BY_GROUP[groupId];
  const top = ev.signals.slice(0, 3);
  return `
    <div class="ec-grid">
      ${top
        .map(
          (s) => `
        <div class="ec-item">
          <span class="ec-label">${esc(s.label)}</span>
          <span class="ec-value">${esc(s.value)}</span>
        </div>`
        )
        .join("")}
    </div>
    <div class="uncertainty">
      <span class="overline">Mức độ chắc chắn</span>
      <p>${esc(ev.uncertainty)}</p>
    </div>`;
}

function statHTML(label, value, note, tone) {
  return `
    <div class="stat ${tone ? "stat-tone-" + tone : ""}">
      <span class="stat-label">${esc(label)}</span>
      <span class="stat-value">${esc(value)}</span>
      <span class="stat-note">${esc(note)}</span>
    </div>`;
}

// ---------- State ----------
let activityLog = [];
let activityCounter = 100;
let caseState = {}; // "group-07": sent|undone|resolved · "group-09"/"group-03": open|resolved
let resultLabel = {}; // groupId -> label coach đã chọn
let optOutGroups = new Set();
let openCaseGroupId = null;
let coachFlagged = new Set(); // nhóm coach tự đánh dấu cần chú ý dù AI không phát hiện
let caseNotes = {}; // groupId -> ghi chú coach gõ trong panel case

function addActivityEntry(type, groupId, summary) {
  activityCounter += 1;
  activityLog.unshift({ id: activityCounter, time: "vừa xong", groupId, type, summary });
}

function renderActivityFeed() {
  const list = document.getElementById("activity-list");
  list.innerHTML = "";
  activityLog.forEach((entry) => {
    const g = entry.groupId ? groupById(entry.groupId) : null;
    const item = document.createElement("div");
    item.className = "tl-item " + (ACTIVITY_TONE[entry.type] || "tone-calm");
    item.innerHTML = `
      <div class="tl-marker" aria-hidden="true"></div>
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-tag">${esc(ACTIVITY_TYPE_LABEL[entry.type] || entry.type)}</span>
          <span class="tl-time">${esc(entry.time)}</span>
        </div>
        <p class="tl-summary">${esc(entry.summary)}</p>
      </div>`;
    if (g) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn tl-link";
      btn.textContent = `Xem chi tiết — ${g.name}`;
      btn.addEventListener("click", () => openCase(entry.groupId));
      item.querySelector(".tl-body").appendChild(btn);
    }
    list.appendChild(item);
  });
}

function renderPolicyPanel() {
  document.getElementById("policy-act-rule").innerHTML = ruleBulletsHTML(POLICY_C_BULLETS.autoAct);
  document.getElementById("policy-ask-rule").innerHTML = ruleBulletsHTML(POLICY_C_BULLETS.alwaysEscalate);
  document.getElementById("guardrail-list").innerHTML = POLICY_C.guardrails
    .map((g) => `<li>${esc(g)}</li>`)
    .join("");
}

function renderKPIs() {
  const total = CLASS_CONTEXT.totalGroups;
  const askOpen = caseState["group-09"] === "open" ? 1 : 0;
  const flaggedOpen = coachFlagged.has("group-03") && caseState["group-03"] !== "resolved" ? 1 : 0;
  const attention = askOpen + flaggedOpen;
  const actPending = caseState["group-07"] === "sent" ? 1 : 0;
  const normal = total - attention - actPending;
  document.getElementById("kpi-row").innerHTML =
    statHTML("Cần bạn xem ngay", `${attention} nhóm`, "AI chuyển + bạn tự đánh dấu", attention ? "warning" : null) +
    statHTML("AI đã tự xử lý", `${actPending} nhóm`, "Check-in đã gửi, đang chờ phản hồi", actPending ? "accent" : null) +
    statHTML("Bình thường", `${normal} nhóm`, "Không cần làm gì thêm", null);
}

// Tiến độ checkpoint cả lớp — chỉ để xem, không bấm chọn (khác Option A).
function renderCheckpointProgress() {
  const el = document.getElementById("checkpoint-progress");
  el.innerHTML = CHECKPOINTS.map((cp) => {
    const pct = cp.groupsTotal ? Math.round((cp.groupsPassed / cp.groupsTotal) * 100) : 0;
    const timeNote = cp.medianMinutesToPass != null ? `· trung vị ${cp.medianMinutesToPass} phút` : "";
    return `
      <div class="cp-card static">
        <span class="cp-name">${esc(cp.name)}</span>
        <span class="cp-bar"><span style="width:${pct}%"></span></span>
        <span class="cp-stats">${cp.groupsPassed}/${cp.groupsTotal} nhóm đã qua · ${cp.groupsInProgress} đang làm ${timeNote}</span>
      </div>`;
  }).join("");
}

function renderPauseBanner() {
  const paused = document.getElementById("pause-toggle").checked;
  document.getElementById("pause-banner").classList.toggle("hidden", !paused);
}

// priority: "Cao"/"Trung bình"/"Thấp" (từ AI_QUEUE_SUGGESTION) hoặc null nếu
// không áp dụng. reason luôn là câu giải thích CỤ THỂ (từ evidence thật),
// không phải mô tả chung chung — để coach quyết định ngay trên card, không
// phải bấm vào mới biết vấn đề là gì.
function caseCardHTML(groupId, tone, tag, priority, reason, chips) {
  const g = groupById(groupId);
  const pillHTML = priority
    ? `<span class="pill ${PRIORITY_CLASS[priority] || ""}">${esc(priority)}</span>`
    : "";
  return `
    <button type="button" class="case-card ${tone}" data-open="${groupId}">
      <div class="case-body">
        <div class="case-top">
          <span class="case-name">${esc(g.name)} <span class="case-sub">${esc(tag)}</span></span>
          ${pillHTML}
        </div>
        <p class="case-reason">${esc(reason)}</p>
        <div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
      </div>
    </button>`;
}

function resultRowHTML(groupId) {
  const g = groupById(groupId);
  return `
    <div class="result">
      <span class="result-title">${esc(g.name)} — đã xử lý</span>
      <p>Coach chọn "<strong>${esc(resultLabel[groupId] || "")}</strong>".</p>
    </div>`;
}

// Gộp cả case AI tự chuyển (group-09, Ask) và case coach tự đánh dấu thủ
// công (group-03, khi AI đánh giá bình thường nhưng coach thấy khác) —
// hai nguồn gốc khác nhau, phân biệt bằng tone màu, nhưng cùng một chỗ để
// coach không phải nhìn hai nơi.
function renderPriorityList() {
  const el = document.getElementById("priority-list");
  const g09 = groupById("group-09");
  const g03 = groupById("group-03");
  let html = "";

  if (caseState["group-09"] === "open") {
    html += caseCardHTML(
      "group-09",
      "tone-warning",
      "AI chuyển cho bạn · 10:38",
      AI_QUEUE_SUGGESTION["group-09"].priority,
      AI_QUEUE_SUGGESTION["group-09"].reason,
      [thresholdChip(g09), "Yêu cầu trợ giúp: đã gửi 10:38"]
    );
  } else if (caseState["group-09"] === "resolved") {
    html += resultRowHTML("group-09");
  }

  if (coachFlagged.has("group-03")) {
    if (caseState["group-03"] === "resolved") {
      html += resultRowHTML("group-03");
    } else {
      html += caseCardHTML(
        "group-03",
        "tone-flag",
        "Bạn tự đánh dấu · thủ công",
        AI_QUEUE_SUGGESTION["group-03"].priority,
        `AI đánh giá: "${AI_QUEUE_SUGGESTION["group-03"].reason}" — nhưng bạn đã đánh dấu cần chú ý dựa trên quan sát khác.`,
        [thresholdChip(g03), "Coach tự đánh dấu"]
      );
    }
  }

  el.innerHTML = html || `<div class="empty-detail">Không có case nào cần chú ý ngay.</div>`;
  el.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openCase(btn.dataset.open));
  });
}

// Toàn bộ nhóm ở checkpoint hiện tại, kể cả nhóm không nổi lên ở đâu khác —
// để coach có cái nhìn đầy đủ, và có chỗ tự đánh dấu case AI không thấy.
function renderRoster() {
  const el = document.getElementById("roster-list");
  const g03 = groupById("group-03");
  const flagged = coachFlagged.has("group-03");
  const resolved03 = caseState["group-03"] === "resolved";

  let status03, action03;
  if (resolved03) {
    status03 = `Đã xử lý: ${resultLabel["group-03"] || ""}`;
    action03 = "";
  } else if (flagged) {
    status03 = "Bạn đã đánh dấu cần chú ý — xem ở mục trên";
    action03 = `<button type="button" class="btn btn-ghost" data-unflag="group-03">Bỏ đánh dấu</button>`;
  } else {
    status03 = "AI: chỉ theo dõi, tín hiệu bình thường";
    action03 = `<button type="button" class="btn btn-secondary" data-flag="group-03">Đánh dấu cần chú ý</button>`;
  }

  el.innerHTML = `
    <div class="roster-row">
      <div class="roster-main">
        <span class="roster-name">${esc(g03.name)}</span>
        <span class="roster-status">${esc(status03)}</span>
      </div>
      ${action03}
    </div>
    <div class="roster-row roster-muted">
      <div class="roster-main">
        <span class="roster-name">7 nhóm khác</span>
        <span class="roster-status">Đã qua Checkpoint 1, không cần theo dõi thêm</span>
      </div>
    </div>`;

  const flagBtn = el.querySelector("[data-flag]");
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      coachFlagged.add("group-03");
      caseState["group-03"] = "open";
      addActivityEntry(
        "policy_change",
        "group-03",
        `Coach tự đánh dấu ${g03.name} cần chú ý dựa trên quan sát khác — AI không phát hiện tín hiệu bất thường.`
      );
      renderAllDynamic();
    });
  }
  const unflagBtn = el.querySelector("[data-unflag]");
  if (unflagBtn) {
    unflagBtn.addEventListener("click", () => {
      coachFlagged.delete("group-03");
      delete caseState["group-03"];
      addActivityEntry("policy_change", "group-03", `Coach bỏ đánh dấu ${g03.name}.`);
      renderAllDynamic();
    });
  }
}

function renderAllDynamic() {
  renderKPIs();
  renderPriorityList();
  renderRoster();
  renderActivityFeed();
}

function renderActList() {
  const el = document.getElementById("act-list");
  const g = groupById("group-07");
  const state = caseState["group-07"];
  if (state === "sent") {
    el.innerHTML = caseCardHTML(
      "group-07",
      "tone-accent",
      "Act · rủi ro thấp · 10:41",
      AI_QUEUE_SUGGESTION["group-07"].priority,
      AI_QUEUE_SUGGESTION["group-07"].reason,
      [thresholdChip(g), `Mở tài liệu ${g.docsReopened} lần`, "AI đang chờ phản hồi"]
    );
    el.querySelector("[data-open]").addEventListener("click", () => openCase("group-07"));
  } else if (state === "undone") {
    el.innerHTML = caseCardHTML(
      "group-07",
      "tone-calm",
      "Đã thu hồi check-in",
      AI_QUEUE_SUGGESTION["group-07"].priority,
      "Check-in đã thu hồi trước khi learner phản hồi — cần bạn xử lý thủ công như một case bình thường.",
      [thresholdChip(g), `Mở tài liệu ${g.docsReopened} lần`]
    );
    el.querySelector("[data-open]").addEventListener("click", () => openCase("group-07"));
  } else {
    el.innerHTML = `
      <div class="result">
        <span class="result-title">${esc(g.name)} — đã xử lý</span>
        <p>Coach chọn "<strong>${esc(resultLabel["group-07"] || "")}</strong>".</p>
      </div>`;
  }
}

function openCase(groupId) {
  openCaseGroupId = groupId;
  renderOverlay();
}

function closeOverlay() {
  openCaseGroupId = null;
  document.getElementById("overlay-root").innerHTML = "";
}

function renderOverlay() {
  const root = document.getElementById("overlay-root");
  if (!openCaseGroupId) {
    root.innerHTML = "";
    return;
  }
  const groupId = openCaseGroupId;
  const g = groupById(groupId);
  const state = caseState[groupId];
  let aiBoxHTML = "";

  if (groupId === "group-07") {
    if (state === "sent") {
      aiBoxHTML = `
        <div class="ai-action tone-success">
          <span class="overline">AI đã Act — tự động gửi check-in lúc 10:41</span>
          <div class="checkin">"${esc(CHECKIN_MESSAGE["group-07"])}"</div>
          <div class="ai-meta">
            <span>Độ tin cậy: <strong>Trung bình</strong></span>
            <span>Rủi ro: <strong>Thấp</strong> — có thể thu hồi, không ảnh hưởng điểm/đánh giá.</span>
          </div>
          <button type="button" class="btn btn-danger mt-12" id="ov-undo-btn">Thu hồi check-in (undo)</button>
        </div>`;
    } else if (state === "undone") {
      aiBoxHTML = `
        <div class="ai-action tone-calm">
          <span class="overline">Đã thu hồi (undo)</span>
          <p>Bạn đã thu hồi check-in trước khi learner phản hồi. Case này xử lý thủ công như một case bình thường.</p>
        </div>`;
    }
  } else if (groupId === "group-09") {
    aiBoxHTML = `
      <div class="ai-action tone-warning">
        <span class="overline">AI Ask — không tự trả lời</span>
        ${proseHTML(
          `${g.name} đã chủ động gửi yêu cầu trợ giúp lúc 10:38. Theo guardrail, một yêu cầu trực tiếp từ learner luôn được coi là "ảnh hưởng lớn" — AI không tự soạn hay gửi phản hồi thay, mà chuyển thẳng cho bạn.`,
          { bulletCls: "bullets bullets-md" }
        )}
      </div>`;
  } else if (groupId === "group-03") {
    aiBoxHTML = `
      <div class="ai-action tone-calm">
        <span class="overline">Don't Act — chỉ theo dõi</span>
        ${proseHTML(
          `Các tín hiệu của ${g.name} nằm trong ngưỡng bình thường so với các nhóm đã qua checkpoint, nên AI không tạo hành động hay check-in nào.`,
          { bulletCls: "bullets bullets-md" }
        )}
      </div>`;
  }

  root.innerHTML = `
    <div class="overlay-backdrop">
      <div class="overlay-panel">
        <div class="overlay-head">
          <div>
            <div class="overlay-title">${esc(g.name)}</div>
            <span class="overlay-members">${esc(g.members.join(", "))}</span>
          </div>
          <button type="button" class="overlay-close" id="ov-close" aria-label="Đóng">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        ${aiBoxHTML}
        ${quickEvidenceHTML(groupId)}
        <div>
          <label class="note-label" for="ov-note">Ghi chú của bạn (tuỳ chọn)</label>
          <textarea id="ov-note" class="note-input" rows="2" placeholder="Vd: đã nói chuyện trực tiếp, nhóm ok rồi...">${esc(caseNotes[groupId] || "")}</textarea>
        </div>
        <div class="rail">
          <span class="overline">Quyết định của bạn</span>
          <div class="rail-actions">
            <button type="button" class="btn btn-decide decide-go" data-result="support_now">Hỗ trợ ngay</button>
            <button type="button" class="btn btn-decide decide-info" data-result="schedule">Lên lịch / đưa vào queue</button>
            <button type="button" class="btn btn-decide decide-calm" data-result="dismiss">Bỏ qua — chưa đủ evidence</button>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" id="ov-optout" ${optOutGroups.has(groupId) ? "checked" : ""} />
          <span>Tắt hành động/theo dõi chủ động của AI cho nhóm này</span>
        </label>
      </div>
    </div>`;

  document.getElementById("ov-close").addEventListener("click", closeOverlay);

  document.getElementById("ov-note").addEventListener("input", (e) => {
    caseNotes[groupId] = e.target.value;
  });

  const undoBtn = document.getElementById("ov-undo-btn");
  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      caseState["group-07"] = "undone";
      addActivityEntry("undo", "group-07", `Coach đã thu hồi check-in gửi tới ${g.name} trước khi có phản hồi.`);
      renderKPIs();
      renderActList();
      renderRoster();
      renderActivityFeed();
      renderOverlay();
    });
  }

  root.querySelectorAll(".rail .btn-decide").forEach((btn) => {
    btn.addEventListener("click", () => resolveCase(groupId, btn.dataset.result));
  });

  document.getElementById("ov-optout").addEventListener("change", (e) => {
    if (e.target.checked) {
      optOutGroups.add(groupId);
      addActivityEntry("policy_change", groupId, `Coach tắt hành động/theo dõi chủ động của AI cho ${g.name}.`);
    } else {
      optOutGroups.delete(groupId);
      addActivityEntry("policy_change", groupId, `Coach bật lại theo dõi chủ động của AI cho ${g.name}.`);
    }
    renderActivityFeed();
  });
}

function resolveCase(groupId, result) {
  const g = groupById(groupId);
  caseState[groupId] = "resolved";
  resultLabel[groupId] = RESULT_LABELS[result];
  const note = (caseNotes[groupId] || "").trim();
  const noteSuffix = note ? ` Ghi chú của coach: "${note}"` : "";
  addActivityEntry("coach_decision", groupId, `Coach chọn "${RESULT_LABELS[result]}" cho ${g.name}.${noteSuffix}`);
  closeOverlay();
  renderKPIs();
  renderPriorityList();
  renderActList();
  renderRoster();
  renderActivityFeed();
}

// ---------- Init ----------
function init() {
  document.getElementById("class-name").textContent = CLASS_CONTEXT.className;
  document.getElementById("class-task").textContent = CLASS_CONTEXT.task;
  document.getElementById("class-size").textContent =
    `${CLASS_CONTEXT.totalLearners} learner · ${CLASS_CONTEXT.totalGroups} nhóm`;
  document.getElementById("class-time").textContent =
    `Bắt đầu ${CLASS_CONTEXT.sessionStarted} · Hiện tại ${CLASS_CONTEXT.now}`;

  activityLog = getInitialProactiveLog();
  activityCounter = 100;
  caseState = { "group-07": "sent", "group-09": "open" };
  resultLabel = {};
  optOutGroups = new Set();
  openCaseGroupId = null;
  coachFlagged = new Set();
  caseNotes = {};

  renderPolicyPanel();
  renderCheckpointProgress();
  renderKPIs();
  renderPriorityList();
  renderActList();
  renderRoster();
  renderActivityFeed();
  renderPauseBanner();
}

document.getElementById("pause-toggle").addEventListener("change", (e) => {
  addActivityEntry(
    "policy_change",
    null,
    e.target.checked
      ? "Coach tạm dừng toàn bộ hành động tự động của AI (policy-level stop). Case đang mở vẫn giữ nguyên, nhưng AI sẽ không tự Act với case mới cho tới khi được bật lại."
      : "Coach bật lại hành động tự động của AI."
  );
  renderPauseBanner();
  renderActivityFeed();
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

initTheme();
init();
