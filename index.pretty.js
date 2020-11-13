function setToken(ctx, index, endIndexDelta = -1) {
    ctx.tokenStream.push({
        token: ctx.state,
        startIndex: ctx.startIndex,
        endIndex: index + endIndexDelta,
    });
    ctx.startIndex = index;
}
function getTokenStream(programText) {
    const programCharacters = programText.split('');
    const context = {
        startIndex: 0,
        state: "TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */,
        tokenStream: []
    };
    for (let index = 0; index < programCharacters.length; ++index) {
        const character = programCharacters[index];
        switch (character) {
            case ' ':
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    break;
                }
                setToken(context, index);
                context.state = "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */;
                break;
            case ':':
                context.state = "TOKEN_LABEL" /* TOKEN_LABEL */;
                break;
            case '\n':
                if (context.startIndex !== index) {
                    setToken(context, index);
                }
                context.state = "TOKEN_NEWLINE" /* TOKEN_NEWLINE */;
                setToken(context, index, 0);
                context.state = "TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */;
                context.startIndex = index + 1;
                break;
            case '%':
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    setToken(context, index);
                    context.state = "TOKEN_REGISTER" /* TOKEN_REGISTER */;
                }
                break;
            case ',':
                setToken(context, index);
                context.state = "TOKEN_COMMA" /* TOKEN_COMMA */;
                break;
            case '/':
                if (context.startIndex !== index) {
                    setToken(context, index);
                }
                if ('/' !== programCharacters[index + 1]) {
                    context.state = "TOKEN_INVALID" /* TOKEN_INVALID */;
                    break;
                }
                while (programCharacters[index] !== '\n') {
                    index++;
                }
                context.state = "TOKEN_COMMENT" /* TOKEN_COMMENT */;
                --index;
                break;
            default:
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    setToken(context, index);
                    context.state = "TOKEN_CONST" /* TOKEN_CONST */;
                }
        }
    }
    setToken(context, programCharacters.length - 1, 0);
    return context.tokenStream;
}

