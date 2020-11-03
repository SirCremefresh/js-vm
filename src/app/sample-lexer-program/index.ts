import { getTokenStream } from '../../lib/lexer/index';
import CodeMirror from './codemirror';

function onDomReady(fn: () => void) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


function textWidth(text: string, fontProp: string): number {
  const tag = document.createElement('div');
  tag.style.position = 'absolute';
  tag.style.left = '-999em';
  tag.style.whiteSpace = 'nowrap';
  tag.style.font = fontProp;
  tag.innerHTML = text;

  document.body.appendChild(tag);

  const result = tag.clientWidth;

  document.body.removeChild(tag);

  return result;
}

let characterWith: number;
const asdf = 0;

onDomReady(() => {

  const editor = CodeMirror(document.body, {});
  console.log(editor);
  // const editor = document.getElementById('editor');
  //
  // characterWith = textWidth('C', 'JetBrains Mono 1em') - 1;

  // const myCodeMirror = CodeMirror(document.body, {
  //   value: 'function myScript(){return 100;}\n',
  //   mode: 'javascript'
  // });

  // if (editor != null) {
  //   const myCodeMirror = CodeMirror(document.body, {
  //     value: 'function myScript(){return 100;}\n',
  //     mode: 'javascript'
  //   });
  //
  //   editor.addEventListener('click', e => {
  //     const position = window.getSelection()?.focusOffset;
  //     if (position === undefined) {
  //       console.log('could not get position');
  //       return null;
  //     }
  //     console.log(e.target);
  //     console.log(position);
  //     console.log(e);
  //
  //     console.log(editor.childNodes);
  //     const cursor = editor.querySelectorAll('.line-number')[0].querySelector('.cursor');
  //     console.log(characterWith);
  //     console.log(asdf);
  //     asdf += 1;
  //     (cursor as HTMLElement).style.left = `${asdf * 6}px`;
  //     console.dir((cursor as HTMLElement).style.left);
  //
  //     // if (cursor && position > cursor)
  //     //   position--;
  //     // if (clean)
  //     //   editor['innerText'] = clean;
  //     // const textnode = (editor.firstChild['splitText'] as any)(position);
  //     // clean = textnode.wholeText;
  //     // cursor = position;
  //     // editor.insertBefore(document.createTextNode('|'), textnode);
  //     // editor['innerText'] = textnode.wholeText;
  //   });
  //   console.log('added listener');
  // }
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
