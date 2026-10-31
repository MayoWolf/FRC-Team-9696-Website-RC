import { mkdir, rm, cp, writeFile, readFile } from "node:fs/promises";
import { team as t } from "../src/content.mjs";
import { createHash } from "node:crypto";
const assetSources = {
  style: "src/style.css",
  app: "src/app.js",
  fonts: "public/assets/fonts.css",
  icon: "public/assets/icon.svg",
};
const assetUrls = {};
for (const [name, path] of Object.entries(assetSources)) {
  const hash = createHash("sha256")
    .update(await readFile(path))
    .digest("hex")
    .slice(0, 12);
  assetUrls[name] = `/assets/${name}-${hash}.${path.split(".").pop()}`;
}
const arrow = '<span aria-hidden="true">→</span>';
const ext = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true">↗</span></a>`;
const mail = (subject) =>
  `mailto:${t.email}?subject=${encodeURIComponent(subject)}`;
const button = (url, label, kind = "primary") =>
  `<a class="button ${kind}" href="${url}">${label}${arrow}</a>`;
const mascot = (cls = "") =>
  `<img class="${cls}" src="/assets/hami-mascot.png" width="1512" height="1506" alt="HAMI, our green robot mascot with a blue visor and a waving claw">`;
const doodle = (type) => {
  const paths = {
    wrench:
      "M34 8c-8-4-17 1-16 10L7 30a6 6 0 0 0 9 8l11-12c9 1 14-8 10-15l-7 8-6-6z",
    code: "m15 12-10 10 10 10m18-20 10 10-10 10m-7-25-5 30",
    flag: "M12 40V7m1 1c8-6 15 7 24 0v20c-9 7-16-6-24 0",
    pen: "m9 30 22-22 8 8-22 22-11 3zM26 13l8 8M9 30l8 8",
    bolt: "m28 4-18 23h13l-3 18 19-26H26z",
    star: "m24 4 5 13 14 1-11 9 4 14-12-8-12 8 4-14-11-9 14-1z",
  };
  return `<svg class="doodle doodle-${type}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[type] || paths.bolt}"/></svg>`;
};
const navigation = [
  ["/team/", "Our team"],
  ["/season/", "Seasons"],
  ["/resources/", "Resources"],
  ["/support/", "Support us"],
];
function shell({ title, description, path = "/", content }) {
  const nav = navigation
    .map(
      ([href, name]) =>
        `<a href="${href}" ${path === href ? 'aria-current="page"' : ""}>${name}</a>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} · Hamichanics 9696</title><meta name="description" content="${description}"><meta name="theme-color" content="#d2e4bf"><link rel="canonical" href="${t.site}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${title} · Hamichanics 9696"><meta property="og:description" content="${description}"><meta property="og:url" content="${t.site}${path}"><meta property="og:image" content="${t.site}/assets/hami-mascot.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${assetUrls.icon}" type="image/svg+xml"><link rel="stylesheet" href="${assetUrls.fonts}"><link rel="stylesheet" href="${assetUrls.style}"><script src="${assetUrls.app}" defer></script></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><div class="container header-inner"><a class="brand" href="/" aria-label="Hamichanics 9696 home"><img src="${assetUrls.icon}" width="56" height="56" alt=""><span>Hamichanics<small>FRC TEAM 9696</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Main navigation">${nav}<a class="nav-join" href="/join/" ${path === "/join/" ? 'aria-current="page"' : ""}>Join the team</a></nav></div></header><main id="main">${content}</main><footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-home"><a class="brand" href="/"><img src="${assetUrls.icon}" width="56" height="56" alt=""><span>Hamichanics<small>FRC TEAM 9696</small></span></a><p>Alexander Hamilton High School<br>Los Angeles, California</p><a href="mailto:${t.email}">${t.email}</a></div><div><h2>Take a look around</h2>${navigation.map(([url, name]) => `<a href="${url}">${name}</a>`).join("")}<a href="/join/">Join & mentor</a></div><div><h2>Keep in touch</h2>${ext(t.newsletter, "Team newsletter")}${ext(t.tba, "Matches on The Blue Alliance")}${ext(t.first, "Our FIRST profile")}${ext(t.donate, "Donate through HCB")}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Hamichanics · FRC Team 9696</span>${ext("https://github.com/MayoWolf/FRC-Team-9696-Website-RC", "Website source")}<a href="#main">Back to top ↑</a></div></div></footer></body></html>`;
}
const pageHero = (n, kicker, title, desc, extra = "") =>
  `<section class="page-hero"><div class="container"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lead">${desc}</p>${extra}</div><div class="hero-spark" aria-hidden="true">${doodle("bolt")}</div></section>`;
const cta = `<section class="join-banner"><div class="container join-banner-inner"><div class="banner-face" aria-hidden="true"><img src="${assetUrls.icon}" alt="" width="110" height="110"></div><div><h2>Come hang out with the robots.</h2><p>Interested in joining or mentoring? Send us a hello.</p></div>${button("/join/", "Get in touch", "blue")}</div></section>`;
const activities = [
  [
    "wrench",
    "Build it",
    "Sketch parts, try out mechanisms, and learn to use CAD and workshop tools.",
  ],
  [
    "code",
    "Program it",
    "Write code, work with sensors, and figure out why the robot did that.",
  ],
  [
    "flag",
    "Play the game",
    "Learn the rules, scout matches, and practice working with an alliance.",
  ],
  [
    "pen",
    "Tell the story",
    "Help with design, fundraising, documentation, and team communications.",
  ],
];
const work = `<section class="section workshop" id="build"><div class="container"><div class="section-heading"><div><p class="kicker">WHAT WE DO</p><h2>A lot goes into a robot.</h2></div><p>You can work on the machine or help the team around it. Here are a few places to start.</p></div><div class="activities">${activities.map(([type, title, text]) => `<article><div class="tool-sticker">${doodle(type)}</div><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>`;
const resource = (url, title, desc) =>
  `<a class="resource" href="${url}" ${url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}><div><h3>${title}</h3><p>${desc}</p></div><span aria-hidden="true">↗</span></a>`;
const pages = [
  {
    path: "/",
    title: "Hi from Team 9696!",
    description:
      "We’re the Hamichanics, FRC Team 9696 at Alexander Hamilton High School in Los Angeles. Meet our team, follow our seasons, and get involved.",
    content: `
 <section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="team-sticker">Hamilton High School · Los Angeles</p><h1>We’re the<br><span>Hamichanics!</span></h1><p>High school students. Robot builders.<br>And the humans behind FRC Team 9696.</p><p class="hero-description">We design, build, and program robots at Alexander Hamilton High School. Meet the team—and our little green friend, HAMI.</p><div class="actions">${button("/team/", "Meet the team")}${button("/join/", "Join us", "outline")}</div></div><div class="hami-scene"><div class="number-sticker">TEAM <strong>9696</strong></div><div class="mascot-blob">${mascot("hero-mascot")}</div><span class="hami-hello">Hey, Hamilton!</span><span class="scene-bolt">${doodle("bolt")}</span><svg class="scene-lines" viewBox="0 0 80 80" aria-hidden="true"><path d="m28 35-9-8m23 0-1-14m14 23 12-7"/></svg><p class="hami-caption">That’s HAMI. Say hi! <span aria-hidden="true">↖</span></p></div></div></section>
 <section class="home-shortcuts"><div class="container"><a href="${t.newsletter}" target="_blank" rel="noopener noreferrer"><span class="shortcut-icon">${doodle("pen")}</span><span><strong>Notes from the team</strong><small>Read our newsletter</small></span>${arrow}</a><a href="/season/"><span class="shortcut-icon">${doodle("flag")}</span><span><strong>See us on the field</strong><small>Seasons & match results</small></span>${arrow}</a><a href="/support/"><span class="shortcut-icon">${doodle("wrench")}</span><span><strong>Help keep us building</strong><small>Support Team 9696</small></span>${arrow}</a></div></section>
 <section class="section welcome"><div class="container welcome-grid"><div><p class="kicker">A LITTLE ABOUT US</p><h2>Hamilton’s own<br>robotics team.</h2><div class="school-tag">Los Angeles, CA <span aria-hidden="true">✳</span> FRC since 2024</div></div><div><p class="big-copy">We’re learning our way around the workshop, one robot at a time.</p><p>The Hamichanics compete in FIRST Robotics Competition, where high school teams build a robot for a new game each season. Our work includes designing parts, assembling mechanisms, writing code, and getting ready for matches.</p><p>Our first FRC season was in 2024. At that year’s Orange County Regional, we took home the Rookie Inspiration Award.</p><a class="text-link" href="/team/">More about the Hamichanics ${arrow}</a></div></div></section>
 ${work}
 <section class="section noticeboard"><div class="container"><p class="kicker">ON THE TEAM NOTICEBOARD</p><h2>Robots, results & what’s next.</h2><div class="notice-grid"><article class="notice next-note"><span class="pin" aria-hidden="true"></span><span class="note-label">NEXT SEASON</span><h3>Hello,<br>BIOCORE!</h3><p>The next FRC game arrives January 9, 2027. Find the kickoff details and official resources here.</p><a class="text-link" href="/season/#2027">2027 season info ${arrow}</a><span class="note-doodle">${doodle("bolt")}</span></article><article class="notice results-note"><span class="pin" aria-hidden="true"></span><span class="note-label">FROM THE FIELD</span><h3>Our 2026<br>season</h3><p>We competed at the Los Angeles and Glendale district events. Check out the results and match videos.</p><a class="text-link" href="/season/#2026">Look back at 2026 ${arrow}</a></article><article class="notice award-note"><span class="pin" aria-hidden="true"></span><span class="award-star">${doodle("star")}</span><h3>Our first<br>FRC award!</h3><p>Rookie Inspiration Award<br>Orange County Regional · 2024</p><a class="text-link" href="/season/#2024">Where we started ${arrow}</a></article></div></div></section>
 <section class="section support-home"><div class="container support-home-inner"><div><p class="kicker">THANKS FOR HELPING OUT</p><h2>Parts. Rides.<br>Snacks. Support.</h2><p>Donations help with robot parts and transportation to competitions. You can also ask us about materials, mentoring, and other ways to help.</p>${button("/support/", "Support the Hamichanics", "blue")}</div><div class="support-drawing" aria-hidden="true">${doodle("wrench")}<span>Every bit<br>helps!</span>${doodle("bolt")}</div></div></section>${cta}`,
  },
  {
    path: "/team/",
    title: "Our team",
    description:
      "Meet the Hamichanics, Alexander Hamilton High School’s FRC robotics team in Los Angeles. Team 9696 since 2024.",
    content: `${pageHero("", "MEET TEAM 9696", "Hi! We’re the<br>Hamichanics.", "We’re the robotics team at Alexander Hamilton High School in Los Angeles. Our mascot is HAMI. Our FRC number is 9696.")}
 <section class="section"><div class="container about-grid"><figure class="mascot-portrait">${mascot()}<figcaption>Our little green teammate, HAMI.</figcaption></figure><div><p class="kicker">ROBOTS AT HAMILTON</p><h2>What happens<br>in robotics?</h2><p>We build and program robots, learn to use machinery, and make CAD designs. Our training has included smaller robots and a mock competition to help members prepare for FRC.</p><p>In FIRST Robotics Competition, each season brings a new game. Teams work through its rules, design a robot, and compete alongside other teams in alliances.</p><p>There’s plenty of work away from the machine, too: organizing, documenting progress, fundraising, and helping families stay informed.</p>${ext(t.newsletter, "Read the team newsletter")}</div></div></section>${work}
 <section class="section team-history"><div class="container history-grid"><div class="year-bubble"><strong>2024</strong><span>Our first FRC season</span></div><div><h2>How it started</h2><p>Team 9696 made its FRC debut in 2024 and received the Rookie Inspiration Award at the Orange County Regional. In 2026, we competed at the Los Angeles and Glendale district events.</p>${button("/season/", "Explore our seasons", "outline")}</div></div></section>
 <section class="section"><div class="container simple-split"><div><p class="kicker">STUDENTS & MENTORS</p><h2>Have a question<br>for the team?</h2></div><div><p>Ask us about current leadership, meeting times, joining, or mentoring. The team can share the latest details.</p>${button(mail("Hello, Hamichanics — team inquiry"), "Email the team")}</div></div></section>${cta}`,
  },
  {
    path: "/season/",
    title: "Seasons & results",
    description:
      "Hamichanics FRC seasons, competition results, match videos, and official information about the 2027 BIOCORE kickoff.",
    content: `${pageHero("", "ON THE FIELD", "Our seasons<br>& robot adventures.", "Find official match records, revisit our first FRC season, and see what’s coming next.")}<nav class="year-nav container" aria-label="Jump to season"><a href="#2027">2027 · Next up</a><a href="#2026">2026 · REBUILT</a><a href="#2024">2024 · Our debut</a></nav>
 <section class="section season-feature" id="2027"><div class="container season-grid"><div><p class="kicker">NEXT UP · 2027</p><h2>BIOCORE!</h2><p class="big-copy">Presented by Haas<br>Part of FIRST CANOPY</p><p>FIRST will reveal the 2027 FRC game on January 9, 2027. Check the official season page for announcements and resources.</p>${ext(t.game, "Official season information", "button primary")}<p class="small muted">Contact the team separately for event registrations and travel plans.</p></div><aside class="calendar"><span class="calendar-rings" aria-hidden="true"></span><div class="calendar-month">JANUARY 2027</div><strong>9</strong><h3>Game reveal day</h3><p>Saturday · 9 AM Pacific<br>12 PM Eastern</p><a class="text-link" href="/assets/kickoff.ics" download>Add to your calendar ↓</a><p class="small">FIRST’s broadcast, not a team meeting. Calendar reserves one hour; broadcast duration may vary.</p></aside></div></section>
 <section class="section" id="2026"><div class="container"><p class="kicker">2026 · REBUILT</p><h2>Two district events.</h2><p class="section-intro">Our 2026 official season took us to El Segundo and Glendale.</p><div class="event-list"><article><div class="event-date"><span>MAR</span><strong>20–22</strong><span>2026</span></div><div><h3>Los Angeles</h3><p>CA District Los Angeles Event<br>El Segundo, California</p></div>${ext("https://frc-events.firstinspires.org/2026/CALAS", "Event results")}</article><article><div class="event-date"><span>MAR</span><strong>27–29</strong><span>2026</span></div><div><h3>Glendale</h3><p>CA District Glendale Event<br>Glendale, California</p></div>${ext("https://frc-events.firstinspires.org/2026/CAGLE", "Event results")}</article></div><div class="actions archive-links">${ext("https://www.thebluealliance.com/team/9696/2026", "Matches & videos")}${ext("https://frc-events.firstinspires.org/2026/team/9696", "Official team record")}</div><p class="small muted">Past events. Dates include the official load-in windows.</p></div></section>
 <section class="section debut" id="2024"><div class="container debut-inner"><div class="debut-award">${doodle("star")}<h3>Rookie<br>Inspiration<br>Award</h3><span>ORANGE COUNTY · 2024</span></div><div><p class="kicker">2024 · CRESCENDO</p><h2>Our first time out.</h2><p>Our FRC story started at the 2024 Orange County Regional, where Team 9696 received the Rookie Inspiration Award.</p>${ext("https://frc-events.firstinspires.org/2024/team/9696", "See our rookie season")}</div></div></section>${cta}`,
  },
  {
    path: "/support/",
    title: "Support the team",
    description:
      "Help the Hamichanics with robot parts, transportation, mentoring, or materials. Donate through the team’s public HCB fundraiser.",
    content: `${pageHero("", "HELP TEAM 9696", "A little help<br>for our robots.", "Robot parts and competition transportation add up. Here’s how you can help the Hamichanics.", button(t.donate, "Donate through HCB"))}
 <section class="section"><div class="container"><h2>What your support helps with</h2><div class="support-needs"><article>${doodle("wrench")}<h3>Robot parts</h3><p>Parts and materials for prototypes, mechanisms, and repairs.</p></article><article>${doodle("flag")}<h3>Getting to events</h3><p>Transportation for students, equipment, and the robot.</p></article><article>${doodle("bolt")}<h3>Keeping us going</h3><p>Snacks and water help, too. Check with the team before dropping anything off.</p></article></div></div></section>
 <section class="section giving-section"><div class="container giving-grid"><div><p class="kicker">OUR TEAM FUNDRAISER</p><h2>Give through HCB.</h2><p>Our public fundraiser is listed as “9696 Hamilton Hamichanics” on HCB. Donations and payment details are handled on their website.</p>${ext(t.donate, "Visit our fundraiser", "button primary")}<p class="small muted">HCB has the current fundraiser details and donation terms.</p></div><aside class="contact-note"><h3>Want to help<br>another way?</h3><p>We’d love to hear about tools, materials, company sponsorships, or mentoring. Ask the team what’s needed right now.</p><a class="text-link" href="${mail("Supporting Team 9696")}">Email the Hamichanics ${arrow}</a></aside></div></section>
 <section class="section"><div class="container thanks"><p class="kicker">A BIG THANK-YOU</p><h2>To our supporters</h2><p>Our 2026 FIRST sponsor listing includes:</p><div class="partner-row"><span>Just Keep Livin<br>Foundation</span><span>Alexander Hamilton<br>High School</span></div>${ext("https://frc-events.firstinspires.org/2026/team/9696", "Official 2026 sponsor listing")}</div></section>${cta}`,
  },
  {
    path: "/join/",
    title: "Join & mentor",
    description:
      "Want to join the Hamichanics or mentor Team 9696? Contact our Hamilton High School robotics team for current meeting and participation details.",
    content: `${pageHero("", "COME SAY HELLO", "There’s room<br>for another human.", "Interested in robots, code, design, or helping a team? Tell us a little about yourself and ask how to get involved.")}
 <section class="section"><div class="container join-grid"><article class="join-card student-card">${doodle("wrench")}<p class="kicker">FOR HAMILTON STUDENTS</p><h2>Meet the robots.<br>Meet the team.</h2><p>Email us your name, grade, and what you’re interested in. We’ll help you find out about current meetings and the next steps for joining.</p><p>You might enjoy CAD, building, programming, strategy, fundraising, or media. You don’t have to pick a specialty before saying hello.</p>${button(mail("Interested in joining the Hamichanics"), "Ask about joining")}</article><article class="join-card mentor-card">${doodle("code")}<p class="kicker">FOR MENTORS & VOLUNTEERS</p><h2>Show us<br>what you know.</h2><p>Have experience with engineering, programming, design, communication, or organization? Tell the team about your background and availability.</p><p>The team can explain its current needs and the school and FIRST requirements for volunteers.</p>${button(mail("Team 9696 — mentoring inquiry"), "Ask about mentoring", "blue")}</article></div></section>
 <section class="section faq-section"><div class="container faq-grid"><div><p class="kicker">A FEW QUESTIONS</p><h2>Before you<br>drop by…</h2><div class="faq-doodle" aria-hidden="true">?</div></div><div class="faqs"><details><summary>Do I need robotics experience?</summary><p>Tell us where you’re starting. The team has taught members CAD, building, machinery, and programming. Ask about our current process for new members.</p></details><details><summary>When and where do you meet?</summary><p>Email the team for the current schedule and room. Build hours can change during competition season.</p></details><details><summary>What if I’m not a programmer?</summary><p>There’s mechanical design, assembly, electrical work, strategy, documentation, fundraising, and communication, too.</p></details><details><summary>How can families stay informed?</summary><p>Read the <a href="${t.newsletter}" target="_blank" rel="noopener noreferrer">team newsletter</a>, and contact us for current forms, parent communications, and travel plans. Older posts contain past schedules.</p></details><details><summary>Can I help without joining?</summary><p>Yes—visit our <a href="/support/">support page</a> or ask about mentoring and materials.</p></details></div></div></section><section class="section contact-section"><div class="container"><p class="kicker">HERE’S OUR EMAIL</p><h2>Hello, Hamichanics!</h2><a class="contact-email" href="mailto:${t.email}">${t.email} ${arrow}</a></div></section>`,
  },
  {
    path: "/resources/",
    title: "Team resources",
    description:
      "Useful links for Hamichanics students and families: team updates, competition results, programming documentation, and CAD resources.",
    content: `${pageHero("", "THE USEFUL STUFF", "Links for<br>robot people.", "Team updates, match results, and a few handy places to learn. Pick what you need below.")}
 <section class="section"><div class="container resource-layout"><div><span class="resource-sticker">${doodle("pen")}</span><h2>Team & families</h2><p>Confirm current logistics with the team. Newsletter archives include past schedules.</p></div><div class="resource-list">${resource(t.newsletter, "Team newsletter", "Updates, competition information, and notes to families.")}${resource(mail("Team 9696 — question"), "Email the team", "Ask about meetings, joining, forms, or helping out.")}${resource(t.donate, "Team fundraiser", "Donate to Hamilton Hamichanics through HCB.")}</div></div></section>
 <section class="section resource-blue"><div class="container resource-layout"><div><span class="resource-sticker">${doodle("flag")}</span><h2>Games & matches</h2></div><div class="resource-list">${resource(t.game, "Official FRC season page", "Game announcements, kickoff information, and season resources.")}${resource(t.first, "Our FIRST profile", "Official participation history and awards for Team 9696.")}${resource(t.tba, "The Blue Alliance", "Results and available match videos.")}</div></div></section>
 <section class="section"><div class="container resource-layout"><div><span class="resource-sticker">${doodle("code")}</span><h2>Learn something</h2><p>External tools and documentation for exploring robotics.</p></div><div class="resource-list">${resource("https://docs.wpilib.org/", "WPILib docs", "FRC programming, controls, electrical systems, and robot software.")}${resource("https://www.onshape.com/en/education/", "Onshape for education", "Browser-based CAD and learning resources.")}${resource("https://www.firstinspires.org/programs/frc", "What is FRC?", "An introduction to FIRST Robotics Competition.")}</div></div></section>${cta}`,
  },
];
await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const [name, path] of Object.entries(assetSources))
  await cp(path, `dist${assetUrls[name]}`);
for (const page of pages) {
  const folder = `dist${page.path}`;
  await mkdir(folder, { recursive: true });
  await writeFile(`${folder}index.html`, shell(page));
}
await writeFile(
  "dist/404.html",
  shell({
    title: "Page not found",
    description: "Find your way back to the Hamichanics.",
    path: "/404.html",
    content: pageHero(
      "404",
      "A SMALL DETOUR",
      "Oops!<br>This page is missing.",
      "Let’s get you back to the Hamichanics homepage.",
      button("/", "Back to the homepage"),
    ),
  }),
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p) => `<url><loc>${t.site}${p.path}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${t.site}/sitemap.xml\n`,
);
await writeFile(
  "dist/assets/kickoff.ics",
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hamichanics//FRC Kickoff//EN",
    "BEGIN:VEVENT",
    "UID:2027-frc-kickoff@team9696.netlify.app",
    "DTSTAMP:20261031T000000Z",
    "DTSTART:20270109T170000Z",
    "DTEND:20270109T180000Z",
    "SUMMARY:2027 FRC BIOCORE game reveal",
    "DESCRIPTION:Official FIRST game reveal. One-hour calendar slot; broadcast duration may vary. Not a team meeting. Confirm details with FIRST.",
    "URL:" + t.game,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n"),
);
console.log(
  `Built ${pages.length} pages + 404, sitemap, robots, and calendar.`,
);
