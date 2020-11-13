import { Register } from './register';

export class VmState {
  public stdOut: (message: number) => void = console.log;
  public readonly instructions: Int32Array;
  public readonly stack: number[] = [];
  public readonly registers: Int32Array = new Int32Array(Register.REGISTER_LENGTH);
  public instructionIndex = 0;

  constructor(instructions: Int32Array, stdOut: ((message: number) => void) | null = null) {
    this.instructions = instructions;
    if (stdOut !== null) {
      this.stdOut = stdOut;
    }
  }

  public nextInstruction(): number {
    return this.instructions[this.instructionIndex++];
  }
}
