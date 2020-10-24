/*
const programText2 = `
push 100000 // asdf
load %rd // asdfg
log %rd

my-label:
inc %rc, 1
jl my-label

halt`;
*/

// const programText2 = `//hello world`;

type TokenElement = { token: Token, startIndex: number, endIndex: number };
type TokenStreamCtx = { startIndex: number, state: Token, tokenStream: TokenElement[] };

const programText23 = `push %ra
asfdas:
load %ra`;
const programText32 = `push 100000`;
const programText = `add 100000, 100000, %ra, %ra`;
const programText2 = `add 100000, %ra`;

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
  TOKEN_COMMENT = 'TOKEN_COMMENT',
  TOKEN_INVALID = 'TOKEN_INVALID',
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
  programText = programText + '\n';
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
      while (programCharacters[index] !== '\n'){
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

  console.log(context.tokenStream.map(tokenElement => ({
    ...tokenElement,
    code: programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1)
  })));
  console.log(programText.length);
  console.log(context.tokenStream[context.tokenStream.length - 1].endIndex - programText.length == -1 ? 'passed' : 'failed');

  // let result  ='';
  // for (const tokenElement of context.tokenStream) {
  //   result += programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1);
  // }
  //
  // for (let index = 0; index < result.length; ++index) {
  //   if (result[index] !== programText[index]) {
  //     console.log(`Error. index: ${index}, `);
  //   }
  // }
  // console.log('--');
  //
  // console.log(result);
  // console.log('--');
  //
  // console.log(programText);
  // console.log('--');
}

lexThat(programText2);
