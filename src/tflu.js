/*!
 * The Food Line-up – website scripts
 * https://github.com/thefoodlineup/website
 *
 * Geladen in Webflow via jsDelivr met een vaste versie (zie README).
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
   * FAQ: eerste vraag open   [data-faq-list]
   * ------------------------------------------------------------------ */
  function initFaq() {
    $$('[data-faq-list]').forEach(function (list) {
      var first = list.querySelector('details');
      if (first) first.setAttribute('open', '');
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
   * Filter + meer laden (Cases, Stories)
   *
   *   [data-filter-group="naam"]            knoppen met [data-filter="waarde"]
   *                                         (alle / alles = alles tonen)
   *   [data-filter-list="naam"]             lijst; elk kind is een item
   *        data-filter-page="9"             items per keer (0 = alles)
   *        data-filter-page-mobile="6"      idem op mobiel
   *   [data-filter-key]                     in elk item: tekst om op te filteren
   *   [data-filter-count="naam"]            telling, data-noun-one / data-noun-many
   *   [data-filter-shown="naam"]            "6 van 12 stories"
   *   [data-filter-more="naam"]             meer-knop (wrapper wordt verborgen)
   *        [data-filter-more-label]         tekst, data-template="Toon meer cases ({rest})"
   *   [data-filter-empty="naam"]            lege staat (display: flex)
   *   [data-filter-reset="naam"]            terug naar alles
   *   ?type=waarde in de url kiest meteen een filter.
   * ------------------------------------------------------------------ */
  function initFilters() {
    $$('[data-filter-list]').forEach(function (list) {
      var name = list.getAttribute('data-filter-list');
      var q = function (attr) { return document.querySelector('[' + attr + '="' + name + '"]'); };
      var group = q('data-filter-group');
      var chips = group ? $$('[data-filter]', group) : [];
      var items = Array.prototype.slice.call(list.children);
      var count = q('data-filter-count');
      var shown = q('data-filter-shown');
      var more = q('data-filter-more');
      var empty = q('data-filter-empty');
      var reset = q('data-filter-reset');
      var wrap = list.closest('.w-dyn-list') || list;
      var current = 'alle';
      var limit;

      function perPage() {
        var p = parseInt(list.getAttribute(mobile.matches ? 'data-filter-page-mobile' : 'data-filter-page'), 10);
        if (isNaN(p)) p = parseInt(list.getAttribute('data-filter-page'), 10);
        return p > 0 ? p : Infinity;
      }
      function isAll(v) { return v === 'alle' || v === 'alles' || v === '*' || v === ''; }
      function key(item) {
        var k = item.querySelector('[data-filter-key]');
        return k ? k.textContent.trim().toLowerCase() : '';
      }
      function noun(el, n) {
        return n + ' ' + (n === 1 ? el.getAttribute('data-noun-one') || '' : el.getAttribute('data-noun-many') || '');
      }

      function render() {
        var match = items.filter(function (i) { return isAll(current) || key(i) === current; });
        var visible = Math.min(limit, match.length);
        items.forEach(function (i) { i.style.display = 'none'; });
        match.forEach(function (i, n) { if (n < limit) i.style.display = ''; });
        wrap.style.display = match.length ? '' : 'none';
        if (empty) empty.style.display = match.length ? 'none' : 'flex';
        if (count) count.textContent = noun(count, match.length).trim();
        if (shown) shown.textContent = visible + ' van ' + noun(shown, match.length).trim();
        if (more) {
          var rest = match.length - visible;
          var holder = more.parentElement && more.parentElement.children.length === 1 ? more.parentElement : more;
          holder.style.display = rest > 0 ? '' : 'none';
          var label = more.querySelector('[data-filter-more-label]');
          var tpl = label && label.getAttribute('data-template');
          if (tpl) label.textContent = tpl.replace('{rest}', rest);
        }
      }

      function pick(chip) {
        current = (chip.getAttribute('data-filter') || 'alle').toLowerCase();
        limit = perPage();
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      }

      chips.forEach(function (c) {
        c.addEventListener('click', function (e) { e.preventDefault(); pick(c); });
      });
      if (reset) reset.addEventListener('click', function (e) { e.preventDefault(); if (chips[0]) pick(chips[0]); });
      if (more) more.addEventListener('click', function (e) { e.preventDefault(); limit += perPage(); render(); });
      if (mobile.addEventListener) mobile.addEventListener('change', function () { limit = perPage(); render(); });

      limit = perPage();
      var fromUrl = new URLSearchParams(window.location.search).get('type');
      var start = fromUrl && chips.filter(function (c) {
        return (c.getAttribute('data-filter') || '').toLowerCase() === fromUrl.toLowerCase();
      })[0];
      if (start) pick(start); else render();
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

  function init() {
    document.documentElement.classList.add('tflu-js');
    if (reduceMotion) document.documentElement.classList.add('tflu-reduced-motion');
    initLinkButtons();
    initDates();
    initFaq();
    initOfferteLinks();
    initFilters();
    initGalleries();
    // Volgt in blok D: initMegaNav() (Osmo Mega Navigation + TFLU-uitbreidingen)
    // Volgt later: initAnimations() (data-animate / data-stagger / data-counter, GSAP)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
