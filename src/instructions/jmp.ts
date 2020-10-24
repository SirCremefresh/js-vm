import {VmState} from '../vm-state';

export function jmp(vmState: VmState) {
	// TODO check if jmp destination instruction is label
	vmState.instructionIndex = vmState.nextInstruction();
}
