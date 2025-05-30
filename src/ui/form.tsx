"use client";

import * as React from "react";
import * as Context from "@/context/AppContext";
import * as Ui from "@/ui";
import * as Utils from "@/lib/utils";
import * as Icons from "./icons";
import { useWikipediaSummary } from "@/hooks/useWikipediaSummary";

const Form = () => {
  const { addNode, title, setTitle } = Context.useApp();
  const { fetchSummary, isLoading: isSummaryLoading } = useWikipediaSummary();
  const [note, setNote] = React.useState("");
  const [selectedArticle, setSelectedArticle] = React.useState<string | null>(
    null
  );
  const [articleSummary, setArticleSummary] = React.useState<string | null>(
    null
  );
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustHeight();
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArticle && note.trim()) {
      const summary = await fetchSummary(selectedArticle);
      addNode({
        article: {
          ...summary,
          summary: articleSummary || summary.summary,
        },
        note: note.trim(),
      });
      setNote("");
      setSelectedArticle(null);
      setArticleSummary(null);
      console.log("added");
    }
  };

  const handleSummaryUpdate = (newSummary: string) => {
    setArticleSummary(newSummary);
  };

  const isFormValid = selectedArticle && note.trim().length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 font-mono font-light resize-none overflow-hidden"
          rows={1}
          placeholder="My rabbit hole"
        />
        <Ui.Note
          value={note}
          onChange={setNote}
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
        />
        {!selectedArticle && <Ui.Search onSelect={setSelectedArticle} />}
        {selectedArticle && (
          <div className="flex items-center gap-2 relative">
            <Ui.ArticleCard
              title={selectedArticle}
              onPreNodeUpdate={handleSummaryUpdate}
            />
            <button
              onClick={() => {
                setSelectedArticle(null);
                setArticleSummary(null);
              }}
              className="absolute right-2 top-2 rounded-full bg-gray-500 p-1 cursor-pointer transition-colors hover:bg-gray-600"
            >
              <div className="w-3 h-3 text-black">
                <Icons.CloseIcon />
              </div>
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={!isFormValid || isSummaryLoading}
          className={Utils.cx([
            "w-full py-2 px-4 rounded-md text-white font-medium",
            {
              "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500":
                Boolean(isFormValid && !isSummaryLoading),
              "bg-gray-400 cursor-not-allowed":
                !isFormValid || isSummaryLoading,
            },
          ])}
        >
          {isSummaryLoading ? "Loading..." : "Add to Rabbit Hole"}
        </button>
      </div>
    </form>
  );
};

export default Form;
