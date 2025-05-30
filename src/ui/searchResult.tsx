import * as React from "react";
import * as Utils from "@/lib/utils";

import Image from "next/image";

interface SearchResultProps {
  result: {
    title: string;
    description?: string;
    image?: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={Utils.cx([
        "w-full flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-[#383838]",
        { "bg-[#383838]": isSelected },
      ])}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
        {result.image ? (
          <Image
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            width={48}
            height={48}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-100 truncate">
          {result.title}
        </h3>
        {result.description && (
          <p className="text-sm text-gray-400 mt-1">{result.description}</p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
