import { assert } from '../assert';
export function load(vmState) {
    const stackValue = vmState.stack.pop();
    if (process.env.NODE_ENV !== 'production') {
        assert(stackValue !== undefined, 'Load on empty stack');
    }
    vmState.registers[vmState.nextInstruction()] = stackValue;
}
//# sourceMappingURL=load.js.map