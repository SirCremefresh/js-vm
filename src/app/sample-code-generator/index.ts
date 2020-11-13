import { generateCode } from '../../lib/code-generator/index';
import { Vm } from '../../lib/vm-runtime/index';


const programText = `
push 100
load %rd
log %rd
loop_start:
inc %rc, 1
log %rc
jl loop_start
halt`;

const vm = new Vm(generateCode(programText));
try {
  vm.run();
} catch (e) {
  console.log('error');
  console.log(vm.vmState);
}
