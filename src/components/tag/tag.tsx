import React from "react";

import "./styles.scss";

interface TagProps {
  label: string;
  onRemove: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
  return (
    <div className="tag">
      {label}
      <button
        className="remove-tag-button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        ✕
      </button>
    </div>
  );
};
