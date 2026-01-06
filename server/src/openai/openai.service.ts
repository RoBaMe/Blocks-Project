import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { myTools, myToolsDict } from 'src/tools';

@Injectable()
export class OpenAIService {
    private openai: OpenAI;
    private tools: OpenAI.Responses.Tool[];

    constructor() {
        this.openai = new OpenAI({
            apiKey: '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',
        });
        this.tools = myTools.map((tool) => tool.toOpenAiToolSchema());
    }

    async runTools(userMessage: string): Promise<string> {
        const response = await this.openai.responses.create({
            model: 'gpt-4',
            input: userMessage,
            tools: this.tools,
            tool_choice: 'auto',
        });

        const toolCalls = response.output.filter((output) => output.type === 'function_call');

        if (toolCalls.length === 0) return 'No Appopriate tool found, please try again';

        const results = await Promise.all(
            toolCalls.map(async (toolCall) => {
                const tool = myToolsDict[toolCall.name];

                if (!tool) return `Tool ${toolCall.name} not found`;

                const result = await tool.run(toolCall.arguments);
                return result;
            }),
        );

        return results.join('\n');
    }
}