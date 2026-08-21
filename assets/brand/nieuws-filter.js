/* Nieuws-pagina: tag-filter (wolkjes) boven de nieuws-kolommen.
   Genereert de filterbalk automatisch uit de tags op de .news-card items,
   zodat de dagelijkse nieuws-cron het filter nooit kan breken.
   - Alleen actief op pagina's met .news-column (de nieuws-pagina)
   - 'Alle' reset; archief (.news-archive) blijft altijd zichtbaar
   - Taalbewust: 'Alle' / 'All' op basis van <html lang> */
(function () {
  'use strict';

  var isEn = (document.documentElement.lang || 'nl').toLowerCase().indexOf('en') === 0;
  var allText = isEn ? 'All' : 'Alle';
  var labelText = isEn ? 'Filter articles by topic' : 'Filter artikelen op onderwerp';

  function cleanTag(t) {
    return t.textContent.replace(/\s+/g, ' ').trim();
  }

  document.querySelectorAll('.news-column').forEach(function (col) {
    var cards = Array.prototype.slice.call(col.querySelectorAll('.news-card'));
    if (cards.length < 2) return;

    // unieke tags uit de kaarten halen
    var tags = [];
    cards.forEach(function (card) {
      var t = card.querySelector('.tag');
      if (t) {
        var name = cleanTag(t);
        if (name && tags.indexOf(name) === -1) tags.push(name);
      }
    });
    if (tags.length < 2) return;

    // filterbalk bouwen
    var bar = document.createElement('div');
    bar.className = 'news-filter';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', labelText);

    var chips = [];
    function makeChip(text, active) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'news-filter-chip' + (active ? ' is-active' : '');
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      b.textContent = text;
      return b;
    }

    var btnAll = makeChip(allText, true);
    bar.appendChild(btnAll);
    chips.push(btnAll);

    tags.forEach(function (name) {
      var b = makeChip(name, false);
      b.addEventListener('click', function () { setFilter(name); });
      bar.appendChild(b);
      chips.push(b);
    });

    function setFilter(name) {
      chips.forEach(function (c) {
        var active = c.textContent === name;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        var t = card.querySelector('.tag');
        var show = name === '' || (t && cleanTag(t) === name);
        card.classList.toggle('is-filtered', !show);
      });
    }

    btnAll.addEventListener('click', function () { setFilter(''); });

    // plaats de balk direct onder het kolom-kopje (h2)
    var h2 = col.querySelector('h2');
    col.insertBefore(bar, h2 ? h2.nextSibling : col.firstChild);
  });
})();
