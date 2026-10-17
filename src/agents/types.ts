import { Article, ReaderProfile, LearningSignals, ChiefEditorNote, CoffeeBreakItem, PaperEdition, NuancePerspective } from '../types';

export type AgentRole =
  | 'chief_editor'
  | 'curator_reranker'
  | 'nuance_analyst'
  | 'culture_puzzle'
  | 'newsroom_anchor';

export interface AgentLog {
  agent: string;
  role: AgentRole;
  message: string;
  timestamp: number;
}

export interface EditorialWorkflowState {
  profile: ReaderProfile;
  signals: LearningSignals;
  candidateArticles: Article[];
  curatedLeadArticle?: Article;
  curatedSideArticles?: Article[];
  curatedSections?: { category: string; articles: Article[] }[];
  chiefEditorNote?: ChiefEditorNote;
  coffeeBreak?: CoffeeBreakItem;
  nuancePerspective?: NuancePerspective;
  agentLogs: AgentLog[];
}
