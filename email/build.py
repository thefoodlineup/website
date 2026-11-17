"""Bouwt de HTML voor de nieuwe TFLU-mails (Web 2026). Eén module per mail; footer komt uit HubSpot."""
import json, sys

LOGO = "https://19588880.fs1.hubspotusercontent-na1.net/hubfs/19588880/website-2026/mail/tflu-mail-logo-navy.png"
LOGO_DARK = "https://19588880.fs1.hubspotusercontent-na1.net/hubfs/19588880/website-2026/mail/tflu-mail-logo.png"
ARR_W = "https://19588880.fs1.hubspotusercontent-na1.net/hubfs/19588880/website-2026/mail/tflu-mail-pijl-wit.png"
ARR_N = "https://19588880.fs1.hubspotusercontent-na1.net/hubfs/19588880/website-2026/mail/tflu-mail-pijl-navy.png"
WIEBER = "https://19588880.fs1.hubspotusercontent-na1.net/hubfs/19588880/website-2026/mail/tflu-mail-wieber.png"
SITE = "https://www.thefoodlineup.nl"
NAVY, ORANGE, LB, LBS, WHITE = "#25245a", "#f2560a", "#c6e6e4", "#eef6f5", "#ffffff"
DISPLAY = "Anton,'Arial Narrow',Impact,'Helvetica Neue',Arial,sans-serif"
BODY = "Outfit,'Helvetica Neue',Helvetica,Arial,sans-serif"

def tok(prop, fb=""):
    return "{{ personalization_token('contact.%s', '%s') }}" % (prop, fb)

STYLE = """<style>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;600&display=swap');
:root{color-scheme:light dark;supported-color-schemes:light dark}
.tf-btn a{background-image:linear-gradient(101.5deg,#25245a 50%,#f2560a 50%);background-size:260% 100%;background-position:100% 0;transition:background-position .25s cubic-bezier(.22,1,.36,1),color .25s cubic-bezier(.22,1,.36,1)}
.tf-btn a:hover{background-color:#25245a!important;background-position:0 0!important}
.tf-btn:hover td{background-color:#25245a!important}
@media (max-width:620px){
 .tf-pad{padding-left:24px!important;padding-right:24px!important}
 .tf-card{padding-top:32px!important;padding-bottom:32px!important}
 .tf-h1{font-size:36px!important;line-height:40px!important}
 .tf-btn,.tf-btn a{display:block!important;width:100%!important;text-align:center!important;box-sizing:border-box!important}
}
@media (prefers-color-scheme:dark){
 .tf-bg{background:#14143a!important}.tf-card,.tf-head{background:#1d1c4d!important}.tf-head{border-color:#3a3978!important}
 .tf-logo-l{display:none!important}.tf-logo-d{display:block!important;max-height:none!important;width:104px!important;height:auto!important}
 .tf-txt,.tf-txt p,.tf-txt td,.tf-txt a{color:#ffffff!important}.tf-muted{color:#c6e6e4!important}
 .tf-box{background:#2f2e6b!important}.tf-h1{color:#ffffff!important}.tf-line{border-color:#3a3978!important}
 .tf-num,.tf-txt .tf-num{color:#f2560a!important}
 .tf-btn a{background-image:linear-gradient(101.5deg,#ffffff 50%,#f2560a 50%)}
 .tf-btn a:hover{background-color:#ffffff!important;color:#25245a!important}.tf-btn:hover td{background-color:#ffffff!important}
 .tf-btn a:hover .tf-arr-w{display:none!important}.tf-btn a:hover .tf-arr-n{display:inline-block!important}
}
[data-ogsc] .tf-bg{background:#14143a!important}[data-ogsc] .tf-card,[data-ogsc] .tf-head{background:#1d1c4d!important}
[data-ogsc] .tf-logo-l{display:none!important}[data-ogsc] .tf-logo-d{display:block!important;max-height:none!important;width:104px!important;height:auto!important}
[data-ogsc] .tf-txt,[data-ogsc] .tf-h1{color:#ffffff!important}[data-ogsc] .tf-box{background:#2f2e6b!important}
</style>"""

def p(text, size=16, color=NAVY, mb=16, weight=400):
    return f'<p style="margin:0 0 {mb}px 0;font-family:{BODY};font-size:{size}px;line-height:1.55;color:{color};font-weight:{weight};">{text}</p>'

