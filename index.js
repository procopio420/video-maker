const readline = require('readline-sync');

function start() {
    const content = {};

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ');
    }

    content.searchTerm = askAndReturnSearchTerm();

    function askAndReturnPrefix(searchTerm) {
        const prefixes = [`Who is ${searchTerm}`, `What is ${searchTerm}`, `The history of ${searchTerm}`];
        return prefixes[readline.keyInSelect(prefixes, 'Choose one option:')];
    }


    content.prefix = askAndReturnPrefix(content.searchTerm);

    console.log(content);
}

start();