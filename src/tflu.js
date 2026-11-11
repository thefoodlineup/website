/*!
 * The Food Line-up – website scripts
 * https://github.com/thefoodlineup/website
 *
 * Geladen in Webflow via jsDelivr met een vaste versie (zie README). v1.4.0
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
   *   [data-gallery-bar]     optioneel: voortgangsbalk die meeschuift
   *   [data-gallery-count]   optioneel: "01 / 05"
   * ------------------------------------------------------------------ */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function initGalleries() {
    $$('[data-gallery-track]').forEach(function (track) {
      var section = track.closest('section') || document;
      var prev = section.querySelector('[data-gallery-prev]');
      var next = section.querySelector('[data-gallery-next]');
      var bar = section.querySelector('[data-gallery-bar]');
      var count = section.querySelector('[data-gallery-count]');
      var totalSlides = track.children.length;
      if (count) {
        count.textContent = '';
        var cur = document.createTextNode('01 ');
        var tot = document.createElement('span');
        tot.className = 'cases_count-total';
        tot.textContent = '/ ' + pad2(totalSlides);
        count.appendChild(cur);
        count.appendChild(tot);
      }
      function step() {
        var first = track.firstElementChild;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.setAttribute('aria-disabled', track.scrollLeft <= 2 ? 'true' : 'false');
        if (next) next.setAttribute('aria-disabled', track.scrollLeft >= max ? 'true' : 'false');
        var progress = max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0;
        if (bar && bar.parentElement) {
          bar.style.transform = 'translateX(' + (bar.parentElement.clientWidth - bar.offsetWidth) * progress + 'px)';
        }
        if (count && count.firstChild) {
          var idx = Math.min(totalSlides, Math.round(track.scrollLeft / step()) + 1);
          count.firstChild.textContent = pad2(idx) + ' ';
        }
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
   * FAQ-overzicht met zoeken en onderwerpen   [data-faq-index]
   *   [data-faq-list]      één CMS-lijst met alle vragen (op volgorde)
   *   [data-faq-topic]     in elk item: naam van het onderwerp (verborgen)
   *   [data-faq-search]    zoekveld
   *   [data-faq-cats]      hier komen de onderwerp-knoppen (incl. "Alle vragen")
   *   [data-faq-total]     "19 vragen"
   *   [data-faq-empty]     lege staat, [data-faq-reset] zet alles terug
   *   Vragen worden per onderwerp gegroepeerd onder een h2.
   *   ?onderwerp=slug in de url kiest meteen een onderwerp.
   * ------------------------------------------------------------------ */
  function slugify(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function initFaqIndex() {
    $$('[data-faq-index]').forEach(function (root) {
      var list = root.querySelector('[data-faq-list]');
      if (!list) return;
      var host = list.closest('.w-dyn-list') || list;
      var input = root.querySelector('[data-faq-search]');
      var nav = root.querySelector('[data-faq-cats]');
      var total = root.querySelector('[data-faq-total]');
      var empty = root.querySelector('[data-faq-empty]');
      var reset = root.querySelector('[data-faq-reset]');
      var groups = [];
      var byName = {};
      var items = Array.prototype.slice.call(list.children);
      var current = 'alle';

      items.forEach(function (item) {
        var t = item.querySelector('[data-faq-topic]');
        var name = (t && t.textContent.trim()) || 'Overig';
        if (t) t.parentNode.removeChild(t);
        var g = byName[name];
        if (!g) {
          g = byName[name] = { name: name, slug: slugify(name), items: [] };
          groups.push(g);
        }
        item.removeAttribute('role');
        item._faqText = item.textContent.replace(/\s+/g, ' ').toLowerCase();
        g.items.push(item);
      });

      groups.forEach(function (g) {
        var sec = document.createElement('section');
        sec.className = 'faq-index_group';
        sec.id = g.slug;
        sec.setAttribute('aria-labelledby', 'faq-g-' + g.slug);
        var h = document.createElement('h2');
        h.className = 'faq-index_group-title';
        h.id = 'faq-g-' + g.slug;
        h.textContent = g.name;
        var wrap = document.createElement('div');
        wrap.className = list.className.replace(/\bw-dyn-items\b/, '').trim();
        g.items.forEach(function (i) { wrap.appendChild(i); });
        sec.appendChild(h);
        sec.appendChild(wrap);
        host.parentNode.insertBefore(sec, host);
        g.el = sec;
      });
      host.parentNode.removeChild(host);
      if (empty) empty.parentNode.appendChild(empty);

      var buttons = [];
      function addButton(slug, label, count) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'faq-index_cat';
        b.setAttribute('data-faq-cat', slug);
        var l = document.createElement('span');
        l.textContent = label;
        var c = document.createElement('span');
        c.className = 'faq-index_cat-count';
        c.textContent = count;
        b.appendChild(l);
        b.appendChild(c);
        b.addEventListener('click', function () { current = slug; render(); });
        if (nav) nav.appendChild(b);
        buttons.push(b);
      }
      if (nav) {
        addButton('alle', 'Alle vragen', items.length);
        groups.forEach(function (g) { addButton(g.slug, g.name, g.items.length); });
      }

      function render() {
        var words = input ? input.value.toLowerCase().split(/\s+/).filter(Boolean) : [];
        var shown = 0;
        groups.forEach(function (g) {
          var inCat = current === 'alle' || current === g.slug;
          var any = false;
          g.items.forEach(function (i) {
            var ok = inCat && words.every(function (w) { return i._faqText.indexOf(w) >= 0; });
            i.style.display = ok ? '' : 'none';
            if (ok) { any = true; shown++; }
          });
          g.el.style.display = any ? '' : 'none';
        });
        buttons.forEach(function (b) {
          var on = b.getAttribute('data-faq-cat') === current;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (total) total.textContent = shown === 1 ? '1 vraag' : shown + ' vragen';
        if (empty) empty.style.display = shown ? 'none' : 'flex';
      }

      if (input) {
        input.type = 'search';
        input.addEventListener('input', render);
      }
      if (reset) reset.addEventListener('click', function (e) {
        e.preventDefault();
        current = 'alle';
        if (input) input.value = '';
        render();
      });
      // Structured data (FAQPage) uit dezelfde CMS-inhoud
      if (!document.querySelector('script[data-faq-ld]')) {
        var ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
        items.forEach(function (i) {
          var q = i.querySelector('summary');
          var a = q && q.nextElementSibling;
          if (q && a) ld.mainEntity.push({
            '@type': 'Question', name: q.textContent.trim(),
            acceptedAnswer: { '@type': 'Answer', text: a.textContent.replace(/\s+/g, ' ').trim() }
          });
        });
        var s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-faq-ld', '');
        s.textContent = JSON.stringify(ld);
        document.head.appendChild(s);
      }

      var fromUrl = new URLSearchParams(location.search).get('onderwerp');
      if (fromUrl && byName && groups.some(function (g) { return g.slug === fromUrl; })) current = fromUrl;
      render();
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
    initFaqIndex();
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
