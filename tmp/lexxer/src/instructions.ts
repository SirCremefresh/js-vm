import {add} from './instructions/add';
import {halt} from './instructions/halt';
import {inc} from './instructions/inc';
import {jl} from './instructions/jl';
import {jle} from './instructions/jle';
import {jmp} from './instructions/jmp';
import {load} from './instructions/load';
import {log} from './instructions/log';
import {push} from './instructions/push';
import {VmState} from './vm-state';

export const enum Instruction {
  INSTRUCTION_HALT,
  INSTRUCTION_PUSH,
  INSTRUCTION_LOG,
  INSTRUCTION_ADD,
  INSTRUCTION_LOAD,
  INSTRUCTION_INC,
  INSTRUCTION_JMP,
  INSTRUCTION_JLE,
  INSTRUCTION_JL,
  INSTRUCTION_LABEL,
  INSTRUCTION_NOP,
}

export const InstructionMap = {
  [Instruction.INSTRUCTION_HALT]: halt,
  [Instruction.INSTRUCTION_PUSH]: push,
  [Instruction.INSTRUCTION_LOG]: log,
  [Instruction.INSTRUCTION_ADD]: add,
  [Instruction.INSTRUCTION_LOAD]: load,
  [Instruction.INSTRUCTION_INC]: inc,
  [Instruction.INSTRUCTION_JMP]: jmp,
  [Instruction.INSTRUCTION_JLE]: jle,
  [Instruction.INSTRUCTION_JL]: jl,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
  [Instruction.INSTRUCTION_NOP]: function (_: VmState) {
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
  [Instruction.INSTRUCTION_LABEL]: function (_: VmState) {
    return null;
  },
};
