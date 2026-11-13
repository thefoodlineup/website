# Changelog

Alle wijzigingen per versie. Nieuwste bovenaan.

## [1.28.1] - 2026-11-13

- Formulieren: labels met een leeg for="" (Webflow) worden gerepareerd. Keuzeknoppen bij 'Wat voor event organiseer je?' en 'Hoeveel gasten verwacht je?' zijn weer aan te klikken (blauw met witte tekst), en labels zijn weer gekoppeld aan hun veld (klik op label = focus, schermlezers).

## [1.28.0] - 2026-11-13

- Deel dit verhaal: kopieerknop toont 'Link gekopieerd' (navy labeltje, gele vink); op telefoon/tablet opent dezelfde knop het deelmenu van het toestel.
- Aanmeldblok in het artikel alleen bij stories vanaf 300 woorden (onderaan staat al 'Nog meer zin in eten?').

## [1.27.3] - 2026-11-13

- Aanmeldblok in stories: e-mailveld even hoog als de knop (56px). Webflow: ruimte tussen veld en 'Je kunt je altijd weer afmelden' (signup_note margin-top 0.875rem).

## [1.27.2] - 2026-11-13

- Stories: 'Lees het verhaal' bij de uitgelichte story krijgt bij hover dezelfde onderstreping als de andere tekstlinks, alleen onder de tekst.

## [1.27.1] - 2026-11-13

- FAQ: na zoeken of filteren blijft de plakkende linkerkolom (met zoekveld) onder de navigatie staan; de vragenkolom krijgt minimaal de hoogte van de linkerkolom en de lijst scrolt terug naar boven als je lager op de pagina stond.

## [1.27.0] - 2026-11-13

- Vacature: 'Solliciteer via e-mail' en het mailadres in de sollicitatietekst krijgen het onderwerp 'Sollicitatie: [titel vacature]'.

## [1.26.2] - 2026-11-13

- Vacaturerij: pijl in het rondje schuift niet meer op bij hover; alleen het rondje kleurt wit met navy pijl.

## [1.26.1] - 2026-11-13

- Vacaturerij: geen lichter vlak meer; in plaats daarvan tekent de scheidingslijn onder de rij geel in van links naar rechts (zoals de onderstreping bij links), titel geel, rondje wit.

## [1.26.0] - 2026-11-13

- Vacaturerij (Werken bij): bij hover schuift een lichter navy vlak van links over de hele rij en wordt de titel geel; het rondje vult wit met een navy pijl die iets opschuift. Bij minder beweging alleen de kleurwissel.

## [1.25.1] - 2026-11-12

- Ankerlinks: positie zonder de tijdelijke verschuiving van de inschuif-animatie; iets meer ruimte onder de navigatie (64px desktop, 32px mobiel).

## [1.25.0] - 2026-11-12

- Ankerlinks binnen de pagina scrollen naar het begin van het blok (label boven de kop meegerekend), met ruimte onder de vaste navigatie. Bijv. 'Wat is B Corp?' op Impact.

## [1.24.0] - 2026-11-12

- Line-up: inforegel via schuingedrukte regel, 'Naam — omschrijving' met naam vet, vervolgregels onder een gang ingesprongen, en lijsten met alleen namen (meer dan 6) compact in twee kolommen.

## [1.23.1] - 2026-11-12

- Line-up: gang-labels in navy in plaats van donkeroranje (geen nieuwe merkkleur).

## [1.23.0] - 2026-11-12

- Line-up op case-detail: menu-items met meerdere regels (Shift+Enter) krijgen een metaregel en per gang een label (Amuse, Voor, Hoofd, Dessert) naast het gerecht.
- Labels met wieber: alinea in het label zonder marge, zodat wieber en tekst op één lijn staan (o.a. oproepblok 'Jouw event').

## [1.22.0] - 2026-11-12

- Kruimelpad: op desktop 36px tot de kop (was 24px), vloeiend aflopend naar de mobiele afstand. Geldt op alle pagina's met een kruimelpad.

