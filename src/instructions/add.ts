import {Register} from '../register';
import {VmState} from '../vm-state';

export function add(vmState: VmState) {
	vmState.registers[Register.A] = vmState.nextInstruction();
	vmState.registers[Register.B] = vmState.nextInstruction();
	vmState.registers[Register.C] = vmState.registers[Register.A] + vmState.registers[Register.B];
}
