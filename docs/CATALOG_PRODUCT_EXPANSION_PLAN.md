# Campfire Store — Catalog product expansion plan (Phase 2)

**Status:** Draft  
**Prerequisite:** [CATALOG_RESTRUCTURE_PLAN.md](./CATALOG_RESTRUCTURE_PLAN.md) Phase 1 merged (28 leaf categories, `bags-and-gear` rename, `sport-shoe` icon)  
**Repo:** `campfire-store-api` (`dev-tools/data/products/`)  
**Target:** **~480 SKUs** (from 49 today) — within the 400–500 “realistic shop” goal

---

## 1. Constraints (non-negotiable)

| Rule | Detail |
|------|--------|
| **Real products only** | Every SKU must map to a real manufacturer product page (`originalUrl`). No fictional models. |
| **Image-ready** | **1–5 downloadable images** on `originalUrl` (manufacturer PDP preferred). You handle crop + **WebP conversion** locally — see [CATALOG_PRODUCT_IMAGE_SOURCES.md](./CATALOG_PRODUCT_IMAGE_SOURCES.md). |
| **Theme** | European outdoor specialty retail — bikes, paddle, camp, hike, clothing, footwear, winter. |
| **Locales** | `descriptionI18n.en` + `descriptionI18n.de` for every product (match existing seed quality). |
| **Pricing** | `priceI18n.EUR` + `priceI18n.USD`; use manufacturer RRP at time of import (round sensibly). |
| **Category leaf** | Every product links to exactly one **leaf** category `_id` from Phase 1. |
| **No fake variants** | Men’s/women’s are separate SKUs only when the manufacturer sells them as separate products. |

---

## 2. Baseline (today)

**49 products** · **8 populated leaves** · median price ~€999 · **8 featured**

| Manufacturer | SKUs | Notes |
|--------------|------|-------|
| Cube | 10 | Strong image pipeline |
| Canyon | 10 | Excellent galleries |
| Scott | 6 | |
| Fjällräven | 5 | Clothing, future packs |
| Deuter | 4 | Backpacks |
| Mammut | 3 | Backpacks |
| RevolutionRace | 3 | Pants |
| Osprey | 2 | Backpacks |
| Patagonia | 2 | Pants |
| Trek | 1 | Road |
| Blizzard Tecnica | 1 | Ski |
| Naturehike | 1 | Tent |
| Rebel Kayaks | 1 | Kayak |

---

## 3. Target assortment (~480 SKUs)

### 3.1 By department

| Department | Current | Target | Δ |
|------------|---------|--------|---|
| Bicycles | 27 | **103** | +76 |
| Clothing | 10 | **96** | +86 |
| Camping | 1 | **94** | +93 |
| Bags & gear | 9 | **52** | +43 |
| Footwear | 0 | **48** | +48 |
| Kayaks | 1 | **50** | +49 |
| Ski | 1 | **50** | +49 |
| **Total** | **49** | **493** | **+444** |

> **Note:** `e-bikes` (+18) is included below but only after the Phase 1b category leaf exists. Without e-bikes, total ≈ **475**.

### 3.2 By leaf category

