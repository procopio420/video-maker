const readline = require('readline-sync');

function start() {
    const content = {};

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of'];
        return prefixes[readline.keyInSelect(prefixes, 'Choose one option:')];
    }

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    console.log(content);
}

start();