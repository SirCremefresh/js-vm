import { getTokenStream } from '../../lib/lexer/index';
function onDomReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1);
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
const fontLengthScaling = 0.6;
const fontHeightScaling = 1.25;
let fontLength = 0;
let fontHeight = 0;
let cursorX = 0;
let cursorY = 0;
let editor;
let cursor;
let offsetTop;
let offsetLeft;
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
let tokenStream;
onDomReady(() => {
    editor = document.getElementById('editor');
    cursor = document.querySelector('.cursor');
    const fontSize = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--editor-font-size'));
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
            const lines = programText.split('\n');
            const line = lines[cursorY];
            lines[cursorY] = line.slice(0, cursorX) + character + line.slice(cursorX);
            programText = lines.join('\n');
            cursorX++;
            renderCode();
        }
        else if (event.key === 'Backspace') {
            const lines = programText.split('\n');
            const line = lines[cursorY];
            lines[cursorY] = line.slice(0, cursorX - 1) + line.slice(cursorX);
            programText = lines.join('\n');
            cursorX--;
            renderCode();
        }
        else if (event.key === 'Delete') {
            const lines = programText.split('\n');
            const line = lines[cursorY];
            lines[cursorY] = line.slice(0, cursorX) + line.slice(cursorX + 1);
            programText = lines.join('\n');
            renderCode();
        }
        else if (event.key === 'Enter') {
            const lines = programText.split('\n');
            const line = lines[cursorY];
            lines[cursorY] = line.slice(0, cursorX) + "\n" + line.slice(cursorX);
            programText = lines.join('\n');
            cursorY++;
            cursorX = 0;
            renderCode();
        }
        else if (event.key === 'ArrowRight') {
            cursorX++;
        }
        else if (event.key === 'ArrowLeft') {
            cursorX--;
        }
        else if (event.key === 'ArrowDown') {
            cursorY++;
        }
        else if (event.key === 'ArrowUp') {
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
const tokenToClassNameMap = {
    ["TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */]: 'instruction',
    ["TOKEN_CONST" /* TOKEN_CONST */]: 'const',
    ["TOKEN_REGISTER" /* TOKEN_REGISTER */]: 'register',
    ["TOKEN_COMMENT" /* TOKEN_COMMENT */]: 'comment'
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
            editor.appendChild(createSpanWithContent('line-number', `${lineNumber}:`));
            line = createDiv('line');
            lineNumber++;
        }
        const tokenClass = tokenToClassNameMap[tokenElement.token];
        if (tokenClass) {
            line.appendChild(createSpanWithContent(tokenClass, programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1).replace(/\s/g, '\xa0')));
        }
        else {
            switch (tokenElement.token) {
                case "TOKEN_NEWLINE" /* TOKEN_NEWLINE */:
                    editor.appendChild(line);
                    line = null;
                    break;
                case "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */:
                    line.appendChild(createSpanWithContent(tokenClass, new Array(tokenElement.endIndex - tokenElement.startIndex + 2).join('\xa0')));
                    break;
                default:
                    line.appendChild(createSpanWithContent('not-found', programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)));
            }
        }
    }
    if (line) {
        editor.appendChild(line);
    }
    console.timeEnd('render');
}
function createSpanWithContent(className, content) {
    const span = document.createElement('span');
    span.classList.add(className);
    span.textContent = content;
    return span;
}
function createDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}
function updateCursor() {
    const lineNumberWith = editor.querySelector('.line-number').scrollWidth;
    cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
    cursor.style.left = `${offsetLeft + lineNumberWith - fontLength / 2 + cursorX * fontLength}px`;
}
//# sourceMappingURL=index.js.map