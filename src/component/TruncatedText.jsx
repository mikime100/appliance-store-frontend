import React, { useState } from "react";
import { Link } from "react-router-dom";

const TruncatedText = ({ text, maxLines = 3, productId, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncation - limit to 10 words maximum
  const maxWords = 10;
  const words = text ? text.split(" ") : [];
  const needsTruncation = text && words.length > maxWords;

  if (!needsTruncation) {
    return <p className={className}>{text}</p>;
  }

  const truncatedText = isExpanded ? text : words.slice(0, maxWords).join(" ");

  return (
    <div className={className}>
      <p className="mb-1">
        {truncatedText}
        {!isExpanded && (
          <Link
            to={`/product/${productId}`}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium underline ml-1"
          >
            Read more...
          </Link>
        )}
      </p>
    </div>
  );
};

export default TruncatedText;
