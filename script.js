// ====== Konfig ======
const DEFAULT_TZ = "Europe/Oslo";
const YEAR = new Date().getFullYear();
document.getElementById("year").textContent = YEAR;

// ====== Event-data ======
// Demo-data – bytt ut etter hvert. Vi dekker flere stilarter som avtalt.
const events = [
  // MMA
  { promotion:"UFC", sportType:"MMA", title:"UFC 305", startsAtUTC:"2025-08-24T03:00:00Z", venue:"T-Mobile Arena", city:"Las Vegas", country:"USA", source:"https://www.ufc.com/events" },
  { promotion:"PFL", sportType:"MMA", title:"PFL Playoffs", startsAtUTC:"2025-09-07T00:00:00Z", venue:"The Theater MSG", city:"New York", country:"USA", source:"https://pflmma.com/" },
  { promotion:"ONE", sportType:"MMA", title:"ONE 187", startsAtUTC:"2025-10-11T12:00:00Z", venue:"Singapore Indoor Stadium", city:"Singapore", country:"SGP", source:"https://onefc.com/events" },
  { promotion:"KSW", sportType:"MMA", title:"KSW 98", startsAtUTC:"2025-09-20T18:00:00Z", venue:"Atlas Arena", city:"Łódź", country:"POL", source:"https://kswmma.com/" },
  { promotion:"Cage Warriors", sportType:"MMA", title:"CW 180", startsAtUTC:"2025-09-28T19:00:00Z", venue:"3Arena", city:"Dublin", country:"IRL", source:"https://cagewarriors.com/" },

  // Boksing
  { promotion:"Top Rank", sportType:"Boxing", title:"World Title Night", startsAtUTC:"2025-09-14T02:00:00Z", venue:"T-Mobile Arena", city:"Las Vegas", country:"USA", source:"https://www.toprank.com/" },
  { promotion:"Matchroom", sportType:"Boxing", title:"Fight Night", startsAtUTC:"2025-10-05T20:00:00Z", venue:"O2 Arena", city:"London", country:"UK", source:"https://www.matchroomboxing.com/" },

  // Grappling
  { promotion:"IBJJF", sportType:"Grappling", title:"IBJJF GP", startsAtUTC:"2025-09-06T17:00:00Z", venue:"Walter Pyramid", city:"Long Beach", country:"USA", source:"https://ibjjf.com/" },
  { promotion:"ADCC", sportType:"Grappling", title:"ADCC Trials", startsAtUTC:"2025-11-02T15:00:00Z", venue:"Arena", city:"Barcelona", country:"ESP", source:"https://adcombat.com/" },
  { promotion:"Polaris", sportType:"Grappling", title:"Polaris 29", startsAtUTC:"2025-09-30T18:00:00Z", venue:"International Convention Centre", city:"Wales", country:"UK", source:"https://polarisprograppling.com/" },

  // Kickboksing / Muay Thai
  { promotion:"Glory", sportType:"Kick/Muay", title:"Glory 95", startsAtUTC:"2025-09-21T18:00:00Z", venue:"Johan Cruyff Arena", city:"Amsterdam", country:"NED", source:"https://glorykickboxing.com/" },
  { promotion:"K-1", sportType:"Kick/Muay", title:"K-1 World GP", startsAtUTC:"2025-10-25T09:00:00Z", venue:"Yoyogi Gymnasium", city:"Tokyo", country:"JPN", source:"https://k-1.co.jp/" },
  { promotion:"ONE", sportType:"Kick/Muay", title:"ONE Muay Thai Series", startsAtUTC:"2025-10-03T12:00:00Z", venue:"Singapore Indoor Stadium", city:"Singapore", country:"SGP", source:"https://onefc.com/events" },

  // Bare Knuckle & Slap
  { promotion:"BKFC", sportType:"Bare Knuckle", title:"BKFC 80", startsAtUTC:"2025-09-15T23:00:00Z", venue:"Kaseya Center", city:"Miami", country:"USA", source:"https://www.bkfc.com/events" },
  { promotion:"BYB", sportType:"Bare Knuckle", title:"BYB 28", startsAtUTC:"2025-10-12T01:00:00Z", venue:"Hard Rock Live", city:"Hollywood, FL", country:"USA", source:"https://bybextreme.com/" },
  { promotion:"Power Slap", sportType:"Slap", title:"Power Slap 15", startsAtUTC:"2025-10-18T02:00:00Z", venue:"Fontainebleau", city:"Las Vegas", country:"USA", source:"https://www.powerslap.com/" },
];

// ====== Hjelpere ======
function formatDateTime(iso, tz = DEFAULT_TZ) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("no-NO", {
    timeZone: tz, weekday: "short", day: "2-digit", month: "short", year: "numeric"
  }).format(d);
  const time = new Intl.DateTimeFormat("no-NO", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
  }).format(d);
  return { date, time };
}
function el(tag, className, text){ const e=document.createElement(tag); if(className) e.className=className; if(text) e.textContent=text; return e; }

// ====== Rendering ======
let currentFilter = "ALL";
function render(list, query = ""){
  const root = document.getElementById("event-list");
  root.innerHTML = "";

  const q = query.trim().toLowerCase();

  const filtered = list
    .filter(e => currentFilter === "ALL" || e.sportType === currentFilter)
    .filter(e =>
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.promotion.toLowerCase().includes(q) ||
      (e.sportType||"").toLowerCase().includes(q) ||
      (e.city||"").toLowerCase().includes(q)
    )
    .sort((a,b) => new Date(a.startsAtUTC)-new Date(b.startsAtUTC));

  for(const ev of filtered){
    const li = el("li", "event");
    const badge = el("span", "badge", ev.promotion + " • " + ev.sportType);
    const title = el("p", "title", ev.title);
    const { date, time } = formatDateTime(ev.startsAtUTC, DEFAULT_TZ);
    const meta = el("div", "meta");
    meta.append(
      el("span", null, date),
      el("span", null, `Start: ${time} (${DEFAULT_TZ})`),
      el("span", null, [ev.venue, ev.city, ev.country].filter(Boolean).join(", "))
    );
    const link = el("a", "button", "Se mer"); link.href = ev.source; link.target="_blank"; link.rel="noopener";
    li.append(badge, title, meta, link);
    root.appendChild(li);
  }

  if(filtered.length===0){ root.appendChild(el("li","event","Ingen treff.")); }
}

// ====== UI: søk & filtre ======
function initUI(){
  const q = document.getElementById("q");
  q.addEventListener("input", () => render(events, q.value));

  document.querySelectorAll(".chip").forEach(ch => {
    ch.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      ch.classList.add("active");
      currentFilter = ch.dataset.filter;
      render(events, q.value);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  render(events);
  console.log("Fight Atlas live.");
});
