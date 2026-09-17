/**
 * Tests for the pure card layout logic in src/cards.js.
 */
const Cards = require("../src/cards");
const Mustache = require("mustache");

/**
 * Compiles a Mustache template string into a render function using the
 * modern mustache 4.x API (the legacy 0.7.x Mustache.compile API is only
 * present in the vendored copy used by the demo pages).
 */
function compileTemplate(templateString) {
    return function (view) {
        return Mustache.render(templateString, view);
    };
}

describe("normalizeColumnCount", () => {
    test("floors fractional counts to a whole number", () => {
        expect(Cards.normalizeColumnCount(2.9)).toBe(2);
        expect(Cards.normalizeColumnCount(1.1)).toBe(1);
    });

    test("keeps valid positive integers unchanged", () => {
        expect(Cards.normalizeColumnCount(1)).toBe(1);
        expect(Cards.normalizeColumnCount(4)).toBe(4);
    });

    test("guards against invalid input with a single-column fallback", () => {
        expect(Cards.normalizeColumnCount(0)).toBe(1);
        expect(Cards.normalizeColumnCount(-3)).toBe(1);
        expect(Cards.normalizeColumnCount(NaN)).toBe(1);
        expect(Cards.normalizeColumnCount(Infinity)).toBe(1);
        expect(Cards.normalizeColumnCount("2")).toBe(1);
        expect(Cards.normalizeColumnCount(undefined)).toBe(1);
        expect(Cards.normalizeColumnCount(null)).toBe(1);
    });
});

describe("columnCountForWidth", () => {
    test("returns at least one column for any positive width", () => {
        expect(Cards.columnCountForWidth(1)).toBe(1);
        expect(Cards.columnCountForWidth(299)).toBe(1);
    });

    test("adds a column for every MIN_COL_WIDTH of viewport", () => {
        expect(Cards.columnCountForWidth(300)).toBe(1);
        expect(Cards.columnCountForWidth(600)).toBe(2);
        expect(Cards.columnCountForWidth(900)).toBe(3);
        expect(Cards.columnCountForWidth(1200)).toBe(4);
    });

    test("guards against invalid input", () => {
        expect(Cards.columnCountForWidth(0)).toBe(1);
        expect(Cards.columnCountForWidth(-100)).toBe(1);
        expect(Cards.columnCountForWidth(NaN)).toBe(1);
        expect(Cards.columnCountForWidth(Infinity)).toBe(1);
        expect(Cards.columnCountForWidth("600")).toBe(1);
        expect(Cards.columnCountForWidth(undefined)).toBe(1);
        expect(Cards.columnCountForWidth(null)).toBe(1);
    });
});

describe("columnWidthPercent", () => {
    test("computes a percentage width per column", () => {
        expect(Cards.columnWidthPercent(1)).toBe("100%");
        expect(Cards.columnWidthPercent(2)).toBe("50%");
        expect(Cards.columnWidthPercent(3)).toBe("33%");
        expect(Cards.columnWidthPercent(4)).toBe("25%");
    });

    test("guards against invalid column counts", () => {
        expect(Cards.columnWidthPercent(0)).toBe("100%");
        expect(Cards.columnWidthPercent(-2)).toBe("100%");
        expect(Cards.columnWidthPercent(NaN)).toBe("100%");
        expect(Cards.columnWidthPercent(undefined)).toBe("100%");
    });
});

describe("distributeCards", () => {
    test("distributes cards round-robin across columns", () => {
        const cards = ["a", "b", "c", "d", "e"];
        expect(Cards.distributeCards(cards, 2)).toEqual([
            ["a", "c", "e"],
            ["b", "d"]
        ]);
    });

    test("returns a single column when the count is invalid", () => {
        expect(Cards.distributeCards(["a", "b"], 0)).toEqual([["a", "b"]]);
        expect(Cards.distributeCards(["a", "b"], -1)).toEqual([["a", "b"]]);
    });

    test("handles empty card lists", () => {
        expect(Cards.distributeCards([], 3)).toEqual([[], [], []]);
    });

    test("guards against non-array input", () => {
        expect(Cards.distributeCards(undefined, 2)).toEqual([[], []]);
        expect(Cards.distributeCards(null, 2)).toEqual([[], []]);
        expect(Cards.distributeCards("cards", 2)).toEqual([[], []]);
        expect(Cards.distributeCards({ length: 2 }, 2)).toEqual([[], []]);
    });
});

describe("renderCard", () => {
    const template = compileTemplate(
        "{{#title}}<h1>{{title}}</h1>{{/title}}" + "{{#message}}<p>{{{message}}}</p>{{/message}}"
    );

    test("renders a card from data", () => {
        const html = Cards.renderCard(template, {
            title: "Hello",
            message: "World"
        });
        expect(html).toContain("<h1>Hello</h1>");
        expect(html).toContain("<p>World</p>");
    });

    test("escapes HTML in interpolated values", () => {
        const html = Cards.renderCard(template, {
            title: "<script>alert(1)</script>"
        });
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    test("returns an empty string for an invalid template", () => {
        expect(Cards.renderCard(null, {})).toBe("");
        expect(Cards.renderCard(undefined, {})).toBe("");
        expect(Cards.renderCard("not-a-function", {})).toBe("");
    });
});

describe("cardsData", () => {
    test("contains seven cards", () => {
        expect(Cards.cardsData).toHaveLength(7);
    });

    test("every card has at least one renderable field", () => {
        for (const card of Cards.cardsData) {
            expect(card.title || card.message || card.image).toBeTruthy();
        }
    });

    test("cards with a message render through the demo template", () => {
        const template = compileTemplate(
            '{{#image}}<div class="card-image {{image}}"></div>{{/image}}' +
                "{{#title}}<h1>{{title}}</h1>{{/title}}" +
                "{{#message}}<p>{{{message}}}</p>{{/message}}"
        );
        for (const card of Cards.cardsData) {
            const html = Cards.renderCard(template, card);
            expect(html).toContain("card");
        }
    });
});
