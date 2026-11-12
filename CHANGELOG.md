# Changelog

Alle wijzigingen per versie. Nieuwste bovenaan.

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
