/* =====================================================================
   SVERIGE-TUREN — flere turer (turvelger)
   Tre turer bygges fra felles STEDER (PLACES) + ETAPPER (SEG):
     1. Sverige (én vei, ~8 dg)        → helt til Strömstad
     2. 8 dg tur/retur → Stavern/Larvik (nærmest Sverige t/r på 8 dg)
     3. 6 dg tur/retur → Kragerø        (rolig sløyfe)
   Koordinater/distanser er INDIKATIVE — IKKE for navigasjon.
   Toll/sikkerhet/drivstoff verifisert via research (Tolletaten, Tullverket,
   Kystverket, met.no) — sjekk alltid satser før tur.
   ===================================================================== */

/* ---------- STEDER (felles for alle turer) ---------- */
const PLACES = {
  kristiansand: {
    name: "Kristiansand (Rona båthavn)", lat: 58.156, lng: 8.055, kind: "start",
    blurb: "Hjemmehavn. Her starter alt. Topp opp diesel, vann og proviant før vi stikker ut Topdalsfjorden og inn i Blindleia østover.",
    todo: ["Fyll diesel HELT opp (tank ~70 l = kort rekkevidde — fyll ofte!)", "Sjekk olje, kjølevann, impeller og kilereim på Yanmar-en", "Test VHF, lanterner og lensepumpe FØR avgang", "Vann på tank + ekstra dunker, siste storhandel", "Sjekk yr.no + BarentsWatch bølgevarsel"],
    harbor: { guest: "Egen plass / Rona båthavn (Topdalsfjorden, øst i byen)", fuel: "Diesel ved marinaene nær Kristiansand gjestehavn", water: "Ja", shop: "Fullt utvalg butikker" },
    advice: "Dra tidlig på morgenen mens det er lite vind. Blindleia er svært skjermet, så første dag er trygg selv om det blåser litt ute.",
  },
  lillesand: {
    name: "Lillesand (hytta)", lat: 58.2495, lng: 8.3772, kind: "base", harborFree: true,
    blurb: "Hytta! Vi tar det rolig her. Perfekt base — gutta kan ta bussen hjem og jobbe en dag, og komme tilbake hit før vi fortsetter.",
    todo: ["Sove + chille på hytta (gratis overnatting!)", "Grille og ta pils i solnedgang", "Etterfylle proviant (Lillesand har butikk)", "La evt. 1–2 mann ta buss hjem for jobb, hente dem tilbake her"],
    harbor: { guest: "Egen brygge ved hytta / Lillesand gjestehavn", fuel: "Diesel i Lillesand", water: "Ja", shop: "Butikker i sentrum" },
    advice: "Blindleia inn til Lillesand er noe av det fineste på kysten — kjør sakte og nyt det. Bra værbuffer før de åpne etappene østover.",
  },
  grimstad: {
    name: "Grimstad", lat: 58.3447, lng: 8.5949, kind: "fuel",
    blurb: "Sjarmerende hvit sørlandsby. Kjapp stopp på vei mot Arendal — strekk på beina, evt. fyll diesel.",
    todo: ["Kjapp benstrekk på brygga", "Evt. diesel og vann", "Is til veien"],
    harbor: { guest: "Grimstad gjestehavn (midt i sentrum)", fuel: "Diesel i nærheten", water: "Ja", shop: "Butikker i gangavstand" },
    advice: "Beskyttet innseiling. Vi blir ikke liggende — videre samme dag.",
  },
  arendal: {
    name: "Arendal", lat: 58.4612, lng: 8.7669, kind: "harbor",
    blurb: "«Sørlandets Venezia» med kanaler og livlig Pollen-havn midt i byen. Fin lunsjstopp + diesel.",
    todo: ["Lunsj på brygga i Pollen", "Rusle på Tyholmen / gamlebyen", "Fyll diesel (Barbu marina) og vann"],
    harbor: { guest: "Pollen gjestehavn (helt sentralt, via Galtesund)", fuel: "Diesel (Barbu marina)", water: "Ja", shop: "Fullt utvalg" },
    advice: "Galtesund leder rett inn til sentrum. God dieselstopp. Etappen videre ut Tromøysund mot Lyngør er delvis åpen — sjekk vind.",
  },
  lyngor: {
    name: "Lyngør", lat: 58.6326, lng: 9.1297, kind: "gem", exposedArrival: true,
    blurb: "Bilfri øyperle — kåret til Europas best bevarte tettsted. Trange, idylliske sund mellom hvite hus. Et must.",
    todo: ["Ligg i sundet mellom husene", "Lyngør Fyr", "Bad fra svaberg", "Øl på Den Blå Lanterne"],
    harbor: { guest: "Gjesteplasser i sundet (kom tidlig — fullt i høysesong)", fuel: "Begrenset — fyll i Arendal/Risør", water: "Ja", shop: "Liten landhandel" },
    advice: "Smal innseiling — ta det rolig. Ingen biler = total ro. Kom tidlig for å sikre plass.",
  },
  risor: {
    name: "Risør", lat: 58.7206, lng: 9.2342, kind: "harbor",
    blurb: "«Den hvite by ved Skagerrak». Vakker trehusbebyggelse rundt en lun indre havn. Lunsjstopp + diesel.",
    todo: ["Lunsj ved gjestehavna", "Rusle i trehusbyen / Risør Akvarium", "Fyll diesel og vann"],
    harbor: { guest: "Risør gjestehavn (indre havn, godt skjermet)", fuel: "Diesel i Risør", water: "Ja", shop: "Butikker nær havna" },
    advice: "Innseiling forbi Stangholmen fyr er grei i pent vær. Lun havn — fyll opp før den mer åpne skjærgården mot Kragerø (Portør).",
  },
  kragero: {
    name: "Kragerø", lat: 58.8693, lng: 9.4149, kind: "base",
    blurb: "Perlen blant kystbyene (Edvard Munchs «perle»). Skjærgård i verdensklasse rundt. Bading, svaberg og uteliv.",
    todo: ["Bading og svaberg i skjærgården", "Tur til Jomfruland på fin dag", "Middag og uteliv i sentrum", "Storhandle proviant"],
    harbor: { guest: "Kragerø gjestehavn (sentralt)", fuel: "Diesel i Kragerø", water: "Ja", shop: "Fullt utvalg" },
    advice: "Siste skikkelige by før de værutsatte etappene østover (Jomfruland + Langesundsbukta). Legg avgang TIDLIG — før sjøbrisen bygger seg opp.",
  },
  langesund: {
    name: "Langesund", lat: 59.0008, lng: 9.749, kind: "fuel", exposedArrival: true,
    blurb: "Innfartsporten til Grenland. Kort diesel- og benstrekk-stopp midt mellom de to mest værutsatte etappene.",
    todo: ["Fyll diesel", "Kjapp matbit", "Sjekk vind på nytt før Langesundsbukta"],
    harbor: { guest: "Langesund gjestehavn", fuel: "Diesel", water: "Ja", shop: "Butikk i sentrum" },
    advice: "⚠️ Både etappen hit (forbi Jomfruland) og videre (over Langesundsbukta) er åpne og værutsatte. Kjør kun i lite vind, helst formiddag.",
  },
  stavern: {
    name: "Stavern", lat: 58.9983, lng: 10.0356, kind: "harbor", exposedArrival: true,
    blurb: "Sjarmerende marineby med Norges soldager og lun gjestehavn. Velfortjent pustehull etter Langesundsbukta.",
    todo: ["Ligg i den koselige gjestehavna", "Citadelløya / Stavern fort", "Middag i sentrum", "Bade i Vestfold-skjærgården"],
    harbor: { guest: "Stavern gjestehavn (lun, populær)", fuel: "Diesel i Larvik/Stavern", water: "Ja", shop: "Butikker i gangavstand" },
    advice: "Porten til Vestfold/Oslofjorden — så langt mot Sverige man kommer på en kort rundtur. Lun og fin havn.",
  },
  sandefjord: {
    name: "Sandefjord", lat: 59.1312, lng: 10.2167, kind: "harbor",
    blurb: "Tidligere hvalfangstby med flott havnepromenade. Lunsjstopp på vei inn i Tjøme-skjærgården.",
    todo: ["Lunsj på bryggepromenaden", "Hvalfangstmonumentet", "Bunkre vann/proviant"],
    harbor: { guest: "Sandefjord gjestehavn (sentralt)", fuel: "Diesel", water: "Ja", shop: "Fullt utvalg" },
    advice: "Delvis skjermet av Vesterøya inn mot byen. Greit mellomstopp før Tønsberg.",
  },
  tonsberg: {
    name: "Tønsberg", lat: 59.2676, lng: 10.4076, kind: "harbor",
    blurb: "Norges eldste by, med yrende Brygga-liv om sommeren. Siste norske overnatting før vi går ut mot grensa.",
    todo: ["Ligg ved Brygga (yrende uteliv)", "Slottsfjellet / tårnet", "Middag og pils på brygga", "Sjekk værvindu GRUNDIG for kryssingen"],
    harbor: { guest: "Tønsberg gjestehavn (rett ved Brygga)", fuel: "Diesel i nærheten", water: "Ja", shop: "Fullt utvalg" },
    advice: "Vi går indre led gjennom Vrengen for best ly forbi Tjøme. Neste etappe krysser ytre Oslofjord (Verdens Ende → Hvaler) — åpen sjø.",
  },
  hvaler: {
    name: "Hvaler (Skjærhalden)", lat: 59.028, lng: 11.032, kind: "harbor",
    blurb: "Ytterste norske utpost før Sverige — distriktets største gjestehavn (~100 plasser). Nydelig skjærgård og nasjonalpark.",
    todo: ["Bad i Ytre Hvaler nasjonalpark", "Fyll diesel og vann HELT opp (siste i Norge)", "Sjekk vær GRUNDIG for kryssingen Hvaler→Koster", "Sjekk toll-/melderutiner + last ned Kvoteappen"],
    harbor: { guest: "Skjærhalden gjestehavn (~100 plasser, dybde 3–18 m)", fuel: "Diesel", water: "Ja", shop: "Butikk" },
    advice: "Siste stopp i Norge. Kryssingen til Koster går over åpent farvann — vent på lite vind, dra tidlig morgen. Ly: Skjærhalden (NO), Kostersundet (SE).",
  },
  koster: {
    name: "Koster (Sydkoster) 🇸🇪", lat: 58.867, lng: 11.04, kind: "sweden", exposedArrival: true,
    blurb: "VELKOMMEN TIL SVERIGE! Bilfrie øyer i Sveriges første marine nasjonalpark (Kosterhavet).",
    todo: ["Skål — vi er i Sverige! 🇸🇪", "Lunsj / reker på bryggekafé i Ekenäs", "Evt. en rask sykkeltur", "Kostersundet er trygg nødhavn"],
    harbor: { guest: "Ekenäs gästhamn (Sydkoster) / Kostersundet", fuel: "Begrenset — fyll på Hvaler først", water: "Ja", shop: "Liten butikk" },
    advice: "Husk tollformaliteter (se Toll & grense). Kostersundet ligger trygt selv i hard SV-vind.",
  },
  stromstad: {
    name: "Strömstad 🇸🇪", lat: 58.9333, lng: 11.1833, kind: "destination",
    blurb: "ENDESTASJON! Klassisk svensk badeby med alt: gjestehavn midt i byen (~350 plasser), Systembolaget, restauranter og rekefrokost.",
    todo: ["Feire at vi kom helt til Sverige! 🎉", "Rekefrokost i gjestehavna", "Systembolaget — hold deg innenfor norsk kvote", "Restaurant/uteliv", "Hvile + planlegg hjemtur"],
    harbor: { guest: "Strömstad gästhamn (sentralt, ~350 plasser)", fuel: "Diesel", water: "Ja", shop: "Fullt utvalg + Systembolaget" },
    advice: "Mål nådd! 🇸🇪 Husk: ved retur til Norge må du gå direkte til sted med tolltjeneste hvis du har varer over kvoten. Bruk Kvoteappen.",
  },
};

