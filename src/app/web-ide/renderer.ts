import { getTokenStream, Token } from '../../lib/lexer/index';

const tokenToClassNameMap: { [key: string]: string } = {
  [Token.TOKEN_INSTRUCTION]: 'instruction',
  [Token.TOKEN_CONST]: 'const',
  [Token.TOKEN_REGISTER]: 'register',
  [Token.TOKEN_COMMENT]: 'comment'
};

export function renderCodeToEditor(programText: string, editor: HTMLElement): void {
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
