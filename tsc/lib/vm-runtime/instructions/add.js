export function add(vmState) {
    vmState.registers[0 /* A */] = vmState.nextInstruction();
    vmState.registers[1 /* B */] = vmState.nextInstruction();
    vmState.registers[2 /* C */] = vmState.registers[0 /* A */] + vmState.registers[1 /* B */];
}
//# sourceMappingURL=add.js.map