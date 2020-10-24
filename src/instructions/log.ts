import {VmState} from '../vm-state';

export function log(vmState: VmState) {
	console.log(vmState.registers[vmState.nextInstruction()]);
}
