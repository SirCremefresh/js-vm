import {VmState} from '../vm-state';

export function push(vmState: VmState) {
	vmState.stack.push(vmState.nextInstruction());
}
