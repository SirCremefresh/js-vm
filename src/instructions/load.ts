import {Instruction} from '../instructions';
import {VmState} from '../vm-state';

export function load(vmState: VmState) {
	const stackValue = vmState.stack.pop();
	if (stackValue === undefined) {
		process.exit(Instruction.INSTRUCTION_LOAD);
	}
	vmState.registers[vmState.nextInstruction()] = stackValue;
}
