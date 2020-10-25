import {VmState} from '../vm-state';

export function push(vmState: VmState): void {
  vmState.stack.push(vmState.nextInstruction());
}
