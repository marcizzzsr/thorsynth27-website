# ThorSynth @ ISBI 2027 — challenge website

Static website of the ThorSynth challenge (synthetic thoracic CT from 3T Dixon MRI), served with GitHub Pages.
No build step: plain HTML, CSS and JavaScript.

## Structure

| Path | Content |
| --- | --- |
| `index.html` | Home |
| `challenge.html` | Motivation, task, tracks, data, evaluation |
| `participate.html` | Participant guide |
| `leaderboard.html` | Leaderboard preview (shows a notice until the validation phase starts) |
| `rules.html` | Schedule, rules, data terms, awards, FAQ |
| `organizers.html` | Organizing team and contacts |
| `assets/config.js` | **All dates and links**: timeline, Codabench, Zenodo, GitHub, email |
| `assets/site.js` | Shared header and footer, timeline, leaderboard, link handling |
| `assets/site.css` | Styles |

## Editing

- **Dates and links**: edit `assets/config.js` only. Timeline, countdown, announcement bar and buttons update from it.
- **Links not public yet**: leave the value empty (`""`). The site shows the link as "coming soon" and makes it clickable as soon as a URL is filled in.
- **Texts**: page texts come from the shared content document and are synced into the HTML files through pull requests.
- **Leaderboard**: until the validation start date the page shows a notice. Add `#preview` to the page URL to see the board layout.

## Publishing

GitHub Pages, branch `main`, folder `/ (root)`. Changes reach `main` only through pull requests approved by the repository owner.
