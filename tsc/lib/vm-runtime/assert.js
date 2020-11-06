export function assert(val, message) {
    if (!val) {
        console.error(message);
        process.exit(1);
    }
}
//# sourceMappingURL=assert.js.map