# Changelog

Alle wijzigingen per versie. Nieuwste bovenaan.

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
