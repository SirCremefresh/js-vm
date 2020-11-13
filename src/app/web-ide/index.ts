import { generateCode } from '../../lib/code-generator/index';
import { Vm } from '../../lib/vm-runtime/index';
import { renderCodeToEditor } from './renderer';

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
let runControl: HTMLElement;

let offsetTop = 0;
let offsetLeft = 0;

let editorFocused = true;

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

function setEditorFocused(focused: boolean) {
  if (focused) {
    editorPanel.classList.add('focused');
  } else {
    editorPanel.classList.remove('focused');
  }
  editorFocused = focused;
}

onDomReady(() => {
  editor = document.getElementById('editor') as HTMLElement;
  editorPanel = document.querySelector('.editor-panel') as HTMLElement;
  cursor = document.querySelector('.cursor') as HTMLElement;
  runControl = document.getElementById('control-run') as HTMLElement;

  const fontSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--editor-font-size')
  );

  fontLength = fontSize * fontLengthScaling;
  fontHeight = fontSize * fontHeightScaling;

  runControl.addEventListener('click', event => {
    const vm = new Vm(generateCode(programText), (message) => {

      console.log(`this is cool message: ${message}`);
    });
    try {
      vm.run();
    } catch (e) {
      console.log('error');
      console.log(vm.vmState);
    }
  });

  document.addEventListener('click', event => {
    if (!eventHasParent(event, editorPanel)) {
      setEditorFocused(false);
      return;
    }
    setEditorFocused(true);

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
    if (!editorFocused) {
      return false;
    }
    if (event.key !== 'F5') {
      event.preventDefault();
    }
    let needsRender = false;
    if (event.key.length === 1) {
      const character = (event.key !== ' ') ? event.key : ' ';
      const linePoints = getPointsOfLineUnsafe(cursorY);
      programText = programText.slice(0, cursorX + linePoints.startIndex) + character + programText.slice(cursorX + linePoints.startIndex);
      cursorX++;
      needsRender = true;
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
      needsRender = true;
    } else if (event.key === 'Delete') {
      const linePoints = getPointsOfLineUnsafe(cursorY);
      programText = programText.slice(0, cursorX + linePoints.startIndex) + programText.slice(cursorX + linePoints.startIndex + 1);
      needsRender = true;
    } else if (event.key === 'Enter') {
      const lines = programText.split('\n');
      const line = lines[cursorY];
      lines[cursorY] = line.slice(0, cursorX) + '\n' + line.slice(cursorX);
      programText = lines.join('\n');
      cursorY++;
      cursorX = 0;
      needsRender = true;
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
    if (needsRender) {
      renderCodeToEditor(programText, editor);
    }
  });
  setTimeout(() => {
    offsetTop = editor.offsetTop;
    offsetLeft = editor.offsetLeft;

    renderCodeToEditor(programText, editor);
    updateCursor();
    setEditorFocused(true);
  }, 500);
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

function getLineNumberWith() {
  return (editor.querySelector('.line-number') as Element).scrollWidth;
}

function updateCursor() {
  const lineNumberWith = getLineNumberWith();
  cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
  cursor.style.left = `${offsetLeft + lineNumberWith - fontLength / 2 + cursorX * fontLength}px`;
}

