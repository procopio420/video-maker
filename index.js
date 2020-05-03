const readline = require('readline-sync');
const robots = {
    text: require('./robots/text.js'),
}

async function start() {
    const content = {
        searchTerm: '',
        prefix: '',
        sourceContentOriginal: '',
        sourceContentSanitized: '',
        sentences: [{
            text: '',
            keywords: [''],
            images: ['']
        }]
    };

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ');
    }
    content.searchTerm = askAndReturnSearchTerm();

    function askAndReturnPrefix(searchTerm) {
        const prefixes = [`Who is ${searchTerm}`, `What is ${searchTerm}`, `The history of ${searchTerm}`];
        return prefixes[readline.keyInSelect(prefixes, 'Choose one option:')].replace(` ${searchTerm}`, '');
    }
    content.prefix = askAndReturnPrefix(content.searchTerm);

    await robots.text(content);
}

start();