def button(label, href):
    arrows = (f'<img class="tf-arr-w" src="{ARR_W}" width="18" height="18" alt="" style="display:inline-block;border:0;width:18px;height:18px;vertical-align:-2px;margin-left:10px;">'
              f'<img class="tf-arr-n" src="{ARR_N}" width="18" height="18" alt="" style="display:none;mso-hide:all;border:0;width:18px;height:18px;vertical-align:-2px;margin-left:10px;">')
    return f'''<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="tf-btn"><tr><td bgcolor="{ORANGE}" align="center" style="background:{ORANGE};">
<a href="{href}" style="display:inline-block;padding:12px 28px;font-family:{DISPLAY};font-size:20px;line-height:26px;text-transform:uppercase;color:#ffffff;text-decoration:none;background-color:{ORANGE};">{label}{arrows}</a></td></tr></table>'''

def link_button(label, href):
    return f'<a href="{href}" style="font-family:{BODY};font-size:15px;font-weight:600;color:{NAVY};text-decoration:underline;" class="tf-txt">{label}</a>'

def steps(items):
    rows = ""
    for i, (title, txt) in enumerate(items, 1):
        rows += f'''<tr><td valign="top" width="44" class="tf-num" style="padding:0 0 18px 0;font-family:{DISPLAY};font-size:26px;line-height:28px;color:{ORANGE};">0{i}</td>
<td valign="top" style="padding:0 0 18px 0;" class="tf-txt"><p style="margin:0 0 2px 0;font-family:{BODY};font-size:16px;font-weight:600;color:{NAVY};">{title}</p>
<p style="margin:0;font-family:{BODY};font-size:15px;line-height:1.5;color:{NAVY};">{txt}</p></td></tr>'''
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}</table>'

def box(inner):
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="tf-box tf-txt" bgcolor="{LBS}" style="background:{LBS};padding:18px 20px;border-left:4px solid {ORANGE};">{inner}</td></tr></table>'''

def contact_block():
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="tf-line" style="border-top:1px solid #dfe9e8;padding-top:22px;">
<p class="tf-txt" style="margin:0 0 6px 0;font-family:{DISPLAY};font-size:20px;text-transform:uppercase;color:{NAVY};">Liever even bellen?</p>
<p class="tf-txt" style="margin:0;font-family:{BODY};font-size:15px;line-height:1.7;color:{NAVY};">
<a href="tel:+31202615235" style="color:{NAVY};text-decoration:none;font-weight:600;">(+31) 20 26 15 235</a><br>
<a href="mailto:info@thefoodlineup.nl" style="color:{NAVY};text-decoration:none;font-weight:600;">info@thefoodlineup.nl</a></p></td></tr></table>'''

def wrap(eyebrow, h1_a, h1_b, body):
    return f'''{STYLE}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="tf-bg" bgcolor="{LBS}" style="background:{LBS};">
<tr><td align="center" style="padding:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td bgcolor="{WHITE}" style="background:{WHITE};padding:20px 40px;border-bottom:1px solid #dfe9e8;" class="tf-pad tf-head">
<a href="{SITE}"><img class="tf-logo-l" src="{LOGO}" width="104" height="73" alt="The Food Line-up" style="display:block;border:0;width:104px;height:auto;">
<img class="tf-logo-d" src="{LOGO_DARK}" width="104" height="73" alt="The Food Line-up" style="display:none;mso-hide:all;max-height:0;width:0;border:0;"></a></td></tr>
<tr><td class="tf-card tf-pad tf-txt" bgcolor="{WHITE}" style="background:{WHITE};padding:40px 40px 36px 40px;">
<img src="{WIEBER}" width="28" height="11" alt="" style="display:block;border:0;margin:0 0 14px 0;">
<p class="tf-muted" style="margin:0 0 10px 0;font-family:{BODY};font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:{NAVY};opacity:.75;">{eyebrow}</p>
<h1 class="tf-h1" style="margin:0 0 22px 0;font-family:{DISPLAY};font-weight:400;font-size:48px;line-height:52px;text-transform:uppercase;color:{NAVY};">{h1_a}{h1_b}</h1>
{body}
</td></tr>
{footer()}
</table></td></tr></table>'''


