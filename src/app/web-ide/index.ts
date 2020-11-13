import { getTokenStream, Token, TokenElement } from '../../lib/lexer/index';

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
let editorPanel: HTMLElement;
let cursor: HTMLElement;

let offsetTop = 0;
let offsetLeft = 0;

// large text for testing
// let programText = new Array(50)
//   .fill('a')
//   .map(v => Array(20).fill(v).join(' '))
//   .join('\n');

let programText = `push 100
load %rd
log %rd
loop_start:
inc %rc, 1
log %rc
jl loop_start
halt`;

let tokenStream: TokenElement[];

function eventHasParent(event: Event, parent: HTMLElement) {
  if (event.target === null || !(event.target instanceof HTMLElement)) {
    return false;
  }
  let checkingElement = event.target;
  do {
    if (checkingElement === parent) {
      return true;
    }
    checkingElement = checkingElement.parentElement as HTMLElement;
  } while (checkingElement !== null);

  return false;
}

onDomReady(() => {
  editor = document.getElementById('editor') as HTMLElement;
  editorPanel = document.querySelector('.editor-panel') as HTMLElement;
  cursor = document.querySelector('.cursor') as HTMLElement;

  const fontSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--editor-font-size')
  );

  fontLength = fontSize * fontLengthScaling;
  fontHeight = fontSize * fontHeightScaling;

  console.log({ fontSize, fontLength, fontHeight });

  document.addEventListener('click', event => {
    if (!eventHasParent(event, editorPanel)) {
      return;
    }

    const { clientX, clientY } = event;
    const lineNumberWith = getLineNumberWith();
    cursorX = Math.floor((clientX - offsetLeft - lineNumberWith) / fontLength);
    cursorY = Math.floor((clientY - offsetTop) / fontHeight);
    cursorX = cursorX > 0 ? cursorX : 0;
    cursorY = cursorY > 0 ? cursorY : 0;

    const line = getPointsOfLine(cursorY);
    if (!line) {
      const lastLine = getPointsOfLastLine();
      cursorY = editor.children.length / 2 - 1;
      cursorX = lastLine.endIndex - lastLine.startIndex + 1;
    } else {
      const maxX = line.endIndex - line.startIndex;
      cursorX = cursorX < maxX ? cursorX : maxX;
    }


    updateCursor();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'F5') {
      event.preventDefault();
    }

    if (event.key.length === 1) {
      const character = (event.key !== ' ') ? event.key : ' ';
      const linePoints = getPointsOfLineUnsafe(cursorY);
      programText = programText.slice(0, cursorX + linePoints.startIndex) + character + programText.slice(cursorX + linePoints.startIndex);
      cursorX++;
      renderCode();
    } else if (event.key === 'Backspace') {
      const linePoints = getPointsOfLineUnsafe(cursorY);
      if (cursorX > 0) {
        programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
        cursorX--;
      } else if (cursorY > 0) {
        const linePointsPrev = getPointsOfLineUnsafe(cursorY - 1);
        programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
        cursorX = linePointsPrev.endIndex - linePointsPrev.startIndex;
        cursorY--;
      }
      renderCode();
    } else if (event.key === 'Delete') {
      const linePoints = getPointsOfLineUnsafe(cursorY);
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
      const linePoints = getPointsOfLineUnsafe(cursorY);

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
          const linePoints = getPointsOfLineUnsafe(cursorY - 1);
          cursorX = linePoints.endIndex - linePoints.startIndex;
          cursorY--;
        }
      }
    } else if (event.key === 'ArrowDown') {
      const lineCount = getRenderedLineCount();
      if (cursorY < lineCount - 1) {
        const linePointsNext = getPointsOfLineUnsafe(++cursorY);
        if (cursorX > linePointsNext.endIndex - linePointsNext.startIndex) {
          cursorX = linePointsNext.endIndex - linePointsNext.startIndex;
        }
      } else {
        const linePoints = getPointsOfLineUnsafe(cursorY);
        cursorX = linePoints.endIndex - linePoints.startIndex + 1;
      }
    } else if (event.key === 'ArrowUp') {
      if (cursorY > 0) {
        const linePointsPrev = getPointsOfLineUnsafe(--cursorY);
        if (cursorX > linePointsPrev.endIndex - linePointsPrev.startIndex) {
          cursorX = linePointsPrev.endIndex - linePointsPrev.startIndex;
        }
      } else {
        cursorX = 0;
      }
    }
    console.log(event.key);
    updateCursor();
  });
  setTimeout(() => {
    offsetTop = editor.offsetTop;
    offsetLeft = editor.offsetLeft;

    renderCode();
    updateCursor();
  }, 500);
  console.log('after');
});

function getPointsOfLastLine(): { startIndex: number, endIndex: number } {
  return getPointsOfLineUnsafe((editor.children.length / 2 - 1)) as { startIndex: number, endIndex: number };
}

function getPointsOfLineUnsafe(lineNumber: number): { startIndex: number, endIndex: number } {
  return getPointsOfLine(lineNumber) as { startIndex: number, endIndex: number };
}

function getPointsOfLine(lineNumber: number): { startIndex: number, endIndex: number } | undefined {
  const line = editor.children[lineNumber * 2 + 1] as HTMLElement | undefined;
  if (!line) {
    return undefined;
  }
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
  const lines = [];
  for (const tokenElement of tokenStream) {
    if (!line) {
      lines.push(createSpanWithContent('line-number', `${lineNumber}:`, tokenElement.startIndex, tokenElement.startIndex));
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
        lines.push(line);
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
    lines.push(line);
  }

  if (lines.length > 0) {
    editor.append(...lines);
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

function getLineNumberWith() {
  return (editor.querySelector('.line-number') as Element).scrollWidth;
}

function updateCursor() {
  const lineNumberWith = getLineNumberWith();
  console.log(lineNumberWith, offsetLeft);
  cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
  cursor.style.left = `${offsetLeft + lineNumberWith - fontLength / 2 + cursorX * fontLength}px`;
}

