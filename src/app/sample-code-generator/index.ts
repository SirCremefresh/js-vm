import { getTokenStream, Token, TokenElement } from '../../lib/lexer/lexer';
import { Instruction, Register, Vm } from '../../lib/vm-runtime';

function getCodeFromToken(tokenElement: TokenElement): string {
  return programText.slice(tokenElement.startIndex, tokenElement.endIndex + 1);
}

function panic(message: string): never {
  console.error(message);
  process.exit(1);
}

function parseRegistry(regString: string): number {
  switch (regString) {
  case '%ra':
    return Register.A;
  case '%rb':
    return Register.B;
  case '%rc':
    return Register.C;
  case '%rd':
    return Register.D;
  default:
    panic(`Register is not known: ${regString}`);
  }
}

const InstructionHandlers = {
  push: (generatorState: GeneratorState) => {
    const [, constant] = generatorState.line;
    return [Instruction.INSTRUCTION_PUSH, parseInt(getCodeFromToken(constant))];
  },
  load: (generatorState: GeneratorState) => {
    const [, par1] = generatorState.line;
    return [Instruction.INSTRUCTION_LOAD, parseRegistry(getCodeFromToken(par1))];
  },
  log: (generatorState: GeneratorState) => {
    const [, par1] = generatorState.line;
    return [Instruction.INSTRUCTION_LOG, parseRegistry(getCodeFromToken(par1))];
  },
  inc: (generatorState: GeneratorState) => {
    const [, par1, par2] = generatorState.line;
    return [Instruction.INSTRUCTION_INC, parseRegistry(getCodeFromToken(par1)), parseInt(getCodeFromToken(par2))];
  },
  jl: (generatorState: GeneratorState) => {
    const [, par1] = generatorState.line;
    return [Instruction.INSTRUCTION_JL, getCodeFromToken(par1)];
  },
  halt: (generatorState: GeneratorState) => {
    return [Instruction.INSTRUCTION_HALT];
  }
};

type InstructionHandler = keyof typeof InstructionHandlers;

function isInstruction(code: string | InstructionHandler): code is InstructionHandler {
  return code in InstructionHandlers;
}

interface GeneratorState {
  result: Array<number | string>,
  line: TokenElement[],
  labelMap: Map<string, number>
}


function inlineLabelRefrences(generatorState: GeneratorState): GeneratorState {
  for (let i = 0; i < generatorState.result.length; i++) {
    if (typeof generatorState.result[i] === 'string') {
      const labelIndex = generatorState.labelMap.get(generatorState.result[i] as string);
      if (!labelIndex) {
        panic(`Label not found. labelk: ${generatorState.result[i]}`);
      }
      generatorState.result[i] = labelIndex;
    }
  }
  return generatorState;
}

function processLine(generatorState: GeneratorState): GeneratorState {
  const [firstToken] = generatorState.line;
  if (firstToken.token === Token.TOKEN_INSTRUCTION) {
    const instructionCode = getCodeFromToken(firstToken);
    if (isInstruction(instructionCode)) {
      generatorState.result.push(...InstructionHandlers[instructionCode](generatorState));
    } else {
      panic(`Instruction not recognised: ${instructionCode}. location: ${firstToken.startIndex}`);
    }
    generatorState.line = [];
  } else if (firstToken.token === Token.TOKEN_LABEL) {
    const code = getCodeFromToken(firstToken).slice(0, -1);
    generatorState.labelMap.set(code, generatorState.result.length);
    generatorState.result.push(Instruction.INSTRUCTION_LABEL);
    generatorState.line = [];
  } else if (firstToken.token !== Token.TOKEN_COMMENT) {
    panic(`Line needs to start with Instruction or Comment code: ${firstToken}. location: ${firstToken.startIndex}`);
  }
  return generatorState;
}

function generateCode(programText: string) {
  let generatorState: GeneratorState = {
    result: [],
    line: [],
    labelMap: new Map<string, number>()
  };

  const tokenStream = getTokenStream(programText);
  const ignorableTokens = [Token.TOKEN_WHITESPACE, Token.TOKEN_COMMENT, Token.TOKEN_COMMA];

  for (const tokenElement of tokenStream) {
    if (ignorableTokens.includes(tokenElement.token)) {
      continue;
    }
    if (tokenElement.token !== Token.TOKEN_NEWLINE) {
      generatorState.line.push(tokenElement);
      continue;
    }
    if (generatorState.line.length === 0) {
      continue;
    }
    generatorState = processLine(generatorState);
  }

  if (generatorState.line.length > 0) {
    generatorState = processLine(generatorState);
  }

  generatorState = inlineLabelRefrences(generatorState);

  return Int32Array.from(generatorState.result as Array<number>);
}

const programText = `
push 100
load %rd
log %rd
loop_start:
inc %rc, 1
log %rc
jl loop_start
halt`;

const vm = new Vm(generateCode(programText));
try {
  vm.run();
} catch (e) {
  console.log('error');
  console.log(vm.vmState);
}
