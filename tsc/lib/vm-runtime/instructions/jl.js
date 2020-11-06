import { jmp } from './jmp';
export function jl(vmState) {
    if (vmState.registers[2 /* C */] >= vmState.registers[3 /* D */]) {
        vmState.instructionIndex++;
        return;
    }
    jmp(vmState);
}
//# sourceMappingURL=jl.js.map