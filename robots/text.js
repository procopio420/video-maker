const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').api_key;

function robot(content) {
    fetchContentFromWikipedia(content);
    // sanitizeContent(content);
    // breakContentIntoSentences(content);

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
        const algorithmiaWikipedia = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const wikipediaResponse = await algorithmiaWikipedia.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();
        console.log(wikipediaContent);
    }
}

module.exports = robot;