import {Instruction} from './instructions';
import {Register} from './register';
import {Vm} from './vm';

//
// [:|] mit inc instruction
// [:)]
if (process.env.NODE_ENV !== 'production') {
  console.time('vm_test');
}
const vm = new Vm([
  Instruction.INSTRUCTION_PUSH, 1_000_000_000,
  Instruction.INSTRUCTION_LOAD, Register.D,
  Instruction.INSTRUCTION_LOG, Register.D,
  Instruction.INSTRUCTION_LABEL,
  // Instruction.INSTRUCTION_LOG, Register.C,
  Instruction.INSTRUCTION_INC, Register.C, 1,
  Instruction.INSTRUCTION_JLE, 6,
  Instruction.INSTRUCTION_HALT
]);


// const vm = new Vm([
// 	Instruction.INSTRUCTION_PUSH, 1,
// 	Instruction.INSTRUCTION_LOAD, Register.C,
// 	Instruction.INSTRUCTION_LOG, Register.C,
// 	Instruction.INSTRUCTION_HALT
// ]);
//

//
// const vm = new Vm([
// 	Instruction.INSTRUCTION_ADD, 2, 3,
// 	Instruction.INSTRUCTION_INC, Register.C, 4,
// 	Instruction.INSTRUCTION_INC, Register.C, 5,
// 	Instruction.INSTRUCTION_LOG, Register.C,
// 	Instruction.INSTRUCTION_HALT
// ]);

vm.run();
if (process.env.NODE_ENV !== 'production') {
  console.timeLog('vm_test');
}
