export interface ArticleSummary {
  title: string;
  summary: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface Node {
  article: ArticleSummary;
  note: string;
}

export interface AppContextType {
  nodes: Node[];
  addNode: (node: Node) => void;
  title: string;
  setTitle: (title: string) => void;
  updateNodeSummary: (nodeIndex: number, newSummary: string) => void;
}

export interface SearchResult {
  title: string;
  description: string;
  image: string;
  index: number;
  thumbnail?: {
    source: string;
  };
}

export interface WikipediaResponse {
  query?: {
    pages?: SearchResult[];
  };
}

export interface SummaryResponse {
  extract: string;
  title: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}
