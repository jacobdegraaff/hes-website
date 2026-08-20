#!/usr/bin/env python3
"""Pas de gemiste content-updates opnieuw toe op de nieuwe (i18n) site:
- subsidies.html: peildata 17-08 -> 19-08 (SPRILA, SPULA, budget)
- nieuws.html: cron-marker + 6 nieuwe nieuws-cards (af6e130)
"""
import os, re

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

# --- subsidies.html: peildata ---
with open('subsidies.html', encoding='utf-8') as f:
    sub = f.read()
n = sub.count('Peildatum: 17-08-2026')
sub = sub.replace('Peildatum: 17-08-2026', 'Peildatum: 19-08-2026')
with open('subsidies.html', 'w', encoding='utf-8') as f:
    f.write(sub)
print(f"subsidies.html: {n} peildata bijgewerkt naar 19-08-2026")

# --- nieuws.html: marker + 6 cards ---
CARDS = """                <!-- AUTO-UPDATED BY CRON | 2026-08-19 -->
                <div class="news-card">
                    <span class="tag tag-battery">Batterijopslag</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44536/qurmit-lanceert-nieuwe-thuisbatterijen-met-opslagcapaciteit-tot-101-kilowattuur">Qurmit lanceert vier nieuwe batterijen met opslag tot 101 kWh</a></h3>
                    <p>De Nederlandse fabrikant Qurmit brengt vier nieuwe modellen op de markt met opslagcapaciteiten van 57 tot 101 kWh. De loodgelaccu's zijn niet-ontvlambaar en vallen daardoor buiten de PGS 37-veiligheidsregels — een interessante optie voor hotels die netcongestie willen omzeilen zonder zware brandveiligheidseisen.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44536/qurmit-lanceert-nieuwe-thuisbatterijen-met-opslagcapaciteit-tot-101-kilowattuur">Bron: Solar &amp; Storage Magazine, 19 augustus 2026</a></p>
                </div>
                <div class="news-card">
                    <span class="tag tag-subsidy">Subsidie</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44534/energiebedrijf-moet-verborgen-terugleverkosten-terugbetalen-aan-eigenaar-zonnepanelen">Energiebedrijf moet verborgen terugleverkosten terugbetalen aan zonnepaneel-eigenaar</a></h3>
                    <p>De Geschillencommissie Energie oordeelt dat terugleverkosten die in de kleine lettertjes stonden niet rechtsgeldig zijn. Een energiebedrijf moet de kosten terugbetalen. Voor hotels met zonnepanelen een signaal om het contract na te lopen op onterechte terugleverkosten.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44534/energiebedrijf-moet-verborgen-terugleverkosten-terugbetalen-aan-eigenaar-zonnepanelen">Bron: Solar &amp; Storage Magazine, 18 augustus 2026</a></p>
                </div>
                <div class="news-card">
                    <span class="tag tag-battery">Zonnepanelen</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44533/nieuw-record-zonnepanelen-dekken-10-procent-wereldwijd-stroomverbruik">Zonnepanelen dekken voor het eerst 10 procent van de wereldwijde stroomvraag</a></h3>
                    <p>In de eerste helft van 2026 leverde zonne-energie een record van 10 procent van alle stroom wereldwijd. Denktank Ember concludeert dat batterijen het mogelijk maken die zonne-energie ook buiten de zonuren te benutten — precies de combinatie waar hotels met eigen opwek van profiteren.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44533/nieuw-record-zonnepanelen-dekken-10-procent-wereldwijd-stroomverbruik">Bron: Solar &amp; Storage Magazine, 18 augustus 2026</a></p>
                </div>
                <div class="news-card">
                    <span class="tag tag-subsidy">Energiebeleid</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44540/energiesector-pleit-voor-sterke-nationale-investeringsinstelling">Energiesector pleit voor sterke Nationale Investeringsinstelling</a></h3>
                    <p>Een brede coalitie van energie- en klimaatorganisaties roept de Taskforce Toekomstige Welvaart op om de geplande Nationale Investeringsinstelling te richten op energie, klimaat en circulaire economie. Meer publiek kapitaal kan de financiering van verduurzaming voor bedrijven en vastgoed versnellen.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44540/energiesector-pleit-voor-sterke-nationale-investeringsinstelling">Bron: Solar &amp; Storage Magazine, 19 augustus 2026</a></p>
                </div>
                <div class="news-card">
                    <span class="tag tag-battery">Batterijopslag</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44543/belgische-regulator-schrapt-definitief-vrijstelling-grote-batterijen-van-nettarieven">Belgische regulator schrapt definitief nettarief-vrijstelling voor grote batterijen</a></h3>
                    <p>De Belgische energieregulator CREG bouwt de vrijstelling van nettarieven voor grootschalige batterijopslag definitief af; bestaande projecten blijven onder voorwaarden beschermd. Een signaal voor de Nederlandse markt over de richting waarin nettarieven voor batterijen zich ontwikkelen.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44543/belgische-regulator-schrapt-definitief-vrijstelling-grote-batterijen-van-nettarieven">Bron: Solar &amp; Storage Magazine, 19 augustus 2026</a></p>
                </div>
                <div class="news-card">
                    <span class="tag tag-battery">Batterijopslag</span>
                    <h3><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44528/plug-in-thuisbatterij-in-belgie-prima-product-gebrek-aan-regulerend-kader">Plug-in thuisbatterij: prima product, maar gebrek aan regels</a></h3>
                    <p>De opkomst van de plug-in batterij (stekker in het stopcontact) roept vragen op over veiligheid en netbeheer. Branchevereniging Techlink pleit voor duidelijke spelregels. Relevant voor ondernemers die laagdrempelig willen starten met energieopslag.</p>
                    <p class="source"><a href="https://solarmagazine.nl/nieuws-zonne-energie/i44528/plug-in-thuisbatterij-in-belgie-prima-product-gebrek-aan-regulerend-kader">Bron: Solar &amp; Storage Magazine, 18 augustus 2026</a></p>
                </div>"""

with open('nieuws.html', encoding='utf-8') as f:
    news = f.read()
old = '                <!-- AUTO-UPDATED BY CRON | 2026-08-14 -->'
idx = news.find(old)
if idx == -1:
    raise SystemExit('FOUT: marker niet gevonden in nieuws.html')
new = news[:idx] + CARDS + news[idx + len(old):]
with open('nieuws.html', 'w', encoding='utf-8') as f:
    f.write(new)
print("nieuws.html: marker + 6 cards toegevoegd (eerste marker)")
print("aantal markers nu:", new.count('AUTO-UPDATED BY CRON'))
