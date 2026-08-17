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

    /* ── Mobile dropdowns: expose state via aria-expanded ─────────────── */
    document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                var open = this.parentElement.classList.toggle('open');
                this.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
        });
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
