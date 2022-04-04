const {
  replaceUnicodeSpaces,
  replaceWikiCitations,
  replaceWikiMath,
} = require("./lib/replacers");
const { getRandomIndexTodaySeed } = require("./lib/random");
const { csWiki, getCSWordOfDay, getWikiEntryByTerm } = require("./index");

const fs = require("fs");
const assert = require("assert");

describe("replace wiki math", function () {
  it("works for floating point wiki entry", function () {
    const testString =
      "In computing, floating-point arithmetic (FP) is arithmetic using formulaic representation of real numbers as an approximation to support a trade-off between range and precision. For this reason, floating-point computation is often found in systems which include very small and very large real numbers, which require fast processing times. A number is, in general, represented approximately to a fixed number of significant digits (the significand) and scaled using an exponent in some fixed base; the base for the scaling is normally two, ten, or sixteen. A number that can be represented exactly is of the following form:\n\n  \n    \n      \n        \n          significand\n        \n        ×\n        \n          \n            base\n          \n          \n            exponent\n          \n        \n        ,\n      \n    \n    {\\displaystyle {\\text{significand}}\\times {\\text{base}}^{\\text{exponent}},}\n  \n\nwhere significand is an integer, base is an integer greater than or equal to two, and exponent is also an integer.\nFor example:\n\n  \n    \n      \n        1.2345\n        =\n        \n          \n            \n              12345\n              ⏟\n            \n          \n          \n            significand\n          \n        \n        ×\n        \n          \n            \n              10\n              ⏟\n            \n          \n          \n            base\n          \n        \n        \n        \n        \n        \n        \n        \n          \n          \n            \n              \n                \n                  \n                    −\n                    4\n                  \n                  ⏞\n                \n              \n              \n                exponent\n              \n            \n          \n        \n        .\n      \n    \n    {\\displaystyle 1.2345=\\underbrace {12345} _{\\text{significand}}\\times \\underbrace {10} _{\\text{base}}\\!\\!\\!\\!\\!\\!^{\\overbrace {-4} ^{\\text{exponent}}}.}\n  \n";
    const expected =
      "In computing, floating-point arithmetic (FP) is arithmetic using formulaic representation of real numbers as an approximation to support a trade-off between range and precision. For this reason, floating-point computation is often found in systems which include very small and very large real numbers, which require fast processing times. A number is, in general, represented approximately to a fixed number of significant digits (the significand) and scaled using an exponent in some fixed base; the base for the scaling is normally two, ten, or sixteen. A number that can be represented exactly is of the following form, (equation not displayable) where significand is an integer, base is an integer greater than or equal to two, and exponent is also an integer.\nFor example";
    assert.equal(replaceWikiMath(testString), expected);
  });
});

describe("get random index with seed", function () {
  it("repeatable pseudo random", function () {
    const index = getRandomIndexTodaySeed(csWiki.length);
    let equivalent = true;
    for (let i = 0; i < 1000000; i++) {
      equivalent &&= index === getRandomIndexTodaySeed(csWiki.length);
    }
    assert.equal(true, equivalent);
  });

  it("less than max", function () {
    let lessThanMax = true;
    for (let i = 0; i < 1000000; i++) {
      lessThanMax &&= getRandomIndexTodaySeed(csWiki.length) < csWiki.length;
    }
    assert.equal(true, lessThanMax);
  });

  it("different per day", function () {
    const done = new Set();
    // go through it 7 times the range and you'll hit all the numbers
    const numDays = csWiki.length * 7;
    let date = new Date(2000, 0, 1);
    for (let i = 0; i < numDays; i++) {
      done.add(getRandomIndexTodaySeed(csWiki.length, date));
      date.setDate(date.getDate() + 1);
    }
    assert.equal(done.size, csWiki.length);
  });
});

describe("cs wiki objects", function () {
  it("every entry has a term and at least one definition", function () {
    let hasOneDef = true;
    for (const entry of csWiki) {
      hasOneDef &&=
        entry.term && entry.definitions.length > 0 && !!entry.definitions[0];
    }
    assert.equal(true, hasOneDef);
  });

  it("every term and definition contains ascii characters only", function () {
    let isAscii = true;
    for (const entry of csWiki) {
      isAscii &&= /^[\x00-\xFF]*$/g.test(entry.term);
      for (const def of entry.definitions) {
        isAscii &&= /^[\x00-\xFF]*$/g.test(def);
      }
    }
    assert.equal(true, isAscii);
  });

  it("every entry has a unique term", function () {
    const unique = new Set();
    for (const entry of csWiki) {
      unique.add(entry.term);
    }
    assert.equal(unique.size, csWiki.length);
  });

  it("find term case-insensitive", function () {
    const term = "abstract data type (ADT)";
    assert.notEqual(undefined, getWikiEntryByTerm(term));
    assert.notEqual(undefined, getWikiEntryByTerm(term.toLowerCase()));
  });

  it("find term does not exist", function () {
    assert.equal(undefined, getWikiEntryByTerm("does not exist"));
  });
});
