# cards-ui

Responsive card UI demos: a set of static HTML pages showing how to build
card-based interfaces with plain HTML/CSS, plus a programmatic renderer that
generates cards from JSON data using [Mustache](https://mustache.github.io/)
templates and [Zepto](https://zeptojs.com/).

## Demos

| File                             | What it shows                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `01_simple_card.html`            | A single card built from plain HTML                                                                 |
| `02_multiple_cards_float.html`   | Multiple fixed-width cards laid out with CSS floats                                                 |
| `03_multiple_cards_columns.html` | Cards arranged in left/right columns                                                                |
| `04_programmatic_cards.html`     | Cards rendered from JSON data via a Mustache template, laid out into a responsive number of columns |

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (for the tooling and tests)

The required Node version is pinned in two places: the `engines` field in
`package.json` and a `.nvmrc` file (for `nvm use` / `fnm use`). No environment
variables are required to install, run, or test this project.

## Install

```sh
npm install
```

This installs the runtime libraries (`mustache`, `zepto`) and the development
tooling (Jest, ESLint, Prettier, http-server) and generates
`package-lock.json` for reproducible installs.

## Run

The demos are static pages, so you can open any `*.html` file directly in a
browser. To serve them over HTTP instead:

```sh
npm start
```

then visit <http://localhost:8080/04_programmatic_cards.html>.

## Test

```sh
npm test
```

Runs the Jest suite for the card layout logic in `src/cards.js` and enforces a
coverage threshold (70% lines).

## Lint and format

```sh
npm run lint        # ESLint over src/ and test/
npm run format      # Prettier check (CI enforces this)
npm run format:write  # Apply Prettier formatting
```

## Architecture

- `src/cards.js` — pure, framework-agnostic card logic: the card dataset,
  responsive column-count computation, column width calculation, card
  rendering, and round-robin card distribution. Exposed as a CommonJS module
  and as a browser global (`window.Cards`).
- `src/index.js` — browser entry point that wires `cards.js` to the DOM with
  Zepto: renders the cards into columns and re-lays them out on window resize.
  `04_programmatic_cards.html` loads `src/cards.js` and `src/index.js` directly,
  so the demo exercises the same code that the test suite covers.
- `assets/css/styles.css` — all card, column, and page styling.
- `assets/js/` — vendored third-party libraries (`mustache.js`,
  `zepto.min.js`) pinned for the legacy demo pages. The same libraries are
  declared as npm dependencies in `package.json` for the module code and
  tests.

## License

MIT. Demo images copyright 2013 Andrew Trice.
