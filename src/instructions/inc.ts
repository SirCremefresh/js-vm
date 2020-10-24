import {VmState} from '../vm-state';

export function inc(vmState: VmState) {
	vmState.registers[vmState.nextInstruction()] += vmState.nextInstruction();
}
