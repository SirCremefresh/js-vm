import { getTokenStream, Token, TokenElement } from '../../lib/lexer/lexer';
import { Instruction, Register, Vm } from '../../lib/vm-runtime';

const programText = `
push 100000
load %rd
log %rd

halt`;

const tokenStream = getTokenStream(programText);

function getCodeFromToken(tokenElement: TokenElement): string {
  return programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1);
}

function panic(message: string): never {
  console.error(message);
  process.exit(1);
}

const InstructionHandlers = {
  push: (tokenElement: TokenElement) => {
    return Instruction.INSTRUCTION_PUSH;
  },
  load: (tokenElement: TokenElement) => {
    return Instruction.INSTRUCTION_LOAD;
  },
  log: (tokenElement: TokenElement) => {
    return Instruction.INSTRUCTION_LOG;

  },
  halt: (tokenElement: TokenElement) => {
    return Instruction.INSTRUCTION_HALT;
  }
};

type InstructionHandler = keyof typeof InstructionHandlers;

function isInstruction(code: string | InstructionHandler): code is InstructionHandler {
  return code in InstructionHandlers;
}

const TokenHandlers = {
  [Token.TOKEN_INSTRUCTION]: (tokenElement: TokenElement) => {
    const instructionCode = getCodeFromToken(tokenElement);
    if (isInstruction(instructionCode)) {
      return [InstructionHandlers[instructionCode](tokenElement)];
    } else {
      panic(`Instruction not recognised: ${instructionCode}. location: ${tokenElement.startIndex}`);
    }
  },
  [Token.TOKEN_COMMENT]: (tokenElement: TokenElement) => {
    return [];
  },
  [Token.TOKEN_WHITESPACE]: (tokenElement: TokenElement) => {
    return [];
  },
  [Token.TOKEN_INVALID]: (tokenElement: TokenElement) => {
    panic(`Invalid. location: ${tokenElement.startIndex}`);
  },
  [Token.TOKEN_LABEL]: (tokenElement: TokenElement) => {
    return [];
  },
  [Token.TOKEN_COMMA]: (tokenElement: TokenElement) => {
    return [];
  },
  [Token.TOKEN_REGISTER]: (tokenElement: TokenElement) => {
    const code = getCodeFromToken(tokenElement);
    switch (code) {
    case '%rd':
      return [Register.D];
    default:
      panic(`Register is not known: ${code}. location: ${tokenElement.startIndex}`);
    }
    return [];
  },
  [Token.TOKEN_CONST]: (tokenElement: TokenElement) => {
    return [parseInt(getCodeFromToken(tokenElement))];
  },
  [Token.TOKEN_STACK]: (tokenElement: TokenElement) => {
    return [];
  },
  [Token.TOKEN_NEWLINE]: (tokenElement: TokenElement) => {
    return [];
  }
};

const parametres = [];

const result = [];
for (const tokenElement of tokenStream) {
  result.push(...TokenHandlers[tokenElement.token](tokenElement));
}

console.log(tokenStream);
console.log(result);

const instructions = Int32Array.from(result);
const vm = new Vm(instructions);
vm.run();
