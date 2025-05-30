"use client";

import * as React from "react";
import { MentionsInput, Mention } from "react-mentions";
import SearchResult from "@/ui/searchResult";

interface WikipediaPage {
  title: string;
  description?: string;
  thumbnail?: {
    source: string;
  };
  index: number;
}

interface WikipediaResponse {
  query?: {
    pages?: WikipediaPage[];
  };
}

interface NoteProps {
  value: string;
  onChange: (value: string) => void;
  selectedArticle: string | null;
  setSelectedArticle: (article: string | null) => void;
}

const mentionStyles = {
  control: {
    fontSize: 16,
    fontWeight: "normal",
    minHeight: "70px",
    maxHeight: "200px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: 0,
    padding: "0.5rem 0.75rem",
    color: "white",
    backgroundColor: "#2a2a2a",
    "&::placeholder": {
      color: "#8b8b8b",
    },
    borderRadius: "0.375rem",
    width: "100%",
    minHeight: "70px",
    maxHeight: "200px",
    overflow: "auto",
    resize: "none",
  },
  suggestions: {
    list: {
      backgroundColor: "#191919",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "0.375rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: "0.5rem",
      zIndex: 50,
    },
    item: {
      "&focused": {
        backgroundColor: "#383838",
      },
    },
  },
} as const;

const mobileStyles = {
  ...mentionStyles,
  control: {
    ...mentionStyles.control,
  },
  input: {
    ...mentionStyles.input,
    border: "none",
    outline: "none",
  },
  suggestions: {
    ...mentionStyles.suggestions,
    list: {
      ...mentionStyles.suggestions.list,
    },
  },
} as const;

const desktopStyles = {
  ...mentionStyles,
  suggestions: {
    ...mentionStyles.suggestions,
    list: {
      ...mentionStyles.suggestions.list,
      width: "400px",
    },
  },
} as const;

const Note = ({
  value,
  onChange,
  selectedArticle,
  setSelectedArticle,
}: NoteProps) => {
  const [results, setResults] = React.useState<WikipediaPage[]>([]);
  // const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndex] = React.useState(-1);
  const [uiLang] = React.useState("en");
  const [isMobile, setIsMobile] = React.useState(true);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const searchWikipedia = async (query: string) => {
    // setIsLoading(true);
    try {
      const response = await fetch(
        `https://${uiLang}.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2&action=query&prop=pageimages%7Cdescription&uselang=content&smaxage=300&maxage=300&generator=prefixsearch&pilicense=any&piprop=thumbnail&pithumbsize=160&gpssearch=${encodeURIComponent(
          query
        )}`
      );

      const data: WikipediaResponse = await response.json();

      if (data.query?.pages) {
        const sortedResults = data.query.pages
          .sort((a, b) => a.index - b.index)
          .slice(0, 10);

        setResults(sortedResults);
        return sortedResults;
      } else {
        setResults([]);
        return [];
      }
    } catch (error) {
      console.error("Wikipedia search error:", error);
      setResults([]);
      return [];
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSearch = async (
    query: string,
    callback: (results: { id: string; display: string }[]) => void
  ) => {
    // If there's already a selected article, don't show suggestions
    if (selectedArticle) {
      callback([]);
      return;
    }

    const searchResults = await searchWikipedia(query);
    callback(
      searchResults.map((result) => ({
        id: result.title,
        display: result.title,
      }))
    );
  };

  return (
    <div className="relative min-h-[70px]">
      <MentionsInput
        value={value}
        onChange={(e: { target: { value: string } }) =>
          onChange(e.target.value)
        }
        className="w-full"
        style={isMobile ? mobileStyles : desktopStyles}
        placeholder="Add note..."
        allowSpaceInQuery
      >
        <Mention
          trigger="@"
          data={handleSearch}
          renderSuggestion={(suggestion) => {
            const result = results.find((r) => r.title === suggestion.id);
            if (!result) return null;
            return (
              <SearchResult
                result={{
                  title: result.title,
                  description: result.description,
                  image: result.thumbnail?.source,
                }}
                isSelected={results.indexOf(result) === selectedIndex}
              />
            );
          }}
          appendSpaceOnAdd
          markup="@[__display__](__id__)"
          onAdd={(id) => setSelectedArticle(String(id))}
          displayTransform={(id, display) => display}
        />
      </MentionsInput>
    </div>
  );
};

export default Note;
