import { CoffeeBreakItem } from '../types';
import { MOCK_COFFEE_BREAK } from '../data/newsFeed';
import { AgentLog } from './types';

export class PuzzleAgent {
  public static async execute(leadCategory: string, logs: AgentLog[]): Promise<CoffeeBreakItem> {
    logs.push({
      agent: 'Culture & Leisure Agent (Minerva-3)',
      role: 'culture_puzzle',
      message: `Formulating intellectual dilemma and word of the day matching lead beat: "${leadCategory}".`,
      timestamp: Date.now()
    });

    const puzzle = { ...MOCK_COFFEE_BREAK };

    logs.push({
      agent: 'Culture & Leisure Agent (Minerva-3)',
      role: 'culture_puzzle',
      message: `Selected riddle: "${puzzle.riddle.slice(0, 40)}..." and historical footnote: 1702 Fleet Street origin.`,
      timestamp: Date.now()
    });

    return puzzle;
  }
}
