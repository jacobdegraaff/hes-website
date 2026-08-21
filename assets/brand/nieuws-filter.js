/* Nieuws-pagina: tag-filter (wolkjes) boven de nieuws-kolommen.
   Genereert de filterbalk automatisch uit de tags op de .news-card items,
   zodat de dagelijkse nieuws-cron het filter nooit kan breken.
   - Alleen actief op pagina's met .news-column (de nieuws-pagina)
   - 'Alle' reset
   - Bij een filter verschijnen bijpassende 'Ouder nieuws'-items als
     volwaardige kaarten (.news-card--promoted) in hetzelfde format
   - Taalbewust: 'Alle' / 'All' op basis van <html lang> */
(function () {
  'use strict';

  var isEn = (document.documentElement.lang || 'nl').toLowerCase().indexOf('en') === 0;
  var allText = isEn ? 'All' : 'Alle';
  var labelText = isEn ? 'Filter articles by topic' : 'Filter artikelen op onderwerp';

  function cleanTag(t) {
    return t.textContent.replace(/\s+/g, ' ').trim();
  }

  function promoteLi(li, tagText, tagClass) {
    var card = document.createElement('article');
    card.className = 'news-card news-card--promoted';

    var tag = document.createElement('span');
    tag.className = 'tag ' + (tagClass || 'tag-subsidy');
    tag.textContent = tagText;
    card.appendChild(tag);

    var a = li.querySelector('a[data-i18n]') || li.querySelector('a');
    var h3 = document.createElement('h3');
    if (a) {
      var na = document.createElement('a');
      na.href = a.href;
      na.textContent = a.textContent;
      h3.appendChild(na);
    }
    card.appendChild(h3);

    var src = li.querySelector('.archive-source a') || li.querySelector('span a');
    if (src) {
      var p = document.createElement('p');
      p.className = 'source';
      var sa = document.createElement('a');
      sa.href = src.href;
      sa.textContent = (isEn ? 'Source: ' : 'Bron: ') + src.textContent;
      p.appendChild(sa);
      card.appendChild(p);
    }
    return card;
  }

  document.querySelectorAll('.news-column').forEach(function (col) {
    var cards = Array.prototype.slice.call(col.querySelectorAll('.news-card:not(.news-card--promoted)'));
    if (cards.length < 2) return;

    // unieke tags uit de kaarten halen (tekst + data-i18n-sleutel + tag-class)
    var tags = [];
    var tagKeys = {};
    var tagClasses = {};
    cards.forEach(function (card) {
      var t = card.querySelector('.tag');
      if (t) {
        var name = cleanTag(t);
        var key = t.getAttribute('data-i18n') || '';
        var cls = (t.className.match(/tag-[a-z]+/) || ['tag-subsidy'])[0];
        if (name) {
          if (tagKeys[name] === undefined) tagKeys[name] = key;
          if (tagClasses[key] === undefined) tagClasses[key] = cls;
          if (tags.indexOf(name) === -1) tags.push(name);
        }
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

    var archive = col.querySelector('.news-archive');

    function setFilter(name) {
      chips.forEach(function (c) {
        var active = c.textContent === name;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      // opruimen: eerder gepromoveerde archief-items als kaart
      col.querySelectorAll('.news-card--promoted').forEach(function (n) { n.remove(); });
      if (name === '') {
        cards.forEach(function (card) { card.classList.remove('is-filtered'); });
        if (archive) archive.style.display = '';
        return;
      }
      // kaarten filteren
      var lastVisible = null;
      cards.forEach(function (card) {
        var t = card.querySelector('.tag');
        var show = t && cleanTag(t) === name;
        card.classList.toggle('is-filtered', !show);
        if (show) lastVisible = card;
      });
      // archief: blok verbergen, bijpassende items promoveren naar kaart
      if (archive) archive.style.display = 'none';
      col.querySelectorAll('.news-archive li').forEach(function (li) {
        var key = li.getAttribute('data-tag') || '';
        if (key && tagKeys[name] === key) {
          var card = promoteLi(li, name, tagClasses[key]);
          if (lastVisible) lastVisible.insertAdjacentElement('afterend', card);
          else if (archive) archive.parentNode.insertBefore(card, archive);
          lastVisible = card;
        }
      });
    }

    btnAll.addEventListener('click', function () { setFilter(''); });

    // plaats de balk direct onder het kolom-kopje (h2)
    var h2 = col.querySelector('h2');
    col.insertBefore(bar, h2 ? h2.nextSibling : col.firstChild);
  });
})();
