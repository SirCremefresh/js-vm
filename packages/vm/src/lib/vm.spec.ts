import { Instruction } from './instruction';
import { Vm } from './vm';

describe('vm', () => {
  it('should work', () => {
    const vm = new Vm(
      Int32Array.from([
        Instruction.INSTRUCTION_PUSH,
        1_000,
        Instruction.INSTRUCTION_HALT,
      ])
    );
    vm.run();
    console.log(JSON.stringify(vm.vmState));
    expect(vm.vmState).toBeDefined();
  });
});
