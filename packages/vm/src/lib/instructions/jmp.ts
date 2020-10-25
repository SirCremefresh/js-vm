import { assert } from '../assert';
import { Instruction } from '../instructions';
import { VmState } from '../vm-state';

export function jmp(vmState: VmState): void {
  const instruction = vmState.nextInstruction();
  if (process.env.NODE_ENV !== 'production') {
    assert(
      vmState.instructions[instruction] === Instruction.INSTRUCTION_LABEL,
      'Jump Destination is not Label'
    );
  }
  vmState.instructionIndex = instruction;
}
