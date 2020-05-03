const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').api_key;

async function robot(content) {
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    // breakContentIntoSentences(content);

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
        const algorithmiaWikipedia = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const wikipediaResponse = await algorithmiaWikipedia.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();

        content.sourceContentOriginal = wikipediaContent.content;
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal);
        const withoutDates = removeDates(withoutBlankLinesAndMarkdown);

        content.sourceContentSanitized = withoutDates;

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n');
            const noBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false;
                }
                return true;
            });

            return noBlankLinesAndMarkdown.join("\n");
        }

        function removeDates(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
        }

    }
}

module.exports = robot;