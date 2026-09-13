# Tandläkarhuset Östersund: hårdkodad webbplats

Statisk sajt (HTML, CSS, en liten JS-fil). Ingen byggkedja, inget ramverk,
inga beroenden. Ladda upp mappen som den är på vilket webbhotell som helst.

Ersätter Wix-bygget (`callesassi.wixstudio.com/my-site-1`). Samma innehåll,
samma bilder, samma design, men mobilanpassningen är skriven för hand i
stället för att kämpas fram i Wix redigerare.

---

## Var sajten ligger

| | |
|---|---|
| **Granskningsadress** | https://tandlakarhuset.blomstrande.net |
| Netlify-adress | https://tandlakarhuset.netlify.app |
| Repo | https://github.com/callesassi-netizen/tandlakarhuset |
| Netlify-projekt | `tandlakarhuset`, teamet Blomstrande Digitalt Innehåll |

Netlify bygger om automatiskt vid varje push till `main`. Inget byggkommando
körs, hela mappen publiceras som den är (`netlify.toml`).

**Granskningsadressen är satt till `noindex`** i `netlify.toml`, så Google inte
indexerar den och låter den konkurrera med kundens riktiga sajt. Den raden ska
bort vid skarp lansering, tillsammans med domänbytet nedan.

## Sidor

| Fil | Sida | URL i Wix idag |
|---|---|---|
| `index.html` | Hem | `/` |
| `mottagningen.html` | Mottagningen och teamet | `/mottagningen` |
| `tandvard.html` | Tandvård & behandlingar | `/tandvard-behandlingar` |
| `barn-och-ungdom.html` | Barn & ungdom | `/barn-och-ungdom` |
| `tandhygienist.html` | Tandhygienist | `/tandhygienisten` |
| `priser.html` | Priser & ersättningar | `/priser-och-ersattningar` |
| `kontakt.html` | Kontakt | `/kontakta-oss` |
| `404.html` | Sidan finns inte | (ny) |

`robots.txt` och `sitemap.xml` ligger i roten. Byt domänen i `sitemap.xml`,
i `<link rel="canonical">` och i `og:`-taggarna när adressen är bestämd -
just nu står `https://www.tandlakarhuset.com/` överallt.

## Mappar

```
assets/css/style.css     hela designsystemet, en fil
assets/js/site.js        mobilmeny, scroll-reveal, formulär, lazy karta
assets/img/              bilder i flera bredder, WebP + JPG, samt logga och ikoner
```

## Designsystemet

Färger, typsnitt och mått ligger som CSS-variabler högst upp i `style.css`.
Ändrar du en variabel slår det igenom på hela sajten.

- **Rubriker:** Instrument Serif (fallback Georgia)
- **Brödtext:** Manrope (fallback Helvetica/Arial)
- **Teal** `#179B93` · **djup teal** `#0F5F5A` · **mörk fond** `#0C302E` ·
  **papper** `#FBFAF7` · **dis** `#EEF4F3`
- Inga rundade hörn, inga skuggor, hårstreck i stället. Versaletiketter i
  teal med stor teckenmellanrum. 68 × 1 px streck under rubriker.

Typografin är fluid (`clamp()`), så den skalar steglöst mellan mobil och
desktop utan brytpunktshopp.

## Bredderna

Sidan har medvetet **fyra bredder** i stället för en. Att allt ligger på samma
linje gör en sida stel; variationen ger den rytm.

| Klass | Bredd | Används till |
|---|---|---|
| `.wrap .wrap--smal` | 1000 px | texttunga partier: historien, "Ditt första besök", "Så fungerar kostnaden" |
| `.wrap` | 1280 px | standard: sidhuvuden, kontaktkort, mörka band |
| `.wrap .wrap--bred` | 1560 px | rutnät: korten på startsidan, personrutnätet, behandlingarna, sidfoten |
| `.halvbleed` | hela skärmen | text på ramens linje, bilden fortsätter ut till kanten |

Halvbleed används bara där sektionen har en **egen bakgrundsfärg** (Implantat på
Tandvård, Tandlossning på Tandhygienist). Utan den ramen ser bilden ut att rinna
ut ur sidan i stället för att vara ett medvetet val.

`.halvbleed--hoger` lägger bilden till höger, `.halvbleed--vanster` till
vänster. Texten står alltid på samma vänsterlinje som en vanlig `.wrap`, vilket
kräver den exakta fönsterbredden: `site.js` sätter `--vw` till
`clientWidth`, eftersom `100vw` räknar med scrollbaren och ger några pixlars fel.

I mobil faller alla fyra ihop till en kolumn med samma marginal.

## Teamet

`mottagningen.html` visar personalen i två grupper, med teamets tandläkare
och telefonnummer i rubriken:

- **Team Charlotte:** Lillemor (receptionist & tandsköterska), Sanna,
  Frida, Anneli, Åsa, Charlotte Lagerfalk Leijon
- **Team Marielle:** Linda, Jenni, Kerstin, Tanja, Tina (receptionist),
  Ida, Maria, Marielle Sinclair

Uniformsfärgerna följer indelningen: Team Marielle bär vinrött, Team
Charlotte grönt och beige.

Ordningen i koden är ordningen på sidan. Ska någon flytta mellan teamen
räcker det att flytta hennes `<figure>` till den andra gruppen.

## Toppbanden