def footer():
    return f'''<tr><td bgcolor="{NAVY}" class="tf-pad" style="background:{NAVY};padding:28px 40px 30px 40px;">
<p style="margin:0 0 10px 0;font-family:{BODY};font-size:13px;line-height:1.6;color:#ffffff;">
<a href="https://www.linkedin.com/company/10384742/" style="color:#ffffff;text-decoration:underline;">LinkedIn</a> &nbsp;&middot;&nbsp;
<a href="https://www.instagram.com/thefoodlineup/" style="color:#ffffff;text-decoration:underline;">Instagram</a> &nbsp;&middot;&nbsp;
<a href="{SITE}" style="color:#ffffff;text-decoration:underline;">thefoodlineup.nl</a></p>
<p style="margin:0 0 10px 0;font-family:{BODY};font-size:12px;line-height:1.6;color:#c6e6e4;">{{{{ site_settings.company_name }}}} &middot; {{{{ site_settings.company_street_address_1 }}}}, {{{{ site_settings.company_zip }}}} {{{{ site_settings.company_city }}}} &middot; Eerste cateraar in Europa met het B Corp-certificaat</p>
<p style="margin:0;font-family:{BODY};font-size:12px;line-height:1.6;color:#c6e6e4;">Je ontvangt deze mail omdat je contact met ons hebt opgenomen via onze website. <a href="{{{{ unsubscribe_link }}}}" style="color:#ffffff;text-decoration:underline;">Afmelden of voorkeuren aanpassen</a></p>
</td></tr>'''

def hi():
    return p("Hi " + tok("firstname", "daar") + ",")

