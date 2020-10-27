import {getTokenStream} from '../../lib/lexer/index'

const programText = `//hello world program
push 100000 // asdf
load %rd // asdfg
log %rd

my-label:
inc %rc, 1
jl my-label

halt`;

const tokenStream = getTokenStream(programText);

console.log(tokenStream.map(tokenElement => ({
  ...tokenElement,
  code: programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)
})));
console.log(programText.length);
console.log(tokenStream[tokenStream.length - 1].endIndex - programText.length == -1 ? 'passed' : 'failed');
