import { add } from './instructions/add';
import { halt } from './instructions/halt';
import { inc } from './instructions/inc';
import { jl } from './instructions/jl';
import { jle } from './instructions/jle';
import { jmp } from './instructions/jmp';
import { load } from './instructions/load';
import { log } from './instructions/log';
import { push } from './instructions/push';
export const InstructionMap = {
    [0 /* INSTRUCTION_HALT */]: halt,
    [1 /* INSTRUCTION_PUSH */]: push,
    [2 /* INSTRUCTION_LOG */]: log,
    [3 /* INSTRUCTION_ADD */]: add,
    [4 /* INSTRUCTION_LOAD */]: load,
    [5 /* INSTRUCTION_INC */]: inc,
    [6 /* INSTRUCTION_JMP */]: jmp,
    [7 /* INSTRUCTION_JLE */]: jle,
    [8 /* INSTRUCTION_JL */]: jl,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    [10 /* INSTRUCTION_NOP */]: function (_) {
        return null;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    [9 /* INSTRUCTION_LABEL */]: function (_) {
        return null;
    },
};
//# sourceMappingURL=instructions.js.map