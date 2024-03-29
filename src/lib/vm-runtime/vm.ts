import { Instruction, InstructionMap } from './instructions';
import { VmState } from './vm-state';

export class Vm {
  public readonly vmState: VmState;

  constructor(instructions: Int32Array, stdOut: ((message: number) => void) | null = null) {
    this.vmState = new VmState(instructions, stdOut);
  }

  public run(): number {
    let instruction;
    do {
      instruction = this.vmState.instructions[this.vmState.instructionIndex++] as Instruction;
      InstructionMap[instruction](this.vmState);
    } while (instruction !== Instruction.INSTRUCTION_HALT);
    return 0;
  }
}
