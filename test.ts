const python = require('lezer-python');
const input  = "x=10\nprint(10)";
const tree   = python.parser.parse(input);
const cursor = tree.cursor();
cursor.firstChild();
cursor.nextSibling();
cursor.firstChild();
console.log(cursor.type.name);
console.log(input.substr(cursor.from,cursor.to));
