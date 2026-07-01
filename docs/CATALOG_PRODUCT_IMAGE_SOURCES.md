# Campfire Store — Product image sources (Phase 2)

**Purpose:** Real product examples with **1–5 downloadable images** from manufacturer or trustworthy EU sources.  
**Companion:** [CATALOG_PRODUCT_EXPANSION_PLAN.md](./CATALOG_PRODUCT_EXPANSION_PLAN.md) (SKU targets & sprints)  
**Your job:** Download from `originalUrl` → crop if needed → **convert to WebP** + derived sizes → wire into product JSON.

---

## 1. How to use this doc

1. Work sprint-by-sprint (same order as expansion plan).
2. For each row: open **originalUrl**, confirm **≥1 packshot** (ideally 3–5 in the gallery).
3. If manufacturer page has no gallery, use **fallbackUrl** (Tier **B** retailer) — still store manufacturer URL in `originalUrl` when possible, or the retailer URL if no manufacturer PDP exists.
4. Mark `images_found` in your spreadsheet before processing.
5. **Skip** any SKU where you cannot find at least one clean product image ≥800px.

**Column legend**

| Col | Meaning |
|-----|---------|
| **~Img** | Typical gallery size on that source (verify per SKU) |
| **Tier** | M = manufacturer official · B = authorized EU retailer fallback |
| **Fallback** | Use only when manufacturer PDP lacks usable images |

---

## 2. Brand image playbook

Where to find galleries when a sprint table does not list every trim.