| Leaf `code` | Current | Target | Δ | Primary JSON file |
|-------------|---------|--------|---|-------------------|
| `touring-kayaks` | 1 | 12 | +11 | `touring-kayaks.json` |
| `whitewater-kayaks` | 0 | 14 | +14 | `whitewater-kayaks.json` **new** |
| `inflatable-kayaks` | 0 | 14 | +14 | `inflatable-kayaks.json` **new** |
| `kayak-accessories` | 0 | 10 | +10 | `kayak-accessories.json` **new** |
| `road-bikes` | 6 | 22 | +16 | `road-bikes.json` |
| `gravel-bikes` | 10 | 25 | +15 | `gravel-bikes.json` |
| `mountain-bikes` | 11 | 28 | +17 | `mountain-bikes.json` |
| `e-bikes` | 0 | 18 | +18 | `e-bikes.json` **new** |
| `cycling-accessories` | 0 | 15 | +15 | `cycling-accessories.json` **new** |
| `tents` | 1 | 28 | +27 | `tents.json` |
| `sleeping-bags` | 0 | 24 | +24 | `sleeping-bags.json` **new** |
| `sleeping-pads` | 0 | 14 | +14 | `sleeping-pads.json` **new** |
| `camp-kitchen` | 0 | 16 | +16 | `camp-kitchen.json` **new** |
| `camping-accessories` | 0 | 12 | +12 | `camping-accessories.json` **new** |
| `backpacks` | 9 | 32 | +23 | `backpacks.json` |
| `lighting-tools` | 0 | 12 | +12 | `lighting-tools.json` **new** |
| `trekking-poles` | 0 | 8 | +8 | `trekking-poles.json` **new** |
| `hiking-pants` | 10 | 20 | +10 | `hiking-pants.json` |
| `jackets-shells` | 0 | 28 | +28 | `jackets-shells.json` **new** |
| `midlayers-fleece` | 0 | 22 | +22 | `midlayers-fleece.json` **new** |
| `shorts-tights` | 0 | 16 | +16 | `shorts-tights.json` **new** |
| `clothing-accessories` | 0 | 10 | +10 | `clothing-accessories.json` **new** |
| `hiking-boots` | 0 | 28 | +28 | `hiking-boots.json` **new** |
| `trail-runners` | 0 | 20 | +20 | `trail-runners.json` **new** |
| `all-mountain` | 1 | 10 | +9 | `ski.json` → rename/split `all-mountain-skis.json` |
| `piste-freeride-skis` | 0 | 16 | +16 | `piste-freeride-skis.json` **new** |
| `ski-boots` | 0 | 14 | +14 | `ski-boots.json` **new** |
| `ski-accessories` | 0 | 10 | +10 | `ski-accessories.json` **new** |

### 3.3 Taxonomy cleanup (reassign existing)

| Product | From | To |
|---------|------|-----|
| Fjällräven Nikka Shorts Curved Women | `hiking-pants` | `shorts-tights` |
| Patagonia Women's Pack Out Tights | `hiking-pants` | `shorts-tights` |

Do this in **Sprint 0** before counting hiking-pants targets.

---

## 4. Brand strategy

### 4.1 Tier 1 — expand heavily (proven image workflow)

| Brand | Departments | Why |
|-------|-------------|-----|
| **Cube** | Road, gravel, MTB, e-bike | Huge EU catalog, consistent packshots |
| **Canyon** | Road, gravel, MTB, e-bike | Best-in-class product imagery |
| **Scott** | Road, gravel, MTB | Good galleries, overlaps bike range |
| **Trek** | Road, gravel, MTB, e-bike | Broad range |
| **Fjällräven** | Pants, jackets, packs, accessories | Strong `.de` PDPs |
| **Mammut** | Packs, jackets, pants, boots | Alpine outdoor fit |
| **Deuter** | Backpacks, sleeping bags | EU staple |
| **Patagonia** | Jackets, midlayers, shorts | Reliable media |

### 4.2 Tier 2 — add for breadth (verify image size per SKU)

| Brand | Departments |
|-------|-------------|
| **Vaude** | Tents, packs, pants, jackets |
| **Salewa** | Boots, jackets, pants |
| **Lowa** | Hiking boots |
| **MSR** | Tents, stoves, filters |
| **Sea to Summit** | Pads, bags, kitchen |
| **Therm-a-Rest** / **Exped** | Sleeping pads |
| **Petzl** / **Black Diamond** | Headlamps, poles |
| **Gumotex** / **Itiwit** | Inflatable kayaks |
| **Prijon** / **Dagger** / **Pyranha** | Kayaks |
| **Blizzard** / **Atomic** / **Salomon** / **Head** | Skis, boots |
| **Naturehike** / **Nordisk** / **Robens** | Budget-mid camp |
| **RevolutionRace** | Pants, shorts |
| **Osprey** / **Gregory** | Backpacks |

### 4.3 Tier 3 — sprinkle for realism (≤5 SKUs each)

Haglöfs, Schöffel, Scarpa, La Sportiva, Merrell, Keen, Werner, NRS, Palm, Primus, Jetboil, Trangia, Helinox, Leki, Giro, EVOC, Ortlieb, Carinthia, Hilleberg.

**Cap any Tier 3 brand at 5 SKUs** until image pipeline is proven.

---

## 5. Price & merchandising targets

### 5.1 Catalog-wide price mix (EUR)

| Band | Share of catalog | Purpose |
|------|------------------|---------|
| &lt; €200 | ~25% | Filters, impulse, accessories |
| €200 – €800 | ~35% | Core outdoor (packs, clothing, camp) |
| €800 – €2,500 | ~25% | Bikes entry-mid, premium camp |
| €2,500+ | ~15% | Flagship bikes, kayaks, ski |

