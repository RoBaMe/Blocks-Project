import z from 'zod';
import { Tool } from './tool';

export class MaxTool extends Tool<number[], number> {
    constructor() {
        super(
            'maxNumbers',
            'Calculate the maximum number of a list of numbers',
            z.array(z.number()),
        );
    }

    protected async doAction(input: number[]): Promise<number> {
        return Math.max(...input);
    }

    protected displayResult(result: number): string {
       return `The maximum number is ${result}`;
    }
}
