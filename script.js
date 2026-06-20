/* =========================================================
   EDIT ME — the only numbers a non-technical editor should
   ever need to touch. Everything else on the page is plain
   text inside index.html.
   ========================================================= */
const WEDDING = {
  // Date of the wedding, in ISO format (YYYY-MM-DDTHH:MM).
  // Time is a placeholder until a ceremony start time is confirmed.
  isoDate: "2027-06-11T16:00:00",
  // How long the celebration runs, for calendar invites.
  durationHours: 6,
  title: "Pamella & Jack's Wedding",
  location: "Palácio Correio-Mor, Loures, Portugal",
  // Link to the full wedding website (Canva). Replace "#" with the
  // real published link once the Canva site is live.
  detailsUrl: "#",
};

/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initGate();
  initRevealOnScroll();
  initDetailsLink();
  initCountdown();
  initCalendarLinks();
});

/* ---------- Hero gate-opening interaction ---------- */
function initGate() {
  const hero = document.getElementById("hero");
  const enterBtn = document.getElementById("enter-btn");
  if (!hero || !enterBtn) return;

  enterBtn.addEventListener("click", () => {
    if (hero.classList.contains("is-open")) return;
    hero.classList.add("is-open");
    enterBtn.setAttribute("aria-expanded", "true");

    // let the gates part and the estate zoom in before the page glides onward
    window.setTimeout(() => {
      const next = document.getElementById("invitation");
      if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 950);
  });
}

/* ---------- Gentle fade-in as sections enter the viewport ---------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Wedding Details card link ---------- */
function initDetailsLink() {
  const card = document.getElementById("details-card");
  if (card) card.href = WEDDING.detailsUrl;
}

/* ---------- Countdown ---------- */
function initCountdown() {
  const el = document.getElementById("countdown-days");
  if (!el) return;
  const weddingDate = new Date(WEDDING.isoDate);

  const update = () => {
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((weddingDate - now) / msPerDay);
    el.textContent = daysLeft > 0 ? daysLeft.toLocaleString() : "0";
  };

  update();
  window.setInterval(update, 1000 * 60 * 60); // refresh hourly is plenty for a day-count
}

/* ---------- Add-to-calendar links ---------- */
function initCalendarLinks() {
  const start = new Date(WEDDING.isoDate);
  const end = new Date(start.getTime() + WEDDING.durationHours * 60 * 60 * 1000);

  const toUtcStamp = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const startStamp = toUtcStamp(start);
  const endStamp = toUtcStamp(end);

  const googleLink = document.getElementById("add-google-cal");
  if (googleLink) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: WEDDING.title,
      dates: `${startStamp}/${endStamp}`,
      location: WEDDING.location,
      details: "Formal invitation and additional details to follow.",
    });
    googleLink.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  const icsLink = document.getElementById("add-ics-cal");
  if (icsLink) {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pamella & Jack//Save the Date//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@pamellaandjack.wedding`,
      `DTSTAMP:${toUtcStamp(new Date())}`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${WEDDING.title}`,
      `LOCATION:${WEDDING.location}`,
      "DESCRIPTION:Formal invitation and additional details to follow.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    icsLink.href = URL.createObjectURL(blob);
  }
}