Today the catalog skews high (bikes). Phase 2 deliberately **front-loads camp, clothing, footwear** in early sprints to fix filter UX.

### 5.2 Featured products

| Metric | Current | Target |
|--------|---------|--------|
| Featured count | 8 | **36–40** |
| Per department | bikes-heavy | **≥4 per root** |
| `featureOrder` | 1–8 | 1–40, department-interleaved |

Mark **~8%** of new SKUs as featured max; rotate seasonally later.

### 5.3 Badges

Use existing `bestseller` / `new` badges sparingly:

- **new** — SKUs added in latest sprint (remove after next sprint or via `active` flag pattern)
- **bestseller** — 1–2 per leaf max; pick recognizable models (e.g. Canyon Grail, Fjällräven Keb, MSR Hubba Hubba)

---

## 6. Data & file conventions

### 6.1 Product JSON schema

Follow existing seed shape:

```json
{
  "_id": "<ObjectId>",
  "name": "Product Name",
  "manufacturer": "Brand",
  "category": "<leaf category ObjectId>",
  "priceI18n": { "EUR": 199, "USD": 219 },
  "descriptionI18n": { "en": "…", "de": "…" },
  "images": [{ "original": {}, "large": {}, "medium": {}, "small": {}, "thumbnail": {} }],
  "originalUrl": "https://manufacturer…/product-page",
  "isFeatured": false,
  "featureOrder": null,
  "badges": []
}
```

### 6.2 One JSON file per leaf category

Mirror `dev-tools/data/products/<leaf-code>.json`. Update `db-seed.js` to import all files (consider glob instead of manual list).

### 6.3 ID generation

- **New products:** new `ObjectId()` per SKU.
- **Existing products:** keep `_id` (cart/order history safe).
- **Image paths:** keep pattern `/img/products/{size}/product-{id}-{timestamp}-{n}_{suffix}.{ext}`.

### 6.4 `db-seed.js` refactor (recommended in Sprint 0)

```js
const productFiles = fs.readdirSync(path.join(dataDir, 'products')).filter((f) => f.endsWith('.json'));
for (const file of productFiles) {
  await Product.create(readJson(`products/${file}`));
}
```

---

## 7. Images — your workflow + source list

**You** download source images and convert to WebP (and derived sizes). This plan only defines **which real products** to add and **where to get 1–5 trustworthy images**.

### 7.1 Your pipeline

```text
[ ] Pick SKU from CATALOG_PRODUCT_IMAGE_SOURCES.md (or sprint table below)
[ ] Open originalUrl → confirm ≥1 usable packshot (ideally 3–5 gallery images)
[ ] Download best angle(s); crop/letterbox to 2000×2000 if needed
[ ] Convert to WebP + export large / medium / small / thumbnail
[ ] Place under public/img/products/{size}/
[ ] Add product JSON with images[] paths + originalUrl
[ ] Do not commit JSON until files exist on disk
```

### 7.2 Source trust tiers

