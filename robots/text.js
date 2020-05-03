const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("../credentials/algorithmia.json").api_key;

const sbd = require("sbd");

const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const watsonApiKey = require("../credentials/ibmcloud.json").apikey;

const watson = new NaturalLanguageUnderstandingV1({
  version: "2019-07-12",
  authenticator: new IamAuthenticator({
    apikey: watsonApiKey,
  }),
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
});

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  await fetchKeywordOfAllSentences(content);

  async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      watson.analyze(
        {
          text: sentence,
          features: {
            keywords: {},
          },
        },
        (error, response) => {
          if (error) {
            throw error;
          } else {
            const keywords = response.result.keywords.map((keyword) => keyword.text);
            resolve(keywords);
          }
        }
      );
    });
  }

  async function fetchKeywordOfAllSentences(content) {
      for(const sentence of content.sentences){
          sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
      }
  }

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const algorithmiaWikipedia = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await algorithmiaWikipedia.pipe({
      articleName: content.searchTerm,
      lang: content.lang,
    });
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

    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }

  function limitMaximumSentences(content) {
      content.sentences = content.sentences.slice(0, content.maximumSentences);
  }
}

module.exports = robot;
