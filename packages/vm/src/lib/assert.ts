export function assert(val: boolean, message: string): void {
  if (!val) {
    console.log(message);
    process.exit(1);
  }
}
