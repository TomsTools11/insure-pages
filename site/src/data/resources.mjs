// Resource list data for /resources/: the tools an insurance agency runs on,
// grouped by what they are for. Compiled from Insurance Leads Guide's
// "Ultimate Insurance Agent Resource List" (August 2026), with the blurbs
// rewritten and a URL added for every tool we could verify.
//
// Shape:
//   parts      [{ name, categories: [{ name, blurb, items: [{ name, url, note }] }] }]
//   groups     display grouping over `parts` by index (see below)
//   categories the same categories flattened, each with the id, number and
//              accent the page renders
//
// An item with no url renders as a plain card, never as a dead link. A note
// is one short line under the name: what it covers, a former name, or a free
// tier worth knowing about. Listings are not endorsements; nothing here is
// paid placement. To add a tool, append an item to its category; to add a
// category, append it to the right part. Counts, numbering and the jump nav
// all derive from this file, so nothing else needs to change.

// Tuples keep the list readable: [name, url, note].
const P = [
  ["Leads and data", [
    ["Insurance lead companies", "Real-time and fresh shared leads across personal lines, health and senior markets. Pricing and filters vary a lot by state, so run a small test order before committing volume.", [
      ["GOAL", "https://checkoutgoal.com/", ""],
      ["QuoteWizard", "https://quotewizard.com/", ""],
      ["SmartFinancial Agents", "https://smartfinancial.com/agents", ""],
      ["Benepath Leads", "https://benepath.net/", ""],
      ["Hometown Quotes", "https://www.hometownquotes.com/", ""],
    ]],
    ["Prospecting and marketing lists", "Lists are aggregated contact data, not leads. Nobody on a list asked to hear from you, so they suit direct mail, door knocking and cold outreach rather than a quote follow-up sequence.", [
      ["ListShack", "https://listshack.com/", ""],
      ["LRG", "", "Lead Research Group"],
      ["InfoFree", "https://www.infofree.com/", ""],
      ["Data Axle", "https://www.data-axle.com/", ""],
      ["Exclusive Insurance Leads", "", ""],
      ["QuoteWizard Calls", "https://quotewizard.com/", "Inbound call transfers"],
      ["Benepath", "https://benepath.net/", "Web and calls. Health, group health, commercial"],
    ]],
  ]],
  ["Software and sales", [
    ["CRM and lead management", "Most of these are trying to become the one system you live in, which makes the choice harder every year. The right pick depends on captive or independent, your product lines, and whether you want all-in-one or best-of-breed. Switching after integration is painful, so research properly.", [
      ["Agent CRM", "https://agent-crm.com/", ""],
      ["Pipedrive", "https://www.pipedrive.com/", "All lines. 30 day free trial"],
      ["VanillaSoft", "https://www.vanillasoft.com/", "Customizable, all lines"],
      ["GoHealth", "https://www.gohealth.com/", "Formerly Norvax"],
      ["Radius", "https://radiusbob.com/", ""],
      ["Act!", "https://www.act.com/", ""],
      ["AgencyZoom", "https://www.agencyzoom.com/", ""],
      ["HubSpot", "https://www.hubspot.com/", "Free tier up to 1,000,000 contacts"],
      ["Salesforce", "https://www.salesforce.com/", ""],
      ["Insureio", "https://insureio.com/", ""],
      ["Dial Your Leads", "", "Lead management and telemarketing automation"],
      ["AgencyBloc", "https://www.agencybloc.com/", "Health and life"],
      ["Ontraport", "https://ontraport.com/", "CRM plus business automation"],
      ["Agency MVP", "https://agencymvp.com/", ""],
      ["Redtail CRM", "https://www.redtailtechnology.com/", ""],
      ["GoHighLevel", "https://www.gohighlevel.com/", ""],
      ["ClientCircle", "https://clientcircle.com/", ""],
      ["AgentCubed", "https://www.agentcubed.com/", ""],
      ["InsuredMine", "https://insuredmine.com/", ""],
    ]],
    ["Quoting and comparative raters", "Many raters are line specific, so a multi-line brokerage usually ends up running two or three.", [
      ["Epic Quotes by Applied", "https://www1.appliedsystems.com/", "Formerly SEMCat. P and C"],
      ["EZLynx", "https://www.ezlynx.com/", ""],
      ["NinjaQuoter", "https://ninjaquoter.com/", "Life"],
      ["Compulife", "https://www.compulife.com/", "Life"],
      ["PL Rating", "https://www.vertafore.com/", "Personal lines"],
      ["Quotit", "https://www.quotit.com/", "Health, Medicare"],
      ["Ritter", "https://www.ritterim.com/", "Medicare, final expense, life"],
      ["CSG Actuarial", "https://www.csgactuarial.com/", "Medicare, final expense"],
      ["GetInsured", "https://www.getinsured.com/", "Health"],
      ["QuotePro", "https://www.quotepro.com/", "Auto"],
      ["Tarmika", "https://www.tarmika.com/", "Commercial"],
    ]],
    ["Agency management systems", "An all-in-one spine for the agency. Check migration and integration paths against whatever CRM, dialer or rater you already run, and pick something that can absorb the product lines you plan to add.", [
      ["Vertafore AMS360", "https://www.vertafore.com/products/ams360", ""],
      ["Applied Epic", "https://www1.appliedsystems.com/en-us/products/applied-epic/", ""],
      ["HawkSoft", "https://www.hawksoft.com/", ""],
      ["AgencyBloc", "https://www.agencybloc.com/", ""],
      ["HealthSherpa", "https://www.healthsherpa.com/", ""],
      ["Agency Software", "https://www.agencysoftware.com/", ""],
      ["EZLynx Agency Management", "https://www.ezlynx.com/", ""],
      ["NowCerts", "https://nowcerts.com/", ""],
      ["Zywave", "https://www.zywave.com/", ""],
      ["Insly", "https://www.insly.com/", ""],
      ["QQCatalyst", "https://www.qqcatalyst.com/", ""],
      ["DYAD", "", "Formerly Nexsure"],
      ["Veruna", "https://veruna.com/", ""],
    ]],
    ["Dialers", "Post-DNC, dialers earn their keep on speed to lead and producer throughput rather than raw volume. Most of the serious ones integrate with your CRM.", [
      ["ProspectBoss", "https://prospectboss.com/", "Formerly SalesDialers"],
      ["InterCloud9", "https://www.intercloud9.com/", ""],
      ["VanillaSoft", "https://www.vanillasoft.com/", ""],
      ["Dial Your Leads", "", ""],
      ["Velocify Dial-IQ", "https://www.velocify.com/", ""],
      ["ReadyMode", "https://readymode.com/", ""],
      ["PhoneBurner", "https://www.phoneburner.com/", ""],
      ["Five9", "https://www.five9.com/", ""],
      ["Kixie", "https://www.kixie.com/", ""],
      ["Mojo", "https://www.mojosells.com/", ""],
      ["Call Logic", "https://calllogic.com/", ""],
      ["EVS7", "https://evs7.com/", ""],
    ]],
    ["eSignature", "Most agency management systems now sign natively. These are for agencies that want a standalone trail, or a workflow the AMS cannot do.", [
      ["Docusign", "https://www.docusign.com/", ""],
      ["Adobe Acrobat Sign", "https://www.adobe.com/sign.html", ""],
      ["PandaDoc", "https://www.pandadoc.com/", "14 day free trial"],
      ["SignNow", "https://www.signnow.com/", "Free trial"],
      ["OneSpan", "https://www.onespan.com/", "Formerly eSignLive"],
      ["ShareFile RightSignature", "https://www.sharefile.com/", ""],
      ["Dropbox Sign", "https://sign.dropbox.com/", ""],
    ]],
  ]],
  ["Website and web presence", [
    ["Website builders and CMS", "WordPress is the traditional starting point for non-developers. Drag and drop builders cost a monthly fee but include hosting, which is a separate bill and a separate learning curve on WordPress.", [
      ["WordPress", "https://wordpress.org/", "Open source CMS"],
      ["Squarespace", "https://www.squarespace.com/", "Site builder"],
      ["Wix", "https://www.wix.com/", "Site builder"],
      ["Weebly", "https://www.weebly.com/", "Site builder"],
      ["Webflow", "https://webflow.com/", "Site builder"],
      ["Drupal", "https://www.drupal.org/", "Open source CMS"],
    ]],
    ["WordPress themes", "Where to find a starting design if you are building it yourself.", [
      ["ThemeForest", "https://themeforest.net/", ""],
      ["GeneratePress", "https://generatepress.com/", ""],
      ["StudioPress", "https://www.studiopress.com/", ""],
      ["WordPress.org Themes", "https://wordpress.org/themes/", "Free"],
    ]],
    ["WordPress page builders", "Plugins that bring drag and drop editing to WordPress.", [
      ["Elementor", "https://elementor.com/", ""],
      ["WPBakery", "https://wpbakery.com/", "Formerly Visual Composer"],
      ["Divi Builder", "https://www.elegantthemes.com/gallery/divi/", ""],
      ["Beaver Builder", "https://www.wpbeaverbuilder.com/", ""],
    ]],
    ["Web hosting", "Site speed is a ranking signal, so hosting is a lead generation decision and not just an IT one.", [
      ["Cloudways", "https://www.cloudways.com/", "Good value"],
      ["SiteGround", "https://www.siteground.com/", ""],
      ["A2 Hosting", "https://www.a2hosting.com/", ""],
      ["WP Engine", "https://wpengine.com/", ""],
      ["WPX", "https://wpx.net/", ""],
      ["TigerTech", "https://www.tigertech.net/", ""],
    ]],
    ["Done-for-you website design", "Insurance-specific design and development shops, for agencies that do not want to touch a CMS.", [
      ["AgentMethods", "https://www.agentmethods.com/", ""],
      ["Advisor Websites", "https://www.advisorwebsites.com/", ""],
      ["EZLynx", "https://www.ezlynx.com/", ""],
      ["Leadsurance", "https://leadsurance.com/", ""],
      ["BriteFire", "https://britefire.com/", ""],
      ["InsuranceWebDesigns", "", ""],
    ]],
    ["Content delivery networks", "A CDN serves your files from the server nearest the visitor, which speeds up the site, takes load off your host, and filters out a lot of malicious traffic on the way through.", [
      ["Cloudflare", "https://www.cloudflare.com/", ""],
      ["KeyCDN", "https://www.keycdn.com/", ""],
      ["Amazon CloudFront", "https://aws.amazon.com/cloudfront/", ""],
    ]],
    ["Domain registrars", "Where to register the name.", [
      ["NameSilo", "https://www.namesilo.com/", ""],
      ["Cloudflare Domains", "https://www.cloudflare.com/products/registrar/", "At-cost registration pricing"],
      ["Namecheap", "https://www.namecheap.com/", ""],
      ["Dynadot", "https://www.dynadot.com/", ""],
      ["GoDaddy", "https://www.godaddy.com/", ""],
    ]],
    ["Domain aftermarkets", "Where to buy a name somebody already owns.", [
      ["Afternic", "https://www.afternic.com/", ""],
      ["Dan", "https://dan.com/", ""],
      ["Sedo", "https://sedo.com/", ""],
      ["Flippa", "https://flippa.com/", ""],
      ["BuyDomains", "https://www.buydomains.com/", ""],
    ]],
    ["Website chat", "Live chat removes the wait between interest and a conversation, which is usually where a quote request is won or lost.", [
      ["LiveChat", "https://www.livechat.com/", ""],
      ["HappyFox", "https://www.happyfox.com/", ""],
      ["Olark", "https://www.olark.com/", ""],
      ["Zendesk Chat", "https://www.zendesk.com/service/messaging/", ""],
      ["Tawk.to", "https://www.tawk.to/", "Free"],
      ["Freshchat", "https://www.freshworks.com/live-chat-software/", ""],
    ]],
    ["Calendar and scheduling", "Self-scheduling cuts the back and forth out of booking an appointment and takes the admin off the producer.", [
      ["Calendly", "https://calendly.com/", ""],
      ["Acuity Scheduling", "https://acuityscheduling.com/", ""],
      ["HubSpot Meetings", "https://www.hubspot.com/products/sales/schedule-meeting", ""],
      ["Microsoft Bookings", "https://www.microsoft.com/en-us/microsoft-365/business/scheduling-and-booking-app", ""],
      ["Google Calendar", "https://calendar.google.com/", ""],
      ["Zoho Bookings", "https://www.zoho.com/bookings/", ""],
      ["TidyCal", "https://tidycal.com/", ""],
      ["Doodle", "https://doodle.com/", ""],
      ["Chili Piper", "https://www.chilipiper.com/", ""],
    ]],
    ["Conversion and landing pages", "Purpose-built pages and on-page prompts. All paid, and all easy to justify if they move the conversion rate at all.", [
      ["ClickFunnels", "https://www.clickfunnels.com/", ""],
      ["Unbounce", "https://unbounce.com/", ""],
      ["Instapage", "https://instapage.com/", ""],
      ["Wishpond", "https://www.wishpond.com/", ""],
      ["Leadpages", "https://www.leadpages.com/", "14 day free trial"],
    ]],
    ["Analytics and user behavior", "Traffic counts, conversion tracking, session recordings and heatmaps. Google Analytics is the default, and recent versions have pushed a lot of small businesses toward simpler alternatives.", [
      ["Google Analytics", "https://analytics.google.com/", "Free"],
      ["Clicky", "https://clicky.com/", "Low cost, readable reports"],
      ["Piwik PRO", "https://piwik.pro/", ""],
      ["Matomo", "https://matomo.org/", ""],
      ["Simple Analytics", "https://www.simpleanalytics.com/", ""],
      ["Plausible", "https://plausible.io/", ""],
      ["Pirsch", "https://pirsch.io/", ""],
      ["Microsoft Clarity", "https://clarity.microsoft.com/", "Free heatmaps and recordings"],
      ["Lucky Orange", "https://www.luckyorange.com/", ""],
      ["Hotjar", "https://www.hotjar.com/", ""],
    ]],
    ["Quote and web forms", "For rolling your own quote or contact form. Add Zapier or Make and most of these will post straight into your CRM, rater or dialer.", [
      ["Formstack", "https://www.formstack.com/", ""],
      ["Google Forms", "https://www.google.com/forms/about/", "Workspace edition for business use"],
      ["WPForms", "https://wpforms.com/", ""],
      ["Typeform", "https://www.typeform.com/", ""],
      ["Gravity Forms", "https://www.gravityforms.com/", ""],
      ["Wufoo", "https://www.wufoo.com/", ""],
      ["Ninja Forms", "https://ninjaforms.com/", ""],
      ["Quform", "https://www.themecatcher.net/quform/", ""],
      ["Jotform", "https://www.jotform.com/", ""],
    ]],
    ["SEO and market research", "Keyword research, competitor analysis and the free tools from the search engines themselves.", [
      ["SE Ranking", "https://seranking.com/", "Solid value alternative"],
      ["Semrush", "https://www.semrush.com/", "Strong, expensive"],
      ["Ahrefs", "https://ahrefs.com/", "Priced for agencies"],
      ["Google Search Console", "https://search.google.com/search-console/about", "Free"],
      ["Bing Webmaster Tools", "https://www.bing.com/webmasters/", "Free"],
      ["SpyFu", "https://www.spyfu.com/", "Search and PPC competitor analysis"],
      ["WebSite Auditor", "https://www.link-assistant.com/website-auditor/", ""],
      ["Keywords Everywhere", "https://keywordseverywhere.com/", "Browser extension"],
      ["AnswerThePublic", "https://answerthepublic.com/", "Free, good for topic ideas"],
      ["Rank Math", "https://rankmath.com/", "Free WordPress SEO plugin"],
      ["Yoast SEO", "https://yoast.com/", "Free WordPress SEO plugin"],
    ]],
    ["Content and writing", "Drafting, editing and everyday communication. The AI assistants below all have usable free tiers.", [
      ["Grammarly", "https://www.grammarly.com/", ""],
      ["Microsoft Editor", "https://www.microsoft.com/en-us/microsoft-365/microsoft-editor", ""],
      ["Claude", "https://claude.ai/", ""],
      ["ChatGPT", "https://chatgpt.com/", ""],
      ["Google Gemini", "https://gemini.google.com/", ""],
      ["Grok", "https://grok.com/", ""],
      ["Koala Writer", "https://koala.sh/", ""],
      ["ZimmWriter", "https://zimmwriter.com/", ""],
    ]],
    ["Logo and brand", "AI has collapsed the cost and turnaround of a decent logo. Custom design services still exist, and many now use AI in the process anyway.", [
      ["Canva", "https://www.canva.com/", ""],
      ["Looka", "https://looka.com/", "Formerly LogoJoy"],
      ["Tailor Brands", "https://www.tailorbrands.com/", ""],
      ["ChatGPT", "https://chatgpt.com/", "Good results with custom logo GPTs"],
      ["99designs", "https://99designs.com/", "Custom logo and branding"],
      ["DesignCrowd", "https://www.designcrowd.com/", "Design by submission"],
    ]],
    ["Freelance marketplaces", "Contractors for video, code, design, graphics, copy and telemarketing.", [
      ["MarketHire", "", "Vetted talent, mostly marketing"],
      ["Fiverr", "https://www.fiverr.com/", ""],
      ["Upwork", "https://www.upwork.com/", ""],
      ["Freelancer", "https://www.freelancer.com/", ""],
      ["PeoplePerHour", "https://www.peopleperhour.com/", ""],
      ["Guru", "https://www.guru.com/", ""],
    ]],
  ]],
  ["Lead generation and marketing", [
    ["Door knocking apps", "If door to door is part of the mix, these map the territory and keep the notes straight.", [
      ["SalesRabbit", "https://salesrabbit.com/", ""],
      ["Spotio", "https://spotio.com/", ""],
      ["Badger Maps", "https://www.badgermapping.com/", ""],
    ]],
    ["Cold email outreach", "For scaling personalized outbound without sending it by hand.", [
      ["Reply", "https://reply.io/", "Free tier with 200 data credits"],
      ["Mailshake", "https://mailshake.com/", ""],
      ["GMass", "https://www.gmass.co/", ""],
    ]],
    ["Prospecting data", "For filling in the contact details you are missing, or building a very specific list.", [
      ["Voila Norbert", "https://www.voilanorbert.com/", "First 50 lookups free"],
      ["Albacross", "https://albacross.com/", "Identify website visitors"],
      ["Hunter", "https://hunter.io/", ""],
      ["Instantly", "https://instantly.ai/", ""],
      ["LinkedIn Sales Navigator", "https://business.linkedin.com/sales-solutions/sales-navigator", ""],
      ["Clearbit", "https://clearbit.com/", ""],
    ]],
    ["Advertising platforms", "Search costs more per lead and converts better because the intent is already there. Social is where you create the interest and retarget the people who showed some.", [
      ["Google Ads", "https://ads.google.com/", ""],
      ["Microsoft Advertising", "https://ads.microsoft.com/", "Bing and Yahoo search"],
      ["Facebook Ads", "https://www.facebook.com/business/ads", ""],
      ["LinkedIn Ads", "https://business.linkedin.com/marketing-solutions/ads", ""],
      ["X Ads", "https://ads.x.com/", "Formerly Twitter Ads"],
    ]],
    ["Ad and social graphics", "On social, the image does as much work as the copy.", [
      ["Canva", "https://www.canva.com/", ""],
      ["Adobe Express", "https://www.adobe.com/express/", ""],
      ["Microsoft Designer", "https://designer.microsoft.com/", ""],
      ["Snappa", "https://snappa.com/", ""],
      ["Figma", "https://www.figma.com/", ""],
      ["GraphicRiver", "https://graphicriver.net/", ""],
      ["Pablo by Buffer", "https://pablo.buffer.com/", ""],
    ]],
    ["Video production and editing", "Low cost and free editors that are good enough for social, ad platforms and local TV.", [
      ["DaVinci Resolve", "https://www.blackmagicdesign.com/products/davinciresolve", "Free version is genuinely capable"],
      ["Filmora", "https://filmora.wondershare.com/", "AI assisted editing"],
      ["Clipchamp", "https://clipchamp.com/", "Built into Windows"],
      ["iMovie", "https://www.apple.com/imovie/", "Mac and iOS"],
      ["LeoModo", "", "Hire video editors on demand"],
    ]],
    ["Social media management", "Scheduling and organizing so the calendar does not depend on remembering.", [
      ["SocialBee", "https://socialbee.com/", "14 day free trial. From $24/mo"],
      ["Missinglettr", "https://www.missinglettr.com/", "From $15/mo"],
      ["Nowzer", "", "Compliance aware scheduling"],
      ["SocialPilot", "https://www.socialpilot.co/", "From $25/mo"],
      ["Zoho Social", "https://www.zoho.com/social/", "From $10/mo"],
      ["Later", "https://later.com/", "From $17/mo"],
      ["MeetEdgar", "https://meetedgar.com/", "From $30/mo"],
      ["Buffer", "https://buffer.com/", "Limited free plan. From $6/mo per channel"],
    ]],
    ["Email marketing", "Newsletters, autoresponders, funnels and automated lead follow-up. A dedicated sender usually beats the email feature bundled into a CRM on deliverability. Several below are free up to 1,000 subscribers.", [
      ["MailerLite", "https://www.mailerlite.com/", "Free up to 1,000 contacts"],
      ["Kit", "https://kit.com/", "Formerly ConvertKit. Free up to 10k contacts"],
      ["AWeber", "https://www.aweber.com/", "Free up to 500 subscribers"],
      ["Mailchimp", "https://mailchimp.com/", ""],
      ["Moosend", "https://moosend.com/", ""],
      ["Brevo", "https://www.brevo.com/", ""],
      ["ActiveCampaign", "https://www.activecampaign.com/", ""],
      ["GetResponse", "https://www.getresponse.com/", ""],
    ]],
    ["Automation and integration", "Middleware that connects the tools you already pay for, without needing a developer. This is how the rest of this list stops being twelve separate islands.", [
      ["AISDR", "https://aisdr.com/", "AI sales outreach"],
      ["Make", "https://www.make.com/", "Formerly Integromat. Free plan includes 1,000 operations/mo"],
      ["Zapier", "https://zapier.com/", ""],
      ["n8n", "https://n8n.io/", "Hosted and open source"],
      ["IFTTT", "https://ifttt.com/", ""],
      ["Microsoft Power Automate", "https://www.microsoft.com/en-us/power-platform/products/power-automate", ""],
    ]],
    ["Direct mail", "Still a strong channel for life, final expense and Medicare. Used for lead generation, nurture and client appreciation.", [
      ["Lead Connections", "", "Medicare, final expense and annuity mail house"],
      ["Lead Concepts", "https://leadconcepts.com/", "Multi-line mail house"],
      ["Postalytics", "https://www.postalytics.com/", "Direct mail automation"],
      ["Lob", "https://www.lob.com/", ""],
      ["Click2Mail", "https://click2mail.com/", ""],
      ["Thanks.io", "https://thanks.io/", "AI assisted handwritten mail"],
      ["SendOutCards", "https://www.sendoutcards.com/", "Gifts and referrals"],
      ["Door Hangers", "", ""],
    ]],
    ["Local directories and citations", "Google Business Profile first, and fill in every field. Citations elsewhere are what hold up local rankings. Captive agents may already have a Yext profile through the carrier.", [
      ["Google Business Profile", "https://www.google.com/business/", ""],
      ["Bing Places", "https://www.bingplaces.com/", ""],
      ["Apple Business Connect", "https://businessconnect.apple.com/", "Apple Maps listings"],
      ["Yelp", "https://biz.yelp.com/", ""],
      ["Yext", "https://www.yext.com/", ""],
      ["BrightLocal", "https://www.brightlocal.com/", "Local rank checker"],
      ["Whitespark", "https://whitespark.ca/", ""],
      ["Moz Local", "https://moz.com/products/local", "Formerly GetListed"],
    ]],
    ["Print, cards and stationery", "Business cards and letterhead. Letterpress looks superb and costs accordingly.", [
      ["Overnight Prints", "https://www.overnightprints.com/", ""],
      ["Moo", "https://www.moo.com/", ""],
      ["UPrinting", "https://www.uprinting.com/", ""],
      ["Dolce Press", "https://dolcepress.com/", "Letterpress, high end"],
    ]],
  ]],
  ["Operations and organizations", [
    ["Email and business suites", "A free consumer mailbox is not a viable place for client information. The terms of service on free services generally allow the provider to use what passes through them, and a business mailbox costs a few dollars a month.", [
      ["Google Workspace", "https://workspace.google.com/", "Around $7/mo per user. Deep integration options"],
      ["Microsoft 365", "https://www.microsoft.com/en-us/microsoft-365/business", "Best fit if you live in Outlook and Office"],
      ["Fastmail", "https://www.fastmail.com/", "Low cost, privacy focused"],
      ["Zoho Workplace", "https://www.zoho.com/workplace/", "Good if you run other Zoho products"],
    ]],
    ["Licensing and continuing education", "Pre-licensing and online CE.", [
      ["Kaplan", "https://www.kaplanfinancial.com/insurance", ""],
      ["National Online Insurance School", "https://www.nationalonlineinsuranceschool.com/", ""],
      ["WebCE", "https://www.webce.com/", ""],
      ["InsuranceStudy", "https://www.insurancestudy.com/", ""],
      ["A.D. Banker", "https://www.adbanker.com/", ""],
    ]],
    ["Errors and omissions", "Direct sources and agent organizations that write E and O. If you work with an FMO or belong to an independent agent group, check whether they offer it first.", [
      ["EOforLess", "https://www.eoforless.com/", ""],
      ["Get Insured 24/7", "", ""],
      ["NAPA Benefits", "https://www.napa-benefits.org/", ""],
      ["American Agents Alliance", "https://agentsalliance.com/", ""],
    ]],
    ["FMOs, IMOs and appointments", "IMO, FMO and MGA get used interchangeably, and the definitions shift by product line and by carrier. In practice they all offer carrier contracts to independents, usually alongside training, technology, back-office support and lead programs.", [
      ["Ritter Insurance Marketing", "https://www.ritterim.com/", "Medicare, final expense, LTC, ancillary"],
      ["Senior Market Sales", "https://www.seniormarketsales.com/", "Medicare, FE, life, LTC, annuity"],
      ["Agent Pipeline", "https://www.agentpipeline.com/", "Health, Medicare, life"],
      ["Premier Marketing", "https://www.premiermarketinginc.com/", "Medicare, FE, life, LTC, annuity"],
      ["Precision Senior Marketing", "https://www.psmbrokerage.com/", "Medicare, FE, life, LTC, annuity"],
      ["Eldercare Insurance Services", "https://www.eldercareins.com/", "Medicare, FE, life, LTC, annuity"],
      ["Equis Financial", "https://equisfinancial.com/", "Life, FE, mortgage protection, annuity"],
    ]],
    ["Phone and communication", "VOIP, broadcast text, SMS marketing and voicemail. Several unified platforms cover all of it natively, so check what your AMS already does before adding another line item.", [
      ["Nextiva", "https://www.nextiva.com/", ""],
      ["RingCentral", "https://www.ringcentral.com/", ""],
      ["Phone.com", "https://www.phone.com/", ""],
      ["CallRail", "https://www.callrail.com/", "Call tracking and attribution"],
      ["Quo", "https://www.openphone.com/", "Formerly OpenPhone"],
      ["Bridge", "", "Phone, text and eSignature"],
      ["Lightspeed Voice", "https://lightspeedvoice.com/", ""],
      ["Twilio", "https://www.twilio.com/", "Programmable voice and SMS"],
      ["Drop Cowboy", "https://dropcowboy.com/", "Ringless voicemail"],
      ["Sly Broadcast", "https://www.slybroadcast.com/", "Ringless voicemail"],
    ]],
    ["Video conferencing and webinars", "Telesales and webinars replace a lot of drive time. The same tool usually covers client calls, team meetings and seminars.", [
      ["GoTo", "https://www.goto.com/", ""],
      ["Zoom", "https://zoom.us/", ""],
      ["Google Meet", "https://meet.google.com/", ""],
      ["Microsoft Teams", "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software", ""],
      ["Zoho Meeting", "https://www.zoho.com/meeting/", ""],
      ["Webex", "https://www.webex.com/", ""],
      ["eWebinar", "https://ewebinar.com/", "Automated webinars"],
      ["Amazon Chime", "https://aws.amazon.com/chime/", ""],
    ]],
    ["Productivity and everything else", "The general-purpose tools that end up running the back office.", [
      ["Google Workspace", "https://workspace.google.com/", "Mail, Docs, Sheets, Drive, Calendar"],
      ["AppSumo", "https://appsumo.com/", "Lifetime deals on newer software"],
      ["Make", "https://www.make.com/", ""],
      ["Zapier", "https://zapier.com/", ""],
      ["Claude", "https://claude.ai/", ""],
      ["ChatGPT", "https://chatgpt.com/", ""],
      ["Google Gemini", "https://gemini.google.com/", ""],
      ["Microsoft Copilot", "https://copilot.microsoft.com/", ""],
      ["Asana", "https://asana.com/", ""],
      ["Notion", "https://www.notion.com/", ""],
      ["Airtable", "https://www.airtable.com/", ""],
      ["Slack", "https://slack.com/", ""],
      ["Zoho Projects", "https://www.zoho.com/projects/", ""],
      ["LastPass", "https://www.lastpass.com/", ""],
      ["Dropbox", "https://www.dropbox.com/", ""],
      ["Trello", "https://trello.com/", ""],
      ["Google Alerts", "https://www.google.com/alerts", ""],
    ]],
  ]],
];

