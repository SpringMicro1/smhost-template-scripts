module.exports = {
  replaceUnicodeSpaces: function (str) {
    return str.replaceAll(/\u00A0/g, " ");
  },
  replaceWikiCitations: function (str) {
    return str.replaceAll(/\[\d+\]/g, "");
  },
  replaceWikiMath: function (str) {
    return str
      .replaceAll(/(.*\\displaystyle.*)/g, "(badeq)")
      .replaceAll(/(\s{2,})/g, "")
      .split(/:|,/g)
      .filter((str) => str.match(/[^\x00-\x7F]/) === null)
      .join()
      .replaceAll(/\(badeq\)/g, " (equation not displayable) ");
  },
};
