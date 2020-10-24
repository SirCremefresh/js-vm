import {Instruction, InstructionMap} from './instructions';
import {VmState} from './vm-state';

export class Vm {
  private readonly vmState: VmState;

  constructor(instructions: Int32Array) {
    this.vmState = new VmState(instructions);
  }

  public run(): number {
    let instruction;
    do {
      instruction = this.vmState.instructions[this.vmState.instructionIndex++] as Instruction;
      InstructionMap[instruction](this.vmState);
    } while (instruction !== Instruction.INSTRUCTION_HALT);
    console.log(JSON.stringify(this.vmState));
    return 0;
  }
}
