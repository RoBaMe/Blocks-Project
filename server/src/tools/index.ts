import { MaxTool } from './maxTool';
import { SumTool } from './sumTool';
import { Tool } from './tool';

export const myTools = [new SumTool(), new MaxTool()];

export const myToolsDict: Record<string, Tool<any, any>> = myTools.reduce((acc, tool) => {
    acc[tool.name] = tool;
    return acc;
}, {});
