import { Register } from './register';

export class VmState {
  public readonly instructions: Int32Array;
  public readonly stack: number[] = [];
  public readonly registers: Int32Array = new Int32Array(
    Register.REGISTER_LENGTH
  );
  public instructionIndex = 0;

  constructor(instructions: Int32Array) {
    this.instructions = instructions;
  }

  public nextInstruction(): number {
    return this.instructions[this.instructionIndex++];
  }
}
