import {assert} from '../assert';
import {VmState} from '../vm-state';

export function load(vmState: VmState): void {
  const stackValue = vmState.stack.pop() as number;
  if (process.env.NODE_ENV !== 'production') {
    assert(stackValue !== undefined, 'Load on empty stack');
  }
  vmState.registers[vmState.nextInstruction()] = stackValue;
}
