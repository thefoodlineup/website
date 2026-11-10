/*!
 * The Food Line-up – website scripts
 * https://github.com/thefoodlineup/website
 *
 * Geladen in Webflow via jsDelivr met een vaste versie (zie README).
 * Modules worden per fase toegevoegd: navigatie, animaties, tracking.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    // Modules volgen hier, bijvoorbeeld:
    // initMegaNav();      // Osmo Mega Navigation + TFLU-uitbreidingen
    // initAnimations();   // data-animate / data-stagger / data-counter (GSAP)
    document.documentElement.classList.add('tflu-js');
    if (reduceMotion) document.documentElement.classList.add('tflu-reduced-motion');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