Bandet överst på undersidorna är bredare än bildernas eget format, så
`object-fit: cover` klipper i höjd. Var klippet hamnar sätts per sida med
`--bildlage` på `.toppbild` (`center 22%` när ansiktena sitter högt upp,
`center` för närbilder utan ansikten). Utan det kapades personalens huvuden på
Barn & ungdom.

Bilderna är byggda med samma sak i åtanke: croppen i originalfotot lämnar
tillräckligt med luft ovanför huvudena för att överleva CSS-beskärningen.

## Uppslagen

Sektionerna där en kort rubrik står till vänster om en lång brödtext
("Ditt första besök", "Vad gör en tandhygienist?", "Mycket händer i ett barns
liv", "Patientomhändertagande", "Så fungerar kostnaden") använder klassen
`.uppslag`:

- rubrikspalten är smalare än textspalten, så texten får en läsbar radlängd
- rubriken avslutas med designsystemets 68 px-streck i stället för att bara ta slut
- på desktop är rubrikspalten `position: sticky` och följer med medan texten
  rullar förbi, så spalten aldrig står tom
- där texten är lång (Barn & ungdom) ligger första stycket som ingress i
  rubrikspalten, vilket jämnar ut höjderna

I mobil blir det en vanlig kolumn och sticky stängs av.

## Ersättningsrutorna på Priser

De fyra rutorna under "Ersättningar och betalning" länkar vidare. Målen är
desamma som på gamla tandlakarhuset.com, följda till sin nuvarande adress:

| Ruta | Länk |
|---|---|
| Högkostnadsskydd & garantier | 1177, Rättigheter inom tandvård (Jämtland Härjedalen) |
| Försäkringskassans högkostnadsskydd | forsakringskassan.se, Tandvårdsstöd |
| Allmänt och särskilt tandvårdsbidrag | socialstyrelsen.se, Tandvård |
| Tandvårdskonto & Walley faktura | walley.se |

Den sista är ett byte: gamla sajten pekade på lowell.se, som inte längre har
något om tandvård. Stäm av med kliniken vilken betallösning de använder i dag.

"Om priset" ovanför är ett numrerat rutnät i samma form som "Övriga
behandlingar" på Tandvård, inte en radlista. Sista cellen (`.lista-atgard`) är
mörk och länkar till Tandpriskollen, så knappen får en naturlig plats i rutnätet
i stället för att hänga löst under det. Sidan har också ett eget toppband
(väntrummet). Utan det var Priser den enda undersidan helt utan bild.

## Mottagningen

De tre textblocken efter personrutnätet har var sin form, så de inte läser som
tre likadana stycken i rad:

1. **Patientomhändertagande:** text till vänster, bild på instrumenten i
   sterilen ut mot högerkanten (halvbleed på dis-fond)
2. **Ägarskap:** rubriken över, texten i två spalter under
3. **Vår historia:** tidslinje

## Mobil

- Meny under 1040 px blir hamburgare med helskärmsmeny.
- Radbrytningar som bara ska gälla i desktop skrivs `<br class="d">`
  **med ett mellanslag före**. I mobil döljs taggen och mellanslaget håller
  isär orden. (Det var precis det som gick sönder i Wix.)
- Teamrutnätet går 4 → 3 → 2 kolumner. Två kolumner i mobil i stället för en
  gör teamsidan hälften så lång.
- `prefers-reduced-motion` stängs av all rörelse.

## Bilder

Varje bild finns i flera bredder som WebP (modernt) och JPG (fallback),
kopplade med `srcset`/`sizes`. Webbläsaren hämtar bara den storlek den
behöver, så en mobil laddar ungefär 150 kB bilder på startsidan.

Alla bilder är byggda direkt ur Varga Studios originalfiler i full
upplösning, i samma beskärningar som Wix-sajten använder.

**Lägga till en bild:** spara den i `assets/img/` i två eller tre bredder
(namn-480.webp, namn-960.webp …) och kopiera ett befintligt `<picture>`-block.

## Kontaktformuläret

Sajten är statisk och har ingen server, så formuläret öppnar patientens
e-postklient med ärendet ifyllt (`site.js`, sist i filen). Ska det skickas
från servern i stället: byt ut lyssnaren mot en riktig
`<form action="…" method="post">`.

En rad under knappen ber patienten att inte skicka hälsouppgifter via
formuläret. Den bör stå kvar.

## Kartan

Google Maps laddas först när besökaren scrollat fram den (`data-karta`
i `kontakt.html`). Det håller både laddtiden och kakorna nere.

## Att göra innan publicering

1. **Bekräfta med kliniken** vilket team som har vilka öppettider. De två
   uppsättningarna är härledda ur ordningen på den gamla sajten.
2. **Domän.** Byt adress i `sitemap.xml`, i `<link rel="canonical">` och i
   `og:`-taggarna, och ta bort `X-Robots-Tag` ur `netlify.toml`.
3. **Loggan i vektor** (AI/EPS/PDF) om kliniken har den. Nuvarande SVG är
   vektoriserad ur en 361 × 81 px PNG; texten är perfekt, men byggnadsmärket
   håller bara till ungefär 2–3× sin storlek.
4. **Tandvårdskontot.** Rutan "Tandvårdskonto & Walley faktura" pekar på
   walley.se; gamla sajtens länk gick till lowell.se, som inte längre nämner
   tandvård. Fråga kliniken vilken lösning som gäller i dag.

---

Foto: Varga Studios. Tandläkarhuset är en del av Praktikertjänst AB.
