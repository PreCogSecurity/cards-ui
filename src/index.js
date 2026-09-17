/**
 * index.js - Browser entry point for the cards-ui demo.
 *
 * Wires the pure card logic from cards.js to the DOM using Zepto:
 * renders the card data into a responsive set of columns and re-lays
 * the cards out when the window is resized.
 *
 * Expects the following globals to be loaded first (see
 * 04_programmatic_cards.html): Zepto, Mustache, and Cards.
 */
(function (root) {
    "use strict";

    var Cards = root.Cards;
    var Zepto = root.Zepto;
    var Mustache = root.Mustache;

    if (!Cards || !Zepto || !Mustache) {
        return;
    }

    var content, columns, compiledCardTemplate;

    /**
     * Compiles a Mustache template string into a render function. Supports
     * both the legacy vendored mustache.js 0.7.x API (Mustache.compile) and
     * the modern mustache 4.x API (Mustache.render).
     */
    function compileTemplate(templateString) {
        if (typeof Mustache.compile === "function") {
            return Mustache.compile(templateString);
        }
        return function (view) {
            return Mustache.render(templateString, view);
        };
    }

    Zepto(function ($) {
        content = $(".content");
        compiledCardTemplate = compileTemplate($("#card-template").html());
        layoutColumns();
        $(window).resize(onResize);
    });

    /** Resize event handler: re-lays out only when the column count changes. */
    function onResize() {
        var targetColumns = Cards.columnCountForWidth($(document).width());
        if (columns !== targetColumns) {
            layoutColumns();
        }
    }

    /** Rebuilds the responsive column layout from the card data. */
    function layoutColumns() {
        var columnCount = Cards.columnCountForWidth($(document).width());

        content.detach();
        content.empty();

        var columnsDom = [];
        for (var x = 0; x < columnCount; x++) {
            var col = $('<div class="column">');
            col.css("width", Cards.columnWidthPercent(columnCount));
            columnsDom.push(col);
            content.append(col);
        }

        var distributed = Cards.distributeCards(Cards.cardsData, columnCount);
        for (var c = 0; c < distributed.length; c++) {
            for (var i = 0; i < distributed[c].length; i++) {
                var html = Cards.renderCard(compiledCardTemplate, distributed[c][i]);
                columnsDom[c].append($(html));
            }
        }
        $("body").prepend(content);
    }
})(typeof window !== "undefined" ? window : this);
