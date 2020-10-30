import { getTokenStream } from '../../lib/lexer/index';

function onDomReady(fn: () => void) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

onDomReady(() => {
  const editor = document.getElementById('editor');

  if (editor != null) {
    // editor.onclick = e => console.log(e);

    let clean: any, cursor: any;
    editor.addEventListener('click', e => {
      const position = window.getSelection()?.focusOffset;
      if (position === undefined) {
        console.log('could not get position');
        return null;
      }
      console.log(e.target);
      console.log(position);
      console.log(e);
      // if (cursor && position > cursor)
      //   position--;
      // if (clean)
      //   editor['innerText'] = clean;
      // const textnode = (editor.firstChild['splitText'] as any)(position);
      // clean = textnode.wholeText;
      // cursor = position;
      // editor.insertBefore(document.createTextNode('|'), textnode);
      // editor['innerText'] = textnode.wholeText;
    });
    console.log('added listener');
  }
  console.log('after');



});



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
