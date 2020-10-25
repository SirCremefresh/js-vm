import { VmState } from '../vm-state';

export function inc(vmState: VmState): void {
  vmState.registers[vmState.nextInstruction()] += vmState.nextInstruction();
}
