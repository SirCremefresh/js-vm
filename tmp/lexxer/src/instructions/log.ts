import {VmState} from '../vm-state';

export function log(vmState: VmState): void {
  console.log(vmState.registers[vmState.nextInstruction()]);
}
