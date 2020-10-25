import {Instruction} from './instructions';
import {Register} from './register';
import {Vm} from './vm';

// console.time('vm_test');
//
const vm = new Vm(Int32Array.from([
  Instruction.INSTRUCTION_PUSH, 1_000_000_000,
  Instruction.INSTRUCTION_LOAD, Register.D,
  Instruction.INSTRUCTION_LOG, Register.D,
  Instruction.INSTRUCTION_LABEL,
  Instruction.INSTRUCTION_INC, Register.C, 1,
  Instruction.INSTRUCTION_JL, 6,
  Instruction.INSTRUCTION_HALT
]));
//
vm.run();
console.log(JSON.stringify(vm.vmState));
// console.timeLog('vm_test');
//
// const programm = [];
// const programCode = `
// push 1000000000
// load D
// log D
// label [loop_start]
// inc C 1
// jl [loop_start]
// halt
// `;
//
// const lines = programCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
// const labels = new Map();
// const instructionMap = {
//   'push': Instruction.INSTRUCTION_PUSH,
//   'load': Instruction.INSTRUCTION_LOAD,
//   'log': Instruction.INSTRUCTION_LOG,
//   'label': Instruction.INSTRUCTION_LABEL,
//   'inc': Instruction.INSTRUCTION_INC,
//   'jl': Instruction.INSTRUCTION_JL,
//   'jle': Instruction.INSTRUCTION_JLE,
//   'halt': Instruction.INSTRUCTION_HALT,
// };
//
// let indexCounter = 0;
// for (const line in lines) {
//   const [operand, ...args] = line.split(' ');
//   if (!Object.prototype.hasOwnProperty.call(instructionMap, operand)) {
//     console.log(`operand not found: ${operand}`);
//     process.exit(1);
//   }
//   // @ts-ignore
//   const instruction = instructionMap[operand];
//   if (instruction === Instruction.INSTRUCTION_LABEL){
//     labels.set(args[0], indexCounter);
//   }
//
//   indexCounter += 1 + args.length;
// }
//
// console.log(lines);
//