const tokenToClassNameMap = {
    ["TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */]: 'instruction',
    ["TOKEN_CONST" /* TOKEN_CONST */]: 'const',
    ["TOKEN_REGISTER" /* TOKEN_REGISTER */]: 'register',
    ["TOKEN_COMMENT" /* TOKEN_COMMENT */]: 'comment'
};
function renderCodeToEditor(programText, editor) {
    const tokenStream = getTokenStream(programText);
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
        }
        else {
            switch (tokenElement.token) {
                case "TOKEN_NEWLINE" /* TOKEN_NEWLINE */:
                    line.dataset.endIndex = tokenElement.endIndex.toString();
                    lines.push(line);
                    line = null;
                    break;
                case "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */:
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
function createSpanWithContent(className, content, startIndex, endIndex) {
    const span = document.createElement('span');
    span.classList.add(className);
    span.textContent = content;
    span.dataset.startIndex = startIndex.toString();
    span.dataset.endIndex = endIndex.toString();
    return span;
}
function createDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

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
let editorPanel;
let cursor;
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
function eventHasParent(event, parent) {
    if (event.target === null || !(event.target instanceof HTMLElement)) {
        return false;
    }
    let checkingElement = event.target;
    do {
        if (checkingElement === parent) {
            return true;
        }
        checkingElement = checkingElement.parentElement;
    } while (checkingElement !== null);
    return false;
}
onDomReady(() => {
    editor = document.getElementById('editor');
    editorPanel = document.querySelector('.editor-panel');
    cursor = document.querySelector('.cursor');
    const fontSize = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--editor-font-size'));
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
        }
        else {
            const maxX = line.endIndex - line.startIndex;
            cursorX = cursorX < maxX ? cursorX : maxX;
        }
        updateCursor();
    });
    document.addEventListener('keydown', event => {
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
        }
        else if (event.key === 'Backspace') {
            const linePoints = getPointsOfLineUnsafe(cursorY);
            if (cursorX > 0) {
                programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
                cursorX--;
            }
            else if (cursorY > 0) {
                const linePointsPrev = getPointsOfLineUnsafe(cursorY - 1);
                programText = programText.slice(0, cursorX + linePoints.startIndex - 1) + programText.slice(cursorX + linePoints.startIndex);
                cursorX = linePointsPrev.endIndex - linePointsPrev.startIndex;
                cursorY--;
            }
            needsRender = true;
        }
        else if (event.key === 'Delete') {
            const linePoints = getPointsOfLineUnsafe(cursorY);
            programText = programText.slice(0, cursorX + linePoints.startIndex) + programText.slice(cursorX + linePoints.startIndex + 1);
            needsRender = true;
        }
        else if (event.key === 'Enter') {
            const lines = programText.split('\n');
            const line = lines[cursorY];
            lines[cursorY] = line.slice(0, cursorX) + '\n' + line.slice(cursorX);
            programText = lines.join('\n');
            cursorY++;
            cursorX = 0;
            needsRender = true;
        }
        else if (event.key === 'ArrowRight') {
            const linePoints = getPointsOfLineUnsafe(cursorY);
            if (cursorX < linePoints.endIndex - linePoints.startIndex) {
                cursorX++;
            }
            else {
                const lineCount = getRenderedLineCount();
                if (cursorY < lineCount - 1) {
                    cursorX = 0;
                    cursorY++;
                }
                else {
                    cursorX = linePoints.endIndex - linePoints.startIndex + 1;
                }
            }
        }
        else if (event.key === 'ArrowLeft') {
            if (cursorX > 0) {
                cursorX--;
            }
            else {
                if (cursorY > 0) {
                    const linePoints = getPointsOfLineUnsafe(cursorY - 1);
                    cursorX = linePoints.endIndex - linePoints.startIndex;
                    cursorY--;
                }
            }
        }
        else if (event.key === 'ArrowDown') {
            const lineCount = getRenderedLineCount();
            if (cursorY < lineCount - 1) {
                const linePointsNext = getPointsOfLineUnsafe(++cursorY);
                if (cursorX > linePointsNext.endIndex - linePointsNext.startIndex) {
                    cursorX = linePointsNext.endIndex - linePointsNext.startIndex;
                }
            }
            else {
                const linePoints = getPointsOfLineUnsafe(cursorY);
                cursorX = linePoints.endIndex - linePoints.startIndex + 1;
            }
        }
        else if (event.key === 'ArrowUp') {
            if (cursorY > 0) {
                const linePointsPrev = getPointsOfLineUnsafe(--cursorY);
                if (cursorX > linePointsPrev.endIndex - linePointsPrev.startIndex) {
                    cursorX = linePointsPrev.endIndex - linePointsPrev.startIndex;
                }
            }
            else {
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
    }, 500);
    console.log('after');
});
function getPointsOfLastLine() {
    return getPointsOfLineUnsafe((editor.children.length / 2 - 1));
}
function getPointsOfLineUnsafe(lineNumber) {
    return getPointsOfLine(lineNumber);
}
function getPointsOfLine(lineNumber) {
    const line = editor.children[lineNumber * 2 + 1];
    if (!line) {
        return undefined;
    }
    return {
        startIndex: parseInt(line.dataset.startIndex),
        endIndex: parseInt(line.dataset.endIndex)
    };
}
function getRenderedLineCount() {
    return editor.children.length / 2;
}
function getLineNumberWith() {
    return editor.querySelector('.line-number').scrollWidth;
}
function updateCursor() {
    const lineNumberWith = getLineNumberWith();
    console.log(lineNumberWith, offsetLeft);
    cursor.style.top = `${offsetTop + cursorY * fontHeight}px`;
    cursor.style.left = `${offsetLeft + lineNumberWith - fontLength / 2 + cursorX * fontLength}px`;
}
