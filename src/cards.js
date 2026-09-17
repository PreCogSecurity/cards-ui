/**
 * cards.js - Core card UI logic for the cards-ui demo.
 *
 * Pure, framework-agnostic functions for computing the responsive column
 * layout and rendering card markup from data. The DOM wiring lives in
 * index.js; this module is kept free of DOM dependencies so it can be
 * unit-tested in Node.
 *
 * Works as a CommonJS module (for tests) and as a browser global
 * (window.Cards) when loaded via a plain <script> tag.
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Cards = factory();
    }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    /** Minimum viewport width (px) below which an additional column is not created. */
    var MIN_COL_WIDTH = 300;

    /**
     * Data used to render the card templates. Each entry maps to a section
     * of the Mustache template in 04_programmatic_cards.html.
     */
    var cardsData = [
        {
            title: "This is a card!",
            message:
                "In essence, a card is just a rectangular region which contains content. " +
                "This content is just HTML. This could be <b>text</b>, <i>images</i>, " +
                "<u>lists</u>, etc... The card UI metaphor dictates the interaction and " +
                "layout of these regions."
        },
        {
            message: "Yep, just some simple content encapsulated in this card.",
            image: "image1"
        },
        {
            image: "image2",
            banner: true,
            caption: "Image, Banner & HTML",
            message: "All standard HTML structures, styled with CSS."
        },
        {
            title: "This is another card!",
            image: "image4",
            message:
                "Here, you can see a more complex card. It is all just layout of HTML structures.",
            caption: "Look, it's Vegas!"
        },
        {
            message: "Yep, just some simple content encapsulated in this card.",
            image: "image5",
            banner: true
        },
        {
            image: "image6",
            caption: "It's a college!",
            message:
                "With HTML in the content.<ul><li>Bullet 1</li><li>Bullet 2</li><li>Bullet 3</li></ul>"
        },
        {
            image: "image1",
            caption: "San Francisco City Hall",
            message:
                "All of these photos were captured with a quadcopter and GoPro! " +
                "Check out my blog <a href='http://tricedesigns.com'>http://tricedesigns.com</a> " +
                "to learn more!"
        }
    ];

    /**
     * Coerces an arbitrary value into a valid column count (>= 1).
     * Invalid input falls back to a single column.
     */
    function normalizeColumnCount(columnCount) {
        if (typeof columnCount !== "number" || !isFinite(columnCount) || columnCount < 1) {
            return 1;
        }
        return Math.floor(columnCount);
    }

    /**
     * Returns the number of columns that fit in the given viewport width.
     * Always at least one column, even for very narrow viewports.
     */
    function columnCountForWidth(width) {
        if (typeof width !== "number" || !isFinite(width) || width <= 0) {
            return 1;
        }
        return Math.max(1, Math.floor(width / MIN_COL_WIDTH));
    }

    /**
     * Returns the CSS width (as a percentage string) of a column in a
     * layout with the given number of columns.
     */
    function columnWidthPercent(columnCount) {
        return Math.floor(100 / normalizeColumnCount(columnCount)) + "%";
    }

    /**
     * Renders a single card from the given data using a compiled Mustache
     * template function. Falls back to an empty string for invalid input.
     */
    function renderCard(compiledTemplate, card) {
        if (typeof compiledTemplate !== "function") {
            return "";
        }
        return compiledTemplate(card || {});
    }

    /**
     * Distributes the given cards across `columnCount` columns in a
     * round-robin fashion, returning an array of arrays (one per column).
     * Non-array input yields empty columns.
     */
    function distributeCards(cards, columnCount) {
        var count = normalizeColumnCount(columnCount);
        var columns = [];
        for (var i = 0; i < count; i++) {
            columns.push([]);
        }
        if (!Array.isArray(cards)) {
            return columns;
        }
        for (var j = 0; j < cards.length; j++) {
            columns[j % count].push(cards[j]);
        }
        return columns;
    }

    return {
        MIN_COL_WIDTH: MIN_COL_WIDTH,
        cardsData: cardsData,
        normalizeColumnCount: normalizeColumnCount,
        columnCountForWidth: columnCountForWidth,
        columnWidthPercent: columnWidthPercent,
        renderCard: renderCard,
        distributeCards: distributeCards
    };
});
