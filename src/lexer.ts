// const programText = `
// push 100000
// load %rd
// log %rd
// my-label:
// inc %rc, 1
// jl my-label
// halt
// `;
type TokenElement = { token: Token, startIndex: number, endIndex: number };
type TokenStreamCtx = { startIndex: number, state: Token, tokenStream: TokenElement[] };

const programText2 = `push %ra
asfdas:
load %ra`;
const programText1 = `push 100000`;
const programText = `add 100000, 100000, %ra, %ra`;
const programText3 = `add 100000, %ra`;

const programText4 = `main:\n\n\n`;

const lines = programText
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);


//const instructionText = "push 369";
//const instructionText = 'push369';

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
  TOKEN_CHARACTER = 'TOKEN_CHARACTER',
  TOKEN_NUMBER = 'TOKEN_NUMBER',
}

// const instructionTokens = [Token.TOKEN_CHARACTER, Token.TOKEN_CONST];

// [
// {token: Token.TOKEN_INSTRUCTION, startIndex: 0, endIndex: 3},
// {token: Token.TOKEN_WHITESPACE, value: ' '},
// {token: Token.TOKEN_CONST, value: '369'}
// ];
// const instructionTokens = [Token.TOKEN_INSTRUCTION, Token.TOKEN_CONST];

// const tokenStream = [];

// for (const line of lines) {
//   const [instruction, ...argList] = line.split(' ');
//   const args = (argList.length > 0) ? argList.join('').split(',') : [];
//   console.log({instruction, args});
// }

//INSTRUCTION-WHITESPACE-*{TOKEN_REGISTER/TOKEN_STACK/TOKEN_CONST}
//{INSTRUCTION/LABEL}-WHITESPACE-*{TOKEN_REGISTER/TOKEN_STACK/TOKEN_CONST}
//  INSTRUCTION-{:,WHITESPACE}-{TOKEN_REGISTER/TOKEN_STACK/TOKEN_CONST}{,/\n}


// let startIndex = 0;
// let state: Token = Token.TOKEN_INSTRUCTION;
// const tokenStream: TokenStreamItem[] = [];


function setToken(ctx: TokenStreamCtx, index: number, endIndexDelta = -1) {
  ctx.tokenStream.push({
    token: ctx.state,
    startIndex: ctx.startIndex,
    endIndex: index + endIndexDelta,
  });
  ctx.startIndex = index;
}

//INSTRUCTION-WHITESPACE-TOKEN_CONST
//LABEL

function lexThat(programText: string) {
  const context: TokenStreamCtx = {
    startIndex: 0,
    state: Token.TOKEN_INSTRUCTION,
    tokenStream: []
  };


  for (const [index, character] of (programText + '\n').split('').entries()) {

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
      setToken(context, index);

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
    default:
      if (context.state === Token.TOKEN_WHITESPACE) {
        setToken(context, index);
        context.state = Token.TOKEN_CONST;
      }
    }
  }

  console.log(context.tokenStream.map(tokenElement => ({
    ...tokenElement,
    code: programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)
  })));
  console.log(programText.length);
  console.log(context.tokenStream[context.tokenStream.length - 1].endIndex - programText.length == 0 ? 'passed' : 'failed');
}

lexThat(programText2);
