export function inc(vmState) {
    vmState.registers[vmState.nextInstruction()] += vmState.nextInstruction();
}
//# sourceMappingURL=inc.js.map