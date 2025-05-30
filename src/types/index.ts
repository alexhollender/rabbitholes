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
  removeNode: (nodeIndex: number) => void;
}
