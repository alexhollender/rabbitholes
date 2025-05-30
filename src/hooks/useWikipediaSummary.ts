import { useState, useCallback } from "react";
import { ArticleSummary, SummaryResponse } from "@/types";

export function useWikipediaSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(
    async (title: string): Promise<ArticleSummary> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title.replace(/ /g, "_")
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }

        const data: SummaryResponse = await response.json();
        return {
          title: data.title,
          summary: data.extract,
          thumbnail: data.thumbnail
            ? {
                url: data.thumbnail.source,
                width: data.thumbnail.width,
                height: data.thumbnail.height,
              }
            : undefined,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return {
          title,
          summary: "",
          thumbnail: undefined,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { fetchSummary, isLoading, error };
}
