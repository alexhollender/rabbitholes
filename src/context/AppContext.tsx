"use client";

import * as React from "react";
import * as Types from "@/lib/types";

const AppContext = React.createContext<Types.AppContextType | undefined>(
  undefined
);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = React.useState<Types.Node[]>([]);
  const [title, setTitle] = React.useState("");

  const addNode = (node: Types.Node) => {
    setNodes((prev) => [...prev, node]);
  };

  const updateNodeSummary = (nodeIndex: number, newSummary: string) => {
    setNodes((prev) =>
      prev.map((node, index) =>
        index === nodeIndex
          ? {
              ...node,
              article: {
                ...node.article,
                summary: newSummary,
              },
            }
          : node
      )
    );
  };

  const removeNode = (nodeIndex: number) => {
    setNodes((prev) => prev.filter((_, index) => index !== nodeIndex));
  };

  const value: Types.AppContextType = {
    nodes,
    addNode,
    title,
    setTitle,
    updateNodeSummary,
    removeNode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
