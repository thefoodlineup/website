/*!
 * The Food Line-up – website scripts
 * https://github.com/thefoodlineup/website
 *
 * Geladen in Webflow via jsDelivr met een vaste versie (zie README). v1.5.5
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

  /* ------------------------------------------------------------------
   * Formulieren -> HubSpot   form[data-hs-form="<formulier-ID>"]
   *
   * De Webflow-formulieren blijven de basis (velden, succes- en foutmelding).
   * Het script vangt het verzenden af en stuurt de velden naar de HubSpot
   * Forms API. Veldnamen in Webflow = interne namen in HubSpot.
   *   [data-error-for="naam"]      foutmelding bij een veld (leeg = verborgen)
   *   [data-show-if="naam=waarde"] blok alleen tonen bij die keuze
   *   [data-form-summary]          samenvatting (offerte), ook in de succesmelding
   *   Meegestuurd: pagina, eerste landingspagina en UTM's van dit bezoek,
   *   de HubSpot-cookie (alleen als die er na toestemming is) en de
   *   nieuwsbrieftoestemming (abonnement 12212794) als het vinkje aan staat.
   * ------------------------------------------------------------------ */
  var HS_PORTAL = '19588880';
  var HS_SUBSCRIPTION = 12212794;
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var MSG = {
    firstname: 'Vul je voornaam in.',
    lastname: 'Vul je achternaam in.',
    email: 'Vul je e-mailadres in.',
    emailBad: 'Dit e-mailadres lijkt niet te kloppen. Bijvoorbeeld: naam@bedrijf.nl',
    phone: 'Vul je telefoonnummer in, dan kunnen we je bellen.',
    phoneBad: 'Dit telefoonnummer lijkt te kort. Bijvoorbeeld: 06 12345678',
    company: 'Vul de naam van je bedrijf in.',
    message: 'Vul je vraag of opmerking in.',
    web_contact_onderwerp: 'Kies een onderwerp.',
    web_type_event: 'Kies het type event.',
    web_aantal_gasten: 'Kies het aantal gasten. Weet je het nog niet? Kies dan ‘Weet ik nog niet’.',
    when: 'Kies een maand, ‘Later’ of ‘Weet ik nog niet’.',
    whenYear: 'Kies in welk jaar je event plaatsvindt.'
  };

  function store(fn) {
    try { return fn(window.sessionStorage); } catch (e) { return null; }
  }

  // Bron van dit bezoek bewaren (alleen voor deze sessie) zodat een formulier
  // drie pagina's later nog weet via welke campagne iemand binnenkwam.
  function rememberVisit() {
    store(function (s) {
      if (!s.getItem('tflu_landing')) s.setItem('tflu_landing', location.href.split('#')[0]);
      var q = new URLSearchParams(location.search);
      if (UTM.some(function (k) { return q.get(k); }) && !s.getItem('tflu_utm')) {
        var o = {};
        UTM.forEach(function (k) { if (q.get(k)) o[k] = q.get(k); });
        s.setItem('tflu_utm', JSON.stringify(o));
      }
    });
  }

  function cookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function errorEl(form, name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }

  function setError(form, name, msg) {
    var el = errorEl(form, name);
    var inputs = $$('[name="' + name + '"]', form);
    if (el) {
      if (!el.id) el.id = 'err-' + (form.getAttribute('data-form') || 'f') + '-' + name;
      el.textContent = msg || '';
    }
    inputs.forEach(function (i) {
      if (i.type === 'radio' || i.type === 'hidden') return;
      i.classList.toggle('is-error', !!msg);
      if (msg) {
        i.setAttribute('aria-invalid', 'true');
        if (el) i.setAttribute('aria-describedby', el.id);
      } else {
        i.removeAttribute('aria-invalid');
      }
    });
    return !msg;
  }

  function checkField(form, input) {
    var name = input.name;
    var v = (input.value || '').trim();
    var msg = '';
    if (input.required && !v) msg = MSG[name] || 'Vul dit veld in.';
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = MSG.emailBad;
    else if (v && input.type === 'tel' && v.replace(/\D/g, '').length < 10) msg = MSG.phoneBad;
    return setError(form, name, msg);
  }

  function validateFields(form, scope) {
    var ok = true;
    var first = null;
    $$('input[required], select[required], textarea[required], input[type="email"], input[type="tel"]', scope || form)
      .forEach(function (i) {
        if (i.offsetParent === null && i.type !== 'hidden') return; // verborgen stap
        if (!checkField(form, i)) { ok = false; first = first || i; }
      });
    if (first) first.focus();
    return ok;
  }

  function initShowIf(form) {
    var blocks = $$('[data-show-if]', form);
    if (!blocks.length) return;
    function update() {
      blocks.forEach(function (b) {
        var rule = b.getAttribute('data-show-if').split('=');
        var field = form.elements[rule[0]];
        var val = '';
        if (field) val = field.value !== undefined ? field.value : '';
        if (field && field.length && !field.tagName) { // RadioNodeList
          val = field.value;
        }
        b.style.display = val === rule.slice(1).join('=') ? '' : 'none';
      });
    }
    form.addEventListener('change', update);
    update();
  }

  // Keuzeknoppen (radio's als chips): actieve stijl bijhouden.
  function initChips(form) {
    function sync() {
      $$('label input[type="radio"]', form).forEach(function (r) {
        var t = r.closest('label').querySelector('span');
        if (t) t.classList.toggle('is-active', r.checked);
      });
    }
    form.addEventListener('change', function (e) {
      if (e.target.type === 'radio') {
        sync();
        setError(form, e.target.name, '');
      }
    });
    sync();
    form._syncChips = sync;
  }

  function collect(form) {
    var fields = [];
    var seen = {};
    var optin = false;
    $$('input, select, textarea', form).forEach(function (i) {
      if (!i.name || i.type === 'submit' || i.disabled) return;
      if (/^(cf-|g-recaptcha|h-captcha)/.test(i.name)) return; // spamcheck van Webflow, niet voor HubSpot
      if (i.type === 'radio' && !i.checked) return;
      if (i.type === 'checkbox') {
        if (i.name === 'web_nieuwsbrief_optin') optin = i.checked;
        if (!i.checked) return;
        fields.push({ name: i.name, value: 'true' });
        return;
      }
      var v = (i.value || '').trim();
      if (!v || seen[i.name]) return;
      seen[i.name] = true;
      fields.push({ name: i.name, value: v });
    });
    var extra = form.getAttribute('data-hs-tracking') === 'off' ? {} : {
      web_aanmeldpagina: location.href.split('#')[0],
      web_eerste_landingspagina: store(function (s) { return s.getItem('tflu_landing'); }) || ''
    };
    var utm = form.getAttribute('data-hs-tracking') === 'off' ? {} :
      (store(function (s) { return JSON.parse(s.getItem('tflu_utm') || '{}'); }) || {});
    UTM.forEach(function (k) { if (utm[k]) extra[k] = utm[k]; });
    Object.keys(extra).forEach(function (k) {
      if (extra[k] && !seen[k]) fields.push({ name: k, value: extra[k] });
    });
    // Nieuwsbriefformulier zonder vinkje: aanmelden = toestemming voor de nieuwsbrief.
    if (form.hasAttribute('data-hs-subscribe')) optin = true;
    return { fields: fields, optin: optin };
  }

  function submitToHubSpot(form) {
    var data = collect(form);
    var consentText = form.getAttribute('data-consent-text') ||
      'Door te verzenden geef je ons toestemming om bovenstaande informatie te verwerken.';
    var payload = {
      fields: data.fields,
      context: { pageUri: location.href.split('#')[0], pageName: document.title },
      legalConsentOptions: {
        consent: { consentToProcess: true, text: consentText }
      }
    };
    var hutk = cookie('hubspotutk');
    if (hutk) payload.context.hutk = hutk;
    if (data.optin) {
      payload.legalConsentOptions.consent.communications = [{
        value: true,
        subscriptionTypeId: HS_SUBSCRIPTION,
        text: 'Ik ga ermee akkoord om ook andere geniaal lekkere berichten te ontvangen van The Food Line-up.'
      }];
    }
    var url = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL + '/' +
      form.getAttribute('data-hs-form');
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(t); });
      return r;
    });
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form || !form.matches || !form.matches('form[data-hs-form]')) return;
    // Webflow's eigen verzending overslaan: wij sturen naar HubSpot.
    e.preventDefault();
    e.stopImmediatePropagation();
    if (form._busy) return;
    if (form._beforeSubmit && !form._beforeSubmit()) return;
    if (!validateFields(form)) return;

    var wrap = form.closest('.w-form') || form.parentNode;
    var done = wrap.querySelector('.w-form-done');
    var fail = wrap.querySelector('.w-form-fail');
    var btn = form.querySelector('[type="submit"]');
    var label = btn ? btn.value : '';
    form._busy = true;
    if (btn) { btn.disabled = true; btn.value = btn.getAttribute('data-wait') || 'Even geduld…'; }
    if (fail) fail.style.display = 'none';

    submitToHubSpot(form).then(function () {
      form.style.display = 'none';
      if (done) {
        done.style.display = 'block';
        var focus = done.querySelector('[tabindex="-1"]') || done;
        if (!focus.hasAttribute('tabindex')) focus.setAttribute('tabindex', '-1');
        focus.focus({ preventScroll: true });
        var top = wrap.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'tflu_form_submit', form_name: form.getAttribute('data-form') || '' });
    }).catch(function (err) {
      if (window.console) console.warn('[tflu] formulier niet verzonden', err);
      if (fail) fail.style.display = 'block';
    }).then(function () {
      form._busy = false;
      if (btn) { btn.disabled = false; btn.value = label; }
    });
  }

  /* Offerte: twee stappen + "wanneer"-keuze (maanden, later, jaar, datum).
     De opmaak komt uit de verborgen voorbeelden in [data-when-templates]. */
  var MN = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  var MNL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus',
    'september', 'oktober', 'november', 'december'];
  var DOW = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function nlDate(v) { var p = v.split('-'); return Number(p[2]) + ' ' + MNL[Number(p[1]) - 1] + ' ' + p[0]; }

  function initQuoteForm(form) {
    var section = form.closest('section') || document;
    var tpl = section.querySelector('[data-when-templates]');
    var whenEl = form.querySelector('[data-when]');
    var steps = $$('[data-form-step]', form);
    if (!whenEl || !tpl || steps.length < 2) return;

    function cls(name) {
      var el = tpl.querySelector('[data-tpl="' + name + '"]');
      return el ? el.className : '';
    }
    var C = {
      months: cls('months'), month: cls('month'), row: cls('row'), chip: cls('chip'),
      reveal: cls('reveal'), date: cls('date-row'), cal: cls('cal'), grid: cls('cal-grid'),
      day: cls('day'), hint: cls('hint')
    };
    // Klassen van de onderdelen lezen we uit de structuur van de voorbeelden.
    function child(name, path) {
      var n = tpl.querySelector('[data-tpl="' + name + '"]');
      path.forEach(function (i) { n = n && n.children[i]; });
      return n ? n.className : '';
    }
    C.main = child('month', [0]);
    C.sub = child('month', [1]);
    C.revealLabel = child('reveal', [0]);
    C.optional = child('reveal', [0, 0]);
    C.calTitle = child('cal', [0]);
    C.dow = child('cal-grid', [0]);
    C.blank = child('cal-grid', [1]);

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var months = [];
    for (var k = 0; k < 12; k++) {
      var d = new Date(now.getFullYear(), now.getMonth() + k, 1);
      months.push({ key: d.getFullYear() + '-' + pad(d.getMonth() + 1), d: d });
    }
    var winEnd = new Date(now.getFullYear(), now.getMonth() + 12, 1);
    var YEARS = [String(now.getFullYear() + 1), String(now.getFullYear() + 2), 'Nog verder'];
    var st = { mo: '', yr: '', lmo: '', date: '' };

    function el(tag, className, text) {
      var n = document.createElement(tag);
      if (className) n.className = className;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function chip(label, on, pick, aria) {
      var b = el('button', C.chip, label);
      b.type = 'button';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (aria) b.setAttribute('aria-label', aria);
      if (on) b.classList.add('is-active');
      b.addEventListener('click', pick);
      return b;
    }
    function monthChip(d, on, pick) {
      var b = el('button', C.month);
      b.type = 'button';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', MNL[d.getMonth()] + ' ' + d.getFullYear());
      if (on) b.classList.add('is-active');
      b.appendChild(el('span', C.main, MN[d.getMonth()]));
      b.appendChild(el('span', C.sub, String(d.getFullYear())));
      b.addEventListener('click', pick);
      return b;
    }
    function reveal(label, optional) {
      var r = el('div', C.reveal);
      var l = el('span', C.revealLabel, label + (optional ? ' ' : ''));
      if (optional) l.appendChild(el('span', C.optional, '(optioneel)'));
      r.appendChild(l);
      return r;
    }
    function set(patch, keepFocus) {
      Object.keys(patch).forEach(function (key) { st[key] = patch[key]; });
      render(keepFocus);
      setError(form, 'when', '');
    }

    function active() {
      var m = months.filter(function (x) { return x.key === st.mo; })[0];
      if (m) return m.d;
      if (st.lmo) { var p = st.lmo.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, 1); }
      return null;
    }

    function outputs() {
      var act = active();
      var yN = st.yr && st.yr !== 'Nog verder' ? Number(st.yr) : null;
      var when = '', zek = '', verw = '';
      if (st.date) { when = nlDate(st.date); zek = 'exact'; verw = st.date; }
      else if (act) { when = MNL[act.getMonth()] + ' ' + act.getFullYear(); zek = 'maand'; verw = iso(act).slice(0, 8) + '15'; }
      else if (yN) { when = 'ergens in ' + yN; zek = 'jaar'; verw = yN + '-07-01'; }
      else if (st.mo === 'later' && st.yr) { when = 'later dan ' + YEARS[1]; zek = 'onbekend'; }
      else if (st.mo === 'unknown') { when = 'datum nog onbekend'; zek = 'onbekend'; }
      var f = form.elements;
      if (f.web_event_datum_zekerheid) f.web_event_datum_zekerheid.value = zek;
      if (f.web_event_periode) f.web_event_periode.value = when;
      if (f.beoogde_event_datum) f.beoogde_event_datum.value = verw;
      return when;
    }

    function render(keepFocus) {
      var focusKey = keepFocus && document.activeElement && whenEl.contains(document.activeElement)
        ? document.activeElement.getAttribute('aria-label') || document.activeElement.textContent : null;
      whenEl.textContent = '';

      var grid = el('div', C.months);
      months.forEach(function (m) {
        grid.appendChild(monthChip(m.d, st.mo === m.key, function () {
          set({ mo: st.mo === m.key ? '' : m.key, yr: '', lmo: '', date: '' }, true);
        }));
      });
      whenEl.appendChild(grid);

      var row = el('div', C.row);
      row.appendChild(chip('Later', st.mo === 'later', function () {
        set({ mo: st.mo === 'later' ? '' : 'later', yr: '', lmo: '', date: '' }, true);
      }));
      row.appendChild(chip('Weet ik nog niet', st.mo === 'unknown', function () {
        set({ mo: st.mo === 'unknown' ? '' : 'unknown', yr: '', lmo: '', date: '' }, true);
      }));
      whenEl.appendChild(row);

      if (st.mo === 'later') {
        var ry = reveal('In welk jaar?');
        var yrow = el('div', C.row);
        YEARS.forEach(function (y) {
          yrow.appendChild(chip(y, st.yr === y, function () { set({ yr: y, lmo: '', date: '' }, true); }));
        });
        ry.appendChild(yrow);
        whenEl.appendChild(ry);

        var yN = st.yr && st.yr !== 'Nog verder' ? Number(st.yr) : null;
        if (yN) {
          var rm = reveal('Weet je de maand al?', true);
          var mg = el('div', C.months);
          for (var i = 0; i < 12; i++) {
            var md = new Date(yN, i, 1);
            if (md < winEnd) continue;
            (function (md) {
              var key = yN + '-' + pad(md.getMonth() + 1);
              mg.appendChild(monthChip(md, st.lmo === key, function () {
                set({ lmo: st.lmo === key ? '' : key, date: '' }, true);
              }));
            })(md);
          }
          rm.appendChild(mg);
          whenEl.appendChild(rm);
        }
      }

      var act = active();
      if (act) {
        var rd = reveal('Weet je de datum al?', true);
        var drow = el('div', C.date);
        var cal = el('div', C.cal);
        var title = MNL[act.getMonth()] + ' ' + act.getFullYear();
        cal.setAttribute('role', 'group');
        cal.setAttribute('aria-label', title);
        cal.appendChild(el('span', C.calTitle, title));
        var cg = el('div', C.grid);
        DOW.forEach(function (w) { cg.appendChild(el('span', C.dow, w)); });
        var y = act.getFullYear(), m = act.getMonth();
        var N = new Date(y, m + 1, 0).getDate();
        var off = (new Date(y, m, 1).getDay() + 6) % 7;
        for (var b = 0; b < off; b++) cg.appendChild(el('span', C.blank));
        for (var n = 1; n <= N; n++) {
          (function (n) {
            var dd = new Date(y, m, n), v = iso(dd), past = dd < today, on = v === st.date;
            var btn = el('button', C.day, String(n));
            btn.type = 'button';
            btn.setAttribute('aria-label', n + ' ' + title);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (on) btn.classList.add('is-active');
            if (past) { btn.classList.add('is-disabled'); btn.disabled = true; }
            else btn.addEventListener('click', function () { set({ date: on ? '' : v }, true); });
            cg.appendChild(btn);
          })(n);
        }
        cal.appendChild(cg);
        drow.appendChild(cal);
        drow.appendChild(el('p', C.hint, st.date
          ? 'Top, dan checken we direct de beschikbaarheid.'
          : 'Nog geen vaste datum? Geen probleem, de maand is genoeg.'));
        rd.appendChild(drow);
        whenEl.appendChild(rd);
      }

      outputs();
      if (focusKey) {
        var again = $$('button', whenEl).filter(function (x) {
          return (x.getAttribute('aria-label') || x.textContent) === focusKey;
        })[0];
        if (again) again.focus({ preventScroll: true });
      }
    }

    function radioVal(name) {
      var r = form.querySelector('[name="' + name + '"]:checked');
      return r ? r.value : '';
    }

    function summary() {
      var et = radioVal('web_type_event');
      var anders = form.elements.web_type_event_anders && form.elements.web_type_event_anders.value.trim();
      if (et === 'Anders' && anders) et = anders;
      var gs = radioVal('web_aantal_gasten');
      var parts = [
        et || '[type event]',
        gs ? (gs.indexOf('Weet') === 0 ? 'aantal gasten nog onbekend' : gs + ' gasten') : '[aantal gasten]',
        outputs() || '[datum]'
      ];
      var text = parts.join(' · ');
      $$('[data-form-summary]', form.closest('.w-form') || form).forEach(function (s) { s.textContent = text; });
      return text;
    }

    function validateStep1() {
      var ok = true;
      if (!setError(form, 'web_type_event', radioVal('web_type_event') ? '' : MSG.web_type_event)) ok = false;
      if (!setError(form, 'web_aantal_gasten', radioVal('web_aantal_gasten') ? '' : MSG.web_aantal_gasten)) ok = false;
      var whenOk = !!st.mo && (st.mo !== 'later' || !!st.yr);
      if (!setError(form, 'when', whenOk ? '' : (st.mo === 'later' ? MSG.whenYear : MSG.when))) ok = false;
      if (!ok) {
        var firstErr = $$('[data-error-for]', steps[0]).filter(function (x) { return x.textContent; })[0];
        if (firstErr) {
          var fs = firstErr.closest('fieldset') || firstErr;
          var target = fs.querySelector('input, button');
          if (target) target.focus();
        }
      }
      return ok;
    }

    function show(n) {
      steps.forEach(function (s) {
        s.style.display = s.getAttribute('data-form-step') === String(n) ? 'flex' : 'none';
      });
      var card = form.closest('.w-form') || form;
      var top = card.getBoundingClientRect().top + window.pageYOffset - 120;
      if (top < window.pageYOffset) window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (n === 2) {
        summary();
        var first = steps[1].querySelector('input:not([type="hidden"]), textarea');
        if (first) first.focus({ preventScroll: true });
      } else {
        var r = steps[0].querySelector('input[type="radio"]:checked') || steps[0].querySelector('input[type="radio"]');
        if (r) r.focus({ preventScroll: true });
      }
    }

    $$('[data-form-next]', form).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (validateStep1()) show(2);
      });
    });
    $$('[data-form-prev]', form).forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); show(1); });
    });
    form.addEventListener('keydown', function (e) {
      // Enter in stap 1 = volgende stap (niet verzenden)
      if (e.key === 'Enter' && steps[0].contains(e.target) && e.target.tagName === 'INPUT') {
        e.preventDefault();
        if (validateStep1()) show(2);
      }
    });
    form._beforeSubmit = function () {
      if (!validateStep1()) { show(1); validateStep1(); return false; }
      summary();
      return true;
    };

    // ?type=congres (vanaf een event-typepagina) kiest meteen het type.
    var pre = new URLSearchParams(location.search).get('type');
    if (pre) {
      $$('[name="web_type_event"]', form).forEach(function (r) {
        if (r.value.toLowerCase() === pre.toLowerCase().replace(/-/g, ' ')) r.checked = true;
      });
      if (form._syncChips) form._syncChips();
    }

    render();
  }

  // Contact: <select> krijgt zijn opties uit data-options="A|B|C".
  function fillSelects(form) {
    $$('select[data-options]', form).forEach(function (s) {
      if (s.options.length > 1) return;
      var ph = s.getAttribute('data-placeholder') || 'Kies een optie';
      s.textContent = '';
      var o0 = new Option(ph, '');
      s.appendChild(o0);
      s.getAttribute('data-options').split('|').forEach(function (v) {
        v = v.trim();
        if (v) s.appendChild(new Option(v, v));
      });
      var want = new URLSearchParams(location.search).get('onderwerp');
      if (want) {
        Array.prototype.forEach.call(s.options, function (o) {
          if (o.value && o.value.toLowerCase().indexOf(want.toLowerCase()) > -1 && !s.value) s.value = o.value;
        });
      }
    });
  }

  // Webflow zet de verzendknop uit tot zijn eigen spamcheck (Turnstile) klaar is.
  // Wij versturen zelf naar HubSpot, dus de knop blijft gewoon bruikbaar.
  function keepSubmitEnabled(form) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    var label = btn.value;
    function fix() {
      if (form._busy) return;
      if (btn.disabled) btn.disabled = false;
      if (btn.classList.contains('w-form-loading')) btn.classList.remove('w-form-loading');
      if (btn.value !== label && !form._busy) btn.value = label;
    }
    fix();
    if (window.MutationObserver) {
      new MutationObserver(fix).observe(btn, { attributes: true, attributeFilter: ['disabled', 'class', 'value'] });
    }
  }

  function initForms() {
    var forms = $$('form[data-hs-form]');
    rememberVisit();
    if (!forms.length) return;
    window.addEventListener('submit', onSubmit, true);
    forms.forEach(function (form) {
      // Webflow zet standaard "Example Text" als placeholder; het ontwerp heeft geen placeholders.
      $$('[placeholder]', form).forEach(function (i) {
        if (/^example text$/i.test(i.getAttribute('placeholder'))) i.removeAttribute('placeholder');
      });
      keepSubmitEnabled(form);
      fillSelects(form);
      initChips(form);
      initShowIf(form);
      if (form.getAttribute('data-form') === 'offerte') initQuoteForm(form);
      // Direct feedback na het verlaten van een veld dat al een fout had.
      form.addEventListener('blur', function (e) {
        var t = e.target;
        if (t && t.name && t.classList && t.classList.contains('is-error')) checkField(form, t);
      }, true);
      form.addEventListener('change', function (e) {
        var t = e.target;
        if (t && t.tagName === 'SELECT' && t.required) checkField(form, t);
      });
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
    initForms();
    // Volgt in blok D: initMegaNav() (Osmo Mega Navigation + TFLU-uitbreidingen)
    // Volgt later: initAnimations() (data-animate / data-stagger / data-counter, GSAP)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
