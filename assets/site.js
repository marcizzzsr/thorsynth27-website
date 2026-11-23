/* ThorSynth site script: shared header/footer, timeline, pixel scanner, small widgets. */
{
  const C = window.THORSYNTH;
  const page = document.body.dataset.page || "home";
  const DAY = 864e5;
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  const d = s => new Date(s + "T00:00:00Z");
  const fmt = (s, o = { day: "numeric", month: "short", year: "numeric" }) => d(s).toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });
  const T = C.timeline;
  const launched = today >= d(T[0].date);

  /* ---------- header & footer ---------- */
  const nav = [
    ["home", "index.html", "Home"],
    ["challenge", "challenge.html", "Challenge & data"],
    ["participate", "participate.html", "Participant guide"],
    ["leaderboard", "leaderboard.html", "Leaderboard"],
    ["rules", "rules.html", "Rules & FAQ"],
    ["organizers", "organizers.html", "Organizers"]
  ];
  const next = T.find(t => d(t.end || t.date) >= today);
  const regBtn = launched && C.codabench
    ? `<a class="btn cta" href="${C.codabench}" target="_blank" rel="noopener">Register on Codabench</a>`
    : launched
    ? `<a class="btn cta" href="participate.html#register">How to register</a>`
    : `<a class="btn cta" href="participate.html#register">Pre-registration opens ${fmt(T[0].date, { day: "numeric", month: "short" })}</a>`;
  const ann = next
    ? (launched
        ? `<b>${next.label}</b>: ${next.text.toLowerCase()} on <span class="nowrap">${fmt(next.date)}</span>. <a href="participate.html">Participant guide</a>`
        : `Pre-registration opens on Codabench on <b class="nowrap">${fmt(T[0].date)}</b>. Data access requires a signed Data Use Agreement. <a href="participate.html#register">How to register</a>`)
    : `ThorSynth 2027 is closed. Thank you to all participating teams.`;
  const header = `
    <div class="announce" role="note">${ann}</div>
    <nav class="nav" aria-label="Main">
      <div class="wrap">
        <a class="brand" href="index.html"><img class="m" src="assets/mark.png" alt=""><img class="w" src="assets/wordmark-sm.png" alt="ThorSynth"></a>
        <button class="menu" aria-expanded="false" aria-controls="links">Menu</button>
        <div class="links" id="links">${nav.map(([k, h, l]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</div>
        ${regBtn}
      </div>
    </nav>`;
  const footer = `
    <footer class="foot">
      <div class="wrap">
        <div>
          <a class="brand" href="index.html"><img class="m" src="assets/mark.png" alt=""><img class="w" src="assets/wordmark-sm.png" alt="ThorSynth"></a>
          <p style="margin-top:12px">Synthetic thoracic CT from 3T Dixon MRI. A challenge of the IEEE International Symposium on Biomedical Imaging 2027, Lausanne.</p>
        </div>
        <div><h4>Challenge</h4><a href="challenge.html">Task & tracks</a><a href="challenge.html#data">Data</a><a href="challenge.html#evaluation">Evaluation</a><a href="leaderboard.html">Leaderboard</a></div>
        <div><h4>Take part</h4><a href="participate.html">Participant guide</a><a href="participate.html#submission">Submission format</a><a href="rules.html">Rules & FAQ</a>${C.codabench ? `<a href="${C.codabench}" target="_blank" rel="noopener">Codabench page</a>` : `<span class="soon-f">Codabench page · coming soon</span>`}</div>
        <div><h4>Contact</h4><a href="mailto:${C.email}">${C.email}</a>${C.github ? `<a href="${C.github}" target="_blank" rel="noopener">Scripts on GitHub</a>` : `<span class="soon-f">Scripts on GitHub · coming soon</span>`}<a href="${C.isbi}" target="_blank" rel="noopener">ISBI 2027</a></div>
      </div>
      <div class="legal">Organised by IRCCS San Raffaele Hospital and Vita-Salute San Raffaele University, Milan, Italy. Dates are provisional until the challenge launch.</div>
    </footer>`;
  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
  const navEl = document.querySelector(".nav");
  const menuBtn = document.querySelector(".menu");
  menuBtn.addEventListener("click", () => {
    const open = navEl.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  /* ---------- config-driven links and dates ---------- */
  // Links read from config.js. An empty value means the resource is not public yet:
  // buttons and "more" links become a disabled "coming soon" label, inline links become plain text.
  document.querySelectorAll("[data-link]").forEach(a => {
    const v = C[a.dataset.link];
    if (v) { a.href = v; if (/^http/.test(v)) { a.target = "_blank"; a.rel = "noopener"; } return; }
    const label = a.textContent.replace(/[›\s]+$/, "").trim();
    const el = document.createElement("span");
    if (a.classList.contains("btn") || a.classList.contains("go") || a.classList.contains("more")) {
      el.className = a.className + " soon";
      el.setAttribute("aria-disabled", "true");
      el.innerHTML = `${label} <em>coming soon</em>`;
    } else {
      el.textContent = label;
    }
    a.replaceWith(el);
  });
  document.querySelectorAll("[data-date]").forEach(el => {
    const t = T.find(x => x.label === el.dataset.date);
    if (t) el.textContent = fmt(t.date) + (t.end ? " – " + fmt(t.end) : "");
  });
  document.querySelectorAll("[data-email]").forEach(el => { el.textContent = C.email; if (el.tagName === "A") el.href = "mailto:" + C.email; });

  /* ---------- level-bar timeline ---------- */
  // Stops: past (solid), running (yellow), future (dashed placeholder). A "Today" stop is inserted when no phase is running.
  const stateOf = (t, i) => {
    const start = d(t.date), end = d(t.end || t.date);
    if (today >= start && today <= end) return "now";
    return today > end ? "done" : "future";
  };
  const running = T.some((t, i) => stateOf(t, i) === "now");
  const todayStop = { date: today.toISOString().slice(0, 10), label: "Today", text: C.todayNote || "", today: true };
  const withToday = running ? T.slice() : (() => { const k = T.findIndex(t => d(t.date) > today); const arr = T.slice(); arr.splice(k < 0 ? arr.length : k, 0, todayStop); return arr; })();
  const short = { day: "numeric", month: "short" };

  const tl = document.getElementById("timeline");
  if (tl) {
    tl.style.setProperty("--n", withToday.length);
    tl.innerHTML = withToday.map((t, i) => {
      const st = t.today ? "now today" : stateOf(t, i);
      const sameMonth = t.end && t.date.slice(0, 7) === t.end.slice(0, 7);
      const when = !t.end ? fmt(t.date, short) : sameMonth ? fmt(t.date, { day: "numeric" }) + "–" + fmt(t.end, short) : fmt(t.date, short) + "–" + fmt(t.end, short);
      return `<div class="stop ${st}">
        <div class="bar" aria-hidden="true"></div>
        <div class="when">${when}${t.tbc ? '<span class="tbc">tbc</span>' : ""}</div><div class="what">${t.label}</div><div class="txt">${t.text}</div></div>`;
    }).join("");
    const nx = document.getElementById("next");
    if (nx && next) {
      const days = Math.ceil((d(next.date) - today) / DAY);
      nx.innerHTML = days > 0
        ? `<span class="big">${days} day${days === 1 ? "" : "s"}</span><span>to <b>${next.label}</b> (${fmt(next.date)}): ${next.text}. All deadlines 23:59 UTC.</span>`
        : `<span class="big">Now</span><span><b>${next.label}</b> is running until ${fmt(next.end || next.date)}.</span>`;
    }
  }

  /* ---------- vertical schedule ---------- */
  const vt = document.getElementById("schedule-list");
  if (vt) {
    const F = { day: "numeric", month: "long", year: "numeric" };
    vt.innerHTML = withToday.map((t, i) => {
      const st = t.today ? "now today" : ({ done: "past", now: "now", future: "future" })[stateOf(t, i)];
      return `<li class="${st}"><span class="dot" aria-hidden="true"></span><div class="d">${fmt(t.date, F)}${t.end ? "<br>– " + fmt(t.end, F) : ""}${t.tbc ? " (tbc)" : ""}</div><div><b>${t.label}</b><span class="t">${t.text}</span></div></li>`;
    }).join("");
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll(".code").forEach(box => {
    const b = document.createElement("button");
    b.className = "copy"; b.type = "button"; b.textContent = "Copy";
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(box.querySelector("pre").innerText); b.textContent = "Copied"; }
      catch (e) { b.textContent = "Select and copy"; }
      setTimeout(() => (b.textContent = "Copy"), 1600);
    });
    box.appendChild(b);
  });

  /* ---------- leaderboard preview ---------- */
  const lb = document.getElementById("lb");
  // Before the validation phase the board is replaced by a notice. Add #preview to the URL to see the board anyway.
  const locked = document.getElementById("lb-locked");
  const valStart = T.find(t => t.label === "Validation");
  if (lb && locked && valStart && today < d(valStart.date) && location.hash !== "#preview") {
    locked.hidden = false;
    lb.hidden = true;
  }
  if (lb) {
    // Example rows to show the layout only. Replace with an export of the Codabench leaderboard.
    const rows = {
      "br40-val": [["Example team A", 1.4, 58.2, .861, .942], ["Example team B", 2.2, 61.7, .853, .937], ["Baseline (organizers)", 2.8, 66.9, .842, .929], ["Example team C", 3.6, 70.4, .829, .921]],
      "bl60-val": [["Example team B", 1.6, 88.5, .781, .918], ["Example team A", 1.8, 90.1, .776, .921], ["Baseline (organizers)", 2.6, 97.3, .762, .907], ["Example team D", 4.0, 109.8, .731, .889]],
      "br40-test": [], "bl60-test": []
    };
    let tr = "br40", ph = "val";
    const draw = () => {
      const r = rows[`${tr}-${ph}`];
      document.getElementById("lb-title").textContent = (tr === "br40" ? "Track 1 · Br40" : "Track 2 · Bl60") + " — " + (ph === "val" ? "Validation" : "Test");
      document.getElementById("lb-body").innerHTML = r.length
        ? r.map((x, i) => `<tr${/Baseline/.test(x[0]) ? ' class="me"' : ""}><td data-l="Rank"><span class="rk rk${i + 1}">${i + 1}</span></td><td data-l="Team" class="team">${x[0].replace(" (organizers)", "")}${/Baseline/.test(x[0]) ? '<span class="pill">organizers</span>' : ""}</td><td class="n" data-l="Avg. rank">${x[1].toFixed(1)}</td><td class="n" data-l="MAE (HU) ↓">${x[2].toFixed(1)}</td><td class="n" data-l="SSIM ↑">${x[3].toFixed(3)}</td><td class="n" data-l="Pearson r ↑">${x[4].toFixed(3)}</td></tr>`).join("")
        : `<tr class="empty"><td colspan="6">How test-phase results are published will be announced later. Final ranking: ${fmt((T.find(t => t.label === "Results") || {}).date || "2027-02-22")}.</td></tr>`;
    };
    lb.querySelectorAll("[data-tr]").forEach(b => b.addEventListener("click", () => { tr = b.dataset.tr; lb.querySelectorAll("[data-tr]").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }));
    lb.querySelectorAll("[data-ph]").forEach(b => b.addEventListener("click", () => { ph = b.dataset.ph; lb.querySelectorAll("[data-ph]").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }));
    draw();
  }
}
