"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";
import toast from "../components/Toast";

interface ItineraryDisplayProps {
  itinerary: string; // The raw Markdown itinerary
}

// Utility to clean and format Markdown
const cleanMarkdown = (markdown: string): string => {
  return markdown
    .replace(/#\s*##/g, "##") // Replace redundant "# ##" with "##"
    .replace(/##\s*#/g, "##") // Replace "## #" with "##"
    .replace(/\*\s*#/g, "*") // Remove misplaced "#" in list items
    .replace(/\n{3,}/g, "\n\n") // Remove excessive newlines
    .replace(/#\s+(?!\s)/g, "# ") // Ensure proper spacing after each "#"
    .replace(/^\s+|\s+$/g, "") // Trim leading/trailing whitespace
    .trim();
};

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const itineraryRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!itineraryRef.current) return;

    const element = itineraryRef.current;
    const opt = {
      margin: [10, 10],
      filename: "travel-itinerary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Show loading toast
    const loadingToast = toast.loading("Generating PDF...");

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Itinerary downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.dismiss(loadingToast);
        toast.error("Failed to generate PDF. Please try again.");
      });
  };

  // Debugging logs for raw and cleaned Markdown
  useEffect(() => {
    console.log("=== RAW MARKDOWN ===");
    console.log(itinerary);
    console.log("=== CLEANED MARKDOWN ===");
    console.log(cleanMarkdown(itinerary));
  }, [itinerary]);

  // If no itinerary is provided, return nothing
  if (!itinerary) return null;

  // Clean the Markdown before rendering
  const cleanItinerary = cleanMarkdown(itinerary);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-end">
        <button
          className="shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969] rounded-md font-normal transition duration-200 ease-linear hover:font-semibold animate-all ease-in-out"
          onClick={handleDownload}
        >
          <span>Download PDF</span>
        </button>
      </div>
      <div
        ref={itineraryRef}
        className="bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm"
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold text-teal-300 mb-8">
            Your Personalized Itinerary
          </h1>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]} // Enable GitHub-Flavored Markdown features
            className="prose prose-invert max-w-none text-gray-300 prose-headings:text-teal-300 prose-strong:text-teal-200"
            components={{
              // Style custom Markdown elements
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold text-teal-300 mt-8 mb-4 border-b border-teal-800 pb-2"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-semibold text-teal-200 mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-300 mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc space-y-2 ml-6 text-gray-300 mb-6"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-300 leading-relaxed" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-teal-200 font-semibold" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="text-gray-300 italic" {...props} />
              ),
            }}
          >
            {cleanItinerary}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDisplay;
