"use client";

import * as React from "react";
import * as Context from "@/context/AppContext";
import * as Ui from "@/ui";
import * as Icons from "./icons";

const NodesList = () => {
  const { nodes, removeNode } = Context.useApp();

  if (nodes.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No nodes added yet. Use the form above to add a node to your rabbit
        hole.
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-[#313131]">
      <ul className="space-y-4">
        {nodes.map((node, index) => (
          <li
            key={`${node.article.title}-${index}`}
            className="flex flex-col gap-y-2 bg-[#2a2a2a] rounded-lg p-3 relative"
          >
            <button
              onClick={() => removeNode(index)}
              className="absolute right-2 top-2 rounded-full bg-gray-500 p-1 cursor-pointer transition-colors hover:bg-gray-600"
            >
              <div className="w-3 h-3 text-black">
                <Icons.CloseIcon />
              </div>
            </button>
            <p className="whitespace-pre-wrap">{node.note}</p>
            <div className="pr-4">
              <Ui.ArticleCard
                title={node.article.title}
                summary={node.article.summary}
                thumbnail={node.article.thumbnail}
                nodeIndex={index}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodesList;
