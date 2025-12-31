
export enum AppTab {
  AI_ASSISTANT = 'ai',
  NEWS = 'news',
  COMPONENT_SEARCH = 'search',
  TOOLS = 'tools',
  ME = 'me'
}

export type UserTier = 'Free' | 'Pro' | 'Enterprise';

export interface UserAccount {
  name: string;
  avatar: string;
  role: string;
  tier: UserTier;
  credits: number;
  totalUsage: number;
}

export interface HistoryItem {
  id: string;
  type: 'IMAGE' | 'CHAT';
  task: string;
  timestamp: string;
  content: string;
  image?: string;
}

export interface PriceBreak {
  quantity: number;
  price: string;
}

export interface SupplySource {
  distributor: string;
  price: string;
  stock: string;
  isAuthorized: boolean;
  leadTime: string;
  priceBreaks?: PriceBreak[];
}

export interface AlternativePart {
  mpn: string;
  mfg: string;
  description: string;
  package: string;
  price: string;
  compatibility: 'Pin-to-Pin' | 'Functional';
  reasoning: string;
  riskScore: number;
  isDomestic?: boolean;
}

export interface CadAssets {
  symbolUrl: string;
  footprintUrl: string;
  model3dUrl: string;
}

export interface ComponentData {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  pinout: Array<{ pin: string; func: string; desc: string }>;
  imageUrl: string;
  officialUrl?: string;
  cad?: CadAssets;
  engineeringInsights: {
    ratings: {
      newbieFriendly: number;
      competitionPopularity: number;
      failureRisk: number;
    };
    pitfalls: string[];
    bestFit: string[];
  };
  aiAdvice: {
    pros: string[];
    cons: string[];
    precautions: string[];
    typicalApps: string[];
    risks: {
      lifecycle: string;
      supply: string;
      thermalEMC: string;
      secondSource: string;
    };
  };
  datasheetInsights: {
    designNotes: string;
    parameterTable: Record<string, string>;
    datasheetUrl?: string;
    previewUrl?: string;
  };
  marketInfo: {
    priceTrend: 'Rising' | 'Stable' | 'Falling';
    buyingAdvice: string;
    sources: SupplySource[];
  };
  alternatives: AlternativePart[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  time: string;
  views?: number;
  imageUrl?: string;
  takeaway: string;
  affected: string[];
  scenarios: string[];
}
