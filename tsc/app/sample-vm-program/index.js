import { Vm } from '../../lib/vm-runtime/index';
console.time('vm_test');
const vm = new Vm(Int32Array.from([
    1 /* INSTRUCTION_PUSH */, 1000000,
    4 /* INSTRUCTION_LOAD */, 3 /* D */,
    2 /* INSTRUCTION_LOG */, 3 /* D */,
    9 /* INSTRUCTION_LABEL */,
    5 /* INSTRUCTION_INC */, 2 /* C */, 1,
    8 /* INSTRUCTION_JL */, 6,
    0 /* INSTRUCTION_HALT */
]));
//
vm.run();
console.log(JSON.stringify(vm.vmState));
console.timeLog('vm_test');
//# sourceMappingURL=index.js.map