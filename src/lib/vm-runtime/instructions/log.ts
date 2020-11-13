import {VmState} from '../vm-state';

export function log(vmState: VmState): void {
  vmState.stdOut(vmState.registers[vmState.nextInstruction()]);
}
