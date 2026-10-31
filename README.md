# FRC Team 9696 Website RC

The Hamichanics website for Alexander Hamilton High School in Los Angeles.

**Live:** https://team9696.netlify.app

Six static pages: home, team, seasons, support, join/mentor, and resources. Includes responsive navigation, a keyboard-accessible discipline explorer, native FAQ disclosures, and a downloadable 2027 FIRST kickoff calendar entry. No accounts, tracking, or third-party JavaScript.

## Development

Requires Node.js 22 or newer. There are no package dependencies.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:9696. The development server rebuilds once at startup; restart after source changes.

## Editing

- `src/content.mjs`: public team contact, external links, and robotics disciplines.
- `scripts/build.mjs`: page content, shared navigation/footer, metadata, sitemap, calendar generation.
- `src/style.css`: responsive layouts and visual design.
- `src/app.js`: mobile menu and accessible tabs.
- `public/assets/`: locally hosted mascot, icon, and fonts.

The build creates `dist/`. Only `dist/` is published. Netlify configuration is in `netlify.toml`. Local `.netlify/` state is ignored by Git.

## Deployment

Production branch: `main`. Build command: `npm run build`; publish directory: `dist`.

Netlify project: `team9696` (`48ed3d34-aea9-4d05-a7cd-3278bf61a226`).

```sh
netlify link --id 48ed3d34-aea9-4d05-a7cd-3278bf61a226
npm run build
npm run check
netlify deploy --prod --dir dist --no-build
```

When continuous deployment is connected, pushes to `main` publish automatically. Manual production deploys on a Git-connected project are replaced by the next production branch deploy.

## Content provenance

Reviewed October 30, 2026. The RC intentionally avoids unverified meeting schedules, student rosters, sponsor tiers, robot specifications, and social accounts.

- [FIRST team profile](https://frc-events.firstinspires.org/team/9696): team name, school, Los Angeles location, 2024 rookie year, and 2024 Rookie Inspiration Award.
- [FIRST 2026 record](https://frc-events.firstinspires.org/2026/team/9696): Los Angeles and Glendale events; sponsor listing.
- [Team public newsletter](https://lucas-newsletter-c46894.beehiiv.com/): training activities, public communications, and fundraising needs.
- [March 2026 team update](https://lucas-newsletter-c46894.beehiiv.com/p/hamilton-robotics-hamichanics-a6e9): team email `hamiteam5510@gmail.com` and fundraising information.
- [Team HCB donation page](https://hcb.hackclub.com/donations/start/9696-hami-hamichanics): donation destination and HAMI mascot. The older `9696-hami-yankatrons` URL redirects here.
- [FIRST game and season](https://www.firstinspires.org/programs/frc/game-and-season): 2027 BIOCORE name, January 9 kickoff, and 12 PM Eastern broadcast timing. Calendar reserves one hour; broadcast duration may vary.
- [The Blue Alliance](https://www.thebluealliance.com/team/9696): linked match records and video discovery.

Original descriptive copy illustrates the work and learning involved in robotics. It does not assert a current roster or guarantee a particular membership policy. External destinations maintain their own content and policies.

## License

Website source code and original icon: MIT. See `LICENSE`.

The team mascot is an existing team asset and is **not** relicensed under MIT. Fonts are licensed under the SIL Open Font License. See `THIRD_PARTY_NOTICES.md` and `public/assets/licenses/`.
