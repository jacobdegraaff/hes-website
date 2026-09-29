/* ==========================================================================
   Lemnion — Site-wide search (whole site, NL + EN)
   Loads /search-index.json (build-generated from all pages) and filters
   live as the user types. Privacy-friendly: no data leaves the site.
   Dependency-free; idempotent; WCAG-aware (focus, ESC, aria).
   ========================================================================== */
(function () {
    'use strict';

    var modal    = document.getElementById('search-modal');
    var overlay  = document.getElementById('search-overlay');
    var input    = document.getElementById('search-input');
    var resultsEl = document.getElementById('search-results');
    var toggle   = document.getElementById('search-toggle');

    if (!modal || !input || !resultsEl || !toggle) return; // not injected -> no-op

    var INDEX_URL  = '/search-index.json';
    var index      = null;
    var indexLoaded = false;
    var docLang    = (document.documentElement.lang || 'nl').toLowerCase();

    var L = docLang === 'en' ? {
        none: 'No results found for {q}. Try a different term.',
        type: 'Start typing to search the whole site…'
    } : {
        none: 'Geen resultaten voor {q}. Probeer een andere term.',
        type: 'Begin met typen om de hele site te doorzoeken…'
    };

    var closeBtn = document.getElementById('search-close');
    if (closeBtn) closeBtn.setAttribute('aria-label', docLang === 'en' ? 'Close search' : 'Sluiten zoeken');

    /* ── Open / close ─────────────────────────────────────────────────── */
    function closeMobileMenuIfOpen() {
        var m = document.getElementById('mobile-menu-panel');
        var btn = document.querySelector('.menu-toggle');
        if (m && m.classList.contains('active')) {
            m.classList.remove('active');
            if (m.style.display) m.style.display = '';
        }
        if (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    function open() {
        closeMobileMenuIfOpen();
        modal.hidden = false;
        if (overlay) overlay.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        if (typeof window.lockScroll === 'function') window.lockScroll(true);
        document.body.classList.add('search-open');
        loadIndex(function () { if (input) render(input.value); });
        setTimeout(function () { if (input) input.focus(); }, 30);
    }
    function close() {
        modal.hidden = true;
        if (overlay) overlay.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (typeof window.lockScroll === 'function') window.lockScroll(false);
        document.body.classList.remove('search-open');
    }

    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (modal.hidden) open(); else close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) close();
        if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.hidden) open(); else close();
        }
    });

    /* ── Normalisation + index load ───────────────────────────────────── */
    var normCache = {};
    function norm(s) {
        var key = String(s);
        if (Object.prototype.hasOwnProperty.call(normCache, key)) return normCache[key];
        var n = key.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ');
        normCache[key] = n;
        return n;
    }

    function loadIndex(cb) {
        if (indexLoaded) { if (cb) cb(); return; }
        fetch(INDEX_URL, { credentials: 'same-origin' })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (data) { index = data; indexLoaded = true; if (cb) cb(); })
            .catch(function () {
                resultsEl.innerHTML = '<div class="search-hint">Index ' + (docLang === 'en' ? 'unavailable' : 'niet beschikbaar') + '.</div>';
            });
    }

    /* ── Render ───────────────────────────────────────────────────────── */
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function snippet(doc, terms) {
        var c = norm(doc.content);
        var best = c.length, found = -1, i;
        for (i = 0; i < terms.length; i++) {
            var at = c.indexOf(terms[i]);
            if (at !== -1 && at < best) { best = at; found = at; }
        }
        if (found === -1) found = 0;
        var start = Math.max(0, found - 60);
        var end = Math.min(c.length, start + 220);
        return (start > 0 ? '…' : '') + c.slice(start, end).trim() + (end < c.length ? '…' : '');
    }

    function render(q) {
        var trimmed = norm(q).replace(/\s+/g, ' ').trim();
        resultsEl.innerHTML = '';
        if (!trimmed) {
            resultsEl.innerHTML = '<div class="search-hint">' + esc(L.type) + '</div>';
            return;
        }
        if (!index) return;
        var terms = trimmed.split(' ');
        var scored = [], i, j;
        for (i = 0; i < index.length; i++) {
            var d = index[i];
            var hay = norm(d.title + ' ' + d.content);
            var matchesAll = true;
            for (j = 0; j < terms.length; j++) {
                if (hay.indexOf(terms[j]) === -1) { matchesAll = false; break; }
            }
            if (!matchesAll) continue;
            var s = 0;
            var t = norm(d.title), c = norm(d.content);
            for (j = 0; j < terms.length; j++) {
                if (t.indexOf(terms[j]) !== -1) s += 8;   // title match weighs more
                if (c.indexOf(terms[j]) !== -1) s += 2;
            }
            scored.push({ doc: d, s: s });
        }
        scored.sort(function (a, b) { return b.s - a.s || a.doc.title.localeCompare(b.doc.title); });
        scored = scored.slice(0, 8);

        if (!scored.length) {
            resultsEl.innerHTML = '<div class="search-none">' + esc(L.none.replace('{q}', q)) + '</div>';
            return;
        }
        var html = '';
        for (i = 0; i < scored.length; i++) {
            var doc = scored[i].doc;
            html +=
                '<a class="search-result" href="' + esc(doc.url) + '" role="option">' +
                    '<span class="sr-t">' + esc(doc.title) + '<span class="sr-badge">' + esc(doc.lang) + '</span></span>' +
                    '<span class="sr-url">' + esc(doc.url) + '</span>' +
                    '<span class="sr-s">' + esc(snippet(doc, terms)) + '</span>' +
                '</a>';
        }
        resultsEl.innerHTML = html;
        var links = resultsEl.querySelectorAll('.search-result');
        for (i = 0; i < links.length; i++) links[i].addEventListener('click', close);
    }

    input.addEventListener('input', function () {
        loadIndex(function () { render(input.value); });
    });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') e.preventDefault();
    });

    // preload the index in idle time so the first search is instant
    if ('requestIdleCallback' in window) requestIdleCallback(loadIndex);
    else setTimeout(loadIndex, 300);
})();
