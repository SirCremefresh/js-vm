export function assert(val: boolean, message: string): void {
  if (!val) {
    console.error(message);
    process.exit(1);
  }
}
