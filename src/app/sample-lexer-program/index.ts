import { getTokenStream, Token } from '../../lib/lexer/index';
import { TokenElement } from '../../lib/lexer/lexer';

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

let editor: HTMLElement;
let cursor: HTMLElement;

let offsetTop: number;
let offsetLeft: number;

let programText = `//hello world program
push 100000 // asdf
load %rd // asdfg
load %ra // asdfg
load %rc // asdfg
log %rd


my-label:
inc %rc, 1
jl my-label

halt`;

let tokenStream: TokenElement[];

onDomReady(() => {
  editor = document.getElementById('editor') as HTMLElement;
  cursor = document.querySelector('.cursor') as HTMLElement;

  const fontSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--editor-font-size')
  );

  fontLength = fontSize * fontLengthScaling;
  fontHeight = fontSize * fontHeightScaling;

  console.log({ fontSize, fontLength, fontHeight });

  offsetTop = editor.offsetTop;
  offsetLeft = editor.offsetLeft;

  document.addEventListener('keydown', event => {
    if (event.key !== 'F5') {
      event.preventDefault();
    }

    if (event.key.length === 1) {
      const lines = programText.split('\n');
      const line = lines[cursorY];
      lines[cursorY] = line.slice(0, cursorX) + event.key + line.slice(cursorX);
      programText = lines.join('\n');
      renderCode();
    } else if (event.key === 'ArrowRight') {
      cursorX++;
    } else if (event.key === 'ArrowLeft') {
      cursorX--;
    } else if (event.key === 'ArrowDown') {
      cursorY++;
    } else if (event.key === 'ArrowUp') {
      cursorY--;
    }
    console.log(event.key);
    updateCursor();
  });
  setTimeout(() => {
    renderCode();
    updateCursor();
  }, 500);
  console.log('after');
});

const tokenToClassNameMap: { [key: string]: string } = {
  [Token.TOKEN_INSTRUCTION]: 'instruction',
  [Token.TOKEN_CONST]: 'const',
  [Token.TOKEN_REGISTER]: 'register',
  [Token.TOKEN_COMMENT]: 'comment'
};

function renderCode() {
  console.time("render");
  tokenStream = getTokenStream(programText);

  while (editor.firstChild) {
    editor.removeChild(editor.firstChild);
  }
  let lineNumber = 1;
  let line;
  for (const tokenElement of tokenStream) {
    if (!line) {
      editor.appendChild(createSpanWithContent('line-number', `${lineNumber}:`));
      line = createDiv('line');
      lineNumber++;
    }

    const tokenClass = tokenToClassNameMap[tokenElement.token];

    if (tokenClass) {
      line.appendChild(createSpanWithContent(tokenClass, programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)));
    } else {
      switch (tokenElement.token) {
      case Token.TOKEN_NEWLINE:
        editor.appendChild(line);
        line = null;
        break;
      case Token.TOKEN_WHITESPACE:
        line.appendChild(createSpanWithContent(tokenClass, new Array(tokenElement.endIndex - tokenElement.startIndex + 2).join('\xa0')));
        break;
      default:
        line.appendChild(createSpanWithContent('not-found', programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)));
      }
    }
  }
  if (line){
    editor.appendChild(line);
  }
  console.timeEnd("render");
}

function createSpanWithContent(className: string, content: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = content;
  return span;
}

function createDiv(className: string): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add(className);
  return div;
}

function updateCursor() {
  const lineNumberWith = (editor.querySelector('.line-number') as Element).scrollWidth;
  cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
  cursor.style.left = `${offsetLeft + lineNumberWith - fontLength / 2 + cursorX * fontLength}px`;
}