MAILS = {
 "offerte": dict(
  name="Web 2026 | Bevestiging offerte",
  subject="Got it! Je aanvraag is binnen",
  preview="We komen binnen 2 werkdagen bij je terug met de volgende stap.",
  html=wrap("Aanvraag ontvangen", "Got ", "it!",
    hi()
    + p("Bedankt voor je aanvraag. We komen <strong>binnen 2 werkdagen</strong> bij je terug.")
    + box(f'<p style="margin:0 0 4px 0;font-family:{BODY};font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:{NAVY};">Je aanvraag</p>'
          f'<p style="margin:0;font-family:{BODY};font-size:16px;line-height:1.5;color:{NAVY};">{tok("web_type_event","Je event")} &middot; {tok("web_aantal_gasten","aantal gasten volgt")} &middot; {tok("web_event_periode","datum volgt")}</p>')
    + '<div style="height:28px;line-height:28px;">&nbsp;</div>'
    + f'<p class="tf-txt" style="margin:0 0 16px 0;font-family:{DISPLAY};font-size:22px;text-transform:uppercase;color:{NAVY};">Zo gaat het verder</p>'
    + steps([("Intake", "Een eventspecialist belt je om je wensen te bespreken."),
             ("Line-up op maat", "Je ontvangt een voorstel met line-up en kosten."),
             ("Aan de bak", "Zeggen we ‘ja’ tegen elkaar? Dan starten wij met de voorbereidingen.")])
    + p("Alvast inspiratie opdoen? Kijk hoe we andere events geniaal lekker maakten.", mb=20)
    + button("Bekijk onze cases", SITE + "/cases")
    + '<div style="height:32px;line-height:32px;">&nbsp;</div>'
    + contact_block()
    + '<div style="height:24px;line-height:24px;">&nbsp;</div>'
    + p("Tot snel!<br><strong>Team The Food Line-up</strong>", mb=0)
  )),
 "contact": dict(
  name="Web 2026 | Bevestiging contact",
  subject="Bedankt voor je bericht!",
  preview="We nemen binnen 2 werkdagen contact met je op.",
  html=wrap("Bericht ontvangen", "Bedankt voor je ", "bericht!",
    hi()
    + p("Je bericht is goed bij ons aangekomen. We nemen <strong>binnen 2 werkdagen</strong> contact met je op.")
    + box(f'<p style="margin:0 0 4px 0;font-family:{BODY};font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:{NAVY};">Onderwerp</p>'
          f'<p style="margin:0;font-family:{BODY};font-size:16px;line-height:1.5;color:{NAVY};">{tok("web_contact_onderwerp","Je vraag")}</p>')
    + '<div style="height:28px;line-height:28px;">&nbsp;</div>'
    + p("<strong>Plan je een event?</strong> Vraag direct een vrijblijvende offerte aan, dan schotelen we je binnen 2 werkdagen een voorstel voor.", mb=20)
    + button("Offerte aanvragen", SITE + "/offerte-aanvragen")
    + '<div style="height:32px;line-height:32px;">&nbsp;</div>'
    + contact_block()
    + '<div style="height:24px;line-height:24px;">&nbsp;</div>'
    + p("Tot snel!<br><strong>Team The Food Line-up</strong>", mb=0)
  )),
 "chef": dict(
  name="Web 2026 | Bevestiging chef-aanmelding",
  subject="Leuk dat je je aanmeldt!",
  preview="We bekijken je aanmelding en nemen binnen 2 werkdagen contact met je op.",
  html=wrap("Aanmelding ontvangen", "Welkom in de ", "keuken!",
    hi()
    + p("Wat leuk dat je je aanmeldt voor ons netwerk van chefs en foodondernemers. We bekijken je aanmelding en nemen <strong>binnen 2 werkdagen</strong> contact met je op.")
    + f'<p class="tf-txt" style="margin:8px 0 16px 0;font-family:{DISPLAY};font-size:22px;text-transform:uppercase;color:{NAVY};">Zo gaat het verder</p>'
    + steps([("Kennismaken", "We bellen je om je keuken, je concept en je ervaring te leren kennen."),
             ("Proeven", "Past het? Dan plannen we een proeverij."),
             ("Op de line-up", "Daarna sta je in ons netwerk en kom je in aanmerking voor events.")])
    + p("Benieuwd met wie je straks in de keuken staat?", mb=20)
    + button("Bekijk ons chef's netwerk", SITE + "/chefs-netwerk")
    + '<div style="height:32px;line-height:32px;">&nbsp;</div>'
    + contact_block()
    + '<div style="height:24px;line-height:24px;">&nbsp;</div>'
    + p("Tot snel!<br><strong>Team The Food Line-up</strong>", mb=0)
  )),
 "nieuwsbrief": dict(
  name="Web 2026 | Welkom nieuwsbrief",
  subject="Top, je zit erbij!",
  preview="Foodtrends, eventinspiratie en de nieuwste chefs uit ons netwerk.",
  html=wrap("Welkom", "Top, je zit ", "erbij!",
    hi()
    + p("Leuk dat je je hebt aangemeld. Zo nu en dan serveren we je foodtrends, eventinspiratie en de nieuwste chefs uit ons netwerk. Geen spam, wel veel smaak.")
    + steps([("Foodtrends", "Wat verdient straks een plek op jouw eventmenu?"),
             ("Eventinspiratie", "Echte cases, van congres tot jubileum."),
             ("Nieuwe chefs", "De nieuwste talenten uit ons netwerk van 60+ ondernemers.")])
    + p("Kun je niet wachten? Lees alvast onze nieuwste stories.", mb=20)
    + button("Lees onze stories", SITE + "/stories")
    + '<div style="height:28px;line-height:28px;">&nbsp;</div>'
    + p(f'Plan je een event? {link_button("Vraag een vrijblijvende offerte aan", SITE + "/offerte-aanvragen")}.', mb=24)
    + p("Smakelijke groet,<br><strong>Team The Food Line-up</strong>", mb=0)
  )),
 "behandeling": dict(
  name="Web 2026 | In behandeling",
  subject="We gaan voor je aan de slag!",
  preview="Je persoonlijke voorstel komt eraan. We bellen je om het samen door te lopen.",
  html=wrap("Aanvraag in behandeling", "Aanvraag? ", "Check!",
    hi()
    + p("Ons eventteam is voor je aan de slag met een voorstel dat helemaal aansluit bij jouw wensen. Je vindt het binnenkort in je inbox, en we bellen je graag om het samen door te lopen en je vragen te beantwoorden.")
    + f'<p class="tf-txt" style="margin:8px 0 16px 0;font-family:{DISPLAY};font-size:22px;text-transform:uppercase;color:{NAVY};">Hungry for more?</p>'
    + p("Kun je niet wachten op jouw persoonlijke line-up? Bekijk alvast hoe we andere events geniaal lekker maakten, of volg ons op LinkedIn en Instagram voor een kijkje achter de schermen.", mb=20)
    + button("Bekijk onze cases", SITE + "/cases")
    + '<div style="height:32px;line-height:32px;">&nbsp;</div>'
    + contact_block()
    + '<div style="height:24px;line-height:24px;">&nbsp;</div>'
    + p("Tot snel!<br><strong>Team The Food Line-up</strong>", mb=0)
  )),
}

if __name__ == "__main__":
    MAILS["nieuwsbrief"]["html"]=MAILS["nieuwsbrief"]["html"].replace("omdat je contact met ons hebt opgenomen via onze website","omdat je je hebt aangemeld voor onze nieuwsbrief")
    MAILS["chef"]["html"]=MAILS["chef"]["html"].replace("omdat je contact met ons hebt opgenomen via onze website","omdat je je via onze website hebt aangemeld voor ons chef's netwerk")
    json.dump(MAILS, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
    # lokale previews (licht en donker)
    for k, m in MAILS.items():
        doc = f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;">{m["html"]}</body></html>'
        open(f"/tmp/claude-0/-home-claude/f5e7c186-d4a8-5b7f-b181-332ef7722f96/scratchpad/mail/preview-{k}.html", "w").write(doc)
