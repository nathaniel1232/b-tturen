/* ===================================================================
   SVERIGE-TUREN — app.js
   Kart + rute + følg-båten (live dato+klokke) + live vær (Open-Meteo)
   + kostnadskalkulator
   =================================================================== */
(function () {
  "use strict";

  const D = window.TRIP_DATA;
  if (!D) { console.error("TRIP_DATA mangler"); return; }

  const SPEED = D.meta.speedKnots || 6;
  const DAY_START = D.meta.dayStartHour || 9;
  const stopById = {};
  D.stops.forEach((s) => (stopById[s.id] = s));

  /* ---------------- Hjelpere ---------------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function parseISO(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
  function toISO(dt) { return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate()); }
  function addDays(dt, n) { const c = new Date(dt); c.setDate(c.getDate() + n); return c; }
  function fmtDate(dt) { return dt.toLocaleDateString("no-NO", { weekday: "short", day: "numeric", month: "short" }); }
  function fmtDateLong(dt) { return dt.toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" }); }
  function fmtTime(dt) { return pad(dt.getHours()) + ":" + pad(dt.getMinutes()); }
  function hoursFor(nm) { return nm / SPEED; }
  function fmtHours(h) {
    const hh = Math.floor(h); const mm = Math.round((h - hh) * 60);
    return hh + " t" + (mm ? " " + mm + " min" : "");
  }
  function kr(n) { return Math.round(n).toLocaleString("no-NO") + " kr"; }

  function haversineNm(a, b) {
    const R = 3440.065;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const la1 = (a[0] * Math.PI) / 180, la2 = (b[0] * Math.PI) / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  /* ---------------- Totaler ---------------- */
  const ROUTE_NM = D.legs.reduce((s, l) => s + l.nm, 0);          // én vei
  const MOTOR_H = ROUTE_NM / SPEED;
  const lastStop = D.stops[D.stops.length - 1];
  const harborNightsOneWay = D.stops
    .filter((s) => !s.harborFree && s.nights > 0)
    .reduce((s, x) => s + x.nights, 0);

  /* ---------------- Tidsplan-simulering ---------------- */
  let startDate = parseISO(D.meta.defaultStart);
  let SCHED = null;

  function buildSchedule() {
    let cursor = new Date(startDate); cursor.setHours(DAY_START, 0, 0, 0);
    const legSched = [];
    const stopSched = {};
    stopSched[D.stops[0].id] = { arrive: new Date(cursor), depart: new Date(cursor) };
    for (let i = 0; i < D.legs.length; i++) {
      const leg = D.legs[i];
      const dep = new Date(cursor);
      const arr = new Date(cursor.getTime() + hoursFor(leg.nm) * 3600 * 1000);
      legSched.push({ depTime: dep, arrTime: arr });
      const toStop = stopById[leg.to];
      let departTime;
      if (toStop.nights > 0) {
        const d = new Date(arr); d.setDate(d.getDate() + toStop.nights); d.setHours(DAY_START, 0, 0, 0);
        departTime = d;
      } else {
        const pause = toStop.pauseH != null ? toStop.pauseH : 1;
        departTime = new Date(arr.getTime() + pause * 3600 * 1000);
      }
      stopSched[toStop.id] = { arrive: new Date(arr), depart: new Date(departTime) };
      cursor = new Date(departTime);
    }
    SCHED = { legSched, stopSched };
  }

  function dayNumber(dt) {
    const a = new Date(startDate); a.setHours(0, 0, 0, 0);
    const b = new Date(dt); b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / 86400000) + 1;
  }
  function inBlackout(dt) {
    const f = parseISO(D.meta.blackout.from), t = parseISO(D.meta.blackout.to);
    const x = new Date(dt); x.setHours(12, 0, 0, 0);
    return x >= f && x <= t;
  }
  function afterSchool(dt) { return dt > parseISO(D.meta.schoolStart); }

  /* ---------------- KART ---------------- */
  const map = L.map("map", { zoomControl: true }).setView([58.9, 9.8], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: "© OpenStreetMap",
  }).addTo(map);

  const legColors = { protected: "#00b894", mixed: "#e67e22", exposed: "#e74c3c" };

  const allLatLngs = [];
  D.legs.forEach((leg) => {
    const pts = leg.path.map((p) => [p[0], p[1]]);
    L.polyline(pts, {
      color: legColors[leg.protection] || "#0a3d62",
      weight: 4, opacity: 0.85,
      dashArray: leg.protection === "exposed" ? "2 8" : null,
    }).addTo(map);
    pts.forEach((p) => allLatLngs.push(p));
  });

  const markers = {};
  D.stops.forEach((s, i) => {
    const icon = L.divIcon({
      className: "",
      html: '<div class="stop-marker ' + s.kind + '"><span>' + (i + 1) + "</span></div>",
      iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28],
    });
    const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
    m.bindPopup("<b>" + s.name + "</b><br>" + nightsText(s));
    m.on("click", () => openDetail(s.id));
    markers[s.id] = m;
  });

  function fitRoute() {
    if (!allLatLngs.length) return;
    const wide = window.innerWidth > 720;
    map.fitBounds(allLatLngs, wide
      ? { paddingTopLeft: [400, 90], paddingBottomRight: [50, 100] }
      : { paddingTopLeft: [30, 130], paddingBottomRight: [30, 150] });
  }
  fitRoute();

  const boatIcon = L.divIcon({ className: "", html: '<div class="boat-marker">⛵</div>', iconSize: [30, 30], iconAnchor: [15, 15] });
  const boatMarker = L.marker([D.stops[0].lat, D.stops[0].lng], { icon: boatIcon, zIndexOffset: 1000, opacity: 0 }).addTo(map);

  /* ---------------- Animasjons-bane ---------------- */
  const segs = [];
  const legRanges = [];
  let cumNm = 0;
  D.legs.forEach((leg, li) => {
    const legStart = cumNm;
    const realLen = leg.path.reduce((s, p, idx) => idx === 0 ? 0 : s + haversineNm(leg.path[idx - 1], leg.path[idx]), 0);
    for (let i = 1; i < leg.path.length; i++) {
      const a = leg.path[i - 1], b = leg.path[i];
      const segNm = realLen > 0 ? (haversineNm(a, b) / realLen) * leg.nm : 0;
      segs.push({ a, b, startNm: cumNm, nm: segNm, legIndex: li });
      cumNm += segNm;
    }
    legRanges[li] = { startNm: legStart, endNm: cumNm };
  });
  const routeTotalNm = cumNm;

  function posAtNm(nm) {
    if (nm <= 0) return { ll: segs[0].a, legIndex: 0 };
    for (const sg of segs) {
      if (nm <= sg.startNm + sg.nm) {
        const f = sg.nm > 0 ? (nm - sg.startNm) / sg.nm : 0;
        return { ll: [sg.a[0] + (sg.b[0] - sg.a[0]) * f, sg.a[1] + (sg.b[1] - sg.a[1]) * f], legIndex: sg.legIndex };
      }
    }
    const last = segs[segs.length - 1];
    return { ll: last.b, legIndex: last.legIndex };
  }

  /* ---------------- VÆR (Open-Meteo) ---------------- */
  const wxCache = {};
  const WX = {
    0: ["☀️", "Klart"], 1: ["🌤️", "Stort sett klart"], 2: ["⛅", "Delvis skyet"], 3: ["☁️", "Skyet"],
    45: ["🌫️", "Tåke"], 48: ["🌫️", "Rimtåke"],
    51: ["🌦️", "Lett yr"], 53: ["🌦️", "Yr"], 55: ["🌧️", "Kraftig yr"],
    61: ["🌧️", "Lett regn"], 63: ["🌧️", "Regn"], 65: ["🌧️", "Kraftig regn"],
    71: ["🌨️", "Lett snø"], 73: ["🌨️", "Snø"], 75: ["❄️", "Kraftig snø"],
    80: ["🌦️", "Regnbyger"], 81: ["🌧️", "Regnbyger"], 82: ["⛈️", "Kraftige byger"],
    95: ["⛈️", "Tordenvær"], 96: ["⛈️", "Torden m/ hagl"], 99: ["⛈️", "Kraftig torden"],
  };
  function wxInfo(code) { return WX[code] || ["🌡️", "—"]; }
  function windWord(ms) {
    if (ms < 0.5) return "stille"; if (ms < 3.4) return "flau vind"; if (ms < 5.5) return "lett bris";
    if (ms < 8) return "laber bris"; if (ms < 10.8) return "frisk bris"; if (ms < 13.9) return "liten kuling";
    if (ms < 17.2) return "stiv kuling"; return "sterk kuling+";
  }
  function windDirArrow(deg) {
    const dirs = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"];
    return dirs[Math.round(deg / 45) % 8];
  }
  function boatVerdict(ms) {
    if (ms == null) return "";
    if (ms < 5.5) return "🟢 Fine forhold for liten båt";
    if (ms < 8) return "🟡 Greit — kjenn på det på åpne strekk";
    if (ms < 10.8) return "🟠 Hold deg innenskjærs, unngå åpne etapper";
    return "🔴 Vent på bedre vær";
  }
  async function getWeather(lat, lng) {
    const key = lat.toFixed(3) + "," + lng.toFixed(3);
    if (wxCache[key]) return wxCache[key];
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng +
      "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
      "&wind_speed_unit=ms&timezone=auto";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Vær-API feilet");
    const j = await res.json();
    wxCache[key] = j.current;
    return j.current;
  }
  async function updateTopWeather(stop) {
    const place = document.getElementById("wx-place");
    const detail = document.getElementById("wx-detail");
    const icon = document.getElementById("wx-icon");
    place.textContent = stop.name.replace(/ 🇸🇪| \(.*\)/g, "");
    detail.textContent = "Henter vær…";
    try {
      const c = await getWeather(stop.lat, stop.lng);
      const [emo] = wxInfo(c.weather_code);
      icon.textContent = emo;
      detail.textContent = Math.round(c.temperature_2m) + "° · " + Math.round(c.wind_speed_10m) +
        " m/s " + windDirArrow(c.wind_direction_10m);
    } catch (e) { detail.textContent = "Vær utilgjengelig"; }
  }

  /* ---------------- Diverse ---------------- */
  function nightsText(s) {
    if (s.nights > 0) return s.nights + (s.nights === 1 ? " natt" : " netter") + (s.harborFree ? " (hytta, gratis)" : "");
    return "Stopp / passering";
  }
  function legIntoStop(stopId) { return D.legs.find((l) => l.to === stopId); }
  function protLabel(p) {
    return p === "protected" ? "🟢 Skjermet innenskjærs" : p === "mixed" ? "🟡 Delvis åpent" : "🔴 Værutsatt — sjekk vind!";
  }

  /* ---------------- DETALJKORT ---------------- */
  const overlay = document.getElementById("detail-overlay");
  const detailBody = document.getElementById("detail-body");

  function openDetail(stopId) {
    const s = stopById[stopId];
    if (!s) return;
    const sch = SCHED.stopSched[stopId];
    const leg = legIntoStop(stopId);
    const harbor = s.harbor || {};

    let legHtml = "";
    if (leg) {
      const fromName = (stopById[leg.from] || {}).name || leg.from;
      legHtml =
        '<div class="detail-h">⛵ Etappe hit</div>' +
        '<div class="info-card">Fra <b>' + fromName + "</b> · " + leg.nm + " nm · ~" +
        fmtHours(hoursFor(leg.nm)) + ' i 6 knop<br><span style="color:' + (legColors[leg.protection]) +
        ';font-weight:700">' + protLabel(leg.protection) + "</span><br>" + (leg.note || "") + "</div>";
    }

    const todoHtml = (s.todo || []).map((t) => "<li>" + t + "</li>").join("");
    const yrUrl = "https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/" + s.lat + "," + s.lng;
    const gmaps = "https://www.google.com/maps/search/?api=1&query=" + s.lat + "," + s.lng;
    const arriveStr = sch ? fmtDateLong(sch.arrive) + " kl. " + fmtTime(sch.arrive) : "";

    detailBody.innerHTML =
      '<div class="detail-hero ' + s.kind + '">' +
        "<h2>" + s.name + "</h2>" +
        '<div class="dh-meta">📅 ' + arriveStr + " · 🛏️ " + nightsText(s) + "</div>" +
      "</div>" +
      '<div class="detail-body-scroll">' +
        '<p class="detail-blurb">' + (s.blurb || "") + "</p>" +
        '<div class="detail-wx" id="detail-wx"><div class="dwx-icon">⏳</div><div class="dwx-main"><div class="dwx-temp">Henter live vær…</div></div></div>' +
        '<div class="detail-h">📋 Ting å gjøre</div><ul class="todo-list">' + todoHtml + "</ul>" +
        '<div class="detail-h">⚓ Havn</div>' +
        '<div class="harbor-grid">' +
          hg("Gjestehavn", harbor.guest) + hg("Diesel", harbor.fuel) +
          hg("Vann", harbor.water) + hg("Butikk", harbor.shop) +
        "</div>" +
        legHtml +
        '<div class="advice-box ' + (s.exposedArrival ? "exposed" : "") + '">💡 ' + (s.advice || "") + "</div>" +
        '<div class="detail-links">' +
          '<a href="' + yrUrl + '" target="_blank" rel="noopener">🌦️ yr.no her</a>' +
          '<a class="alt" href="' + gmaps + '" target="_blank" rel="noopener">📍 Google Maps</a>' +
        "</div>" +
      "</div>";

    overlay.classList.remove("hidden");
    map.flyTo([s.lat, s.lng], 11, { duration: 0.8 });
    highlightStop(stopId);

    getWeather(s.lat, s.lng).then((c) => {
      const box = document.getElementById("detail-wx");
      if (!box) return;
      const [emo, txt] = wxInfo(c.weather_code);
      box.innerHTML =
        '<div class="dwx-icon">' + emo + "</div>" +
        '<div class="dwx-main">' +
          '<div class="dwx-temp">' + Math.round(c.temperature_2m) + "° · " + txt + "</div>" +
          '<div class="dwx-wind">💨 ' + c.wind_speed_10m.toFixed(1) + " m/s (" + windWord(c.wind_speed_10m) +
            ") fra " + windDirArrow(c.wind_direction_10m) +
            (c.wind_gusts_10m ? " · kast " + c.wind_gusts_10m.toFixed(0) + " m/s" : "") + "</div>" +
          '<div class="dwx-sub">' + boatVerdict(c.wind_speed_10m) + " · live nå</div>" +
        "</div>";
    }).catch(() => {
      const box = document.getElementById("detail-wx");
      if (box) box.innerHTML = '<div class="dwx-icon">🌡️</div><div class="dwx-main"><div class="dwx-wind">Live vær utilgjengelig nå — sjekk yr.no-lenken under.</div></div>';
    });
  }
  function hg(label, val) {
    return '<div class="hg"><div class="hg-label">' + label + '</div><div class="hg-val">' + (val || "–") + "</div></div>";
  }
  document.getElementById("detail-close").addEventListener("click", () => overlay.classList.add("hidden"));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.add("hidden"); });

  /* ---------------- RUTELISTE ---------------- */
  function renderRoute() {
    const el = document.getElementById("tab-rute");
    let html = "";
    D.stops.forEach((s, i) => {
      const sch = SCHED.stopSched[s.id];
      const leg = legIntoStop(s.id);
      const arr = sch ? sch.arrive : startDate;
      const blackoutFlag = inBlackout(arr) ? ' <span class="badge exposed">ferie!</span>' : "";
      html += '<div class="stop-item" data-stop="' + s.id + '">' +
        '<div class="stop-rail"><div class="stop-dot ' + s.kind + '">' + (i + 1) + "</div></div>" +
        '<div class="stop-main">' +
          '<div class="stop-name">' + s.name +
            (s.nights > 0 ? '<span class="badge nights">' + s.nights + (s.nights === 1 ? " natt" : " netter") + "</span>" : '<span class="badge nights">stopp</span>') +
            blackoutFlag +
          "</div>" +
          '<div class="stop-meta">📅 ' + fmtDate(arr) + " kl. " + fmtTime(arr) +
            (leg ? " · " + leg.nm + " nm · ~" + fmtHours(hoursFor(leg.nm)) : " · Avreise") + "</div>" +
          '<div class="stop-blurb">' + (s.blurb || "").slice(0, 105) + ((s.blurb || "").length > 105 ? "…" : "") + "</div>" +
        "</div></div>";
    });
    el.innerHTML = html;
    el.querySelectorAll(".stop-item").forEach((it) => {
      it.addEventListener("click", () => openDetail(it.getAttribute("data-stop")));
    });
  }

  /* ---------------- HJEMTUR ---------------- */
  function renderReturn() {
    const el = document.getElementById("tab-hjem");
    const rp = D.returnPlan;
    let html = '<div class="return-intro">↩︎ ' + rp.intro + "</div>";
    rp.legs.forEach((l) => {
      html += '<div class="return-leg"><div><div class="rl-route">' + l.from + " → " + l.to +
        '</div><div class="rl-note">' + (l.note || "") + "</div></div></div>";
    });
    html += '<div class="return-intro" style="margin-top:12px">🏁 <b>Full rundtur</b> (hvis dere tar hjemturen i ett strekk): ~' +
      (ROUTE_NM * 2) + " nm · ~" + Math.round(MOTOR_H * 2) + " timer motortid · ~13–14 dager totalt.</div>";
    el.innerHTML = html;
  }

  /* ---------------- KOSTNAD ---------------- */
  function renderCosts() {
    const c = D.meta.costs;
    const el = document.getElementById("tab-kost");
    const daysToSweden = SCHED ? dayNumber(SCHED.stopSched[lastStop.id].arrive) : 8;
    const totalDaysOneWay = SCHED ? dayNumber(SCHED.stopSched[lastStop.id].depart) : 10;

    el.innerHTML =
      '<div class="cost-intro">Regn ut hva turen koster. Endre antall personer og prisene — alt oppdateres live. (Standard = turen <b>til Sverige</b>, én vei inkl. opphold.)</div>' +
      '<div class="cost-toggle"><label><input type="checkbox" id="c-round"> Regn for <b>rundtur</b> (tur/retur)</label></div>' +
      '<div class="cost-grid">' +
        costInput("c-people", "👥 Antall personer", c.people, 1) +
        costInput("c-days", "📅 Antall dager", totalDaysOneWay, 1) +
        costInput("c-nights", "🛏️ Netter i gjestehavn", harborNightsOneWay, 1) +
        costInput("c-dieselp", "⛽ Diesel kr/liter", c.dieselPrice, 1) +
        costInput("c-cons", "🔧 Forbruk l/time", c.consumption, 0.1) +
        costInput("c-harbor", "⚓ Gjestehavn kr/natt", c.harborPerNight, 10) +
        costInput("c-food", "🥫 Mat kr/pers/dag", c.foodPerDay, 10) +
        costInput("c-drink", "🍺 Pils/drikke kr/pers/dag", c.drinkPerDay, 10) +
        costInput("c-extra", "🎟️ Ekstra kr/pers (akt./rest.)", c.extrasPerPerson, 50) +
      "</div>" +
      '<div id="cost-result"></div>';

    el.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", computeCosts));
    document.getElementById("c-round").addEventListener("change", function () {
      // oppdater dager/netter til rundtur-anslag når man huker av
      document.getElementById("c-days").value = this.checked ? totalDaysOneWay + 6 : totalDaysOneWay;
      document.getElementById("c-nights").value = this.checked ? harborNightsOneWay + 6 : harborNightsOneWay;
      computeCosts();
    });
    computeCosts();
  }
  function costInput(id, label, val, step) {
    return '<div class="cost-field"><label for="' + id + '">' + label + '</label>' +
      '<input type="number" id="' + id + '" value="' + val + '" min="0" step="' + step + '"></div>';
  }
  function num(id) { const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? 0 : v; }
  function computeCosts() {
    const round = document.getElementById("c-round").checked;
    const people = Math.max(1, num("c-people"));
    const days = num("c-days");
    const nights = num("c-nights");
    const nm = ROUTE_NM * (round ? 2 : 1);

    const dieselL = (nm / SPEED) * num("c-cons");
    const diesel = dieselL * num("c-dieselp");
    const harbor = nights * num("c-harbor");
    const food = people * days * num("c-food");
    const drink = people * days * num("c-drink");
    const extra = people * num("c-extra");
    const total = diesel + harbor + food + drink + extra;

    const rows = [
      ["⛽ Diesel", diesel, Math.round(dieselL) + " l (" + nm + " nm)"],
      ["⚓ Gjestehavn", harbor, nights + " netter"],
      ["🥫 Mat", food, people + " pers × " + days + " dg"],
      ["🍺 Pils/drikke", drink, people + " pers × " + days + " dg"],
      ["🎟️ Ekstra", extra, people + " pers"],
    ];
    let html = '<div class="cost-table">';
    rows.forEach((r) => {
      html += '<div class="cost-row"><span>' + r[0] + ' <em>' + r[2] + '</em></span><b>' + kr(r[1]) + "</b></div>";
    });
    html += "</div>";
    html += '<div class="cost-total">' +
      '<div class="ct-big"><span>Totalt</span><b>' + kr(total) + "</b></div>" +
      '<div class="ct-sub"><span>Per person</span><b>' + kr(total / people) + "</b></div>" +
      '<div class="ct-sub"><span>Per person / dag</span><b>' + kr(total / people / Math.max(1, days)) + "</b></div>" +
      "</div>" +
      '<div class="cost-note">💡 Tips: kjøp pils i Norge før Sverige (billigere), men husk kvotene hjem. Hytta i Lillesand er gratis overnatting.</div>';
    document.getElementById("cost-result").innerHTML = html;
  }

  /* ---------------- INFO / KLAR? ---------------- */
  function renderInfo() {
    const el = document.getElementById("tab-info");
    const c = D.checklists;
    const cu = D.customs;
    const b = D.boatInfo;
    const w = D.weatherGuide;
    let html = "";

    // Værstrategi
    html += '<div class="info-section"><h3>🌦️ Værstrategi (viktigst!)</h3><div class="info-card">' +
      (w.intro || "") + "<br><br><b>Døgnrytmen:</b> " + (w.rhythm || "") +
      "<ul>" + (w.thresholds || []).map((t) => "<li>" + t + "</li>").join("") + "</ul>" +
      "<b>Regler:</b><ul>" + (w.rules || []).map((r) => "<li>" + r + "</li>").join("") + "</ul></div></div>";

    // Båt & sikkerhet
    html += '<div class="info-section"><h3>⛵ Båt, bevis & drivstoff</h3><div class="info-card">' +
      "<b>Båtførerbevis:</b> " + (b.license || "") + "<br><br>" +
      "<b>Drivstoff & rekkevidde:</b> " + (b.fuelRange || "") + "<br><br>" +
      "<b>Mest værutsatte etapper:</b><ul>" + (b.dangerLegs || []).map((d) => "<li>" + d + "</li>").join("") + "</ul>" +
      "<b>Navigasjons-apper:</b> " + (b.navApps || []).join(", ") + "</div></div>";

    html += infoChecklist("🦺 Sikkerhet om bord", c.safety);
    html += infoChecklist("🥫 Proviant", c.provisioning);
    html += infoChecklist("🎒 Pakkeliste", c.packing);

    // Toll
    html += '<div class="info-section"><h3>🛂 Toll & grense (Norge↔Sverige)</h3><div class="info-card">' +
      (cu.intro || "") + "<ul>" + (cu.points || []).map((p) => "<li>" + p + "</li>").join("") + "</ul>" +
      '<div class="quota"><b>🍺 Norsk hjemreisekvote:</b> ' + (cu.alcohol || "") + "</div>" +
      '<div class="quota"><b>🇸🇪 Svensk innførselskvote:</b> ' + (cu.swedishQuota || "") + "</div>" +
      '<div class="note">' + (cu.note || "") + "</div></div></div>";

    // Værkilder
    html += '<div class="info-section"><h3>🔗 Værkilder</h3>';
    (D.weatherSources || []).forEach((src) => {
      html += '<div class="source-link"><a href="' + src.url + '" target="_blank" rel="noopener">' + src.name +
        " ↗</a><span>" + src.why + "</span></div>";
    });
    html += "</div>";

    html += '<div class="info-card note" style="font-style:normal">⚠️ ' + D.meta.disclaimer + "</div>";
    el.innerHTML = html;
  }
  function infoChecklist(title, items) {
    return '<div class="info-section"><h3>' + title + '</h3><ul class="check-list">' +
      (items || []).map((i) => "<li>" + i + "</li>").join("") + "</ul></div>";
  }

  function highlightStop(stopId) {
    document.querySelectorAll(".stop-item").forEach((it) => {
      it.classList.toggle("active", it.getAttribute("data-stop") === stopId);
    });
  }

  /* ---------------- Oppsummering ---------------- */
  function renderSummary() {
    const daysToSweden = dayNumber(SCHED.stopSched[lastStop.id].arrive);
    document.getElementById("stat-distance").textContent = ROUTE_NM;
    document.getElementById("stat-hours").textContent = Math.round(MOTOR_H);
    document.getElementById("stat-days").textContent = daysToSweden;
    document.getElementById("boat-name").textContent = D.meta.boat;

    const inp = document.getElementById("start-date");
    inp.value = toISO(startDate);
    inp.min = "2026-06-21";
    inp.max = "2026-08-10";
    checkBlackout();
  }

  function checkBlackout() {
    const warnEl = document.getElementById("blackout-warning");
    const msgs = [];
    let hitBlackout = false;
    D.stops.forEach((s) => { if (inBlackout(SCHED.stopSched[s.id].arrive)) hitBlackout = true; });
    const swedenArr = SCHED.stopSched[lastStop.id].arrive;
    const homeEst = addDays(SCHED.stopSched[lastStop.id].depart, 6); // grovt hjemme-estimat
    if (hitBlackout) msgs.push("⚠️ Turen kolliderer med skipperens ferie (" +
      fmtDate(parseISO(D.meta.blackout.from)) + "–" + fmtDate(parseISO(D.meta.blackout.to)) + "). Flytt avreise.");
    if (afterSchool(homeEst)) msgs.push("📚 Med hjemtur er dere tilbake ca. " + fmtDate(homeEst) +
      " — etter skolestart (" + fmtDate(parseISO(D.meta.schoolStart)) + "). Start tidligere.");
    if (msgs.length) { warnEl.innerHTML = msgs.join("<br>"); warnEl.classList.remove("hidden"); }
    else { warnEl.classList.add("hidden"); }
  }

  function rebuildAll() {
    buildSchedule();
    renderSummary();
    renderRoute();
    renderReturn();
    renderCosts();
    checkBlackout();
  }

  document.getElementById("start-date").addEventListener("change", (e) => {
    if (e.target.value) { startDate = parseISO(e.target.value); progressNm = 0; rebuildAll(); updateBoat(); }
  });

  /* ---------------- Faner ---------------- */
  const TABS = ["rute", "kost", "hjem", "info"];
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      const id = t.getAttribute("data-tab");
      TABS.forEach((k) => document.getElementById("tab-" + k).classList.toggle("hidden", k !== id));
    });
  });

  document.getElementById("panel-toggle").addEventListener("click", () => {
    const sp = document.getElementById("sidepanel");
    sp.classList.toggle("open");
    document.getElementById("panel-toggle").textContent = sp.classList.contains("open") ? "‹" : "›";
    setTimeout(() => map.invalidateSize(), 300);
  });

  /* ---------------- FØLG BÅTEN ---------------- */
  let playing = false, rafId = null, progressNm = 0, lastTs = null, speedMult = 2;
  const playBtn = document.getElementById("play-btn");
  const slider = document.getElementById("play-slider");
  const playLeg = document.getElementById("play-leg");
  const playDate = document.getElementById("play-date");
  const playTime = document.getElementById("play-time");

  function updateBoat() {
    const pos = posAtNm(progressNm);
    boatMarker.setLatLng(pos.ll);
    boatMarker.setOpacity(1);
    const li = pos.legIndex;
    const leg = D.legs[li];
    if (leg) {
      const fromN = (stopById[leg.from] || {}).name || leg.from;
      const toN = (stopById[leg.to] || {}).name || leg.to;
      playLeg.textContent = "⛵ " + fromN + " → " + toN + "  ·  " + protLabel(leg.protection);
      const r = legRanges[li];
      const span = r.endNm - r.startNm;
      const fr = span > 0 ? Math.min(1, Math.max(0, (progressNm - r.startNm) / span)) : 0;
      const ls = SCHED.legSched[li];
      const t = new Date(ls.depTime.getTime() + fr * (ls.arrTime - ls.depTime));
      playDate.textContent = fmtDate(t);
      playTime.textContent = fmtTime(t);
    }
    slider.value = Math.round((progressNm / routeTotalNm) * 1000);
  }

  function tick(ts) {
    if (!playing) return;
    if (lastTs == null) lastTs = ts;
    const dt = (ts - lastTs) / 1000; lastTs = ts;
    const nmPerSec = (routeTotalNm / 30) * speedMult;
    progressNm += nmPerSec * dt;
    if (progressNm >= routeTotalNm) { progressNm = routeTotalNm; updateBoat(); stopPlay(); return; }
    updateBoat();
    rafId = requestAnimationFrame(tick);
  }
  function startPlay() {
    if (progressNm >= routeTotalNm) progressNm = 0;
    playing = true; lastTs = null; playBtn.textContent = "⏸";
    rafId = requestAnimationFrame(tick);
  }
  function stopPlay() {
    playing = false; playBtn.textContent = "▶";
    if (rafId) cancelAnimationFrame(rafId);
  }
  playBtn.addEventListener("click", () => { playing ? stopPlay() : startPlay(); });
  slider.addEventListener("input", () => {
    stopPlay();
    progressNm = (Number(slider.value) / 1000) * routeTotalNm;
    updateBoat();
  });
  document.getElementById("play-speed").addEventListener("change", (e) => { speedMult = Number(e.target.value); });

  /* ---------------- Topplinje + init ---------------- */
  function initTopbar() {
    document.getElementById("today-date").textContent =
      new Date().toLocaleDateString("no-NO", { day: "numeric", month: "short", year: "numeric" });
    updateTopWeather(D.stops[0]);
  }

  /* ---------------- KJØR ---------------- */
  buildSchedule();
  renderSummary();
  renderRoute();
  renderReturn();
  renderCosts();
  renderInfo();
  initTopbar();
  setTimeout(() => map.invalidateSize(), 200);

  window.__trip = { map, openDetail, getWeather, SCHED: () => SCHED };
})();