## [1.21.0] - 2026-11-12

- Onze aanpak, 'Onze belofte': alleen een oranje vink van 22px zonder rondje, tekst 500 en vloeiend 17→18px, rijen 13→16px (UI-design).

## [1.20.2] - 2026-11-12

- Ruimtetabel en 'Geschikt voor' vloeiend tussen mobiel en desktop volgens het UI-design: zaalnaam 17→19px, aantal 24→28px, rij-padding 14→18px, lijsttekst 17→18px. Het vinkje blijft 32×32.

## [1.20.1] - 2026-11-12

- 'Geschikt voor'-vinkje is echt vierkant (2rem × 2rem, 32 px bij standaard lettergrootte); de oude flex-basis van 24px maakte het smaller.

## [1.20.0] - 2026-11-12

- Locatiedetail, ruimtetabel zoals het UI-design: aantal in Anton (groot, navy), 'personen' klein ernaast, zaalnaam iets groter, lijn onder de kop en onder de laatste rij.
- Locatiedetail 'Geschikt voor': navy vierkantje met witte vink in plaats van een oranje rondje.

## [1.19.0] - 2026-11-12

- Pijl naast een titel (locatiekaarten, casekaarten, eventtegels) zit vast aan het laatste woord: bij lange titels valt de pijl niet meer los onder de titel.
- Locatiekaarten (Webflow-stijl): capaciteit staat onderaan de kaart, zodat die regel in elke rij op één lijn staat.

## [1.18.3] - 2026-11-12

- Stapnummers (Onze aanpak, 'This is how we roll'): geen kleurwissel meer bij hover; de rondjes en cijfers staan stil.

## [1.18.2] - 2026-11-12

