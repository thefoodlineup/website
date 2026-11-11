# Changelog

Alle wijzigingen per versie. Nieuwste bovenaan.

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