/* ---------- ETAPPER (eastbound). Returetapper snur path automatisk. ---------- */
const SEG = {
  "kristiansand-lillesand": { nm: 13, protection: "protected", note: "Ut Topdalsfjorden og inn i Blindleia ved Ulvøysund — en av Norges mest skjermede skjærgårdsleier.",
    path: [[58.156,8.055],[58.165,8.13],[58.20,8.21],[58.225,8.30],[58.243,8.345],[58.2495,8.3772]] },
  "lillesand-grimstad": { nm: 10, protection: "protected", note: "Innenskjærs forbi Justøya og Skiftenes. Smale, godt merkede løp.",
    path: [[58.2495,8.3772],[58.278,8.45],[58.315,8.54],[58.3447,8.5949]] },
  "grimstad-arendal": { nm: 9, protection: "protected", note: "Forbi Hesnesøya og inn Galtesund til Arendal sentrum.",
    path: [[58.3447,8.5949],[58.385,8.66],[58.43,8.73],[58.4612,8.7669]] },
  "arendal-lyngor": { nm: 17, protection: "mixed", note: "Ut Tromøysund, forbi Narestø, over åpnere farvann ved Sandøya. Delvis eksponert mot Skagerrak.",
    path: [[58.4612,8.7669],[58.505,8.86],[58.555,8.97],[58.605,9.08],[58.6326,9.1297]] },
  "lyngor-risor": { nm: 8, protection: "mixed", note: "Forbi Stangholmen til Risør. Kort, men værutsatt åpning mot Skagerrak.",
    path: [[58.6326,9.1297],[58.67,9.18],[58.70,9.21],[58.7206,9.2342]] },
  "risor-kragero": { nm: 16, protection: "mixed", note: "Gjennom Kragerøskjærgården forbi Portør. Partiet ved Portør er eksponert — vurder vinden.",
    path: [[58.7206,9.2342],[58.77,9.30],[58.83,9.38],[58.8693,9.4149]] },
  "kragero-langesund": { nm: 15, protection: "exposed", note: "⚠️ VÆRUTSATT: forbi Jomfruland over Jomfrulandsrenna mot Langesundsbukta. Helt åpent mot Skagerrak — gå tidlig morgen i stille vær.",
    path: [[58.8693,9.4149],[58.90,9.52],[58.955,9.65],[59.0008,9.749]] },
  "langesund-stavern": { nm: 17, protection: "exposed", note: "⚠️⚠️ VÆRUTSATT: kryssing av Langesundsbukta forbi Nevlunghavn/Stavernsodden. Åpen Skagerrak-eksponering uten ly.",
    path: [[59.0008,9.749],[58.99,9.85],[58.97,9.875],[58.995,9.98],[58.9983,10.0356]] },
  "stavern-sandefjord": { nm: 13, protection: "mixed", note: "Inn Larviksfjorden og rundt mot Sandefjordsfjorden. Delvis skjermet av Vesterøya.",
    path: [[58.9983,10.0356],[59.05,10.10],[59.10,10.17],[59.1312,10.2167]] },
  "sandefjord-tonsberg": { nm: 14, protection: "mixed", note: "Ut Sandefjordsfjorden, forbi Tjøme, inn via Vrengen mot Tønsberg. Velg indre led (Vrengen) for best ly.",
    path: [[59.1312,10.2167],[59.17,10.28],[59.22,10.36],[59.2676,10.4076]] },
  "tonsberg-hvaler": { nm: 27, protection: "exposed", note: "⚠️⚠️ Ned Tønsbergfjorden forbi Verdens Ende, så ÅPEN KRYSSING over ytre Oslofjord til Hvaler. Ingen ly midtfjords — krever rolig morgen.",
    path: [[59.2676,10.4076],[59.15,10.43],[59.04,10.44],[59.03,10.43],[59.04,10.70],[59.05,10.90],[59.028,11.032]] },
  "hvaler-koster": { nm: 12, protection: "exposed", note: "⚠️⚠️ VÆRUTSATT GRENSEKRYSSING over Kosterfjorden/Skagerrak. Mest kritiske åpne etappen — KUN i stabilt, rolig vær, tidlig på dagen.",
    path: [[59.028,11.032],[58.97,11.03],[58.92,11.04],[58.867,11.04]] },
  "koster-stromstad": { nm: 7, protection: "mixed", note: "Over Kosterfjorden østover til Strömstad. Delvis skjermet, men åpent midtfjords med ferjetrafikk. Siste etappe!",
    path: [[58.867,11.04],[58.89,11.09],[58.915,11.14],[58.9333,11.1833]] },
};

