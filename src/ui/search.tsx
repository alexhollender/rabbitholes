"use client";

import * as React from "react";
import * as Ui from "@/ui";
import * as Utils from "@/lib/utils";

interface SearchResult {
  title: string;
  description: string;
  image: string;
  index: number;
  thumbnail?: {
    source: string;
  };
}

interface WikipediaResponse {
  query?: {
    pages?: SearchResult[];
  };
}

interface SearchProps {
  onSelect: (title: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [uiLang] = React.useState("en");

  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const searchWikipedia = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${uiLang}.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2&action=query&prop=pageimages%7Cdescription&uselang=content&smaxage=300&maxage=300&generator=prefixsearch&pilicense=any&piprop=thumbnail&pithumbsize=160&gpssearch=${encodeURIComponent(
          query
        )}`
      );

      const data: WikipediaResponse = await response.json();

      if (data.query?.pages) {
        const sortedResults = data.query.pages
          .map((page) => ({
            title: page.title,
            description: page.description || "",
            image: page.thumbnail?.source || "",
            index: page.index,
          }))
          .sort((a, b) => a.index - b.index)
          .slice(0, 10);

        setResults(sortedResults);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Wikipedia search error:", error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = React.useCallback(
    (term: string) => {
      if (term.length > 0) {
        searchWikipedia(term);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    },
    [searchWikipedia]
  );

  const debouncedSearchWithDelay = React.useMemo(
    () => debounce<string>(debouncedSearch, 300),
    [debouncedSearch]
  );

  React.useEffect(() => {
    debouncedSearchWithDelay(searchTerm);
  }, [searchTerm, debouncedSearchWithDelay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(results[selectedIndex].title);
          setIsOpen(false);
          setSelectedIndex(-1);
          setSearchTerm("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onSelect(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    setSearchTerm("");
  };

  const handleClickOutside = React.useCallback((e: MouseEvent) => {
    if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="w-5 h-5 absolute left-3 top-[10px] pointer-events-none text-[#8b8b8b]">
          <SearchIcon />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && results.length > 0 && setIsOpen(true)}
          placeholder="Wikipedia article"
          className="block w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white bg-[#2a2a2a] placeholder-[#8b8b8b]"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 border border-[#3e3e3e] bg-[#191919] rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {results.map((result, index) => (
            <div
              key={`${result.title}-${result.index}`}
              onClick={() => handleResultClick(result)}
              className={Utils.cx([
                "flex items-start cursor-pointer transition-colors",
                { "bg-[#383838]": index === selectedIndex },
              ])}
            >
              <Ui.SearchResult result={result} />
            </div>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && !isLoading && searchTerm && (
        <div className="absolute z-50 w-full mt-1 border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
          No results found for &quot;{searchTerm}&quot;
        </div>
      )}
    </div>
  );
};

// Utility function for debouncing
function debounce<T>(func: (arg: T) => void, wait: number): (arg: T) => void {
  let timeout: NodeJS.Timeout;
  return (arg: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(arg), wait);
  };
}

export default Search;

const SearchIcon = () => {
  return (
    <svg
      id="SearchIcon"
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 17.1059C5 23.8612 10.4964 29.3577 17.2518 29.3577C19.9233 29.3577 22.3644 28.498 24.3756 27.0548L31.9294 34.6238C32.2825 34.9771 32.7432 35.1459 33.2345 35.1459C34.2784 35.1459 35 34.3628 35 33.3341C35 32.8428 34.8157 32.3976 34.4934 32.0753L26.9857 24.5215C28.567 22.4642 29.5036 19.9002 29.5036 17.1059C29.5036 10.3505 24.0071 4.85411 17.2518 4.85411C10.4964 4.85411 5 10.3505 5 17.1059ZM7.62538 17.1059C7.62538 11.7937 11.9396 7.4795 17.2518 7.4795C22.564 7.4795 26.8782 11.7937 26.8782 17.1059C26.8782 22.4181 22.564 26.7323 17.2518 26.7323C11.9396 26.7323 7.62538 22.4181 7.62538 17.1059Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