- Chips (filters op Cases/Stories/Locaties en 'Ook voor' op eventtype-pagina's): bij hover navy achtergrond met witte tekst.

## [1.18.0] - 2026-11-12

- Knoppen op een donkere sectie (bijv. 'Dit kun je verwachten' op Event catering): bij hover een witte vulling met navy tekst en pijl, zoals in het UI-design. Op lichte secties blijft het navy met wit.
- FAQ: vragen klappen soepel open en dicht (hoogte en tekst lopen mee, 0,45 s), het plusje draait mee naar een kruisje en terug; in één lijst staat één vraag open.

## [1.17.0] - 2026-11-12

- Laatste losse links in het hover-systeem: terug-links (story, vacature) krijgen de lijn onder de tekst en de pijl 4px terug; deelknoppen worden oranje zoals de social-knoppen; de pijlknop van een vacaturerij keert om naar wit; belknop in het offerteformulier krijgt de lijn alleen onder het nummer; losse tekstlinks worden oranje (op donker: geel).

## [1.16.1] - 2026-11-12

- Event-type-kaarten (Event catering): bij hover groeit een lijn onder 'Meer info' (zoals bij de megamenukaarten en tekstlinks), naast de beeldzoom en de pijl.
- Cases-slider: 'Alle cases bekijken' staat op dezelfde middellijn als de teller.

## [1.16.0] - 2026-11-12

- Casekaarten: bij hover verschijnt een pijl rechts van de titel (titelkleur, geen achtergrond), samen met de beeldzoom.
- Cases-slider: na loslaten loopt de slider zacht uit naar de dichtstbijzijnde kaart (ease-out) in plaats van te verspringen.
- Knoppen in lichte secties: bij hover op de navy vulling zijn tekst en pijl wit (was lichtblauw, zelfde kleur als de sectie).

## [1.15.1] - 2026-11-12

- Footer-credit: kleinere afstand tussen "Website door" en het NorthFifty-logo; logo zelf in de verhoudingen van de NorthFifty-huisstijl (beeldmerk op kaphoogte, kleinere afstand tot het woordmerk, niet meer afgesneden).
- Homepage-quote: bedrijfsnaam zonder persoonsnaam krijgt hetzelfde gewicht als de naam.

## [1.15.0] - 2026-11-12

- Cases-slider (en andere galerijen): slepen met de muis (grab), pijlen half doorzichtig en niet klikbaar als je niet verder kunt, teller toont het bereik van de zichtbare kaarten zoals in het UI-design ("01–03 / 05").
- Homepage-quote komt uit het CMS: de case met "Quote op homepage" aan levert quote, naam, functie en bedrijf; staat er niets aan, dan verdwijnt het blok.
- Eventtegels: pijl zonder achtergrond.
- Contactlinks (telefoon, e-mail): hoverlijn alleen onder de tekst, icoon staat stil.
- Footer: klikbare tekst (menu, contact, juridisch, credit) wordt geel bij hover.

## [1.14.0] - 2026-11-12

- Blok F, beweging: één hover-systeem volgens het UI-design (schuine vulling op knoppen, groeiende lijn onder tekstlinks, pijl 4px vooruit, trage beeldzoom op kaarten, kaarten zonder beeld 6px omhoog, stapnummers oranje), inkomen bij scrollen per blok en per kaart (kort na elkaar) en tellers voor grote cijfers. Niets beweegt wat bij het laden al in beeld staat; 'minder beweging' zet alles uit.
- Cookietoestemming: bij weigeren of intrekken worden de cookies van die categorie opgeruimd (Analytisch: _ga*; Marketing: _gcl_*, _gac_*, HubSpot, _fbp).

## [1.13.0] - 2026-11-12

- Story's: het aanmeldblok in het artikel is standaard een algemene nieuwsbriefinschrijving (HubSpot-formulier Nieuwsbrief, `data-form="nieuwsbrief-story"`) en staat halverwege het artikel. Een eigen aanmeldblok uit het CMS (kop ingevuld) blijft ongewijzigd.

## [1.12.0] - 2026-11-12

- Story's: zonder datum verdwijnt het losse puntje voor de leestijd.
- Story's: zonder ingevulde leestijd schat het script die uit de artikeltekst (200 woorden per minuut, minimaal 1).

## [1.11.0] - 2026-11-12

- Delen op story's: LinkedIn-link en 'Kopieer de link' werken (met de www-URL); bij kopiëren tijdelijk de class `is-copied`.

## [1.10.0] - 2026-11-12

- SEO: FAQPage-markup (JSON-LD) op pagina's met een FAQ-blok, behalve als er al een FAQPage staat (zoals op /faq).
- Vertaalbaar: tekst die het script zelf toont volgt `<html lang>` (nl of en) via `tr(nl, en)`; data naar HubSpot blijft Nederlands.

## [1.9.0] - 2026-11-11

- Cookiebanner: overgestapt op de componenten van Consent Pro v2 (pagina /cookiebanner, in TFLU-stijl). Eigen formulierafhandeling en voorbeeldmodus verwijderd; alleen focusring, terugvaloptie en het openen van de voorkeuren via links (zonder te navigeren) blijven.

## [1.8.0] - 2026-11-11

- Cookiebanner (Finsweet Consent Pro): voorkeurenformulier wordt nooit door Webflow verstuurd, stijl voor de schakelaars, terugvaloptie zonder Consent Pro en een voorbeeldmodus met `?cookiebanner=preview`.

## [1.7.0] - 2026-11-11

- Mega-navigatie (Osmo Mega Navigation – Directional Hover): uitklappanelen op desktop met hover-intent, richting-animatie en toetsenbordbediening; taalkeuze-dropdown; mobiel burgermenu met schuifpanelen, terugknop en scroll-lock. GSAP 3.13 wordt alleen geladen op pagina's met `[data-menu-wrap]`.

## [1.6.0] - 2026-11-11

- Juridische pagina's: inhoudsopgave met huidige sectie, mobiel uitklapbaar ('Op deze pagina'), zoeken in de algemene voorwaarden met teller en lege melding, één artikel tegelijk open, deeplink naar `#artN` opent dat artikel.

## [1.5.5] - 2026-11-11

- Formulieren: `data-hs-subscribe` geeft nieuwsbrieftoestemming mee zonder vinkje (nieuwsbriefformulier).

## [1.5.4] - 2026-11-11

- Formulieren: verzendknop blijft bruikbaar als Webflow's spamcheck (Turnstile) niet laadt; wij versturen zelf naar HubSpot.

## [1.5.3] - 2026-11-11

- Formulieren: `data-hs-tracking="off"` stuurt geen pagina/UTM-velden mee (voor bestaande HubSpot-formulieren zonder die velden, zoals '6 smaken van 2026').

## [1.5.2] - 2026-11-11

- Standaard-placeholder van Webflow ("Example text") ook in kleine letters en in tekstvakken weg.

## [1.5.1] - 2026-11-11

- Formulieren: spamcheck-velden van Webflow (`cf-turnstile-response` e.d.) gaan niet mee naar HubSpot; standaard-placeholder "Example Text" verdwijnt.

## [1.5.0] - 2026-11-11

- Formulieren naar HubSpot (`form[data-hs-form]`): Webflow-formulieren worden afgevangen en naar de HubSpot Forms API gestuurd. Validatie met foutmeldingen per veld (`data-error-for`), blokken tonen bij een keuze (`data-show-if`), keuzeknoppen als radio's.
- Meegestuurd: pagina, eerste landingspagina en UTM's van het bezoek (sessie), HubSpot-cookie als die er is, nieuwsbrieftoestemming als het vinkje aan staat. `dataLayer`-event `tflu_form_submit`.
- Offerteformulier (`data-form="offerte"`): twee stappen, maand/later/jaar/datum-keuze (`data-when`, opmaak uit `data-when-templates`), samenvatting (`data-form-summary`), `?type=` kiest het type event.
- Contactformulier: `<select data-options="A|B">` vult zijn opties, `?onderwerp=` kiest een onderwerp.

## [1.4.0] - 2026-11-11

- Galerij/slider: optionele voortgangsbalk (`data-gallery-bar`) en teller (`data-gallery-count`, "01 / 05"). Gebruikt door de CMS-gestuurde cases-slider op Home en Event catering.

## [1.3.0] - 2026-11-11

- FAQ-overzicht (`data-faq-index`): vragen per onderwerp gegroepeerd onder een h2, zoeken, onderwerp-knoppen met aantallen, lege staat en `?onderwerp=` in de url. Voegt FAQPage-structured data toe.

## [1.2.1] - 2026-11-11

- FAQ: links naar de pagina waar je al bent verdwijnen uit de antwoorden (bijv. "Bekijk alle locaties" op /locaties), zoals in het UI-design.

## [1.2.0] - 2026-11-11

- Filters: meerdere groepen tegelijk (EN) via `data-filter-field`, en bereik-filters (`data-filter-range` met `data-filter-min` / `data-filter-max`) voor Locaties.
- Komma-tekst als lijst met vinkjes (`data-split-list`), voor "Geschikt voor" op locatie-pagina's.

## [1.1.0] - 2026-11-11

Eerste versie die Webflow laadt. Vervangt de losse inline scripts op de pagina's.

- Filter + meer laden voor Cases en Stories (`data-filter-*`), inclusief `?type=` in de url.
- Horizontale galerij met pijltjes op case-pagina's (`data-gallery-*`).
- Webflow-links met `type="button"` krijgen `role="button"` en werken met toetsenbord.
- Datums `dd.mm.jjjj` worden `dd-mm-jjjj` (`data-date`).
- Eerste FAQ-vraag staat open (`data-faq-list`).
- Offerte-links geven het eventtype mee (`data-offerte-type`).

## [Unreleased]

- Mega-menu (Osmo Mega Navigation + TFLU-uitbreidingen).
- Scroll-animaties en tellers met GSAP.
