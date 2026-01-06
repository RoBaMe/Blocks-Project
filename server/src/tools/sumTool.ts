import z from 'zod';
import { Tool } from './tool';

export class SumTool extends Tool<number[], number> {
    constructor() {
        super(
            'sumNumbers',
            'Calculate the sum of a list of numbers',
            z.array(z.number()),
        );
    }

    protected async doAction(input: number[]): Promise<number> {
        return input.reduce((acc, curr) => acc + curr, 0);
    }

    protected displayResult(result: number): string {
        return `The sum of the numbers is ${result}`;
    }
}
