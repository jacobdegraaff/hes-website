/* ==========================================================================
   Lemnion — Accessibility behavior layer (WCAG 2.2)
   Loaded after inline scripts. Idempotent, defensive, no redesign.
   ========================================================================== */
(function () {
    'use strict';

    /* ── Contact modal: role/aria + focus management ─────────────────── */
    var modal = document.getElementById('contact-modal');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Vrijblijvend contact');

        var closeBtn = modal.querySelector('.contact-modal-close');
        if (closeBtn) closeBtn.setAttribute('aria-label', 'Sluiten');

        var lastFocused = null;

        // When the modal opens, move focus in; when it closes, restore.
        var observer = new MutationObserver(function () {
            var visible = modal.style.display === 'flex';
            if (visible) {
                lastFocused = document.activeElement;
                var focusTarget = closeBtn || modal.querySelector('input, textarea, select, button, a');
                if (focusTarget) focusTarget.focus();
            } else {
                if (lastFocused && document.contains(lastFocused)) {
                    lastFocused.focus();
                }
            }
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['style'] });

        // Keep Tab within the modal while open (focus trap).
        modal.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab' || modal.style.display !== 'flex') return;
            var focusables = modal.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables.length) return;
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });
    }

    /* ====================================================================
       Navigatie-dropdowns
       - Desktop (>1180px): klik op de trigger opent/klapt het mega-menu
         (accordion: één menu tegelijk open; hover doet niets).
       - Mobiel (≤1180px): Nike-stijl drilldown. Tik op een rubriek opent
         een tweede laag met een terug-knop, de rubriekpagina zelf als
         eerste link en daaronder de subpagina's. Geen ▾/▴-driehoekjes;
         een subtiel chevron-rechts (Nike) geeft aan dat er een laag zit.
       ==================================================================== */
    function isMobileNav() { return window.innerWidth <= 1180; }

    var PANEL = document.getElementById('mobile-menu-panel');

    var CHEVRON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.474 18.966L15.44 12 8.474 5.033" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var BACK_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M15.526 5.034 8.56 12l6.966 6.967" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function isEnglish() {
        var l = (document.documentElement.getAttribute('lang') || 'nl').toLowerCase();
        return l.indexOf('en') === 0;
    }

    var mmSub = null;
    var mmList = null;

    function mmBuild() {
        if (!PANEL || mmSub) return;
        mmSub = document.createElement('div');
        mmSub.className = 'mm-sub';
        mmSub.setAttribute('hidden', '');
        var back = document.createElement('button');
        back.type = 'button';
        back.className = 'mm-back';
        back.innerHTML = BACK_SVG + '<span class="mm-back-label"></span>';
        mmSub.appendChild(back);
        mmList = document.createElement('div');
        mmList.className = 'mm-sub-list';
        mmSub.appendChild(mmList);
        PANEL.appendChild(mmSub);

        var setBack = function () {
            back.setAttribute('aria-label', isEnglish() ? 'Back to menu' : 'Terug naar menu');
            back.querySelector('.mm-back-label').textContent = isEnglish() ? 'Back' : 'Terug';
        };
        setBack();
        back.addEventListener('click', mmBack);
    }

    function mmPrepareRows() {
        if (!PANEL) return;
        document.querySelectorAll('.nav-links .nav-dropdown').forEach(function (li) {
            var a = li.querySelector(':scope > a');
            if (!a) return;
            a.setAttribute('aria-haspopup', 'true');
            if (!a.querySelector('.mm-chev')) {
                var s = document.createElement('span');
                s.className = 'mm-chev';
                s.innerHTML = CHEVRON_SVG;
                a.appendChild(s);
            }
        });
    }

    function mmOpen(li) {
        mmBuild();
        var a = li.querySelector(':scope > a');
        if (!a || !mmList || !mmSub) return;
        var catHref = a.getAttribute('href');

        var ul = li.closest('.nav-links');
        if (ul) ul.style.display = 'none';

        mmList.innerHTML = '';
        var cat = a.cloneNode(true);
        cat.removeAttribute('aria-expanded');
        var chev = cat.querySelector('.mm-chev');
        if (chev && chev.parentNode) chev.parentNode.removeChild(chev);
        cat.className = (cat.className || '') + ' mm-cat';
        mmList.appendChild(cat);

        li.querySelectorAll('.nav-dropdown-panel a').forEach(function (sub) {
            if (sub.closest('h4')) return;              // paneel-titel nooit dupliceren
            if (sub.getAttribute('href') === catHref) return; // zelfde pagina als rubriek overslaan
            mmList.appendChild(sub.cloneNode(true));
        });

        a.setAttribute('aria-expanded', 'true');
        mmSub.removeAttribute('hidden');
        if (PANEL.scrollTop) PANEL.scrollTop = 0;
        var back = mmSub.querySelector('.mm-back');
        if (back && back.focus) back.focus({ preventScroll: true });
    }

    function mmBack() {
        mmReset();
    }

    function mmReset() {
        if (!mmSub) return;
        if (!PANEL || !PANEL.contains(mmSub)) return;
        mmSub.setAttribute('hidden', '');
        if (mmList) mmList.innerHTML = '';
        var ul = PANEL.querySelector('.nav-links');
        if (ul) ul.style.display = '';
        if (PANEL.contains(mmSub)) {
            document.querySelectorAll('.nav-links .nav-dropdown.open').forEach(function (li) {
                var a = li.querySelector(':scope > a');
                if (a) a.setAttribute('aria-expanded', 'false');
            });
        }
    }

    function closeMobileMenu() {
        if (!PANEL) return;
        var btn = document.querySelector('.menu-toggle');
        if (PANEL.classList.contains('active')) {
            PANEL.classList.remove('active');
            if (PANEL.style.display) PANEL.style.display = '';
        }
        if (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        }
        var cm = document.getElementById('contact-modal');
        if (!cm || cm.style.display !== 'flex') {
            if (typeof lockScroll === 'function') lockScroll(false);
        }
    }

    /* Desktop: accordion-gedrag (klik togglet altijd, hover doet niets) */
    function closeAllDropdowns(except) {
        document.querySelectorAll('.nav-dropdown.open').forEach(function (li) {
            if (except && li === except) return;
            li.classList.remove('open');
            var a = li.querySelector(':scope > a');
            if (a) a.setAttribute('aria-expanded', 'false');
        });
    }

    document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        link.addEventListener('click', function (e) {
            if (isMobileNav()) {
                e.preventDefault(); // rij opent de tweede laag, navigeert nooit
                mmOpen(this.parentElement);
                return;
            }
            e.preventDefault();
            var li = this.parentElement;
            var wasOpen = li.classList.contains('open');
            closeAllDropdowns();
            var open = !wasOpen;
            li.classList.toggle('open', open);
            this.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    // Klik buiten een dropdown (of ESC) sluit alle open desktop-menu's
    document.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.nav-dropdown')) return;
        closeAllDropdowns();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllDropdowns();
    });

    /* ── Mobiel: drilldown opbouwen en onderhouden ───────────────────── */
    if (PANEL) {
        // Menu telkens op niveau 1 laten openen (ook na sluiten met X/ESC)
        var panelObserver = new MutationObserver(function () {
            mmReset();
            mmPrepareRows();
        });
        panelObserver.observe(PANEL, { attributes: true, attributeFilter: ['class'] });

        // Sluit het menu na een klik op een echte link in het paneel
        // (dekt ook de drilldown-rijen; Contact "#" opent alleen de modal).
        // Uitzondering: de dropdown-trigger zelf (rij met chevron) — die
        // opent de tweede laag en mag het menu niet sluiten.
        PANEL.addEventListener('click', function (e) {
            if (!e.target || !e.target.closest) return;
            var a = e.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href === '#' || href.charAt(0) === '#') return;
            var isTrigger = a.parentElement && a.parentElement.classList &&
                a.parentElement.classList.contains('nav-dropdown');
            if (isTrigger) return;
            closeMobileMenu();
        });
    }

    mmPrepareRows();

    window.addEventListener('resize', function () {
        if (!isMobileNav()) mmReset();
    });
})();
