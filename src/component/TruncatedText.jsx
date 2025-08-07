import React, { useState } from "react";
import { Link } from "react-router-dom";

const TruncatedText = ({ text, maxLines = 3, productId, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Very aggressive truncation - limit to 13 words maximum
  const maxWords = 13;
  const words = text ? text.split(" ") : [];
  const needsTruncation = text && words.length > maxWords;

  // For debugging - let's see what's happening
  console.log("TruncatedText:", {
    textLength: text?.length,
    wordCount: words.length,
    maxWords,
    needsTruncation,
    productId,
  });

  if (!needsTruncation) {
    return <p className={className}>{text}</p>;
  }

  const truncatedText = isExpanded
    ? text
    : words.slice(0, maxWords).join(" ") + "...";

  return (
    <div className={className}>
      <p className="mb-1">{truncatedText}</p>
      {!isExpanded && (
        <Link
          to={`/product/${productId}`}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium underline inline-block"
        >
          Read more
        </Link>
      )}
    </div>
  );
};

export default TruncatedText;
