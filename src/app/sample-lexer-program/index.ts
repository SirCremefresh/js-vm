import { getTokenStream } from '../../lib/lexer/index';

function onDomReady(fn: () => void) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const fontLengthScaling = 0.6;
const fontHeightScaling = 1.25;

let fontLength = 0;
let fontHeight = 0;

let cursorX = 0;
let cursorY = 0;

onDomReady(() => {
  const editor = document.getElementById('editor');
  const cursor = document.querySelector('.cursor') as HTMLElement;

  const fontSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--editor-font-size')
  );

  fontLength = fontSize * fontLengthScaling;
  fontHeight = fontSize * fontHeightScaling;

  console.log({fontSize, fontLength, fontHeight});

  if (editor != null) {
    const offsetTop = editor.offsetTop;
    const offsetLeft = 9;

    document.addEventListener('keydown', event => {
      event.preventDefault();

      // if (event.isComposing || event.key === 229) {
      //   return;
      // }
      if (event.key === 'ArrowRight') {
        cursorX++;
      }
      if (event.key === 'ArrowLeft') {
        cursorX--;
      }
      if (event.key === 'ArrowDown') {
        cursorY++;
      }
      if (event.key === 'ArrowUp') {
        cursorY--;
      }
      console.log(event.key);
      cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
      cursor.style.left = `${offsetLeft + cursorX * fontLength}px`;
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


// Lang 6
// Hoch 12.5

// Lang 24
// Hoch 25
// editor.addEventListener('click', e => {
//   const position = window.getSelection()?.focusOffset;
//   if (position === undefined) {
//     console.log('could not get position');
//     return null;
//   }
//   console.log(e.target);
//   console.log(position);
//   console.log(e);
//
//   console.log(editor.childNodes);
//   const cursor = document.querySelector('.cursor') as HTMLElement;
//   console.log(characterWith);
//   console.log(asdf);
//   asdf += 1;
//   (cursor as HTMLElement).style.top = `${offsetTop}px`;
//   (cursor as HTMLElement).style.left = `${offsetLeft + asdf * 6}px`;
//   console.dir((cursor as HTMLElement).style.left);
//
//   // if (cursor && position > cursor)
//   //   position--;
//   // if (clean)
//   //   editor['innerText'] = clean;
//   // const textnode = (editor.firstChild['splitText'] as any)(position);
//   // clean = textnode.wholeText;
//   // cursor = position;
//   // editor.insertBefore(document.createTextNode('|'), textnode);
//   // editor['innerText'] = textnode.wholeText;
// });
