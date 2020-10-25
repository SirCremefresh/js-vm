import { Register } from '../register';
import { VmState } from '../vm-state';
import { jmp } from './jmp';

export function jl(vmState: VmState): void {
  if (vmState.registers[Register.C] >= vmState.registers[Register.D]) {
    vmState.instructionIndex++;
    return;
  }

  jmp(vmState);
}