// Display groups over `P` by index. Leads, software and website all describe
// the stack an agency runs on, so they read as one group on the page; lead
// generation and operations stay on their own.
const GROUPS = [
  ["Digital and technology", [0, 1, 2]],
  ["Lead generation and marketing", [3]],
  ["Operations and organizations", [4]],
];

// Category cards cycle through these accents, in order.
const ACCENTS = ["yellow", "green", "blue", "lavender"];

export const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const parts = P.map(([name, cats]) => ({
  name,
  categories: cats.map(([cname, blurb, items]) => ({
    name: cname,
    blurb,
    items: items.map(([iname, url, note]) => ({ name: iname, url, note })),
  })),
}));

// The page renders `groups`: each carries its categories in order, and every
// category carries the id (its slug), running number and accent it is drawn
// with. Numbering runs across the whole page, not per group, so a card's
// number is the same wherever a search leaves it.
let n = 0;
export const groups = GROUPS.map(([name, idx]) => {
  const categories = idx.flatMap((i) =>
    parts[i].categories.map((c) => {
      n += 1;
      return {
        ...c,
        id: slug(c.name),
        num: String(n).padStart(2, "0"),
        accent: ACCENTS[(n - 1) % ACCENTS.length],
      };
    }),
  );
  return { id: slug(name), name, categories };
});

export const categories = groups.flatMap((g) => g.categories);
export const categoryCount = categories.length;
export const toolCount = categories.reduce((a, c) => a + c.items.length, 0);