| Brand | Primary source (Tier M) | ~Img | Fallback (Tier B) | Notes |
|-------|-------------------------|------|-------------------|-------|
| **Cube** | `https://www.cube.eu/de-de/` + product slug | 4–8 | [bike24.com](https://www.bike24.com) | Studio packshots on white |
| **Canyon** | `https://www.canyon.com/de-de/` | 5–10 | bike24 | Best galleries in catalog |
| **Scott** | `https://www.scott-sports.com/de/de/product/` | 3–6 | bike24 | Use `?article=` URLs like existing seed |
| **Trek** | `https://www.trekbikes.com/de/de_DE/` | 4–8 | bike24 | |
| **Fjällräven** | `https://www.fjallraven.com/de-de/` | 4–7 | bergfreunde.de | Flat product shots |
| **Mammut** | `https://www.mammut.com/de/de/products/` | 3–6 | bergfreunde | |
| **Patagonia** | `https://eu.patagonia.com/de/de/` | 4–8 | bergfreunde | |
| **Deuter** | `https://www.deuter.com/de-de/shop/` | 4–6 | bergfreunde | |
| **Osprey** | `https://www.osprey.com/` | 4–8 | bergfreunde | |
| **RevolutionRace** | `https://www.revolutionrace.de/` | 3–5 | — | |
| **MSR** | `https://www.msrgear.com/` | 4–6 | bergfreunde | |
| **Naturehike** | `https://www.naturehike.com/` | 3–5 | — | |
| **Nordisk** | `https://www.nordisk.eu/` | 4–6 | bergfreunde | |
| **Vaude** | `https://www.vaude.com/de-de/` | 4–6 | bergfreunde | |
| **Lowa** | `https://lowa.com/de/` | 4–6 | bergfreunde | |
| **Salewa** | `https://www.salewa.com/de-de/` | 4–6 | bergfreunde | |
| **Salomon** | `https://www.salomon.com/de-de/` | 4–8 | bergfreunde | Footwear & ski |
| **Blizzard Tecnica** | `https://www.blizzard-tecnica.com/de/de/` | 3–5 | bergfreunde | |
| **Atomic** | `https://www.atomic.com/de-de/` | 3–5 | bergfreunde | |
| **Head** | `https://www.head.com/de_DE/` | 3–5 | bergfreunde | |
| **Petzl** | `https://www.petzl.com/DE/de/` | 3–5 | bergfreunde | |
| **Black Diamond** | `https://www.blackdiamondequipment.com/de_DE/` | 3–5 | bergfreunde | |
| **Pyranha** | `https://www.pyranha.com/kayaks.php?kayak=` | 2–4 | bergfreunde | Model page + dealer photos |
| **Dagger** | `https://dagger.com/products/` | 3–5 | bergfreunde | |
| **Prijon** | `https://www.prijon.com/` | 2–4 | bergfreunde / kayak.de | |
| **Itiwit (Decathlon)** | `https://www.decathlon.de/` | 4–8 | — | Strong packshots |
| **Gumotex** | — (no consumer PDP) | — | bergfreunde / globetrotter | Search “Gumotex {model}” |
| **Werner** | `https://www.wernerpaddles.com/` | 2–4 | bergfreunde | |
| **NRS** | `https://www.nrs.com/` | 3–5 | — | |
| **Palm** | `https://www.palmequipment.com/eu/` | 3–5 | bergfreunde | |
| **Therm-a-Rest** | `https://www.thermarest.com/` | 3–5 | bergfreunde | |
| **Sea to Summit** | `https://seatosummit.com/` | 3–5 | bergfreunde | |
| **Jetboil** | `https://www.jetboil.com/` | 3–4 | bergfreunde | |
| **Giro** | `https://www.giro.com/` | 3–5 | bike24 | Helmets |

**Tier B search tip:** On Bergfreunde/Globetrotter, product pages almost always expose 4–7 zoomable images — suitable for your 2000×2000 crop.

---

## 3. Existing catalog (49 SKUs)

Already in seed with `originalUrl` — re-harvest only if files missing.

| File | Count | Image notes |
|------|-------|-------------|
| `backpacks.json` | 9 | Mammut, Osprey, Deuter PDPs |
| `gravel-bikes.json` | 10 | Cube, Canyon, Scott |
| `hiking-pants.json` | 10 | Fjällräven, Patagonia, RevolutionRace |
| `mountain-bikes.json` | 11 | Cube, Canyon, Scott |
| `road-bikes.json` | 6 | Cube, Canyon, Trek |
| `all-mountain-skis.json` | 1 | Blizzard Bonafide |
| `tents.json` | 1 | Naturehike |
| `touring-kayaks.json` | 1 | Rebel Kayaks ILAGA |

---

## 4. Sprint 1 — Kayaks (~48 new)

### 4.1 Touring kayaks

| Manufacturer | Model | originalUrl | Tier | ~Img | Fallback |
|--------------|-------|-------------|------|------|----------|
| Rebel Kayaks | ILAGA | https://www.rebelkayaks.com/product/ilaga-2-2/ | M | 3–5 | — |
| Prijon | Sea Kayak | https://www.prijon.com/produkte/sea-kayak | M | 2–4 | bergfreunde.de → search “Prijon Sea Kayak” |
| Perception | Essence 16 | https://www.perceptionkayaks.eu/kayaks/touring-kayaks/essence-16 | M | 3–5 | — |
| Valley | Gemini RM | https://valleysea.com/kayaks/gemini/ | M | 3–5 | bergfreunde |
| Point 65 | Mercury Solo | https://www.point65.com/ | M | 2–4 | Search dealer — brand site is sparse |
| Boreal Design | Esperanto | https://www.borealdesign.com/en/kayaks/esperanto | M | 3–4 | — |
| Wilderness Systems | Pungo 125 | https://www.wildernesssystems.com/us/products/pungo-125 | M | 4–6 | bergfreunde |
| Pelican | Sprint 140DT | https://www.pelicansport.com/products/sprint-140dt | M | 4–6 | — |
| Riot | Enduro 13 | https://riotkayaks.com/ | M | 2–3 | bergfreunde |
| Tahe | Ocean Spirit | https://www.tahekayaks.com/ | M | 2–4 | — |
| P&H | Leo | https://pandhseakayaks.com/kayaks/leo/ | M | 3–5 | bergfreunde |

### 4.2 Whitewater kayaks

| Manufacturer | Model | originalUrl | Tier | ~Img | Fallback |
|--------------|-------|-------------|------|------|----------|
| Pyranha | Machno | https://www.pyranha.com/kayaks.php?kayak=Machno | M | 3–4 | bergfreunde |
| Pyranha | Ripper | https://www.pyranha.com/kayaks.php?kayak=Ripper | M | 3–4 | bergfreunde |
| Dagger | Rewind 9.0 | https://dagger.com/products/rewind | M | 4–5 | — |
| Dagger | Phantom | https://dagger.com/products/phantom | M | 4–5 | — |
| Prijon | Rockit | https://www.prijon.com/produkte/rockit | M | 2–4 | bergfreunde |
| Liquid Logic | Remix 47 | https://www.liquidlogic.com/kayaks/remix-47 | M | 3–5 | — |
| Jackson Kayak | Antix 2 | https://shop.jacksonadventures.com/products/antix-2-0 | M | 4–6 | — |
| Wavesport | Fuse 54 | https://www.wavesport.com/kayaks/river-running/fuse-54 | M | 2–4 | bergfreunde |
| Waka Kayaks | Tutea | https://www.wakakayaks.com/ | M | 2–3 | dealer sites |
| Zet | Free | https://zetkayaks.com/kayaks/free/ | M | 3–4 | — |
| Spade Kayaks | Ace | https://www.spadekayaks.com/ | M | 2–4 | — |

### 4.3 Inflatable kayaks

| Manufacturer | Model | originalUrl | Tier | ~Img | Fallback |
|--------------|-------|-------------|------|------|----------|
| Itiwit | X100+ 2/3P | https://www.decathlon.de/suche?q=itiwit+x100 | M | 5–8 | Pick exact variant PDP |
| Itiwit | X500 2P | https://www.decathlon.de/p/aufblasbares-hochdruck-kajak-x500-2-plaetze/_/R-p-312052 | M | 5–8 | — |
| Aquaglide | Chinook 120 | https://www.aquaglide.com/products/chinook-hx-120 | M | 4–6 | — |
| Advanced Elements | AdvancedFrame Ultralite | https://www.advancedelements.com/product/advancedframe-ultralite-kayak/ | M | 4–5 | — |
| Gumotex | Twist 2 | — | B | 4–6 | bergfreunde.de → “Gumotex Twist 2” |
| Gumotex | Seawave 2 | — | B | 4–6 | globetrotter.de |
| Aqua Marina | Steam 312 | https://www.aquamarina.com/ | M | 3–5 | bergfreunde |
| Grabner | Holiday 2 | https://www.grabner.com/ | M | 2–4 | bergfreunde |
| Gumotex | Thaya | — | B | 4–6 | bergfreunde |

> **Gumotex:** No useful consumer PDP — use Tier **B** URL as `originalUrl` and note manufacturer in `manufacturer` field.

### 4.4 Kayak accessories

| Manufacturer | Model | originalUrl | Tier | ~Img | Fallback |
|--------------|-------|-------------|------|------|----------|
| Werner | Camano | https://www.wernerpaddles.com/paddles/camano | M | 2–4 | bergfreunde |
| Werner | Tybee | https://www.wernerpaddles.com/paddles/tybee | M | 2–4 | bergfreunde |
| NRS | Osprey Paddle | https://www.nrs.com/product/2305/osprey-whitewater-kayak-paddle | M | 3–4 | — |
| Aqua-Bound | Sting Ray | https://www.aquabound.com/sting-ray-4-piece | M | 3–4 | — |
| Palm | Sport PFD | https://www.palmequipment.com/eu/pfd/sport | M | 3–5 | — |
| NRS | cRUSH PFD | https://www.nrs.com/product/45313/crush-life-jacket | M | 3–5 | — |
| Peak PS | Cruiser Paddle | https://www.peakuk.com/ | M | 2–4 | bergfreunde |
| NRS | Standard Rescue Throw Bag | https://www.nrs.com/product/59102/standard-rescue-throw-bag | M | 2–3 | — |
| Yakima | JayLow | https://www.yakima.com/p/jaylow | M | 3–4 | — |
| HIKO | Sprayskirt | https://www.hiko.cz/ | M | 2–4 | bergfreunde |

---

## 5. Sprint 2 — Camping sleep & tents (~55)

### 5.1 Tents

| Manufacturer | Model | originalUrl | Tier | ~Img |
|--------------|-------|-------------|------|------|
| Naturehike | Cloud Up 2 | https://www.naturehike.com/products/cloud-up-2-people-tent | M | 4–6 |
| MSR | Hubba Hubba 2 | https://www.msrgear.com/tents/hubba-hubba-2-tent/11506 | M | 4–6 |
| MSR | Elixir 3 | https://www.msrgear.com/tents/elixir-3-tent/061922 | M | 4–6 |
| Big Agnes | Copper Spur HV UL2 | https://www.bigagnes.com/tents/copper-spur-hv-ul2-tent | M | 4–6 |
| Big Agnes | Tiger Wall UL2 | https://www.bigagnes.com/tents/tiger-wall-ul2-tent | M | 4–6 |
| Nordisk | Lofoten 2 ULW | https://www.nordisk.eu/en/products/lofoten-2-ulw | M | 4–6 |
| Nordisk | Telemark 2.2 | https://www.nordisk.eu/en/products/telemark-2-2 | M | 4–6 |
| Vaude | Hogan UL 2P | https://www.vaude.com/de-de/p/hogan-ul-2p-42242 | M | 4–6 |
| Robens | Nevis 2 | https://www.robens.de/en/Nevis-2 | M | 4–5 |
| Robens | Kiowa | https://www.robens.de/en/Kiowa | M | 4–5 |
| Hilleberg | Anjan 2 GT | https://www.hilleberg.com/tents/anjan/anjan-2-gt | M | 3–5 |
| Exped | Orion III | https://www.exped.com/en/products/orion-iii | M | 3–5 |
| Naturehike | Cloud Up 3 | https://www.naturehike.com/ | M | 4–6 |
| Naturehike | Vik 2 | https://www.naturehike.com/ | M | 4–6 |
| Salewa | Litetrek II | https://www.salewa.com/de-de/ | M | 3–5 |

### 5.2 Sleeping bags

| Manufacturer | Model | originalUrl | Tier | ~Img |
|--------------|-------|-------------|------|------|
| Deuter | Exosphere -6° | https://www.deuter.com/de-de/shop/schlafsack-exosphere-6 | M | 4–5 |
| Deuter | Astro 300 | https://www.deuter.com/de-de/shop/schlafsack-astro-300 | M | 4–5 |
| Marmot | Trestles Elite Eco 20 | https://www.marmot.com/trestles-elite-eco-20 | M | 3–5 |
| Sea to Summit | Ascent AcII | https://seatosummit.com/products/ascent-acii-down-sleeping-bag | M | 4–5 |
| Haglöfs | LIM Down 1 | https://www.haglofs.com/de/de/ | M | 3–5 |
| Carinthia | Defence 4 | https://www.carinthia.eu/en/products/defence-4 | M | 3–4 |
| Fjällräven | Färgsen | https://www.fjallraven.com/de-de/ | M | 4–6 |
| Vaude | Sioux 800 | https://www.vaude.com/de-de/ | M | 4–5 |
| Mammut | Alpine 3-Season | https://www.mammut.com/de/de/products/ | M | 3–5 |
| Exped | Ultra 0° | https://www.exped.com/en/products/ultra-0 | M | 3–5 |
| Nordisk | Oscar -10 | https://www.nordisk.eu/ | M | 4–5 |
| Robens | Breeze 250 | https://www.robens.de/ | M | 3–4 |

### 5.3 Sleeping pads

| Manufacturer | Model | originalUrl | Tier | ~Img |
|--------------|-------|-------------|------|------|
| Therm-a-Rest | NeoAir XLite NXT | https://www.thermarest.com/sleeping-pads/fast-and-light/neoair-xlite-nxt-sleeping-pad/ | M | 4–5 |
| Therm-a-Rest | Trail Pro | https://www.thermarest.com/sleeping-pads/self-inflating/trail-pro-sleeping-pad/ | M | 4–5 |
| Exped | Ultra 3R | https://www.exped.com/en/products/ultra-3r | M | 3–5 |
| Exped | Dura 4R | https://www.exped.com/en/products/dura-4r | M | 3–5 |
| Sea to Summit | Ether Light XT | https://seatosummit.com/products/ether-light-xt-insulated-air-sleeping-mat | M | 4–5 |
| Nemo | Tensor Insulated | https://www.nemoequipment.com/products/tensor-insulated-sleeping-pad | M | 3–5 |
| Vaude | Performance 7R | https://www.vaude.com/de-de/ | M | 3–4 |
| Big Agnes | Zoom UL | https://www.bigagnes.com/sleeping-pads/zoom-ul | M | 3–4 |

---

## 6. Sprint 3 — Camp kitchen & camping accessories (~28)

| Leaf | Manufacturer | Model | originalUrl | ~Img |
|------|--------------|-------|-------------|------|
| camp-kitchen | MSR | PocketRocket 2 | https://www.msrgear.com/stoves/pocketrocket-2-stove/06950 | 3–4 |
| camp-kitchen | MSR | WindBurner Personal | https://www.msrgear.com/stoves/windburner-personal-stove-system/11483 | 4–5 |
| camp-kitchen | Jetboil | Flash | https://www.jetboil.com/Flash-Cooking-System | 3–5 |
| camp-kitchen | Jetboil | MiniMo | https://www.jetboil.com/MiniMo-Cooking-System | 3–5 |
| camp-kitchen | Primus | Lite+ | https://www.primus.eu/products/lite-plus-stove-system | 3–4 |
| camp-kitchen | Trangia | 25 UL Storm | https://www.trangia.se/en/product/25-ul-storm/ | 3–4 |
| camp-kitchen | Sawyer | Squeeze | https://sawyer.com/products/squeeze-water-filtration-system | 3–4 |
| camp-kitchen | Katadyn | BeFree 1.0L | https://www.katadyn.com/en-ch/products/trail/be-free-1-0l | 3–4 |
| camp-kitchen | Sea to Summit | X-Pot 1.4L | https://seatosummit.com/products/x-pot-1-4-liter | 3–4 |
| camping-accessories | Helinox | Chair One | https://www.helinox.com/products/chair-one | 4–6 |
| camping-accessories | Helinox | Table One | https://www.helinox.com/products/table-one | 4–5 |
| camping-accessories | Black Diamond | Moji Lantern | https://www.blackdiamondequipment.com/de_DE/ | 3–4 |
| camping-accessories | Petzl | Bindi Headlamp | https://www.petzl.com/DE/de/Sport/Stirnlampen/BINDI | 3–5 |
| camping-accessories | Vaude | Tarp 3×3 | https://www.vaude.com/de-de/ | 3–4 |

---

## 7. Sprint 4 — Clothing (~62)

Use manufacturer PDPs; all listed brands typically have **4–7 images** per colorway.

| Leaf | Manufacturer | Model | originalUrl pattern |
|------|--------------|-------|---------------------|
| jackets-shells | Mammut | Kento HS Hooded Jacket Men | `mammut.com/de/de/products/` → search Kento |
| jackets-shells | Fjällräven | Keb Eco-Shell Jacket | `fjallraven.com/de-de/` → Keb Eco-Shell |
| jackets-shells | Patagonia | Torrentshell 3L Jacket | `eu.patagonia.com/de/de/product/` |
| jackets-shells | Patagonia | Nano Puff Jacket | same |
| jackets-shells | Haglöfs | L.I.M Jacket Men | `haglofs.com/de/de/` |
| jackets-shells | Arc'teryx | Beta Jacket | `arcteryx.com/de/de/shop/beta-jacket` |
| jackets-shells | The North Face | Dryzzle Futurelight | `thenorthface.de/` |
| jackets-shells | Salewa | Ortles 2 GTX Jacket | `salewa.com/de-de/` |
| jackets-shells | RevolutionRace | Cyclone Rescue Jacket | `revolutionrace.de/` |
| midlayers-fleece | Patagonia | Better Sweater Fleece | `eu.patagonia.com/de/de/` |
| midlayers-fleece | Patagonia | R1 Air Hoody | same |
| midlayers-fleece | Fjällräven | Övik Fleece Hoodie | `fjallraven.com/de-de/` |
| midlayers-fleece | Mammut | Aconcagua Light Jacket | `mammut.com` |
| hiking-pants | Mammut | Runbold IV Pants Men | `mammut.com` |
| hiking-pants | Schöffel | Taubenberg Pants | `schoeffel.com/de-de/` |
| hiking-pants | Vaude | Farley V Pants | `vaude.com/de-de/` |
| hiking-pants | Salewa | Pedroc DST Pants | `salewa.com` |
| shorts-tights | Fjällräven | Nikka Shorts *(reassign)* | existing seed URL |
| shorts-tights | Patagonia | Pack Out Tights *(reassign)* | existing seed URL |
| shorts-tights | Fjällräven | Abisko Shorts | `fjallraven.com` |
| shorts-tights | Patagonia | Quandary Shorts | `eu.patagonia.com` |
| clothing-accessories | Fjällräven | Övik Wool Beanie | `fjallraven.com` |
| clothing-accessories | Buff | Original EcoStretch | `www.buff.com/eu/` |
| clothing-accessories | Hestra | Fall Line Glove | `www.hestragloves.com/de/` |

---

## 8. Sprint 5 — Footwear (~48)

| Leaf | Manufacturer | Model | originalUrl | ~Img |
|------|--------------|-------|-------------|------|
| hiking-boots | Lowa | Renegade GTX Mid Men | https://lowa.com/de/renegade-gtx-mid | 4–6 |
| hiking-boots | Lowa | Zephyr GTX Mid | https://lowa.com/de/zephyr-gtx-mid | 4–6 |
| hiking-boots | Lowa | Tibet GTX | https://lowa.com/de/tibet-gtx | 4–6 |
| hiking-boots | Salewa | Mountain Trainer Mid GTX | https://www.salewa.com/de-de/ | 4–6 |
| hiking-boots | Salewa | Wildfire Edge Mid | https://www.salewa.com/de-de/ | 4–6 |
| hiking-boots | Mammut | Sapuen High GTX | https://www.mammut.com/de/de/products/ | 4–5 |
| hiking-boots | Scarpa | Kailash Trek GTX | https://www.scarpa.com/de/ | 4–5 |
| hiking-boots | La Sportiva | TX4 Mid GTX | https://www.lasportiva.com/de-de/ | 4–5 |
| hiking-boots | Keen | Targhee IV Mid | https://www.keenfootwear.com/de-de/ | 4–6 |
| hiking-boots | Merrell | Moab 3 Mid GTX | https://www.merrell.com/DE/de/ | 4–6 |
| trail-runners | Salomon | X Ultra 4 GTX | https://www.salomon.com/de-de/shop/x-ultra-4-gtx | 5–8 |
| trail-runners | Salomon | Speedcross 6 | https://www.salomon.com/de-de/shop/speedcross-6 | 5–8 |
| trail-runners | La Sportiva | Ultra Raptor II | https://www.lasportiva.com/de-de/ | 4–6 |
| trail-runners | Hoka | Speedgoat 5 | https://www.hoka.com/de/de/ | 4–6 |
| trail-runners | Altra | Lone Peak 7 | https://www.altrarunning.com/de/de/ | 4–6 |
| trail-runners | Inov-8 | Rocfly G 390 | https://www.inov8.com/de/ | 3–5 |

---

## 9. Sprint 6 — Bags & gear (~43)

| Leaf | Manufacturer | Model | originalUrl | ~Img |
|------|--------------|-------|-------------|------|
| backpacks | Fjällräven | Keb 52 | https://www.fjallraven.com/de-de/ | 4–6 |
| backpacks | Fjällräven | Kajka 65 | https://www.fjallraven.com/de-de/ | 4–6 |
| backpacks | Vaude | Brentour 38 | https://www.vaude.com/de-de/ | 4–5 |
| backpacks | Gregory | Baltoro 65 | https://www.gregorypacks.com/ | 4–6 |
| backpacks | Osprey | Atmos AG 65 | https://www.osprey.com/ | 4–6 |
| backpacks | Osprey | Talon 22 | https://www.osprey.com/ | 4–6 |
| backpacks | Deuter | Futura 32 | https://www.deuter.com/de-de/shop/ | 4–5 |
| backpacks | EVOC | FR Trail E-Ride Protect | https://www.evocsports.com/de/ | 4–5 |
| lighting-tools | Petzl | Actik Core | https://www.petzl.com/DE/de/Sport/Stirnlampen/ACTIK-CORE | 3–5 |
| lighting-tools | Petzl | Nao RL | https://www.petzl.com/DE/de/Sport/Stirnlampen/NAO-RL | 3–5 |
| lighting-tools | Black Diamond | Spot 400 | https://www.blackdiamondequipment.com/de_DE/ | 3–4 |
| lighting-tools | Leatherman | Wave+ | https://www.leatherman.com/de/de/shop/wave-plus | 3–5 |
| trekking-poles | Black Diamond | Distance Carbon Z | https://www.blackdiamondequipment.com/de_DE/ | 3–4 |
| trekking-poles | Leki | Micro Vario Carbon | https://www.leki.com/de/ | 3–5 |
| trekking-poles | Komperdell | Carbon C3 | https://www.komperdell.com/de/ | 3–4 |

---

## 10. Sprint 7 — Bicycles (~76)

**No need to pre-list every trim** — Cube/Canyon/Scott/Trek publish **4–10 images per bike**.

| Leaf | How to pick SKUs | originalUrl |
|------|------------------|-------------|
| road-bikes | Next 16 trims from Cube Attain/Agree, Canyon Endurace/Ultimate, Scott Addict, Trek Domane | `cube.eu`, `canyon.com/de-de`, `scott-sports.com`, `trekbikes.com` |
| gravel-bikes | Grizl/Grail/Nuroad/Checkpoint trims not already in seed | same |
| mountain-bikes | Stereo/Neuron/Spectral/Spark/Scale trims | same |
| e-bikes | Cube Hybrid, Canyon Neuron:ON, Trek Fuel EXe, Scott Lumen | same |
| cycling-accessories | Giro Manifest, POC Omne, Abus AirBreaker, Lezyne Macro Drive, Ortlieb Frame-Pack, EVOC Hip Pack | brand sites + bike24 |

**Example anchors** (copy URL from browser after opening configure page):

| Model | originalUrl |
|-------|-------------|
| Cube Agree C:62 Race | https://www.cube.eu/de-de/cube-agree-c62-race-grey-n-reflex/ |
| Canyon Ultimate CF SL 7 | https://www.canyon.com/de-de/road-bikes/race-bikes/ultimate/cf-sl/ultimate-cf-sl-7/ |
| Trek Fuel EXe 8 | https://www.trekbikes.com/de/de_DE/bikes/mountain-bikes/e-mountain-bikes/fuel-exe/ |
| Giro Manifest Spherical | https://www.giro.com/products/road/helmets-manifest-spherical-mips-helm |

---

## 11. Sprint 8 — Ski (~49)

| Leaf | Manufacturer | Model | originalUrl | ~Img |
|------|--------------|-------|-------------|------|
| all-mountain | Blizzard Tecnica | Bonafide 97 | https://www.blizzard-tecnica.com/de/de/men/skis/all-mountain/bonafide/bonafide-97-flat | 3–5 |
| all-mountain | Blizzard | Rustler 9 | https://www.blizzard-tecnica.com/de/de/ | 3–5 |
| all-mountain | Atomic | Maverick 88 CTi | https://www.atomic.com/de-de/ | 3–5 |
| all-mountain | Head | Kore 93 | https://www.head.com/de_DE/ | 3–5 |
| all-mountain | Fischer | Ranger 96 | https://www.fischer-sports.com/de-de/ | 3–5 |
| piste-freeride-skis | Blizzard | Brahma 88 | https://www.blizzard-tecnica.com/de/de/ | 3–5 |
| piste-freeride-skis | Head | Supershape e-Magnum | https://www.head.com/de_DE/ | 3–5 |
| piste-freeride-skis | Salomon | Stance 96 | https://www.salomon.com/de-de/shop/stance-96 | 4–6 |
| ski-boots | Salomon | S/Pro Supra 100 | https://www.salomon.com/de-de/ | 4–6 |
| ski-boots | Lange | LX 110 HV | https://www.lange-boots.com/de-de/ | 3–5 |
| ski-boots | Tecnica | Mach Sport HV 110 | https://www.tecnica-group.com/tecnica/de-de/ | 3–5 |
| ski-accessories | Leki | Carbon 14 S | https://www.leki.com/de/ | 3–4 |
| ski-accessories | Smith | I/O Mag | https://www.smithoptics.com/de-DE/ | 4–6 |
| ski-accessories | Black Diamond | Expedition 3 Poles | https://www.blackdiamondequipment.com/de_DE/ | 3–4 |

---

## 12. Quality gate (per SKU)

```text
[ ] originalUrl opens and shows the correct model
[ ] At least 1 image ≥ 800px on shortest side
[ ] Prefer front/side packshot (not lifestyle-only)
[ ] 3+ gallery images available → shortlist 1–3 for storefront rotation later
[ ] WebP exports done → JSON committed
```

**Reject** if only tiny thumbnails or watermarked marketplace photos are available.

---

## 13. Related documents

| Document | Role |
|----------|------|
| [CATALOG_PRODUCT_EXPANSION_PLAN.md](./CATALOG_PRODUCT_EXPANSION_PLAN.md) | SKU counts, sprints, JSON schema |
| [CATALOG_RESTRUCTURE_PLAN.md](./CATALOG_RESTRUCTURE_PLAN.md) | Category tree (Phase 1) |

---

_Last updated: 2026-06-25. Image harvesting reference — WebP conversion is manual._