| Tier | Source | Use when |
|------|--------|----------|
| **M** | Manufacturer official shop (`cube.eu`, `canyon.com`, `mammut.com`, …) | Always try first — set as `originalUrl` |
| **B** | Authorized EU outdoor retailers ([Bergfreunde](https://www.bergfreunde.de), [Globetrotter](https://www.globetrotter.de), [Bike24](https://www.bike24.com), [Addnature](https://www.addnature.com)) | Manufacturer has no public gallery (e.g. some Gumotex, Prijon) — note in spreadsheet |
| **Avoid** | Amazon, eBay, Pinterest, user reviews | Unreliable rights & resolution |

### 7.3 Product examples with URLs

**Full per-SKU tables** (manufacturer, model, `originalUrl`, expected image count, fallback):  
→ **[CATALOG_PRODUCT_IMAGE_SOURCES.md](./CATALOG_PRODUCT_IMAGE_SOURCES.md)**

Sprint sections below list **product names only**; use the image-sources doc when harvesting.

### 7.4 Tracking spreadsheet columns

`leaf | manufacturer | model | originalUrl | source_tier | images_found | webp_done | json_done`

---

## 8. Implementation sprints

Work in **8 sprints** (~50–60 SKUs each). Order optimizes **empty-category embarrassment** and **price-mix balance**.

### Sprint 0 — Hygiene (~0 new SKUs)

- [ ] Phase 1 categories live; leaf `_id` map documented
- [ ] Reassign 2 shorts/tights products
- [ ] Refactor `db-seed.js` to glob product files
- [ ] Create image tracking spreadsheet
- [ ] Split `ski.json` naming → `all-mountain-skis.json` (optional)

---

### Sprint 1 — Kayaks + empty leaves (~48 SKUs)

**Priority:** fill `whitewater-kayaks`, `inflatable-kayaks`, expand `touring-kayaks`, seed `kayak-accessories`.

#### Touring kayaks (+11 → 12 total)

| Manufacturer | Model |
|--------------|-------|
| Prijon | Sea Kayak |
| Perception | Essence 16 |
| Valley | Gemini RM |
| Point 65 | Mercury Solo |
| Boreal Design | Esperanto |
| Wilderness Systems | Pungo 125 |
| Pelican | Sprint 140DT |
| Riot | Enduro 13 |
| Tahe | Kayaks Ocean Spirit |
| Sevy | (skip — prefer hardshell brands) |
| Rebel Kayaks | *(existing ILAGA)* |

#### Whitewater kayaks (+14)

| Manufacturer | Model |
|--------------|-------|
| Pyranha | Machno |
| Pyranha | Ripper |
| Dagger | Rewind 9.0 |
| Dagger | Phantom |
| Prijon | Rockit |
| Liquid Logic | Remix 47 |
| Jackson Kayak | Antix 2 |
| Wavesport | Fuse 54 |
| Spade Kayaks | Ace |
| Waka Kayaks | Tutea |
| Lettmann | Magnum |
| Riot | Boogie 65 |
| Zet | Free |

#### Inflatable kayaks (+14)

| Manufacturer | Model |
|--------------|-------|
| Gumotex | Twist 2 |
| Gumotex | Seawave 2 |
| Aquaglide | Chinook 120 |
| Advanced Elements | AdvancedFrame Ultralite |
| Itiwit | X100+ 2/3 Places |
| Itiwit | X500 2 Places |
| Aqua Marina | Steam 312 |
| Intex | Excursion Pro K2 *(verify image quality)* |
| Sevylor | Yukon *(if PDP usable)* |
| Grabner | Holiday 2 *(premium EU)* |
| Gumotex | Thaya |

#### Kayak accessories (+10)

| Manufacturer | Model |
|--------------|-------|
| Werner | Camano Paddle |
| Werner | Tybee Paddle |
| NRS | Osprey Paddle |
| Palm | Sport PFD |
| NRS | cRUSH PFD |
| Yakima | JayLow *(roof rack)* |
| HIKO | Sprayskirt *(verify size variants as 1 SKU)* |
| Aquabound | Sting Ray paddle |
| Peak PS | Cruiser paddle |
| NRS | Standard Rescue Throw Bag |

---

### Sprint 2 — Camping core (~55 SKUs)

#### Tents (+27 → 28)

| Manufacturer | Model |
|--------------|-------|
| MSR | Hubba Hubba 2 |
| MSR | Elixir 3 |
| Big Agnes | Copper Spur HV UL2 |
| Big Agnes | Tiger Wall UL2 |
| Nordisk | Lofoten 2 ULW |
| Nordisk | Telemark 2.2 |
| Vaude | Hogan UL 2P |
| Robens | Nevis 2 |
| Robens | Kiowa |
| Naturehike | Cloud Up 3 *(expand line)* |
| Naturehike | Vik 2 |
| Hilleberg | Anjan 2 GT |
| Exped | Orion III |
| Helsport | Reinsfjell Superlight 2 |
| Salewa | Litetrek II Tent |
| Ferrino | Lightent 2 Pro |
| *(existing Naturehike Cloud-up 2)* |

#### Sleeping bags (+24)

| Manufacturer | Model |
|--------------|-------|
| Deuter | Exosphere -6° |
| Deuter | Astro 300 |
| Marmot | Trestles Elite Eco 20 |
| Sea to Summit | Ascent AcII 0°F |
| Haglöfs | LIM Down 1 |
| Carinthia | Defence 4 |
| Fjällräven | Färgsen |
| Vaude | Sioux 800 |
| Robens | Breeze 250 |
| Nordisk | Oscar -10 |
| Mammut | Alpine 3-Season |
| Exped | Ultra 0° |
| Grüezi Bag | Biopod Down 190 |
| Cumulus | X-Lite 300 |

#### Sleeping pads (+14)

| Manufacturer | Model |
|--------------|-------|
| Therm-a-Rest | NeoAir XLite NXT |
| Therm-a-Rest | Trail Pro |
| Exped | Ultra 3R |
| Exped | Dura 4R |
| Sea to Summit | Ether Light XT |
| Nemo | Tensor Insulated |
| Vaude | Performance 7R |
| Robens | Air Impact 38 |
| Big Agnes | Zoom UL |
| Nordisk | Ven 2.5 |
| Mammut | MT 500 |

---

### Sprint 3 — Camp kitchen + camping accessories (~28 SKUs)

#### Camp kitchen (+16)

| Manufacturer | Model |
|--------------|-------|
| MSR | PocketRocket 2 |
| MSR | WindBurner Personal |
| Jetboil | Flash |
| Jetboil | MiniMo |
| Primus | Lite+ |
| Primus | Essential Trail Stove |
| Trangia | 25 UL Storm |
| Optimus | Crux |
| Sawyer | Squeeze |
| Katadyn | BeFree 1.0L |
| Sea to Summit | X-Pot 1.4L |
| GSI Outdoors | Pinnacle Dualist |
| Snow Peak | Trek 900 |
| Esbit | Titanium Solid Fuel Stove |

#### Camping accessories (+12)

| Manufacturer | Model |
|--------------|-------|
| Helinox | Chair One |
| Helinox | Table One |
| Black Diamond | Moji Lantern |
| Petzl | Bindi Headlamp |
| MSR | Tyvek Footprint *(tent accessory — OK here)* |
| Sea to Summit | Pocket Trowel |
| Exped | Schnozzel Pump |
| Nordisk | Aluminium Pole Set |
| Vaude | Tarp 3x3 |
| Outwell | Collaps Kettle |

---

### Sprint 4 — Clothing (~62 SKUs)

#### Jackets & shells (+28)

| Manufacturer | Model |
|--------------|-------|
| Mammut | Kento HS Hooded Jacket Men |
| Mammut | Convey Tour HS Hooded Jacket Women |
| Fjällräven | Keb Eco-Shell Jacket |
| Fjällräven | High Coast Hooded Jacket |
| Patagonia | Torrentshell 3L Jacket |
| Patagonia | Nano Puff Jacket |
| Haglöfs | L.I.M Jacket Men |
| Haglöfs | Spitz Jacket Women |
| Arc'teryx | Beta Jacket |
| Arc'teryx | Atom Hoody |
| The North Face | Dryzzle Futurelight Jacket |
| Salewa | Ortles 2 GTX Jacket |
| Vaude | Yaras Jacket II |
| Schöffel | 3L Jacket Vigo |
| RevolutionRace | Cyclone Rescue Jacket |
| Marmot | Minimalist Jacket |

#### Midlayers & fleece (+22)

| Manufacturer | Model |
|--------------|-------|
| Patagonia | Better Sweater Fleece |
| Patagonia | R1 Air Hoody |
| Fjällräven | Övik Fleece Hoodie |
| Fjällräven | Abisko Fleece |
| Mammut | Aconcagua Light Jacket |
| Haglöfs | Myrdal Hood |
| Schöffel | Fleece Jacket Trentino |
| Vaude | Moab Fleece Jacket |
| Salewa | Pedroc Hybrid Polartec |
| Norröna | Falketind Alpha120 |
| Dynafit | Free Mezzalama |
| Bergans | Ylight Handknit |

#### Hiking pants (+10 net) + shorts/tights (+16)

**Pants additions:**

| Manufacturer | Model |
|--------------|-------|
| Mammut | Runbold IV Pants Men |
| Mammut | Hiking III Pants Women |
| Schöffel | Taubenberg Pants Men |
| Vaude | Farley V Pants |
| Salewa | Agner DST Pants |
| Bergans | Warden Pants |

**Shorts & tights** (incl. 2 reassignments):

| Manufacturer | Model |
|--------------|-------|
| Fjällräven | Nikka Shorts Curved Women *(move)* |
| Patagonia | Pack Out Tights Women *(move)* |
| Fjällräven | Abisko Shorts |
| Patagonia | Quandary Shorts |
| RevolutionRace | GP Pro Shorts |
| Mammut | Runbold Shorts |
| Salomon | Sense Aero Shorts |

#### Clothing accessories (+10)

| Manufacturer | Model |
|--------------|-------|
| Fjällräven | Övik Wool Beanie |
| Patagonia | Powder Town Beanie |
| Mammut | Run Warm Beanie |
| Black Diamond | Lightweight Gloves |
| Hestra | Fall Line Glove |
| Buff | Original EcoStretch |
| Ortlieb | Hip Bag |
| Salewa | Powertex Gloves |

---

### Sprint 5 — Footwear (~48 SKUs)

#### Hiking boots (+28)

| Manufacturer | Model |
|--------------|-------|
| Lowa | Renegade GTX Mid |
| Lowa | Zephyr GTX Mid |
| Lowa | Tibet GTX |
| Salewa | Mountain Trainer Mid GTX |
| Salewa | Wildfire Edge Mid |
| Mammut | Sapuen High GTX |
| Mammut | Ducan High GTX |
| Scarpa | Kailash Trek GTX |
| La Sportiva | TX4 Mid GTX |
| Meindl | Bhutan MFS |
| Hanwag | Tatra II GTX |
| Keen | Targhee IV Mid |
| Merrell | Moab 3 Mid GTX |
| Vaude | TVL Comfy Dress |

#### Trail runners (+20)

| Manufacturer | Model |
|--------------|-------|
| Salomon | X Ultra 4 GTX |
| Salomon | Speedcross 6 |
| La Sportiva | Ultra Raptor II |
| Hoka | Speedgoat 5 |
| Altra | Lone Peak 7 |
| Merrell | Agility Peak 5 |
| Salewa | Dropline |
| Dynafit | Alpine DNA |
| Scarpa | Spin Ultra |
| Inov-8 | Rocfly G 390 |

---

### Sprint 6 — Bags & gear (~43 SKUs)

#### Backpacks (+23 → 32)

| Manufacturer | Model |
|--------------|-------|
| Fjällräven | Keb 52 |
| Fjällräven | Kajka 65 |
| Fjällräven | Abisko Hike 35 |
| Vaude | Brentour 38 |
| Vaude | Astrid EVO 24 |
| Gregory | Baltoro 65 |
| Gregory | Paragon 58 |
| Osprey | Atmos AG 65 |
| Osprey | Talon 22 |
| Deuter | Futura 32 |
| Deuter | Aircontact Core 60+10 |
| EVOC | FR Trail E-Ride Protect |
| Ortlieb | Atrack 35 |

#### Lighting & tools (+12)

| Manufacturer | Model |
|--------------|-------|
| Petzl | Actik Core |
| Petzl | Nao RL |
| Black Diamond | Spot 400 |
| Black Diamond | Revolt 350 |
| Ledlenser | MH5 |
| Princeton Tec | Sync |
| Leatherman | Wave+ |
| Victorinox | Huntsman |
| Opinel | No.08 Outdoor |

#### Trekking poles (+8)

| Manufacturer | Model |
|--------------|-------|
| Black Diamond | Distance Carbon Z |
| Black Diamond | Expedition 3 |
| Leki | Micro Vario Carbon |
| Leki | Makalu Lite |
| Komperdell | Carbon C3 |
| Mammut | Trekking Poles Light |

---

### Sprint 7 — Bicycles (~76 SKUs)

Expand within existing manufacturers first; add **e-bikes** leaf if Phase 1b done.

#### Road (+16), Gravel (+15), MTB (+17)

Pull next trims from official configurators — examples to anchor each file:

| Category | Cube | Canyon | Scott | Trek |
|----------|------|--------|-------|------|
| Road | Agree C:62 Race | Ultimate CF SL 7 | Addict RC 30 | Domane SL 6 |
| Gravel | Nuroad Pro | Grizl CF SL 8 | Addict Gravel 30 | Checkpoint ALR 5 |
| MTB | Stereo ONE44 | Spectral CF 8 | Genius 930 | Fuel EX 8 |

**Rule:** each sprint adds ~5 Cube + ~5 Canyon + ~2 Scott + ~2 Trek per bike leaf until targets met.

#### E-bikes (+18, when category exists)

| Manufacturer | Model |
|--------------|-------|
| Cube | Stereo Hybrid ONE44 Pro |
| Cube | Reaction Hybrid Pro |
| Canyon | Neuron:ON CF 9 |
| Canyon | Spectral:ON CF 8 |
| Trek | Fuel EXe 8 |
| Trek | Rail+ 8 |
| Scott | Lumen eRIDE 900 |
| Haibike | AllTrail 7 |

#### Cycling accessories (+15)

| Manufacturer | Model |
|--------------|-------|
| Giro | Manifest Spherical MIPS |
| POC | Omne Air MIPS |
| Abus | AirBreaker |
| Lezyne | Macro Drive 1300 |
| Cateye | AMPP 800 |
| Ortlieb | Frame-Pack |
| Apidura | Backcountry Frame Pack |
| Topeak | MidLoader |
| Kryptonite | New York Lock |
| EVOC | Hip Pack Pro 3 |

---

### Sprint 8 — Ski (~49 SKUs)

#### All mountain (+9 → 10) — keep Blizzard Bonafide

| Manufacturer | Model |
|--------------|-------|
| Blizzard | Rustler 9 |
| Atomic | Maverick 88 CTi |
| Head | Kore 93 |
| Fischer | Ranger 96 |
| Rossignol | Blackops 92 |
| Salomon | QST 98 |
| Nordica | Enforcer 94 |
| Völkl | Mantra M6 |

#### Piste & freeride (+16)

| Manufacturer | Model |
|--------------|-------|
| Blizzard | Brahma 88 |
| Atomic | Redster G9 |
| Head | Supershape e-Magnum |
| Fischer | RC4 One 82 |
| Rossignol | Hero Elite |
| Salomon | Stance 96 |
| K2 | Mindbender 99Ti |
| Dynastar | M-Pro 99 |

#### Ski boots (+14)

| Manufacturer | Model |
|--------------|-------|
| Salomon | S/Pro Supra 100 |
| Lange | LX 110 HV |
| Rossignol | Alltrack Pro 120 |
| Tecnica | Mach Sport HV 110 |
| Head | Edge 85 |
| Atomic | Hawx Prime 110 |
| Dalbello | Panterra 100 |

#### Ski accessories (+10)

| Manufacturer | Model |
|--------------|-------|
| Leki | Carbon 14 S |
| Black Diamond | Expedition 3 Poles |
| Smith | I/O Mag Goggles |
| Oakley | Flight Deck L |
| Dakine | Mission 25L Pack |
| Ortovox | Free Rider 22 Avabag |

---

## 9. Verification checklist (per sprint)

```text
[ ] Product count per leaf matches §3.2 cumulative targets
[ ] All originalUrl links resolve (200 OK)
[ ] Images on disk for every new SKU
[ ] EN + DE descriptions present
[ ] db-seed / recreateTestData succeeds
[ ] npm test (API regression) passes
[ ] Spot-check filters: brand, price quick filters, pagination (no dupes)
[ ] Featured spread across departments
```

---

## 10. Open items (optional discussion)

These do **not** block drafting; confirm before Sprint 1 if you care:

| # | Topic | Default in this plan |
|---|-------|----------------------|
| 1 | Exact target **493 vs 475** (with/without e-bikes) | Include e-bikes in Sprint 7 |
| 2 | **Intex / budget** kayak SKUs | Included sparingly; drop if images poor |
| 3 | **Arc'teryx** premium pricing | Included (~4 SKUs); signals quality tier |
| 4 | Automated **image import** script | **Manual** — you download & convert to WebP; see [CATALOG_PRODUCT_IMAGE_SOURCES.md](./CATALOG_PRODUCT_IMAGE_SOURCES.md) |
| 5 | **USD** prices | Manual FX offset (~1.08–1.10× EUR) like existing seed |

---

## 11. Related documents

| Document | Role |
|----------|------|
| [CATALOG_RESTRUCTURE_PLAN.md](./CATALOG_RESTRUCTURE_PLAN.md) | Phase 1 categories (prerequisite) |
| [CATALOG_PRODUCT_IMAGE_SOURCES.md](./CATALOG_PRODUCT_IMAGE_SOURCES.md) | **Per-SKU `originalUrl` + image availability** (harvest list) |
| `dev-tools/data/products/*.json` | Product source files |
| `dev-tools/data/db-seed.js` | Import entry point |

---

_Last updated: 2026-06-25. Phase 2 product expansion — categories must be in place first._
