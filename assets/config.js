/* ThorSynth site configuration.
   Edit this file only: every link and date on the site is read from here. */
window.THORSYNTH = {
  // TODO: replace with the real Codabench competition URL once published
  codabench: "",                      // Codabench competition URL: empty = shown as "coming soon"
  get codabenchLeaderboard() { return this.codabench ? this.codabench + "#/results-tab" : ""; },
  get codabenchPhases() { return this.codabench ? this.codabench + "#/pages-tab" : ""; },
  get dua() { return this.dataHost; },  // the DUA is attached to the access request on Zenodo
  dataHost: "",                       // Zenodo record (restricted access, request + DUA): empty = "coming soon"
  github: "",                         // pre-processing, co-registration, helper scripts (and possibly baselines): empty = "coming soon"
  email: "info.thorsynth2027@unisr.it",
  isbi: "https://biomedicalimaging.org/2027/",
  todayNote: "Waiting for ISBI 2027 approval", // shown on the \"Today\" marker of the timeline

  // Timeline: ISO dates (end = optional). Deadlines are 23:59 UTC.
  timeline: [
    { date: "2026-12-01", label: "Launch", text: "Challenge goes live, pre-registration opens on Codabench" },
    { date: "2026-12-09", label: "Training data", text: "Training triplets released to teams with an approved DUA" },
    { date: "2027-01-13", label: "Validation", text: "Validation MRIs released, leaderboard opens" },
    { date: "2027-02-02", end: "2027-02-20", label: "Test", text: "Test phase, final submissions (format to be announced)" },
    { date: "2027-02-22", label: "Results", text: "Final ranking sent to participants" },
    { date: "2027-02-26", label: "Papers", text: "Challenge paper submission deadline (ISBI 2027)" },
    { date: "2027-05-25", end: "2027-05-28", label: "ISBI 2027", text: "Results session in Lausanne, Switzerland" }
  ]
};
