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

let programText = `//hel   lo world program
push 100000 // asdf
load %rd // asdfg
load %ra // asdfg
load %rc // asdfg
log %rd
push 200

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
      const character = (event.key !== ' ') ? event.key : ' ';
      const linePoints = getPointsOfLine(cursorY);
      programText = programText.slice(0, cursorX + linePoints.startIndex) + character + programText.slice(cursorX + linePoints.startIndex);
      cursorX++;
      renderCode();
    } else if (event.key === 'Backspace') {
      const linePoints = getPointsOfLine(cursorY);
      if (cursorX > 0) {
        programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
        cursorX--;
      } else if (cursorY > 0) {
        const linePointsPrev = getPointsOfLine(cursorY - 1);
        programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
        cursorX = linePointsPrev.endIndex - linePointsPrev.startIndex;
        cursorY--;
      }
      renderCode();
    } else if (event.key === 'Delete') {
      const linePoints = getPointsOfLine(cursorY);
      programText = programText.slice(0, cursorX + linePoints.startIndex) + programText.slice(cursorX + linePoints.startIndex + 1);
      renderCode();
    } else if (event.key === 'Enter') {
      const lines = programText.split('\n');
      const line = lines[cursorY];
      lines[cursorY] = line.slice(0, cursorX) + '\n' + line.slice(cursorX);
      programText = lines.join('\n');
      cursorY++;
      cursorX = 0;
      renderCode();
    } else if (event.key === 'ArrowRight') {
      const linePoints = getPointsOfLine(cursorY);

      if (cursorX < linePoints.endIndex - linePoints.startIndex) {
        cursorX++;
      } else {
        const lineCount = getRenderedLineCount();
        if (cursorY < lineCount - 1) {
          cursorX = 0;
          cursorY++;
        } else {
          cursorX = linePoints.endIndex - linePoints.startIndex + 1;
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (cursorX > 0) {
        cursorX--;
      } else {
        if (cursorY > 0) {
          const linePoints = getPointsOfLine(cursorY - 1);
          cursorX = linePoints.endIndex - linePoints.startIndex;
          cursorY--;
        }
      }
    } else if (event.key === 'ArrowDown') {
      const lineCount = getRenderedLineCount();
      if (cursorY < lineCount - 1) {
        const linePointsNext = getPointsOfLine(++cursorY);
        if (cursorX > linePointsNext.endIndex - linePointsNext.startIndex) {
          cursorX = linePointsNext.endIndex - linePointsNext.startIndex;
        }
      } else {
        const linePoints = getPointsOfLine(cursorY);
        cursorX = linePoints.endIndex - linePoints.startIndex + 1;
      }
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

function getPointsOfLine(lineNumber: number): { startIndex: number, endIndex: number } {
  const line = editor.children[lineNumber * 2 + 1] as HTMLElement;
  return {
    startIndex: parseInt(line.dataset.startIndex as string),
    endIndex: parseInt(line.dataset.endIndex as string)
  };
}

function getRenderedLineCount(): number {
  return editor.children.length / 2;
}

const tokenToClassNameMap: { [key: string]: string } = {
  [Token.TOKEN_INSTRUCTION]: 'instruction',
  [Token.TOKEN_CONST]: 'const',
  [Token.TOKEN_REGISTER]: 'register',
  [Token.TOKEN_COMMENT]: 'comment'
};

function renderCode() {
  console.time('render');
  tokenStream = getTokenStream(programText);

  while (editor.firstChild) {
    editor.removeChild(editor.firstChild);
  }
  let lineNumber = 1;
  let line;
  for (const tokenElement of tokenStream) {
    if (!line) {
      editor.appendChild(createSpanWithContent('line-number', `${lineNumber}:`, tokenElement.startIndex, tokenElement.startIndex));
      line = createDiv('line');
      line.dataset.startIndex = tokenElement.startIndex.toString();
      lineNumber++;
    }

    const tokenClass = tokenToClassNameMap[tokenElement.token];

    if (tokenClass) {
      line.appendChild(createSpanWithContent(tokenClass, programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1).replace(/\s/g, '\xa0'), tokenElement.startIndex, tokenElement.endIndex));
    } else {
      switch (tokenElement.token) {
      case Token.TOKEN_NEWLINE:
        line.dataset.endIndex = tokenElement.endIndex.toString();
        editor.appendChild(line);
        line = null;
        break;
      case Token.TOKEN_WHITESPACE:
        line.appendChild(createSpanWithContent(tokenClass, new Array(tokenElement.endIndex - tokenElement.startIndex + 2).join('\xa0'), tokenElement.startIndex, tokenElement.endIndex));
        break;
      default:
        line.appendChild(createSpanWithContent('not-found', programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1), tokenElement.startIndex, tokenElement.endIndex));
      }
    }
  }
  if (line) {
    line.dataset.endIndex = tokenStream[tokenStream.length - 1].endIndex.toString();
    editor.appendChild(line);
  }
  console.timeEnd('render');
}

function createSpanWithContent(className: string, content: string, startIndex: number, endIndex: number): HTMLSpanElement {
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = content;
  span.dataset.startIndex = startIndex.toString();
  span.dataset.endIndex = endIndex.toString();
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

