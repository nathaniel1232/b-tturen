/* =====================================================================
   SVERIGE-TUREN — Sørlandet innenskjærs → Strömstad (én vei, ~8 dager)
   All turdata samlet i ett objekt (TRIP_DATA).
   Koordinater og distanser er INDIKATIVE for planlegging/visualisering.
   IKKE for navigasjon — bruk offisielle sjøkart (Navionics / sjøkart.no).
   Toll-, drivstoff- og sikkerhetsinfo er hentet/verifisert via research
   (Tolletaten, Tullverket, Kystverket, met.no) — sjekk alltid satser før tur.
   ===================================================================== */

const TRIP_DATA = {
  meta: {
    title: "Sverige-turen",
    subtitle: "Sørlandet innenskjærs → Strömstad",
    boat: "Marex 24 Sun Cab · Yanmar 3HM (~27 hk)",
    speedKnots: 6,            // marsjfart vi planlegger med
    dayStartHour: 9,          // vi legger fra kai ca. kl. 09 (morgenvindu!)
    planDate: "2026-06-20",   // dagen planen ble laget
    defaultStart: "2026-07-06", // foreslått avreise (man 6. juli → i Sverige tor 13. juli)
    blackout: { from: "2026-07-20", to: "2026-07-30", reason: "Skipper på ferie" },
    schoolStart: "2026-08-16",
    homePort: "Rona båthavn, Kristiansand",
    disclaimer:
      "Ruten er en indikativ planleggingsstrek — IKKE et sjøkart. Sjekk alltid værmelding (yr.no + BarentsWatch bølgevarsel) og bruk offisielle sjøkart før avgang.",
    // Standard-priser til kostnadskalkulatoren (kan endres i appen)
    costs: {
      dieselPrice: 24,     // kr/liter (båtdiesel ligger litt over pumpepris)
      consumption: 2.0,    // liter/time ved 6 knop (Yanmar 3HM)
      harborPerNight: 380, // kr/natt gjestehavn
      foodPerDay: 250,     // kr/person/dag mat & proviant
      drinkPerDay: 150,    // kr/person/dag pils & drikke
      extrasPerPerson: 900,// kr/person aktiviteter, restaurant, is, buss osv.
      people: 4,           // gutta
    },
  },

  /* ------------------------------------------------------------------
     STOPP (én vei til Strömstad, i rekkefølge).
     nights = netter vi blir liggende (0 = passering/lunsj/diesel).
     pauseH = timer vi stopper ved passering (lunsj/diesel) — for klokkeberegning.
     harborFree = gratis overnatting (hytta).
     ------------------------------------------------------------------ */
  stops: [
    {
      id: "kristiansand",
      name: "Kristiansand (Rona båthavn)",
      lat: 58.156, lng: 8.055,
      kind: "start",
      nights: 0,
      blurb: "Hjemmehavn. Her starter alt. Topp opp diesel, vann og proviant før vi stikker ut Topdalsfjorden og inn i Blindleia østover.",
      todo: [
        "Fyll diesel HELT opp (tank ~70 l = kort rekkevidde — fyll ofte!)",
        "Sjekk olje, kjølevann, impeller og kilereim på Yanmar-en",
        "Test VHF, lanterner og lensepumpe FØR avgang",
        "Vann på tank + ekstra dunker, siste storhandel",
        "Sjekk yr.no + BarentsWatch bølgevarsel for de neste dagene",
      ],
      harbor: { guest: "Egen plass / Rona båthavn (Topdalsfjorden, øst i byen)", fuel: "Diesel ved marinaene nær Kristiansand gjestehavn (Bertesbukta)", water: "Ja", shop: "Fullt utvalg butikker" },
      advice: "Dra tidlig på morgenen mens det er lite vind. Blindleia er svært skjermet, så første dag er trygg selv om det blåser litt ute.",
      exposedArrival: false,
    },
    {
      id: "lillesand",
      name: "Lillesand (hytta)",
      lat: 58.2495, lng: 8.3772,
      kind: "base",
      nights: 2, harborFree: true,
      blurb: "Første natt på hytta! Vi tar det helt rolig her i to netter. Perfekt base: gutta kan ta bussen hjem og jobbe en dag, og komme tilbake hit før vi fortsetter østover.",
      todo: [
        "Sove + chille på hytta (gratis overnatting!)",
        "Grille og ta første pils i solnedgang",
        "Etterfylle proviant (Lillesand har butikk)",
        "La evt. 1–2 mann ta buss hjem for jobb, hente dem tilbake her",
        "Bruk dagen til å vente på godt værvindu østover",
      ],
      harbor: { guest: "Egen brygge ved hytta / Lillesand gjestehavn (sentralt)", fuel: "Diesel i Lillesand", water: "Ja", shop: "Butikker i sentrum" },
      advice: "Blindleia inn til Lillesand er noe av det fineste på kysten — kjør sakte og nyt det. Chill-dagen her er også værbuffer for de åpne etappene lenger øst.",
      exposedArrival: false,
    },
    {
      id: "grimstad",
      name: "Grimstad",
      lat: 58.3447, lng: 8.5949,
      kind: "fuel",
      nights: 0, pauseH: 0.75,
      blurb: "Sjarmerende hvit sørlandsby. Kjapp stopp på vei mot Arendal — strekk på beina, evt. fyll diesel.",
      todo: ["Kjapp benstrekk på brygga", "Evt. diesel og vann", "Is til veien"],
      harbor: { guest: "Grimstad gjestehavn (midt i sentrum)", fuel: "Diesel i nærheten", water: "Ja", shop: "Butikker i gangavstand" },
      advice: "Beskyttet innseiling. Vi blir ikke liggende — videre mot Arendal og Lyngør samme dag.",
      exposedArrival: false,
    },
    {
      id: "arendal",
      name: "Arendal",
      lat: 58.4612, lng: 8.7669,
      kind: "harbor",
      nights: 0, pauseH: 1.25,
      blurb: "«Sørlandets Venezia» med kanaler og livlig Pollen-havn midt i byen. Fin lunsjstopp før den litt åpnere biten ut til Lyngør.",
      todo: ["Lunsj på brygga i Pollen", "Rusle på Tyholmen / gamlebyen", "Fyll diesel (Barbu marina) og vann"],
      harbor: { guest: "Pollen gjestehavn (helt sentralt, via Galtesund)", fuel: "Diesel (Barbu marina)", water: "Ja", shop: "Fullt utvalg" },
      advice: "Galtesund leder rett inn til sentrum. God dieselstopp. Etappen videre ut Tromøysund mot Lyngør er delvis åpen — sjekk vind.",
      exposedArrival: false,
    },
    {
      id: "lyngor",
      name: "Lyngør",
      lat: 58.6326, lng: 9.1297,
      kind: "gem",
      nights: 1,
      blurb: "Bilfri øyperle — kåret til Europas best bevarte tettsted. Trange, idylliske sund mellom hvite hus. Et must, og vår første overnatting østover.",
      todo: ["Ligg i sundet mellom husene", "Lyngør Fyr", "Bad fra svaberg", "Øl på Den Blå Lanterne"],
      harbor: { guest: "Gjesteplasser i sundet (kom tidlig — fullt i høysesong)", fuel: "Begrenset — fyll i Arendal/Risør", water: "Ja", shop: "Liten landhandel" },
      advice: "Smal innseiling — ta det rolig. Ingen biler = total ro. Lang dag bak oss (~36 nm fra Lillesand), så her fortjener vi en rolig kveld.",
      exposedArrival: true,
    },
    {
      id: "risor",
      name: "Risør",
      lat: 58.7206, lng: 9.2342,
      kind: "harbor",
      nights: 0, pauseH: 1.25,
      blurb: "«Den hvite by ved Skagerrak». Vakker trehusbebyggelse rundt en lun indre havn. Lunsjstopp + diesel før Kragerø.",
      todo: ["Lunsj ved gjestehavna", "Rusle i trehusbyen / Risør Akvarium", "Fyll diesel og vann"],
      harbor: { guest: "Risør gjestehavn (indre havn, godt skjermet)", fuel: "Diesel i Risør", water: "Ja", shop: "Butikker nær havna" },
      advice: "Innseiling forbi Stangholmen fyr er grei i pent vær. Lun havn — fyll opp før den mer åpne skjærgården mot Kragerø (Portør).",
      exposedArrival: false,
    },
    {
      id: "kragero",
      name: "Kragerø",
      lat: 58.8693, lng: 9.4149,
      kind: "base",
      nights: 1,
      blurb: "Perlen blant kystbyene (Edvard Munchs «perle»). Skjærgård i verdensklasse rundt. Overnatting og opplading før den værutsatte biten østover.",
      todo: ["Bading og svaberg i skjærgården", "Middag og uteliv i sentrum", "Storhandle proviant", "VIKTIG: sjekk værvindu for Kragerø→Langesund (Jomfruland)"],
      harbor: { guest: "Kragerø gjestehavn (sentralt)", fuel: "Diesel i Kragerø", water: "Ja", shop: "Fullt utvalg" },
      advice: "Siste skikkelige by før de to åpne etappene (Jomfruland + Langesundsbukta). Legg morgendagens avgang TIDLIG — før sjøbrisen bygger seg opp.",
      exposedArrival: false,
    },
    {
      id: "langesund",
      name: "Langesund",
      lat: 59.0008, lng: 9.749,
      kind: "fuel",
      nights: 0, pauseH: 0.75,
      blurb: "Innfartsporten til Grenland. Kort diesel- og benstrekk-stopp midt mellom de to mest værutsatte etappene.",
      todo: ["Fyll diesel", "Kjapp matbit", "Sjekk vind på nytt før Langesundsbukta"],
      harbor: { guest: "Langesund gjestehavn", fuel: "Diesel", water: "Ja", shop: "Butikk i sentrum" },
      advice: "⚠️ Både etappen hit (forbi Jomfruland) og videre (over Langesundsbukta til Stavern) er åpne og værutsatte. Kjør kun i lite vind, helst formiddag.",
      exposedArrival: true,
    },
    {
      id: "stavern",
      name: "Stavern",
      lat: 58.9983, lng: 10.0356,
      kind: "harbor",
      nights: 1,
      blurb: "Sjarmerende marineby med Norges soldager og lun gjestehavn. Velfortjent pustehull etter Langesundsbukta.",
      todo: ["Ligg i den koselige gjestehavna", "Citadelløya / Stavern fort", "Middag i sentrum"],
      harbor: { guest: "Stavern gjestehavn (lun, populær)", fuel: "Diesel i Larvik/Stavern", water: "Ja", shop: "Butikker i gangavstand" },
      advice: "Herfra blir det roligere igjen — inn i Vestfold-skjærgården. Men ta vare på kreftene: en åpen kryssing venter på dag 7.",
      exposedArrival: true,
    },
    {
      id: "sandefjord",
      name: "Sandefjord",
      lat: 59.1312, lng: 10.2167,
      kind: "harbor",
      nights: 0, pauseH: 1.25,
      blurb: "Tidligere hvalfangstby med flott havnepromenade. Lunsjstopp på vei inn i Tjøme-skjærgården.",
      todo: ["Lunsj på bryggepromenaden", "Hvalfangstmonumentet", "Bunkre vann/proviant"],
      harbor: { guest: "Sandefjord gjestehavn (sentralt)", fuel: "Diesel", water: "Ja", shop: "Fullt utvalg" },
      advice: "Delvis skjermet av Vesterøya inn mot byen. Greit mellomstopp før Tønsberg.",
      exposedArrival: false,
    },
    {
      id: "tonsberg",
      name: "Tønsberg",
      lat: 59.2676, lng: 10.4076,
      kind: "harbor",
      nights: 1,
      blurb: "Norges eldste by, med yrende Brygga-liv om sommeren. Siste norske overnatting med full byfølelse før vi går ut mot grensa.",
      todo: ["Ligg ved Brygga (yrende uteliv)", "Slottsfjellet / tårnet", "Middag og pils på brygga", "Sjekk værvindu GRUNDIG for kryssingen i morgen"],
      harbor: { guest: "Tønsberg gjestehavn (rett ved Brygga)", fuel: "Diesel i nærheten", water: "Ja", shop: "Fullt utvalg" },
      advice: "Vi går indre led gjennom Vrengen for best ly forbi Tjøme. Morgendagens etappe krysser ytre Oslofjord (Verdens Ende → Hvaler) — åpen sjø, krever rolig morgen.",
      exposedArrival: false,
    },
    {
      id: "hvaler",
      name: "Hvaler (Skjærhalden)",
      lat: 59.028, lng: 11.032,
      kind: "harbor",
      nights: 1,
      blurb: "Ytterste norske utpost før Sverige — distriktets største gjestehavn (~100 plasser). Nydelig skjærgård og nasjonalpark. Her venter vi på det rette vinduet for grensekryssingen.",
      todo: [
        "Bad i Ytre Hvaler nasjonalpark",
        "Fyll diesel og vann HELT opp (siste i Norge)",
        "Sjekk vær GRUNDIG for kryssingen Hvaler→Koster (morgenvindu!)",
        "Sjekk toll-/melderutiner (se Toll & grense)",
        "Last ned Kvoteappen (Tolletaten) til hjemreisen",
      ],
      harbor: { guest: "Skjærhalden gjestehavn (~100 plasser, dybde 3–18 m)", fuel: "Diesel", water: "Ja", shop: "Butikk" },
      advice: "Siste stopp i Norge. Kryssingen til Koster går over åpent farvann (Kosterfjorden/Skagerrak) — vent på lite vind og rolig sjø, og dra tidlig morgen. Ly-plan: Skjærhalden (norsk side), Kostersundet (svensk side).",
      exposedArrival: false,
    },
    {
      id: "koster",
      name: "Koster (Sydkoster) 🇸🇪",
      lat: 58.867, lng: 11.04,
      kind: "sweden",
      nights: 0, pauseH: 1.5,
      blurb: "VELKOMMEN TIL SVERIGE! Bilfrie øyer i Sveriges første marine nasjonalpark (Kosterhavet). Vi tar en pause her før siste hopp inn til Strömstad.",
      todo: ["Skål — vi er i Sverige! 🇸🇪", "Lunsj / reker på bryggekafé i Ekenäs", "Evt. en rask sykkeltur", "Kostersundet er trygg nødhavn om vinden tar seg opp"],
      harbor: { guest: "Ekenäs gästhamn (Sydkoster) / Kostersundet", fuel: "Begrenset — fyll på Hvaler først", water: "Ja", shop: "Liten butikk" },
      advice: "Husk tollformaliteter (se Toll & grense). Kostersundet ligger trygt selv i hard SV-vind fordi det er lite sjø gjennom sundet — godt å vite.",
      exposedArrival: true,
    },
    {
      id: "stromstad",
      name: "Strömstad 🇸🇪",
      lat: 58.9333, lng: 11.1833,
      kind: "destination",
      nights: 2,
      blurb: "ENDESTASJON! Klassisk svensk badeby med alt: gjestehavn midt i byen (~350 plasser), Systembolaget, restauranter og rekefrokost. Her feirer vi at vi kom helt fram til Sverige.",
      todo: [
        "Feire at vi kom helt til Sverige! 🎉",
        "Rekefrokost i gjestehavna",
        "Systembolaget — men hold deg innenfor norsk hjemreisekvote (se Toll & grense)",
        "Restaurant/uteliv i sentrum",
        "Hvile + planlegg hjemtur/værvindu (se Hjemtur-fanen)",
      ],
      harbor: { guest: "Strömstad gästhamn (sentralt, ~350 plasser, full service)", fuel: "Diesel", water: "Ja", shop: "Fullt utvalg + Systembolaget" },
      advice: "Mål nådd! 🇸🇪 Bruk dagene her til å hvile. Husk: ved retur til Norge må du gå direkte til sted med tolltjeneste hvis du har varer over kvoten — ellers grønn passering. Bruk Kvoteappen.",
      exposedArrival: false,
    },
  ],

  /* ------------------------------------------------------------------
     ETAPPER (én vei). path = strek på sjøen (indikativ, m/ mellompunkter).
     protection: protected | mixed | exposed
     Merk: vi krysser ytre Oslofjord ved Verdens Ende → Hvaler (kortere enn
     å gå rundt via Horten–Moss, men en åpen kryssing — derfor 'exposed').
     ------------------------------------------------------------------ */
  legs: [
    { from: "kristiansand", to: "lillesand", nm: 13, protection: "protected",
      note: "Ut Topdalsfjorden og inn i Blindleia ved Ulvøysund — en av Norges mest skjermede skjærgårdsleier. Ideell start.",
      path: [[58.156,8.055],[58.165,8.13],[58.20,8.21],[58.225,8.30],[58.243,8.345],[58.2495,8.3772]] },

    { from: "lillesand", to: "grimstad", nm: 10, protection: "protected",
      note: "Innenskjærs forbi Justøya og Skiftenes. Smale, godt merkede løp — lav fart.",
      path: [[58.2495,8.3772],[58.278,8.45],[58.315,8.54],[58.3447,8.5949]] },

    { from: "grimstad", to: "arendal", nm: 9, protection: "protected",
      note: "Forbi Hesnesøya og inn Galtesund til Arendal sentrum. Stort sett skjermet.",
      path: [[58.3447,8.5949],[58.385,8.66],[58.43,8.73],[58.4612,8.7669]] },

    { from: "arendal", to: "lyngor", nm: 17, protection: "mixed",
      note: "Ut Tromøysund, forbi Narestø, over åpnere farvann ved Sandøya. Delvis eksponert mot Skagerrak — legg etappen i godt vær.",
      path: [[58.4612,8.7669],[58.505,8.86],[58.555,8.97],[58.605,9.08],[58.6326,9.1297]] },

    { from: "lyngor", to: "risor", nm: 8, protection: "mixed",
      note: "Forbi Stangholmen til Risør. Kort, men værutsatt åpning mot Skagerrak ved Risørflaket.",
      path: [[58.6326,9.1297],[58.67,9.18],[58.70,9.21],[58.7206,9.2342]] },

    { from: "risor", to: "kragero", nm: 16, protection: "mixed",
      note: "Gjennom Kragerøskjærgården forbi Portør. Partiet ved Portør/Jomfrulandsrenna er eksponert — vurder vinden.",
      path: [[58.7206,9.2342],[58.77,9.30],[58.83,9.38],[58.8693,9.4149]] },

    { from: "kragero", to: "langesund", nm: 15, protection: "exposed",
      note: "⚠️ VÆRUTSATT: forbi Jomfruland og over Jomfrulandsrenna mot Langesundsbukta. Helt åpent mot Skagerrak — kjent for grov, kort sjø i pålandsvind. Gå tidlig morgen i stille vær.",
      path: [[58.8693,9.4149],[58.90,9.52],[58.955,9.65],[59.0008,9.749]] },

    { from: "langesund", to: "stavern", nm: 17, protection: "exposed",
      note: "⚠️⚠️ VÆRUTSATT: kryssing av Langesundsbukta forbi Nevlunghavn/Stavernsodden. Åpen Skagerrak-eksponering uten ly — den mest utsatte etappen sammen med Jomfruland.",
      path: [[59.0008,9.749],[58.99,9.85],[58.97,9.875],[58.995,9.98],[58.9983,10.0356]] },

    { from: "stavern", to: "sandefjord", nm: 13, protection: "mixed",
      note: "Inn Larviksfjorden og rundt mot Sandefjordsfjorden. Delvis skjermet av Vesterøya. Roligere enn forrige etappe.",
      path: [[58.9983,10.0356],[59.05,10.10],[59.10,10.17],[59.1312,10.2167]] },

    { from: "sandefjord", to: "tonsberg", nm: 14, protection: "mixed",
      note: "Ut Sandefjordsfjorden, forbi Tjøme-skjærgården, inn via Vrengen mot Tønsberg. Velg indre led (Vrengen) for best ly forbi Tjøme.",
      path: [[59.1312,10.2167],[59.17,10.28],[59.22,10.36],[59.2676,10.4076]] },

    { from: "tonsberg", to: "hvaler", nm: 27, protection: "exposed",
      note: "⚠️⚠️ Ned Tønsbergfjorden forbi Verdens Ende, så ÅPEN KRYSSING over ytre Oslofjord til Hvaler. Ingen ly midtfjords — krever rolig morgen. (Roligere, men en dag lengre, er ruten via Horten–Moss–Fredrikstad.)",
      path: [[59.2676,10.4076],[59.15,10.43],[59.04,10.44],[59.03,10.43],[59.04,10.70],[59.05,10.90],[59.028,11.032]] },

    { from: "hvaler", to: "koster", nm: 12, protection: "exposed",
      note: "⚠️⚠️ VÆRUTSATT GRENSEKRYSSING over Kosterfjorden/Skagerrak fra Hvaler til Koster. Mest kritiske åpne etappen for en liten 6-knops båt — KUN i stabilt, rolig vær, tidlig på dagen.",
      path: [[59.028,11.032],[58.97,11.03],[58.92,11.04],[58.867,11.04]] },

    { from: "koster", to: "stromstad", nm: 7, protection: "mixed",
      note: "Over Kosterfjorden østover til Strömstad. Delvis skjermet, men åpent midtfjords med ferjetrafikk (Kosterbåtene). Siste etappe!",
      path: [[58.867,11.04],[58.89,11.09],[58.915,11.14],[58.9333,11.1833]] },
  ],

  /* ------------------------------------------------------------------
     HJEMTUR — samme farvann tilbake. Egen plan/eget værvindu.
     ------------------------------------------------------------------ */
  returnPlan: {
    intro: "Hjemturen er samme farvann tilbake — ~178 nm, ~30 timer motor, realistisk ~6 seilingsdager. Planlegg den som en egen tur etter eget værvindu (eller del den opp). Full rundtur tur/retter blir derfor ~13–14 dager hvis dere tar alt i ett strekk.",
    legs: [
      { from: "Strömstad", to: "Hvaler (Skjærhalden)", note: "Over grensa igjen — kun i godvær, tidlig morgen. Ved retur til Norge: gå direkte til sted med tolltjeneste hvis du har varer over kvoten, ellers grønn passering. Bruk Kvoteappen." },
      { from: "Hvaler", to: "Stavern", note: "Tilbake over ytre Oslofjord (Verdens Ende) — åpen kryssing, vent på rolig vær. Evt. roligere via Tønsberg/Horten–Moss." },
      { from: "Stavern", to: "Kragerø", note: "Over Langesundsbukta og forbi Jomfruland i lite vind — morgenvindu." },
      { from: "Kragerø", to: "Lyngør / Risør", note: "Innenskjærs sørover gjennom skjærgården." },
      { from: "Lyngør", to: "Lillesand (hytta)", note: "Siste natt på hytta (gratis!) før hjemmebanen." },
      { from: "Lillesand", to: "Kristiansand (Rona)", note: "Gjennom Blindleia hjem. Vel i havn! 🏁" },
    ],
  },

  /* ------------------------------------------------------------------
     SJEKKLISTER (basert på norsk regelverk + research)
     ------------------------------------------------------------------ */
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
      "Oppdaterte sjøkart + magnetkompass som backup (når elektronikken svikter).",
      "Kartplotter/GPS eller mobil/nettbrett med Navionics offline.",
      "Redningsbøye/livbøye med kasteline, dødmannsknapp på motoren, stige for å komme opp av sjøen.",
      "Førstehjelpsutstyr, pannelykt, varmefolie, sjøsykemedisin.",
      "Reservedeler til Yanmar: impeller, drivstoffilter, kilereim + verktøy (vanligste stoppgrunn).",
      "Mobil i vanntett pose + powerbank. Nødnummer på sjøen: 120.",
    ],
    provisioning: [
      "Diesel: fyll HELT opp ved hver mulighet — tank ~70 l gir kort rekkevidde (~150 nm). Ikke gå forbi åpen pumpe med under halv tank.",
      "Ferskvann på tank + ekstra dunker.",
      "Gass til kokeapparat (sjekk nivå + ha reserve).",
      "Holdbart: pasta, ris, couscous, knekkebrød, havregryn, kaffe.",
      "Hermetikk: tomater, bønner, mais + fisk (makrell, tunfisk) — klassisk båtmat.",
      "Pålegg som tåler romtemp: leverpostei, kaviar, brunost, salami, peanøttsmør.",
      "Kjøl: egg, smør, melk, ferskt pålegg (kjøp underveis).",
      "Snacks, frukt og grillmat til hytta/svaberg.",
      "Pils/drikke — kjøp i Norge før Sverige (billigere enn restaurant), men husk kvotene hjem.",
      "Søppelsekker — ta med ALT i land.",
    ],
    packing: [
      "Gyldig PASS eller nasjonalt ID-kort til alle (Norge er utenfor EU — kreves ved grensen!).",
      "Regntøy + varmt lag + flytedress/flyteplagg (kaldt på sjøen selv om sommeren).",
      "Lue og hansker til morgenkjøring.",
      "Solkrem, solbriller, caps, badetøy + håndkle.",
      "Sjøsyketabletter (særlig til de åpne etappene/kryssingene).",
      "Lader/powerbank til alle.",
      "Kort + litt kontanter. I Sverige: Swish/kort funker overalt (svenske kroner).",
      "Sko med godt grep (våte dekk).",
      "Båtførerbevis til den som fører båten (påbudt — se under).",
    ],
  },

  /* ------------------------------------------------------------------
     TOLL & GRENSE (verifisert: Tolletaten / Tullverket)
     ------------------------------------------------------------------ */
  customs: {
    intro: "Norge er utenfor EU, så dere krysser en EU-yttergrense. Selve båten trenger dere normalt ikke melde (den kan stå inntil 18 mnd i Sverige avgiftsfritt så lenge dere bor i Norge). Det viktigste skjer ved RETUR til Norge — hold dere innenfor kvotene.",
    points: [
      "Dokumenter: gyldig pass/ID til alle, båtpapirer (eierbevis/registrering), forsikringsbevis (sjekk at det dekker svensk farvann), og båtførerbevis.",
      "Til Sverige: har dere kun normalt reisegods innenfor svensk kvote, trenger dere ikke oppsøke tollen. Varer ut over kvoten MÅ deklareres ved bemannet tollsted.",
      "Retur til Norge (sjøveien): har dere varer over kvoten eller restriksjonsbelagte varer, MÅ dere gå DIREKTE til et sted med tolltjeneste og melde fra (rød sone). Kun innenfor kvoten = grønn passering uten å stoppe. Å la være = smugling.",
      "📱 Last ned KVOTEAPPEN (Tolletaten) — regn ut og betal for varer/alkohol/tobakk over kvoten fra mobilen før dere ankommer Norge.",
      "⏱️ 24-timers-regelen: full norsk tax-free alkohol-/tobakkskvote krever at dere har vært ute av Norge i minst 24 timer. Kort dagstur (under 24 t) gir INGEN tax-free alkohol/tobakk.",
    ],
    alcohol: "NORSK HJEMREISEKVOTE (per person, krever 24 t+ ute): EN av kombinasjonene — (a) 1 L brennevin + 1,5 L vin + 2 L øl, (b) 3 L vin + 2 L øl, eller (c) 5 L øl. Sterkere kan byttes til svakere (ikke omvendt). Tobakk: 200 sigaretter ELLER 250 g (snus/rull) + 200  blad sigarettpapir. Verdigrense for andre varer: 6000 kr (over 24 t ute). Aldersgrense: 18 år øl/vin/tobakk, 20 år brennevin.",
    swedishQuota: "SVENSK INNFØRSELSKVOTE fra Norge (krever 20 t+ ute, 20 år): 1 L sprit (>22 %) ELLER 2 L sterkvin, + 4 L vin + 16 L sterkøl. Hold dere innenfor BÅDE svensk innførselskvote og norsk hjemreisekvote når dere handler.",
    note: "Reglene og satsene oppdateres jevnlig (nye forenklede avgiftssatser fra 1.1.2026, og Sverige innfører nye regler for varer under 150 € fra 1.7.2026). Sjekk alltid toll.no og tullverket.se rett før avreise.",
  },

  /* ------------------------------------------------------------------
     BÅT & SIKKERHET (verifisert via research)
     ------------------------------------------------------------------ */
  boatInfo: {
    license: "BÅTFØRERBEVIS er PÅBUDT for den som fører båten hvis hen er født 1.1.1980 eller senere — fordi Yanmar-en (~27 hk) er over 25 hk-grensen. Født før 1980 = fritatt. Beviset gjelder båt inntil 15 m.",
    fuelRange: "Yanmar 3HM (~27 hk) i marsjfart (~5,5–6 knop) bruker ca. 1,5–2,5 l/t — regn ~2 l/t. Tank ~70 l → ~30–40 motortimer → grovt 150–210 nm rekkevidde. PLANLEGG ~150 nm mellom fyllinger og fyll oftere enn nødvendig. Bruk Bunkring.no for nærmeste pumpe.",
    navApps: ["Navionics Boating (offline sjøkart, ruteplan)", "BarentsWatch (bølgevarsel, AIS, farledsinfo — gratis)", "Yr + Windy (vind/vindkast/vindvindu)", "Skippo (norsk turapp)", "Offisielle el. sjøkart + papirkart som backup"],
    dangerLegs: [
      "Kragerø → Langesund (forbi Jomfruland): åpent mot Skagerrak, grov kort sjø i pålandsvind.",
      "Langesund → Stavern (Langesundsbukta): mest utsatte etappen, ingen ly midtfjords.",
      "Tønsberg → Hvaler (Verdens Ende-kryssing): åpen kryssing av ytre Oslofjord.",
      "Hvaler → Koster (grensekryssing): mest kritiske åpne hopp — kun i stabilt, rolig vær.",
    ],
  },

  /* ------------------------------------------------------------------
     VÆRSTRATEGI (verifisert via research) — nøkkelen for en liten båt
     ------------------------------------------------------------------ */
  weatherGuide: {
    intro: "En 6-knops båt har ingen reserve til å «gasse fra» været. Planlegg etter VÆRVINDU, ikke etter dato — og bruk morgenvinduet.",
    rhythm: "Sommerdøgnet på Skagerrak: morgenen (grålysning–kl. 10–12) er roligst. Sola lager sjøbris/pålandsvind som bygger seg opp utover dagen og topper kl. 14–18 (ofte 15–25 knop!), før den løyer på kvelden. ⇒ Legg åpne etapper og kryssinger TIDLIG, og vær i havn før kl. 14 på fine dager.",
    thresholds: [
      "🟢 Kjør: under ~10–12 knop middelvind og lav sjø.",
      "🟡 Vurder / kort morgenvindu: ~12–18 knop.",
      "🔴 Vent: over ~18–20 knop, eller når vindkast nærmer seg kuling.",
    ],
    rules: [
      "Se på VINDKAST, ikke bare middelvind — en liten båt styres av kastene.",
      "Bruk BØLGEVARSEL (BarentsWatch): signifikant bølgehøyde over ~1–1,5 m på åpne strekk blir ubehagelig/farlig, særlig med kort periode eller kryssjø.",
      "Pålandsvind (S–SV–V) bygger sjø inn mot kysten og i fjordmunninger — da blir de åpne etappene verst.",
      "Sammenlign minst to modeller i Windy (ECMWF vs GFS) + yr. Spriker de = vær konservativ.",
      "Farevarsel (kuling/gult-oransje-rødt fra met.no) OVERSTYRER alt — ikke kryss åpent vann.",
      "I tvil? VENT. Bedre en ekstra dag i god havn enn å bli tatt av ettermiddagskuling midtfjords.",
    ],
  },

  /* ------------------------------------------------------------------
     VÆRKILDER
     ------------------------------------------------------------------ */
  weatherSources: [
    { name: "yr.no", url: "https://www.yr.no", why: "Norsk standard. Vind, vindkast og sjøvær time for time. Primærkilde for avreise." },
    { name: "BarentsWatch — Bølgevarsel", url: "https://www.barentswatch.no/bolgevarsel/", why: "Kystverkets bølge-/strømvarsel, eget Oslofjord/Skagerrak-varsel. Avgjør om en åpen etappe er trygg." },
    { name: "Windy", url: "https://www.windy.com", why: "Sammenlign modeller (ECMWF vs GFS) + se vindkast og NÅR vinden bygger seg opp." },
    { name: "met.no — farevarsel", url: "https://www.met.no/vaer-og-klima/tekstvarsel-for-havomradene", why: "Kuling-/stormvarsel. Gult/oransje/rødt = bli i havn." },
    { name: "Open-Meteo", url: "https://open-meteo.com", why: "Live data brukt i denne appen (vind/temp per stopp)." },
  ],
};

// Gjør tilgjengelig for app.js (const blir ikke automatisk window-property)
if (typeof window !== "undefined") window.TRIP_DATA = TRIP_DATA;
if (typeof module !== "undefined" && module.exports) module.exports = TRIP_DATA;