/* ---------- Bygg en tur fra en sekvens av steder ---------- */
function buildTrip(meta, seq) {
  const used = {};
  const stops = seq.map((e) => {
    const base = PLACES[e.id];
    let uid = e.id;
    if (used[e.id]) uid = e.id + "__" + (used[e.id] + 1);
    used[e.id] = (used[e.id] || 0) + 1;
    return Object.assign({}, base, {
      id: uid, baseId: e.id, nights: e.nights || 0, pauseH: e.pauseH,
      turnaround: !!e.turnaround,
    });
  });
  const legs = [];
  for (let i = 0; i < seq.length - 1; i++) {
    const aId = seq[i].id, bId = seq[i + 1].id;
    let seg = SEG[aId + "-" + bId], path;
    if (seg) path = seg.path.map((p) => [p[0], p[1]]);
    else { seg = SEG[bId + "-" + aId]; path = seg.path.map((p) => [p[0], p[1]]).reverse(); }
    legs.push({ from: stops[i].id, to: stops[i + 1].id, nm: seg.nm, protection: seg.protection, note: seg.note, path: path });
  }
  return Object.assign({ stops: stops, legs: legs }, meta);
}

/* ---------- TURENE ---------- */
const TRIPS = [
  buildTrip(
    { id: "sverige", name: "🇸🇪 Sverige (én vei, ~8 dg)", oneWay: true,
      blurb: "Helt til Strömstad i Sverige — én vei. Hjemturen er egen plan (se Hjemtur-fanen).",
      returnPlan: {
        intro: "Hjemturen er samme farvann tilbake — ~178 nm, ~30 t motor, realistisk ~6 seilingsdager. Planlegg den etter eget værvindu. Full rundtur blir derfor ~13–14 dager.",
        legs: [
          { from: "Strömstad", to: "Hvaler", note: "Over grensa igjen — kun godvær, tidlig morgen. Ved retur til Norge: gå direkte til sted med tolltjeneste hvis varer over kvoten, ellers grønn passering. Bruk Kvoteappen." },
          { from: "Hvaler", to: "Stavern", note: "Tilbake over ytre Oslofjord (Verdens Ende) — åpen kryssing, vent på rolig vær." },
          { from: "Stavern", to: "Kragerø", note: "Over Langesundsbukta og forbi Jomfruland i morgenvindu." },
          { from: "Kragerø", to: "Lyngør", note: "Innenskjærs sørover gjennom skjærgården." },
          { from: "Lyngør", to: "Lillesand", note: "Siste natt på hytta (gratis!)." },
          { from: "Lillesand", to: "Kristiansand", note: "Gjennom Blindleia hjem. Vel i havn! 🏁" },
        ],
      },
    },
    [
      { id: "kristiansand" }, { id: "lillesand", nights: 2 }, { id: "grimstad", pauseH: 0.75 },
      { id: "arendal", pauseH: 1.25 }, { id: "lyngor", nights: 1 }, { id: "risor", pauseH: 1.25 },
      { id: "kragero", nights: 1 }, { id: "langesund", pauseH: 0.75 }, { id: "stavern", nights: 1 },
      { id: "sandefjord", pauseH: 1.25 }, { id: "tonsberg", nights: 1 }, { id: "hvaler", nights: 1 },
      { id: "koster", pauseH: 1.5 }, { id: "stromstad", nights: 2, turnaround: true },
    ]
  ),

  buildTrip(
    { id: "rundtur8", name: "⛵ 8 dg tur/retur → Stavern", oneWay: false,
      blurb: "Rundtur så langt mot Sverige som går på 8 dager: helt til Stavern/Larvik i Vestfold og hjem igjen. Krysser de åpne etappene (Jomfruland + Langesundsbukta) — væravhengig." },
    [
      { id: "kristiansand" }, { id: "lillesand", nights: 1 }, { id: "grimstad", pauseH: 0.75 },
      { id: "arendal", pauseH: 1.25 }, { id: "lyngor", nights: 1 }, { id: "risor", pauseH: 1.25 },
      { id: "kragero", nights: 1 }, { id: "langesund", pauseH: 0.75 }, { id: "stavern", nights: 1, turnaround: true },
      { id: "langesund", pauseH: 0.75 }, { id: "kragero", nights: 1 }, { id: "risor", pauseH: 1.25 },
      { id: "lyngor", nights: 1 }, { id: "arendal", pauseH: 1.25 }, { id: "grimstad", pauseH: 0.75 },
      { id: "lillesand", nights: 1 }, { id: "kristiansand" },
    ]
  ),

  buildTrip(
    { id: "kragero6", name: "🏖️ 6 dg tur/retur → Kragerø", oneWay: false,
      blurb: "Rolig sløyfe til Kragerø og hjem igjen på 6 dager. Ingen åpne kryssinger — innenskjærs hele veien. Perfekt om man vil ta det med ro." },
    [
      { id: "kristiansand" }, { id: "lillesand", nights: 1 }, { id: "grimstad", pauseH: 0.75 },
      { id: "arendal", pauseH: 1.25 }, { id: "lyngor", nights: 1 }, { id: "risor", pauseH: 1.25 },
      { id: "kragero", nights: 1, turnaround: true }, { id: "risor", pauseH: 1.25 }, { id: "lyngor", nights: 1 },
      { id: "arendal", pauseH: 1.25 }, { id: "grimstad", pauseH: 0.75 }, { id: "lillesand", nights: 1 },
      { id: "kristiansand" },
    ]
  ),
];

