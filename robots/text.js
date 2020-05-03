const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("../credentials/algorithmia.json").api_key;
const sbd = require("sbd");

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const algorithmiaWikipedia = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await algorithmiaWikipedia.pipe(
      content.searchTerm
    );
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );
    const withoutDates = removeDates(withoutBlankLinesAndMarkdown);

    content.sourceContentSanitized = withoutDates;

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split("\n");
      const noBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith("=")) {
          return false;
        }
        return true;
      });

      return noBlankLinesAndMarkdown.join(" ");
    }

    function removeDates(text) {
      return text
        .replace(/\((?:\([^()]*\)|[^()])*\)/gm, "")
        .replace(/  /g, " ");
    }
  }

  function breakContentIntoSentences(content) {
    content.sentences = [];
    const sentences = sbd.sentences(content.sourceContentSanitized);

    sentences.forEach((sentence)=>{
        content.sentences.push({
            text: sentence,
            keywords: [],
            images: []
        })
    })
  }
}

module.exports = robot;
