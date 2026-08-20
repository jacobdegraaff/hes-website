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

    /* ── Dropdowns: klik togglet altijd (alle apparaten) ─────────────── */
    // Een klik op een dropdown-trigger opent/klapt het submenu en navigeert
    // nooit ('verspringen' voorkomen). De href blijft staan voor SEO/crawlers
    // en voor middenklik/open-in-nieuw-tab. De pagina zelf blijft bereikbaar
    // via de sub-items, footer en gerelateerde links.
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
            e.preventDefault();
            var li = this.parentElement;
            var wasOpen = li.classList.contains('open');
            // accordion: een ander menu openen sluit alle andere
            closeAllDropdowns();
            var open = !wasOpen;
            li.classList.toggle('open', open);
            this.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    // Klik buiten een dropdown (of ESC) sluit alle open menu's
    document.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.nav-dropdown')) return;
        closeAllDropdowns();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllDropdowns();
    });

    /* ── Hero slider dots: accessible name on the radio inputs ────────── */
    var slideNames = ['Energie-onafhankelijk', 'File op het stroomnet', 'Tot 60% subsidie'];
    for (var i = 1; i <= 3; i++) {
        var input = document.getElementById('hs' + i);
        var label = document.querySelector('.hero-dots label[for="hs' + i + '"]');
        if (input && !input.getAttribute('aria-label')) {
            input.setAttribute('aria-label', 'Dia ' + i + ': ' + (slideNames[i - 1] || ''));
        }
        // the dot <label> is a decorative visual indicator; the input carries the name
        if (label) {
            label.setAttribute('aria-hidden', 'true');
            label.removeAttribute('aria-label');
        }
    }
})();
