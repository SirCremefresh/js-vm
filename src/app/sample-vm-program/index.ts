import {Vm, Instruction, Register} from '../../lib/vm-runtime/index';

console.time('vm_test');
const vm = new Vm(Int32Array.from([
  Instruction.INSTRUCTION_PUSH, 1_000_000,
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
console.timeLog('vm_test');


