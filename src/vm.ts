import {Instruction, InstructionMap} from './instructions';
import {VmState} from './vm-state';

export class Vm {
	private readonly vmState: VmState;

	constructor(instructions: number[]) {
		this.vmState = new VmState(instructions);
	}

	run() {
		let instruction;
		do {
			instruction = this.vmState.instructions[this.vmState.instructionIndex++] as Instruction;
			InstructionMap[instruction](this.vmState);
		} while (instruction !== Instruction.INSTRUCTION_HALT);
		console.log(JSON.stringify(this.vmState));
	}
}
