import {Register} from '../register';
import {VmState} from '../vm-state';
import {jmp} from './jmp';

export function jle(vmState: VmState) {
	if (vmState.registers[Register.C] > vmState.registers[Register.D]) {
		vmState.instructionIndex++;
		return;
	}

	return jmp(vmState);
}
