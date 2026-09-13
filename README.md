# Tandläkarhuset Östersund

Webbplats för en tandläkarmottagning på Kyrkgatan 60 i Östersund. Sju sidor som
berättar vem kliniken är, vad den gör och hur man får tag på den.

**🔗 [tandlakarhuset.blomstrande.net](https://tandlakarhuset.blomstrande.net)**

---

## Vad det är

Kliniken drivs som två team under samma tak, Team Charlotte och Team Marielle,
med egna telefonnummer och egna öppettider. Det präglar hela sajten: det finns
ingen onlinebokning, och varje sida slutar med båda teamens nummer.

Innehållet följer patientens frågor i tur och ordning: vad ett besök innebär,
vad det kostar, vad som gäller för barn, vem man möter. Tonen är lugn och
konkret, och designen är byggd för att bära den: mycket luft, en hög serif i
rubrikerna och en klinisk tealskala hämtad ur klinikens egen logotyp.

Fotona är tagna av Varga Studios på plats i lokalerna.

## Teknik

Ren HTML, CSS och drygt hundra rader JavaScript. **Inget ramverk, ingen
byggkedja, noll beroenden.** Mappen laddas upp som den är och fungerar på
vilket webbhotell som helst.

Valet är medvetet. En sajt med sju sidor som ändras ett par gånger om året
vinner ingenting på ett ramverk, men förlorar en del: någon måste hålla
beroenden uppdaterade, och om fem år ska den fortfarande gå att öppna och
redigera utan att först få en verktygskedja att starta.

```
index.html               Hem
mottagningen.html        Om oss och teamet
tandvard.html            Tandvård och behandlingar
barn-och-ungdom.html     Barn och ungdom
tandhygienist.html       Tandhygienist
priser.html              Priser och ersättningar
kontakt.html             Kontakt
404.html

assets/css/style.css     hela designsystemet, en fil
assets/js/site.js        mobilmeny, scroll-reveal, formulär, lazy karta
assets/img/              bilder i flera bredder (WebP + JPG), logotyp, ikoner

netlify.toml             publicering, cache-headers, snygga URL:er
robots.txt · sitemap.xml
```

## Designsystemet

Färger, typsnitt och mått ligger som CSS-variabler högst upp i `style.css`.
Ändrar du en variabel slår det igenom på hela sajten.

- **Rubriker:** Instrument Serif · **Brödtext:** Manrope
- **Teal** `#179B93` · **djup teal** `#0F5F5A` · **mörk fond** `#0C302E` ·
  **papper** `#FBFAF7` · **dis** `#EEF4F3`
- Inga rundade hörn, inga skuggor. Ytor skiljs åt med hårstreck. Versaletiketter
  i teal, och ett 68 × 1 px streck under rubriker som står ensamma.

Typografin är fluid (`clamp()`), så den skalar steglöst mellan mobil och desktop
i stället för att hoppa vid brytpunkter.

### Fyra bredder, inte en

Om varje sektion börjar på samma x-linje blir sidan stel, hur bra typografin än
är. Därför växlar fyra bredder genom sidorna:

| Klass | Bredd | Till vad |
|---|---|---|
| `.wrap--smal` | 1000 px | texttunga partier |
| `.wrap` | 1280 px | standard |
| `.wrap--bred` | 1560 px | rutnät och sidfot |
| `.halvbleed` | hela skärmen | text på ramens linje, bilden ut till kanten |

`.halvbleed` används bara i sektioner med egen bakgrundsfärg. Utan den ramen ser
bilden ut att rinna ut ur sidan i stället för att vara ett val.

Att texten i en halvbleed ska linjera exakt med en vanlig `.wrap` kräver den
riktiga fönsterbredden: `100vw` räknar med scrollbaren och ger några pixlars
fel, så `site.js` sätter `--vw` till `clientWidth`.

### Uppslag

Där en kort rubrik står bredvid en lång brödtext blir spalten annars tom. Klassen
`.uppslag` gör rubrikspalten smalare, avslutar den med strecket och gör den
`position: sticky`, så rubriken följer med medan texten rullar förbi.

## Bilder

Varje bild finns i flera bredder som WebP med JPG som reserv, kopplade med
`srcset`/`sizes`. Webbläsaren hämtar bara den storlek den behöver, så en mobil
laddar ungefär 150 kB bilder på startsidan.

Bilderna är byggda direkt ur fotografens originalfiler i full upplösning. Två
saker är värda att veta om man lägger till fler:

- **Toppbanden beskärs två gånger.** Bandet är bredare än bildens eget format,
  så `object-fit: cover` klipper i höjd utöver den beskärning bilden redan har.
  Var klippet hamnar sätts per sida med `--bildlage` på `.toppbild`. Utan det
  kapas ansikten som sitter högt i bild.
- **Lägga till en bild:** spara den i `assets/img/` i två eller tre bredder
  (`namn-480.webp`, `namn-960.webp` …) och kopiera ett befintligt
  `<picture>`-block.

## Mobil

Mobilanpassningen är skriven för hand, inte ärvd från ett ramverk.

- Under 1040 px blir menyn en hamburgare med helskärmsmeny.
- Personrutnätet går 4 → 3 → 2 kolumner. Två kolumner i mobil i stället för en
  halverar teamsidans längd.
- Radbrytningar som bara ska gälla i desktop skrivs `<br class="d">` **med ett
  mellanslag före**. I mobil döljs taggen och mellanslaget håller isär orden.
- `prefers-reduced-motion` stänger av all rörelse.

## Teamen

`mottagningen.html` visar personalen i två grupper med teamets tandläkare och
telefonnummer i rubriken. Ordningen i koden är ordningen på sidan. Ska någon
byta team räcker det att flytta hennes `<figure>` till den andra gruppen.

Båda teamen har genomgående **samma** knapp, i samma färg och med samma minsta
bredd. En fylld och en i kontur är den vanliga primär/sekundär-konventionen, men
här hade den sagt att det ena teamet var förstahandsvalet.

## Tillgänglighet

Skip-länk till innehållet, synliga fokusmarkeringar, `aria-current` på aktuell
sida, alt-texter som beskriver vad bilden visar, och kontraster som håller mot
både papper och den mörka fonden. Telefonnummer är `tel:`-länkar och e-post
`mailto:`.

## SEO

Egen `<title>` och beskrivning per sida, canonical, Open Graph, `sitemap.xml`
och `robots.txt`. Varje sida bär `LocalBusiness`/`Dentist`-schema med adress,
telefon, öppettider, geoposition och behandlingar.

## Formulär och karta

Sajten är statisk och har ingen server. Kontaktformuläret öppnar därför
patientens e-postklient med ärendet ifyllt, adresserat till det team man valt.
Ska det i stället skickas från servern: byt ut lyssnaren sist i `site.js` mot en
riktig `<form action="…" method="post">`.

En rad under knappen ber patienten att inte skicka hälsouppgifter via
formuläret. Den bör stå kvar.

Google Maps laddas först när besökaren scrollat fram kartan (`data-karta` i
`kontakt.html`). Det håller både laddtiden och kakorna nere.

## Cache

Bilderna cachas ett år: deras filnamn innehåller bredden (`hero-1280.webp`) och
ändras aldrig i innehåll. CSS och JS har däremot fasta namn, så de cachas inte
alls utan revalideras mot servern. Det kostar en liten villkorlig förfrågan som
svarar 304 när inget ändrats, och gör att en ny design slår igenom direkt i
stället för att besökare sitter kvar på en gammal version.

Länkarna bär ändå `?v=` som extra säkerhet. **Höj siffran i alla HTML-filer när
du ändrar `style.css` eller `site.js`** om du vill vara helt säker på att
besökare med gamla kopior får den nya.

## Köra lokalt

```bash
python -m http.server 5180
```

Öppna sedan `http://localhost:5180`. Ingen installation, inget byggsteg.

## Publicering

Ligger på Netlify med deploy från `main`. Inget byggkommando körs, hela mappen
publiceras som den är. `netlify.toml` sköter cache-headers och snygga adresser
(`/priser` i stället för `/priser.html`).

Adressen ovan är en granskningsadress och är satt till `noindex` i
`netlify.toml`, så att den inte indexeras och konkurrerar med klinikens riktiga
sajt. Den raden tas bort vid skarp lansering, tillsammans med domänbytet i
`sitemap.xml`, canonical och og-taggarna.

---

Foto: Varga Studios. Tandläkarhuset är en del av Praktikertjänst AB.
