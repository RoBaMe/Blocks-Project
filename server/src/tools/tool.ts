import z from 'zod';
import OpenAI from 'openai';

type OpenAITool = OpenAI.Responses.Tool;
type OpenAIResponse = OpenAI.Responses.Response & { type: 'function_call' };

export abstract class Tool<TInput, TOutput> {
    constructor(
        public name: string,
        protected description: string,
        protected inputSchema: z.ZodSchema<TInput>,
    ) {}

    public toOpenAiToolSchema(): OpenAITool {
        return {
            type: 'function',
            name: this.name,
            description: this.description,
            parameters: z.object({ result: this.inputSchema }).toJSONSchema(),
            strict: true,
        };
    }

    public validateArguments(stringifiedArguments: string): TInput {
        try {
            const parsedArguments = z
                .object({ result: this.inputSchema })
                .parse(JSON.parse(stringifiedArguments));

            return parsedArguments.result;
        } catch (error) {
            throw new Error(`Invalid arguments: ${error.message}`);
        }
    }

    protected abstract doAction(input: TInput): Promise<TOutput>;

    protected abstract displayResult(result: TOutput): string;

    public async run(argumentsString: string): Promise<string> {
        const validatedArguments = this.validateArguments(argumentsString);
        const result = await this.doAction(validatedArguments);
        return this.displayResult(result);
    }
}
