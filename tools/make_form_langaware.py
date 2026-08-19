#!/usr/bin/env python3
"""Maak de contactformulier-JS op alle pagina's (behalve index/admin) taalbewust."""
import os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
pages = [f for f in os.listdir('.') if f.endswith('.html') and f not in ('admin.html', 'index.html')]

PATCHES = [
    # 1) requiredLabels -> LANG + T dict
    ("""    var requiredLabels = {
        voornaam: 'voornaam',
        achternaam: 'achternaam',
        bedrijfsnaam: 'bedrijfsnaam',
        functie: 'functie',
        email: 'e-mailadres',
        mobiel: 'mobiel nummer',
        bericht: 'bericht'
    };""",
     """    var LANG = (document.documentElement.lang || 'nl').split('-')[0];

    var requiredLabels = {
        voornaam: LANG === 'en' ? 'first name' : 'voornaam',
        achternaam: LANG === 'en' ? 'last name' : 'achternaam',
        bedrijfsnaam: LANG === 'en' ? 'company name' : 'bedrijfsnaam',
        functie: LANG === 'en' ? 'job title' : 'functie',
        email: LANG === 'en' ? 'email address' : 'e-mailadres',
        mobiel: LANG === 'en' ? 'mobile number' : 'mobiel nummer',
        bericht: LANG === 'en' ? 'message' : 'bericht'
    };

    var T = (LANG === 'en') ? {
        vul: 'Please fill in your ', in: '.', email: 'Please enter a valid email address.',
        sending: 'Sending...', thanks: 'Thank you for your message!',
        soon: 'We will contact you within 24 hours.',
        fail: 'Sending failed. Please try again later.',
        netfail: 'Sending failed. Check your internet connection and try again.'
    } : {
        vul: 'Vul je ', in: ' in.', email: 'Vul een geldig e-mailadres in.',
        sending: 'Versturen...', thanks: 'Bedankt voor je bericht!',
        soon: 'We nemen binnen 24 uur contact met je op.',
        fail: 'Het versturen is mislukt. Probeer het later opnieuw.',
        netfail: 'Het versturen is mislukt. Controleer je internetverbinding en probeer het opnieuw.'
    };"""),
    # 2) payload lang
    ("""            bericht: document.getElementById('bericht').value.trim(),
            website: honeypot.value
        };""",
     """            bericht: document.getElementById('bericht').value.trim(),
            website: honeypot.value,
            lang: LANG
        };"""),
    # 3) validatie
    ("""        // Client-side validatie (Nederlands, onafhankelijk van browsertaal)
        var errors = {};
        for (var key in requiredLabels) {
            if (!payload[key]) errors[key] = 'Vul je ' + requiredLabels[key] + ' in.';
        }
        if (payload.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(payload.email)) {
            errors.email = 'Vul een geldig e-mailadres in.';
        }""",
     """        // Client-side validatie (taalafhankelijk via <html lang>)
        var errors = {};
        for (var key in requiredLabels) {
            if (!payload[key]) errors[key] = T.vul + requiredLabels[key] + T.in;
        }
        if (payload.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(payload.email)) {
            errors.email = T.email;
        }"""),
    # 4) sending
    ("if (btn) { btn.disabled = true; btn.innerHTML = 'Versturen...'; }",
     "if (btn) { btn.disabled = true; btn.innerHTML = T.sending; }"),
    # 5) success block
    ("""                    '<h3 style="color:var(--green-primary);margin-bottom:0.5rem;">Bedankt voor je bericht!</h3>' +
                    '<p style="color:var(--text-muted);">We nemen binnen 24 uur contact met je op.</p></div>';""",
     """                    '<h3 style="color:var(--green-primary);margin-bottom:0.5rem;">' + T.thanks + '</h3>' +
                    '<p style="color:var(--text-muted);">' + T.soon + '</p></div>';"""),
    # 6) fail messages
    ("showFormError(res.data.message || 'Het versturen is mislukt. Probeer het later opnieuw.');",
     "showFormError(res.data.message || T.fail);"),
    ("showFormError('Het versturen is mislukt. Controleer je internetverbinding en probeer het opnieuw.');",
     "showFormError(T.netfail);"),
]

ok, fail = [], []
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    broken = None
    for i, (old, new) in enumerate(PATCHES):
        if old not in html:
            broken = (i, 'old-string niet gevonden')
            break
        if html.count(old) > 1:
            broken = (i, f'{html.count(old)}x gevonden (verwacht 1)')
            break
        html = html.replace(old, new, 1)
    if broken:
        fail.append((p, broken[0], broken[1]))
        continue
    if 'var LANG' in html and "'Bedankt voor je bericht!</h3>' +" not in html and 'T.sending' in html:
        open(p, 'w', encoding='utf-8').write(html)
        ok.append(p)
    else:
        fail.append((p, -1, 'eindcheck mislukt'))

print(f"OK: {len(ok)} pagina's taalbewust: {ok}")
for p, i, msg in fail:
    print(f"FAIL {p} patch#{i}: {msg}")
sys.exit(1 if fail else 0)
