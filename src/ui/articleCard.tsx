"use client";

import * as React from "react";
import * as Context from "@/context/AppContext";
import * as Types from "@/types";

import { useWikipediaSummary } from "@/hooks/useWikipediaSummary";
import ArticleDrawer from "./articleDrawer";

interface ArticleCardProps {
  title: string;
  summary?: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  nodeIndex?: number;
  onPreNodeUpdate?: (newSummary: string) => void;
}

const ArticleCard = ({
  title,
  summary: initialSummary,
  thumbnail: initialThumbnail,
  nodeIndex,
  onPreNodeUpdate,
}: ArticleCardProps) => {
  const { fetchSummary, isLoading } = useWikipediaSummary();
  const { updateNodeSummary } = Context.useApp();

  const getArticleData = () => {
    if (!initialSummary) return null;
    return { title, summary: initialSummary, thumbnail: initialThumbnail };
  };

  const [articleData, setArticleData] =
    React.useState<Types.ArticleSummary | null>(getArticleData());
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!articleData && !isLoading) {
      fetchSummary(title).then(setArticleData);
    }
  }, [title, articleData, isLoading, fetchSummary]);

  const handleSummaryClick = () => {
    setIsDrawerOpen(true);
  };

  const handleUpdateSummary = (newSummary: string) => {
    if (nodeIndex !== undefined) {
      updateNodeSummary(nodeIndex, newSummary);
      setArticleData((prev) =>
        prev ? { ...prev, summary: newSummary } : null
      );
    } else if (onPreNodeUpdate) {
      onPreNodeUpdate(newSummary);
      setArticleData((prev) =>
        prev ? { ...prev, summary: newSummary } : null
      );
    }
  };

  return (
    <>
      <div
        className="rounded-lg bg-[#3e3e3e] hover:bg-[#2e2e2e] p-2 cursor-pointer transition-colors"
        onClick={handleSummaryClick}
      >
        <div className="flex gap-4">
          {articleData?.thumbnail && (
            <div className="flex-shrink-0">
              <img
                src={articleData.thumbnail.url}
                alt={title}
                className="w-16 h-16 object-cover rounded-md bg-gray-200"
              />
            </div>
          )}
          <div className="flex flex-col gap-y-1">
            <h3 className="font-medium text-gray-100">{title}</h3>
            {isLoading && (
              <div className="mt-2 text-sm text-gray-200">
                Loading summary...
              </div>
            )}
            {!isLoading && articleData?.summary && (
              <p className="text-gray-300 line-clamp-3 text-sm">
                {articleData.summary}
              </p>
            )}
          </div>
        </div>
      </div>
      <ArticleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        articleTitle={title}
        onUpdateSummary={handleUpdateSummary}
        canUpdate={nodeIndex !== undefined || onPreNodeUpdate !== undefined}
      />
    </>
  );
};

export default ArticleCard;
