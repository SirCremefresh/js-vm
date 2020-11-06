function setToken(ctx, index, endIndexDelta = -1) {
    ctx.tokenStream.push({
        token: ctx.state,
        startIndex: ctx.startIndex,
        endIndex: index + endIndexDelta,
    });
    ctx.startIndex = index;
}
export function getTokenStream(programText) {
    const programCharacters = programText.split('');
    const context = {
        startIndex: 0,
        state: "TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */,
        tokenStream: []
    };
    for (let index = 0; index < programCharacters.length; ++index) {
        const character = programCharacters[index];
        switch (character) {
            case ' ':
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    break;
                }
                setToken(context, index);
                context.state = "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */;
                break;
            case ':':
                context.state = "TOKEN_LABEL" /* TOKEN_LABEL */;
                break;
            case '\n':
                if (context.startIndex !== index) {
                    setToken(context, index);
                }
                context.state = "TOKEN_NEWLINE" /* TOKEN_NEWLINE */;
                setToken(context, index, 0);
                context.state = "TOKEN_INSTRUCTION" /* TOKEN_INSTRUCTION */;
                context.startIndex = index + 1;
                break;
            case '%':
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    setToken(context, index);
                    context.state = "TOKEN_REGISTER" /* TOKEN_REGISTER */;
                }
                break;
            case ',':
                setToken(context, index);
                context.state = "TOKEN_COMMA" /* TOKEN_COMMA */;
                break;
            case '/':
                if (context.startIndex !== index) {
                    setToken(context, index);
                }
                if ('/' !== programCharacters[index + 1]) {
                    context.state = "TOKEN_INVALID" /* TOKEN_INVALID */;
                    break;
                }
                while (programCharacters[index] !== '\n') {
                    index++;
                }
                context.state = "TOKEN_COMMENT" /* TOKEN_COMMENT */;
                --index;
                break;
            default:
                if (context.state === "TOKEN_WHITESPACE" /* TOKEN_WHITESPACE */) {
                    setToken(context, index);
                    context.state = "TOKEN_CONST" /* TOKEN_CONST */;
                }
        }
    }
    setToken(context, programCharacters.length - 1, 0);
    return context.tokenStream;
}
//# sourceMappingURL=lexer.js.map