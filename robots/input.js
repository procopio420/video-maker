const readline = require("readline-sync");

const state = require('./state.js');

function robot() {
  const content = {};

  function askAndReturnLang() {
    const languages = ["pt", "en", "es", "fr"];

    return languages[readline.keyInSelect(languages, "Choose one language: ")];
  }
  content.lang = askAndReturnLang();

  function askAndReturnSearchTerm() {
    return readline.question("Type a Wikipedia search term: ");
  }
  content.searchTerm = askAndReturnSearchTerm();

  function askAndReturnPrefix(searchTerm) {
    const prefixes = [
      `Who is ${searchTerm}`,
      `What is ${searchTerm}`,
      `The history of ${searchTerm}`,
    ];
    return prefixes[
      readline.keyInSelect(prefixes, "Choose one search prefix:")
    ].replace(` ${searchTerm}`, "");
  }
  content.prefix = askAndReturnPrefix(content.searchTerm);

  function askAndReturnMaximumSentences() {
    return readline.question("How many sentences do you want? (number) ");
  }
  content.maximumSentences = askAndReturnMaximumSentences();

  state.save(content);
}

module.exports = robot;