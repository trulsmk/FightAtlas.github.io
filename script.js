// --------- Konfig ---------
const DEFAULT_TZ = "Europe/Oslo";

// --------- Demo-data (bytt ut med dine egne) ---------
const events = [
  {
    promotion: "UFC",
    sportType: "MMA",
    title: "UFC 305",
    startsAtUTC: "2025-08-24T03:00:00Z",
    venue: "T-Mobile Arena",
    city: "Las Vegas",
    country: "USA",
    source: "https://www.ufc.com/events"
  },
  {
    promotion: "BKFC",
    sportType: "Bare Knuckle",
    title: "BKFC 80",
    startsAtUTC: "2025-09-15T23:00:00Z",
    venue: "Kaseya Center",
    city: "Miami",
    country: "USA",
    source: "https://www.bkfc.com/events"
  },
  {
    promotion: "ONE",
    sportType: "Muay Thai",
    title: "ONE Championship: Revolution",
    startsAtUTC: "2025-10-03T12:00:00Z",
    venue: "Singapore Indoor Stadium",
    city: "Singapore",
    country: "SGP",
    source: "https://www.onefc.com/events"
  }
];

// --------- Hjelpefunksjoner ---------
function formatDateTime(iso, tz = DEFAULT_TZ) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("no-NO", {
    timeZone: tz,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(d);

  const time = new Intl.DateTimeFormat("no-NO", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);

  return { date, time };
}

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text) e.textContent = text;
  return e;
}

// --------- Rendering ---------
function render(list, query = "") {
  const root = document.getElementById("event-list");
  if (!root) return;
  root.innerHTML = "";

  // filter/søk (valgfritt)
  const q = query.trim().toLowerCase();
  const filtered = list.filter(e =>
    !q ||
    e.title.toLowerCase().includes(q) ||
    e.promotion.toLowerCase().includes(q) ||
    (e.sportType || "").toLowerCase().includes(q) ||
    (e.city || "").toLowerCase().includes(q)
  );

  // sorter på dato
  filtered.sort(
    (a, b) => new Date(a.startsAtUTC).getTime() - new Date(b.startsAtUTC).getTime()
  );

  // lag kort
  for (const ev of filtered) {
    const li = el("li", "event");

    const badge = el("span", "badge");
    badge.textContent = ev.promotion;

    const title = el("p", "title", ev.title);

    const { date, time } = formatDateTime(ev.startsAtUTC, DEFAULT_TZ);

    const meta = el("div", "meta");
    meta.append(
      el("span", null, `${date}`),
      el("span", null, `Start: ${time} (${DEFAULT_TZ})`),
      el("span", null, [ev.venue, ev.city, ev.country].filter(Boolean).join(", "))
    );

    // valgfri "kilde"-lenke
    const link = el("a", "button");
    link.href = ev.source;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Se mer";

    li.append(badge, title, meta, link);
    root.appendChild(li);
  }

  if (filtered.length === 0) {
    const empty = el("li", "event", "Ingen treff.");
    root.appendChild(empty);
  }
}

// --------- Init ---------
function initSearch(list) {
  const q = document.getElementById("q"); // hvis du legger til et <input id="q">
  if (!q) return;
  q.addEventListener("input", () => render(list, q.value));
}

document.addEventListener("DOMContentLoaded", () => {
  render(events);
  initSearch(events);
  console.log("Fight Atlas er live!");
});
