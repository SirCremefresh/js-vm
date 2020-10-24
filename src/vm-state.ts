import {Register} from './register';

export class VmState {
  public readonly instructions: number[];
  public readonly stack: number[] = [];
  public readonly registers: [Register.A, Register.B, Register.C, Register.D] = [0, 0, 0, 0];
  public instructionIndex = 0;

  constructor(instructions: number[]) {
    this.instructions = instructions;
  }

  public nextInstruction(): number {
    return this.instructions[this.instructionIndex++];
  }
}
