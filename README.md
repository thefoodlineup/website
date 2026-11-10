# The Food Line-up – website

Eigen code voor [thefoodlineup.nl](https://www.thefoodlineup.nl), gebouwd in Webflow. Webflow laadt deze bestanden via jsDelivr.

Eigenaar: The Food Line-up. Bouw en beheer: NorthFifty (Michiel Hoorn).

## Structuur

```
website/
├── src/
│   ├── tflu.js        Alle eigen JavaScript (navigatie, animaties, tracking-hooks)
│   └── tflu.css       Eigen CSS die niet in Webflow zelf kan (alleen als het nodig is)
├── CHANGELOG.md       Wat er per versie is veranderd
└── README.md
```

Webflow zelf (pagina's, CMS, stijlen) staat niet in deze repo, maar in de Webflow-werkruimte van The Food Line-up.

## Zo laadt Webflow de code

Altijd met een vaste versie, nooit met `@main` of `@latest`:

```html
<script defer src="https://cdn.jsdelivr.net/gh/thefoodlineup/website@v1.0.0/src/tflu.min.js"></script>
```

jsDelivr maakt automatisch de geminificeerde `.min.js`. Een wijziging hier komt pas live als in Webflow een nieuwe versie wordt gekoppeld en de site opnieuw wordt gepubliceerd.

## Werkafspraken

1. Nooit wachtwoorden, API-sleutels, tokens of klantgegevens in deze repo. Hij is openbaar.
2. Elke release krijgt een tag volgens `vMAJOR.MINOR.PATCH` (bijvoorbeeld `v1.2.0`) en een regel in CHANGELOG.md.
3. Eerst testen op de staging-site (webflow.io), daarna de versie in de Webflow-instellingen ophogen en live publiceren.
4. Scripts gebruiken data-attributen als haakjes (`data-animate`, `data-counter`, enz.), geen Webflow-klassen. Zo breekt er niets als een klasse wordt hernoemd.
5. Content staat altijd in de HTML. JavaScript voegt alleen gedrag toe, zodat zoekmachines en AI-crawlers alles kunnen lezen.
6. Respecteer `prefers-reduced-motion`.

## Componenten van derden

- Mega Navigation (Directional Hover) van Osmo (osmo.supply), gebruikt onder de Osmo-licentie.
- GSAP + ScrollTrigger, geladen via de GSAP-integratie van Webflow.
