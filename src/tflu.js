/*!
 * The Food Line-up – website scripts
 * https://github.com/thefoodlineup/website
 *
 * Geladen in Webflow via jsDelivr met een vaste versie (zie README). v1.2.1
 * Elke module zoekt zijn eigen data-attributen en doet niets als die niet op de pagina staan.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 767px)');

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------
   * Knoppen zonder href (Webflow-links met type="button")
   * Maakt ze bereikbaar met toetsenbord en schermlezer.
   * ------------------------------------------------------------------ */
  function initLinkButtons() {
    $$('a[type="button"]').forEach(function (a) {
      a.setAttribute('role', 'button');
      if (!a.hasAttribute('tabindex')) a.tabIndex = 0;
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') e.preventDefault();
      });
      a.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          a.click();
        }
      });
    });
  }

  /* ------------------------------------------------------------------
   * Datums: 11.11.2026 -> 11-11-2026   [data-date]
   * ------------------------------------------------------------------ */
  function initDates() {
    $$('[data-date]').forEach(function (el) {
      var t = el.textContent.trim();
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(t)) el.textContent = t.replace(/\./g, '-');
    });
  }

  /* ------------------------------------------------------------------
   * FAQ   [data-faq-list]
   *   - eerste vraag open
   *   - links naar de pagina waar je al bent verdwijnen uit de antwoorden:
   *     staat de link aan het eind van een alinea ("Benieuwd naar ...?
   *     Bekijk alle locaties."), dan valt die slotzin (+ inleidende vraag) weg;
   *     staat hij midden in een zin, dan blijft alleen de tekst over.
   * ------------------------------------------------------------------ */
  function samePage(a) {
    var p = function (s) { return s.replace(/\/+$/, '') || '/'; };
    return a.hostname === location.hostname && p(a.pathname) === p(location.pathname);
  }

  function stripSelfLink(a) {
    var par = a.parentNode;
    var after = '';
    for (var n = a.nextSibling; n; n = n.nextSibling) after += n.textContent;
    if (/^[\s.!]*$/.test(after)) {
      // Link sluit de alinea af: verwijder de slotzin(nen) vanaf de laatste zinsgrens.
      var before = '';
      for (var m = a.previousSibling; m; m = m.previousSibling) {
        if (m.nodeType !== 3) { before = null; break; }
        before = m.textContent + before;
      }
      if (before !== null) {
        var cut = before.replace(/\s+$/, '');
        var lead = cut.match(/^([\s\S]*[.!])\s+[^.!?]*\?$/); // inleidende vraag meenemen
        var keep = lead ? lead[1] : (cut.match(/^([\s\S]*[.!?])\s+[^.!?]*$/) || [, ''])[1];
        while (par.firstChild) par.removeChild(par.firstChild);
        if (keep) par.appendChild(document.createTextNode(keep));
        else if (par.parentNode) par.parentNode.removeChild(par);
        return;
      }
    }
    par.replaceChild(document.createTextNode(a.textContent), a);
  }

  function initFaq() {
    $$('[data-faq-list]').forEach(function (list) {
      var first = list.querySelector('details');
      if (first) first.setAttribute('open', '');
      $$('a[href]', list).filter(samePage).forEach(stripSelfLink);
    });
  }

  /* ------------------------------------------------------------------
   * Offerte-links met voorgekozen type   [data-offerte-type="congres"]
   * ------------------------------------------------------------------ */
  function initOfferteLinks() {
    $$('[data-offerte-type]').forEach(function (a) {
      var v = a.getAttribute('data-offerte-type');
      if (v && a.href) a.href = a.href.split('?')[0] + '?type=' + encodeURIComponent(v);
    });
  }

  /* ------------------------------------------------------------------
   * Filter + meer laden (Cases, Stories, Locaties)
   *
   *   [data-filter-group="naam"]            knoppen met [data-filter="waarde"] (alle / alles = alles)
   *        data-filter-field="plaats"       optioneel: welk [data-filter-key] deze groep leest
   *                                         Meerdere groepen met dezelfde naam werken samen (EN).
   *   knop met data-filter-range="150-500"  filtert op een bereik i.p.v. tekst
   *   [data-filter-list="naam"]             lijst; elk kind is een item
   *        data-filter-page="9"             items per keer (0 = alles)
   *        data-filter-page-mobile="6"      idem op mobiel
   *   [data-filter-key] / [data-filter-key="plaats"]   in elk item: tekst om op te filteren
   *   [data-filter-min] / [data-filter-max]            in elk item: getallen voor bereik-filters
   *   [data-filter-count="naam"]            telling, data-noun-one / data-noun-many
   *   [data-filter-shown="naam"]            "6 van 12 stories"
   *   [data-filter-more="naam"]             meer-knop
   *        [data-filter-more-label]         tekst, data-template="Toon meer cases ({rest})"
   *   [data-filter-empty="naam"]            lege staat (display: flex)
   *   [data-filter-reset="naam"]            alles terug naar "alle"
   *   ?type=waarde in de url kiest meteen een filter in de eerste groep.
   * ------------------------------------------------------------------ */
  function initFilters() {
    $$('[data-filter-list]').forEach(function (list) {
      var name = list.getAttribute('data-filter-list');
      var q = function (attr) { return document.querySelector('[' + attr + '="' + name + '"]'); };
      var groups = $$('[data-filter-group="' + name + '"]').map(function (el) {
        return { el: el, field: el.getAttribute('data-filter-field'), chips: $$('[data-filter]', el), chip: null };
      });
      var items = Array.prototype.slice.call(list.children);
      var count = q('data-filter-count');
      var shown = q('data-filter-shown');
      var more = q('data-filter-more');
      var empty = q('data-filter-empty');
      var reset = q('data-filter-reset');
      var wrap = list.closest('.w-dyn-list') || list;
      var limit;

      function perPage() {
        var p = parseInt(list.getAttribute(mobile.matches ? 'data-filter-page-mobile' : 'data-filter-page'), 10);
        if (isNaN(p)) p = parseInt(list.getAttribute('data-filter-page'), 10);
        return p > 0 ? p : Infinity;
      }
      function isAll(v) { return v === 'alle' || v === 'alles' || v === '*' || v === ''; }
      function text(item, sel) {
        var el = item.querySelector(sel);
        return el ? el.textContent.trim().toLowerCase() : '';
      }
      function num(item, attr) {
        var el = item.hasAttribute(attr) ? item : item.querySelector('[' + attr + ']');
        if (!el) return NaN;
        var v = el.getAttribute(attr);
        return parseFloat((v || el.textContent).replace(/[^0-9.-]/g, ''));
      }
      function passes(item, g) {
        if (!g.chip) return true;
        var range = g.chip.getAttribute('data-filter-range');
        if (range) {
          var r = range.split('-').map(parseFloat);
          var lo = isNaN(r[0]) ? 0 : r[0];
          var hi = isNaN(r[1]) ? Infinity : r[1];
          var min = num(item, 'data-filter-min');
          var max = num(item, 'data-filter-max');
          if (isNaN(min)) min = 0;
          if (isNaN(max)) max = Infinity;
          return max >= lo && min <= hi;
        }
        var v = (g.chip.getAttribute('data-filter') || '').toLowerCase();
        if (isAll(v)) return true;
        return text(item, g.field ? '[data-filter-key="' + g.field + '"]' : '[data-filter-key]') === v;
      }
      function noun(el, n) {
        return (n + ' ' + (n === 1 ? el.getAttribute('data-noun-one') || '' : el.getAttribute('data-noun-many') || '')).trim();
      }

      function render() {
        var match = items.filter(function (i) { return groups.every(function (g) { return passes(i, g); }); });
        var visible = Math.min(limit, match.length);
        items.forEach(function (i) { i.style.display = 'none'; });
        match.forEach(function (i, n) { if (n < limit) i.style.display = ''; });
        wrap.style.display = match.length ? '' : 'none';
        if (empty) empty.style.display = match.length ? 'none' : 'flex';
        if (count) count.textContent = noun(count, match.length);
        if (shown) shown.textContent = visible + ' van ' + noun(shown, match.length);
        if (more) {
          var rest = match.length - visible;
          var holder = more.parentElement && more.parentElement.children.length === 1 ? more.parentElement : more;
          holder.style.display = rest > 0 ? '' : 'none';
          var label = more.querySelector('[data-filter-more-label]');
          var tpl = label && label.getAttribute('data-template');
          if (tpl) label.textContent = tpl.replace('{rest}', rest);
        }
      }

      function pick(g, chip, silent) {
        g.chip = chip;
        g.chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        limit = perPage();
        if (!silent) render();
      }

      groups.forEach(function (g) {
        g.chip = g.chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })[0] || g.chips[0] || null;
        g.chips.forEach(function (c) {
          c.addEventListener('click', function (e) { e.preventDefault(); pick(g, c); });
        });
      });
      if (reset) reset.addEventListener('click', function (e) {
        e.preventDefault();
        groups.forEach(function (g) { pick(g, g.chips[0], true); });
        render();
      });
      if (more) more.addEventListener('click', function (e) { e.preventDefault(); limit += perPage(); render(); });
      if (mobile.addEventListener) mobile.addEventListener('change', function () { limit = perPage(); render(); });

      limit = perPage();
      var fromUrl = new URLSearchParams(window.location.search).get('type');
      if (fromUrl && groups[0]) {
        var start = groups[0].chips.filter(function (c) {
          return (c.getAttribute('data-filter') || '').toLowerCase() === fromUrl.toLowerCase();
        })[0];
        if (start) { pick(groups[0], start); return; }
      }
      render();
    });
  }

  /* ------------------------------------------------------------------
   * Horizontale galerij met pijltjes
   *   [data-gallery-track]   scrollende lijst (CSS scroll-snap)
   *   [data-gallery-prev] / [data-gallery-next]
   * ------------------------------------------------------------------ */
  function initGalleries() {
    $$('[data-gallery-track]').forEach(function (track) {
      var section = track.closest('section') || document;
      var prev = section.querySelector('[data-gallery-prev]');
      var next = section.querySelector('[data-gallery-next]');
      function step() {
        var first = track.firstElementChild;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.setAttribute('aria-disabled', track.scrollLeft <= 2 ? 'true' : 'false');
        if (next) next.setAttribute('aria-disabled', track.scrollLeft >= max ? 'true' : 'false');
      }
      function go(dir) {
        track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); go(-1); });
      if (next) next.addEventListener('click', function (e) { e.preventDefault(); go(1); });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ------------------------------------------------------------------
   * Komma-tekst als lijst   [data-split-list]
   *   "Congres, Walking dinner, Feest" -> <ul><li>Congres</li>...</ul>
   *   Styling (vinkjes) via CSS op de pagina.
   * ------------------------------------------------------------------ */
  function initSplitLists() {
    $$('[data-split-list]').forEach(function (el) {
      var parts = el.textContent.split(/[,;\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (parts.length < 1) return;
      var ul = document.createElement('ul');
      ul.setAttribute('role', 'list');
      parts.forEach(function (p) {
        var li = document.createElement('li');
        li.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        ul.appendChild(li);
      });
      el.textContent = '';
      el.appendChild(ul);
    });
  }

  function init() {
    document.documentElement.classList.add('tflu-js');
    if (reduceMotion) document.documentElement.classList.add('tflu-reduced-motion');
    initLinkButtons();
    initDates();
    initFaq();
    initOfferteLinks();
    initFilters();
    initGalleries();
    initSplitLists();
    // Volgt in blok D: initMegaNav() (Osmo Mega Navigation + TFLU-uitbreidingen)
    // Volgt later: initAnimations() (data-animate / data-stagger / data-counter, GSAP)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