/* ---------- FELLES DATA (gjelder alle turer) ---------- */
const TRIP_DATA = {
  meta: {
    title: "Sverige-turen",
    subtitle: "Sørlandet innenskjærs — flere turer",
    boat: "Marex 24 Sun Cab · Yanmar 3HM (~27 hk)",
    speedKnots: 6,
    dayStartHour: 9,
    planDate: "2026-06-20",
    defaultStart: "2026-07-06",
    blackout: { from: "2026-07-20", to: "2026-07-30", reason: "Skipper på ferie" },
    schoolStart: "2026-08-16",
    homePort: "Rona båthavn, Kristiansand",
    disclaimer: "Rutene er indikative planleggingsstreker — IKKE sjøkart. Sjekk alltid værmelding (yr.no + BarentsWatch bølgevarsel) og bruk offisielle sjøkart før avgang.",
    costs: { dieselPrice: 24, consumption: 2.0, harborPerNight: 380, foodPerDay: 250, drinkPerDay: 150, extrasPerPerson: 900, people: 4 },
  },

  trips: TRIPS,

  checklists: {
    safety: [
      "Redningsvest til ALLE om bord — og PÅBUDT å BRUKE den ute i båt under 8 m i fart (småbåtloven §23a). Min. 150N for kysttur.",
      "Min. ett 2 kg ABC-håndslukkingsapparat (godkjent), lett tilgjengelig — påbudt med motor/kok om bord.",
      "Lanterner som virker (side-, akter- og topplys) — påbudt i mørke og nedsatt sikt.",
      "Lense-/øseutstyr som fungerer (fast/løs lensepumpe + øsekar).",
      "Årer eller annet fremdriftsmiddel ved motorstopp.",
      "VHF-radio (DSC, med MMSI) — viktigste kommunikasjon på kysttur. Krever VHF/SRC-sertifikat.",
      "Anker med nok kjetting/tau (min. 5× dybden) + evt. drivanker.",
      "Nødbluss: håndbluss + fallskjermraketter — sjekk utløpsdato!",
      "Oppdaterte sjøkart + magnetkompass som backup.",
      "Kartplotter/GPS eller mobil/nettbrett med Navionics offline.",
      "Redningsbøye med kasteline, dødmannsknapp på motoren, stige for å komme opp av sjøen.",
      "Førstehjelpsutstyr, pannelykt, varmefolie, sjøsykemedisin.",
      "Reservedeler til Yanmar: impeller, drivstoffilter, kilereim + verktøy.",
      "Mobil i vanntett pose + powerbank. Nødnummer på sjøen: 120.",
    ],
    provisioning: [
      "Diesel: fyll HELT opp ved hver mulighet — tank ~70 l gir kort rekkevidde (~150 nm).",
      "Ferskvann på tank + ekstra dunker.",
      "Gass til kokeapparat (sjekk nivå + ha reserve).",
      "Holdbart: pasta, ris, couscous, knekkebrød, havregryn, kaffe.",
      "Hermetikk: tomater, bønner, mais + fisk (makrell, tunfisk).",
      "Pålegg som tåler romtemp: leverpostei, kaviar, brunost, salami, peanøttsmør.",
      "Kjøl: egg, smør, melk, ferskt pålegg (kjøp underveis).",
      "Snacks, frukt og grillmat til hytta/svaberg.",
      "Pils/drikke — kjøp i Norge (billigere), men husk kvotene hjem.",
      "Søppelsekker — ta med ALT i land.",
    ],
    packing: [
      "Gyldig PASS eller nasjonalt ID-kort til alle (kun for Sverige-turen, men greit å ha).",
      "Regntøy + varmt lag + flyteplagg (kaldt på sjøen selv om sommeren).",
      "Lue og hansker til morgenkjøring.",
      "Solkrem, solbriller, caps, badetøy + håndkle.",
      "Sjøsyketabletter (særlig til de åpne etappene).",
      "Lader/powerbank til alle.",
      "Kort + litt kontanter. I Sverige: Swish/kort funker overalt.",
      "Sko med godt grep (våte dekk).",
      "Båtførerbevis til den som fører båten (påbudt — se under).",
    ],
  },

  customs: {
    intro: "Gjelder Sverige-turen. Norge er utenfor EU, så dere krysser en EU-yttergrense. Selve båten trenger dere normalt ikke melde. Det viktigste skjer ved RETUR til Norge.",
    points: [
      "Dokumenter: gyldig pass/ID til alle, båtpapirer, forsikringsbevis (sjekk svensk farvann), båtførerbevis.",
      "Til Sverige: kun normalt reisegods innenfor kvote = ingen tollstopp. Over kvoten MÅ deklareres ved bemannet tollsted.",
      "Retur til Norge (sjøveien): varer over kvoten = gå DIREKTE til sted med tolltjeneste og meld fra (rød sone). Innenfor kvoten = grønn passering. Å la være = smugling.",
      "📱 Last ned KVOTEAPPEN (Tolletaten) — regn ut og betal over kvoten fra mobilen før ankomst Norge.",
      "⏱️ 24-timers-regelen: full tax-free alkohol-/tobakkskvote krever 24 t+ ute av Norge.",
    ],
    alcohol: "NORSK HJEMREISEKVOTE (per person, 24 t+ ute): EN av — (a) 1 L brennevin + 1,5 L vin + 2 L øl, (b) 3 L vin + 2 L øl, eller (c) 5 L øl. Tobakk: 200 sigaretter ELLER 250 g + 200 blad papir. Verdigrense andre varer: 6000 kr. Alder: 18 år øl/vin/tobakk, 20 år brennevin.",
    swedishQuota: "SVENSK INNFØRSELSKVOTE fra Norge (20 t+ ute, 20 år): 1 L sprit (>22 %) ELLER 2 L sterkvin, + 4 L vin + 16 L sterkøl. Hold dere innenfor BÅDE kvotene.",
    note: "Reglene/satsene oppdateres jevnlig (nye satser fra 1.1.2026; svenske regler for varer under 150 € fra 1.7.2026). Sjekk toll.no og tullverket.se rett før avreise.",
  },

  boatInfo: {
    license: "BÅTFØRERBEVIS er PÅBUDT for fører født 1.1.1980 eller senere — fordi Yanmar-en (~27 hk) er over 25 hk-grensen. Født før 1980 = fritatt. Gjelder båt inntil 15 m.",
    fuelRange: "Yanmar 3HM (~27 hk) ved ~5,5–6 knop bruker ~1,5–2,5 l/t — regn ~2 l/t. Tank ~70 l → ~30–40 motortimer → ~150–210 nm rekkevidde. Planlegg ~150 nm mellom fyllinger. Bruk Bunkring.no for nærmeste pumpe.",
    navApps: ["Navionics Boating (offline sjøkart)", "BarentsWatch (bølgevarsel, AIS — gratis)", "Yr + Windy (vind/vindkast)", "Skippo (norsk turapp)", "Offisielle sjøkart + papirkart som backup"],
    dangerLegs: [
      "Kragerø → Langesund (forbi Jomfruland): åpent mot Skagerrak, grov kort sjø i pålandsvind.",
      "Langesund → Stavern (Langesundsbukta): mest utsatte etappen, ingen ly midtfjords.",
      "Tønsberg → Hvaler (Verdens Ende-kryssing): åpen kryssing av ytre Oslofjord. (kun Sverige-turen)",
      "Hvaler → Koster (grensekryssing): mest kritiske åpne hopp. (kun Sverige-turen)",
    ],
  },

  weatherGuide: {
    intro: "En 6-knops båt har ingen reserve til å «gasse fra» været. Planlegg etter VÆRVINDU, ikke etter dato — og bruk morgenvinduet.",
    rhythm: "Sommerdøgnet på Skagerrak: morgenen (grålysning–kl. 10–12) er roligst. Sola lager sjøbris som bygger seg opp utover dagen og topper kl. 14–18 (ofte 15–25 knop!), før den løyer på kvelden. ⇒ Legg åpne etapper TIDLIG, og vær i havn før kl. 14 på fine dager.",
    thresholds: [
      "🟢 Kjør: under ~10–12 knop middelvind og lav sjø.",
      "🟡 Vurder / kort morgenvindu: ~12–18 knop.",
      "🔴 Vent: over ~18–20 knop, eller når vindkast nærmer seg kuling.",
    ],
    rules: [
      "Se på VINDKAST, ikke bare middelvind — en liten båt styres av kastene.",
      "Bruk BØLGEVARSEL (BarentsWatch): bølgehøyde over ~1–1,5 m på åpne strekk blir ubehagelig/farlig.",
      "Pålandsvind (S–SV–V) bygger sjø inn mot kysten — da blir de åpne etappene verst.",
      "Sammenlign minst to modeller i Windy (ECMWF vs GFS) + yr. Spriker de = vær konservativ.",
      "Farevarsel (kuling/gult-oransje-rødt fra met.no) OVERSTYRER alt.",
      "I tvil? VENT. Bedre en ekstra dag i god havn enn å bli tatt av ettermiddagskuling.",
    ],
  },

  weatherSources: [
    { name: "yr.no", url: "https://www.yr.no", why: "Norsk standard. Vind, vindkast og sjøvær time for time." },
    { name: "BarentsWatch — Bølgevarsel", url: "https://www.barentswatch.no/bolgevarsel/", why: "Kystverkets bølge-/strømvarsel. Avgjør om en åpen etappe er trygg." },
    { name: "Windy", url: "https://www.windy.com", why: "Sammenlign modeller + se vindkast og NÅR vinden bygger seg opp." },
    { name: "met.no — farevarsel", url: "https://www.met.no/vaer-og-klima/tekstvarsel-for-havomradene", why: "Kuling-/stormvarsel. Gult/oransje/rødt = bli i havn." },
    { name: "Open-Meteo", url: "https://open-meteo.com", why: "Live data brukt i denne appen (vind/temp per stopp)." },
  ],
};

if (typeof window !== "undefined") window.TRIP_DATA = TRIP_DATA;
if (typeof module !== "undefined" && module.exports) module.exports = TRIP_DATA;
