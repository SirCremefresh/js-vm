type TokenElement = { token: Token, startIndex: number, endIndex: number };
type TokenStreamCtx = { startIndex: number, state: Token, tokenStream: TokenElement[] };

const programText = `//hello world program
push 100000 // asdf
load %rd // asdfg
log %rd

my-label:
inc %rc, 1
jl my-label

halt`;


const enum Token {
  //MEMORY
  TOKEN_REGISTER = 'TOKEN_REGISTER',
  TOKEN_STACK = 'TOKEN_STACK',
  TOKEN_CONST = 'TOKEN_CONST',

  //OTHERS
  TOKEN_INSTRUCTION = 'TOKEN_INSTRUCTION',
  TOKEN_LABEL = 'TOKEN_LABEL',
  TOKEN_WHITESPACE = 'TOKEN_WHITESPACE',
  TOKEN_COMMA = 'TOKEN_COMMA',
  TOKEN_NEWLINE = 'TOKEN_NEWLINE',
  TOKEN_COMMENT = 'TOKEN_COMMENT',
  TOKEN_INVALID = 'TOKEN_INVALID',
}


function setToken(ctx: TokenStreamCtx, index: number, endIndexDelta = -1) {
  ctx.tokenStream.push({
    token: ctx.state,
    startIndex: ctx.startIndex,
    endIndex: index + endIndexDelta,
  });
  ctx.startIndex = index;
}

function getTokenStream(programText: string): TokenElement[] {
  const programCharacters = programText.split('');
  const context: TokenStreamCtx = {
    startIndex: 0,
    state: Token.TOKEN_INSTRUCTION,
    tokenStream: []
  };

  for (let index = 0; index < programCharacters.length; ++index) {
    const character = programCharacters[index];
    switch (character) {
    case ' ':
      if (context.state === Token.TOKEN_WHITESPACE) {
        break;
      }
      setToken(context, index);
      context.state = Token.TOKEN_WHITESPACE;
      break;
    case ':' :
      context.state = Token.TOKEN_LABEL;
      break;
    case '\n':
      if (context.startIndex !== index) {
        setToken(context, index);
      }

      context.state = Token.TOKEN_NEWLINE;
      setToken(context, index, 0);

      context.state = Token.TOKEN_INSTRUCTION;
      context.startIndex = index + 1;
      break;
    case '%':
      if (context.state === Token.TOKEN_WHITESPACE) {
        setToken(context, index);
        context.state = Token.TOKEN_REGISTER;
      }
      break;
    case ',':
      setToken(context, index);
      context.state = Token.TOKEN_COMMA;
      break;
    case '/':
      if (context.startIndex !== index) {
        setToken(context, index);
      }
      if ('/' !== programCharacters[index + 1]) {
        context.state = Token.TOKEN_INVALID;
        break;
      }
      while (programCharacters[index] !== '\n') {
        index++;
      }
      context.state = Token.TOKEN_COMMENT;
      --index;
      break;
    default:
      if (context.state === Token.TOKEN_WHITESPACE) {
        setToken(context, index);
        context.state = Token.TOKEN_CONST;
      }
    }
  }
  setToken(context, programCharacters.length - 1, 0);

  return context.tokenStream;
}

const tokenStream = getTokenStream(programText);

console.log(tokenStream.map(tokenElement => ({
  ...tokenElement,
  code: programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)
})));
console.log(programText.length);
console.log(tokenStream[tokenStream.length - 1].endIndex - programText.length == -1 ? 'passed' : 'failed');
