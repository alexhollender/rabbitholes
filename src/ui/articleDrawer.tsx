"use client";

import * as React from "react";
import * as Utils from "@/lib/utils";

interface ArticleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  onUpdateSummary: (summary: string) => void;
  canUpdate: boolean;
}

const ArticleDrawer = ({
  isOpen,
  onClose,
  articleTitle,
  onUpdateSummary,
  canUpdate,
}: ArticleDrawerProps) => {
  const [selectedText, setSelectedText] = React.useState("");
  const [articleContent, setArticleContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && articleTitle) {
      fetchArticleContent(articleTitle);
    }
  }, [isOpen, articleTitle]);

  const fetchArticleContent = async (title: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro=0&explaintext=1&titles=${encodeURIComponent(
          title
        )}`
      );
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      setArticleContent(pages[pageId].extract || "No content available");
    } catch (error) {
      console.error("Error fetching article content:", error);
      setArticleContent("Error loading article content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    } else {
      setSelectedText("");
    }
  };

  const handleUpdateSummary = () => {
    if (selectedText) {
      onUpdateSummary(selectedText);
      onClose();
    }
  };

  return (
    <>
      <div
        className={Utils.cx([
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          { "opacity-100": isOpen, "opacity-0": !isOpen },
          { "pointer-events-none": !isVisible },
          { invisible: !isVisible },
        ])}
        onClick={onClose}
      />
      <div
        className={Utils.cx([
          "bg-[#1a1a1a] fixed z-50 flex flex-col transition-transform duration-300 ease-in-out",
          {
            "bottom-0 left-0 right-0 h-[90svh] rounded-t-xl": isMobile,
            "top-0 right-0 h-full w-[500px] rounded-l-xl": !isMobile,
          },
          {
            "translate-y-0": isOpen && isMobile,
            "translate-y-full": !isOpen && isMobile,
            "translate-x-0": isOpen && !isMobile,
            "translate-x-full": !isOpen && !isMobile,
          },
          { "pointer-events-none": !isVisible },
          { invisible: !isVisible },
        ])}
      >
        <div className="p-8 flex-1 overflow-auto">
          <div className="mx-auto">
            <h2 className="text-xl font-semibold mb-4">{articleTitle}</h2>
            {isLoading && (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            )}
            {!isLoading && (
              <div
                className="max-w-none prose prose-sm whitespace-pre-wrap"
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
              >
                {articleContent}
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={handleUpdateSummary}
            disabled={!selectedText}
            className={Utils.cx([
              "w-full py-2 px-4 rounded-md text-white font-medium",
              {
                "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500":
                  Boolean(selectedText),
                "bg-gray-400 cursor-not-allowed": !selectedText,
              },
            ])}
          >
            Update Summary
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticleDrawer;
