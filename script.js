// År i footer
document.getElementById("year").textContent = new Date().getFullYear();

const DEFAULT_TZ = "Europe/Oslo";

// Data (demo) — legg til/endre fritt
const promotions = ["UFC", "PFL", "Bellator", "ONE Championship", "Rizin", "Glory", "K-1", "BKFC", "ADCC", "IBJJF"];
const sports = ["MMA", "Boxing", "Grappling", "Kick/Muay", "Bare Knuckle", "Slap"];

const events = [
  // promotion, sportType, popularity = 1–100
  { promotion:"UFC", sportType:"MMA", title:"UFC 305", popularity:98, startsAtUTC:"2025-08-24T03:00:00Z", venue:"T-Mobile Arena", city:"Las Vegas", country:"USA", source:"https://www.ufc.com/events" },
  { promotion:"BKFC", sportType:"Bare Knuckle", title:"BKFC 80", popularity:80, startsAtUTC:"2025-09-15T23:00:00Z", venue:"Kaseya Center", city:"Miami", country:"USA", source:"https://www.bkfc.com/events" },
  { promotion:"ONE Championship", sportType:"Kick/Muay", title:"ONE Muay Thai Series", popularity:76, startsAtUTC:"2025-10-03T12:00:00Z", venue:"Singapore Indoor Stadium", city:"Singapore", country:"SGP", source:"https://onefc.com/events" },
  { promotion:"PFL", sportType:"MMA", title:"PFL Playoffs", popularity:72, startsAtUTC:"2025-09-07T00:00:00Z", venue:"The Theater MSG", city:"New York", country:"USA", source:"https://pflmma.com" },
  { promotion:"Glory", sportType:"Kick/Muay", title:"Glory 95", popularity:69, startsAtUTC:"2025-09-21T18:00:00Z", venue:"AFAS Live", city:"Amsterdam", country:"NED", source:"https://glorykickboxing.com" },
  { promotion:"Matchroom", sportType:"Boxing", title:"Fight Night", popularity:67, startsAtUTC:"2025-10-05T20:00:00Z", venue:"O2 Arena", city:"London", country:"UK", source:"https://matchroomboxing.com" },
  { promotion:"IBJJF", sportType:"Grappling", title:"IBJJF GP", popularity:62, startsAtUTC:"2025-09-06T17:00:00Z", venue:"Walter Pyramid", city:"Long Beach", country:"USA", source:"https://ibjjf.com" },
  { promotion:"ADCC", sportType:"Grappling", title:"ADCC Trials", popularity:61, startsAtUTC:"2025-11-02T15:00:00Z", venue:"Palau Blaugrana", city:"Barcelona", country:"ESP", source:"https://adcombat.com" },
  { promotion:"Cage Warriors", sportType:"MMA", title:"CW 180", popularity:58, startsAtUTC:"2025-09-28T19:00:00Z", venue:"3Arena", city:"Dublin", country:"IRL", source:"https://cagewarriors.com" },
];

let activePromotion = null;
let activeSport = null;

// Utils
const fmt = (iso, tz=DEFAULT_TZ) => {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("no-NO",{timeZone:tz,weekday:"short",day:"2-digit",month:"short",year:"numeric"}).format(d);
  const time = new Intl.DateTimeFormat("no-NO",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(d);
  return `${date} • ${time} (${tz})`;
};
const el = (t,c,txt)=>{ const e=document.createElement(t); if(c) e.className=c; if(txt) e.textContent=txt; return e; };

// Sidebar rendering
function renderSidebar() {
  const promoUl = document.getElementById("promo-list");
  const sportUl = document.getElementById("sport-list");
  promoUl.innerHTML = ""; sportUl.innerHTML = "";

  promotions.forEach(p => {
    const li = el("li", activePromotion===p ? "active" : "", p);
    li.onclick = () => { activePromotion = (activePromotion===p ? null : p); renderSidebar(); renderCards(); };
    promoUl.appendChild(li);
  });

  sports.forEach(s => {
    const li = el("li", activeSport===s ? "active" : "", s);
    li.onclick = () => { activeSport = (activeSport===s ? null : s); renderSidebar(); renderCards(); };
    sportUl.appendChild(li);
  });
}

// Cards (midten)
function renderCards() {
  const root = document.getElementById("cards");
  const q = document.getElementById("q").value.trim().toLowerCase();
  root.innerHTML = "";

  const filtered = events
    .filter(e => !activePromotion || e.promotion === activePromotion)
    .filter(e => !activeSport || e.sportType === activeSport)
    .filter(e => !q ||
      e.title.toLowerCase().includes(q) ||
      e.promotion.toLowerCase().includes(q) ||
      (e.city||"").toLowerCase().includes(q) ||
      (e.sportType||"").toLowerCase().includes(q)
    )
    .sort((a,b)=> b.popularity - a.popularity || new Date(a.startsAtUTC)-new Date(b.startsAtUTC));

  for (const ev of filtered) {
    const li = el("li","card");
    const badge = el("span","badge",`${ev.promotion} • ${ev.sportType}`);
    const title = el("p","title",ev.title);
    const meta = el("div","meta");
    meta.append(
      el("span",null,fmt(ev.startsAtUTC)),
      el("span",null,[ev.venue, ev.city, ev.country].filter(Boolean).join(", ")),
    );
    const a = el("a","cta","Se mer");
    a.href = ev.source; a.target = "_blank"; a.rel = "noopener";

    li.append(badge, title, meta, a);
    root.appendChild(li);
  }

  if (!filtered.length) root.appendChild(el("li","card","Ingen treff."));
}

// Interaksjon
document.getElementById("q").addEventListener("input", renderCards);
document.getElementById("clear").addEventListener("click", ()=>{
  activePromotion = null; activeSport = null;
  document.getElementById("q").value = "";
  renderSidebar(); renderCards();
});

// Init
document.addEventListener("DOMContentLoaded", ()=>{
  renderSidebar();
  renderCards();
});
