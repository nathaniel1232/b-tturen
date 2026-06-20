# ⚓ Sverige-turen — Sørlandet innenskjærs → Strömstad

Visuell, interaktiv seilingsplan for båttur langs **Sørlandskysten** fra **Rona båthavn, Kristiansand**, i ca. **6 knop**, mest mulig **innenskjærs**.

Båt: **Marex 24 Sun Cab · Yanmar 3HM (~27 hk)**

### 🧭 Turvelger — tre turer å velge mellom
| Tur | Distanse | Lengde |
|-----|----------|--------|
| 🇸🇪 **Sverige (én vei)** → Strömstad | ~178 nm | ~8 dager |
| ⛵ **8 dg tur/retur** → Stavern/Larvik | ~210 nm | 8 dager |
| 🏖️ **6 dg tur/retur** → Kragerø (helt innenskjærs) | ~146 nm | 6 dager |

> **Realitetssjekk:** En *rundtur* helt til Sverige er ~30 t hver vei og får ikke plass i 7–10 dager i 6 knop. Derfor: Sverige-turen er **én vei** (hjemtur som egen plan), mens 8-dagers- og 6-dagersturen er komplette rundturer som snur i Norge.

## Hva appen viser
- 🗺️ Hele ruten på kart, etappe for etappe, fargelagt etter værutsatthet (🟢 skjermet / 🟡 delvis åpent / 🔴 værutsatt)
- ⛵ **Følg båten** — animasjon med **dato OG klokkeslett som oppdateres live** når du drar i slideren
- 📅 Dato øverst i hjørnet + datovelger som regner ut hele planen og **advarer hvis turen krasjer med ferien (20.–30. juli) eller skolestart (16. aug)**
- 🌦️ **Live vær** (vind + temp) for hvert stopp (Open-Meteo) med båt-vurdering + lenke til yr.no
- 📍 Klikkbare stopp: hva man bør gjøre, havn/diesel/vann, råd og etappe-info
- 🧭 **Turvelger** — bytt mellom de tre turene; kart, rute, datoer, kostnad og animasjon oppdateres
- 💰 **Kostnad-fane** — endre antall personer, dager, priser → total / per person / per dag oppdateres live (med rundtur-bryter)
- 🎒 **Klar?**-fane: værstrategi, båtførerbevis & drivstoff, sikkerhet, proviant, pakkeliste og **toll/grense med kvoter** (Tolletaten/Tullverket)
- ↩️ Hjemtur og total tid/distanse

## Kjør lokalt (localhost)
Ren statisk side — ingen bygg, ingen API-nøkkel.

```bash
cd "lillesand turen"
python3 -m http.server 8000
# åpne http://localhost:8000
```

(eller `npx serve .`)

## Deploy til Vercel
1. Konto på [vercel.com](https://vercel.com) (gratis).
2. Dra mappa inn på vercel.com, **eller** `npm i -g vercel` og kjør `vercel` i mappa.
3. Ingen config trengs — statisk side. Du får en delbar URL til gutta.

## Filer
| Fil | Hva |
|-----|-----|
| `index.html` | Struktur |
| `style.css` | Utseende |
| `app.js` | Kart, animasjon (dato+klokke), vær, kostnad |
| `data.js` | **All turdata** — stopp, etapper, sjekklister, toll, priser. Rediger her. |
| `vercel.json` | Vercel-config (statisk) |

## Endre planen
Alt innhold ligger i **`data.js`**. Vil du endre stopp, netter, ruten eller standard-priser — rediger `stops`, `legs` og `meta.costs`. Appen oppdaterer seg selv.

## ⚠️ Viktig
Ruten er en **indikativ planleggingsstrek — ikke et sjøkart.** Bruk alltid offisielle sjøkart (Navionics) + sjekk **yr.no og BarentsWatch bølgevarsel** før hver avgang. Husk båtførerbevis (Yanmar 27 hk > 25 hk = påbudt for førere født 1980+). God tur! 🌊
