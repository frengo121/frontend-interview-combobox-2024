// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.
import React, { useState, useEffect, useRef } from "react";

import { DropdownDataList, DropdownData } from "../../data";

import ArrowIcon from "../../assets/down-arrow.svg";
import { Tag } from "../tag/tag";

import "./styles.scss";

interface ComboBoxProps {
  options: DropdownDataList;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
}: ComboBoxProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<DropdownDataList>(options);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOptions, setSelectedOptions] = useState<DropdownDataList>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue === "") {
      setFilteredOptions(
        options.filter((option) => !selectedOptions.includes(option))
      );
      return;
    }
    const newOptions = options.filter(
      (option) =>
        !selectedOptions.includes(option) &&
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(newOptions);
  }, [inputValue, options, selectedOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setFilteredOptions(
      options.filter((option) => !selectedOptions.includes(option))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredOptions.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectOption = (option: DropdownData) => {
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    setInputValue("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const removeOption = (option: DropdownData) => {
    const newSelectedOptions = selectedOptions.filter(
      (selected) => selected !== option
    );
    setSelectedOptions(newSelectedOptions);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  return (
    <>
      <div className="selected-tags-container">
        {selectedOptions.map((option) => (
          <Tag
            key={option.value}
            label={option.label}
            onRemove={() => removeOption(option)}
          />
        ))}
      </div>
      <div className="combobox" onBlur={handleBlur} ref={containerRef}>
        <input
          type="text"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-list"
          role="combobox"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
          }
          placeholder="Options"
        />
        <img src={ArrowIcon} alt="Arrow" className="arrow-icon" />
        {isOpen && (
          <ul id="combobox-list" role="listbox" className="combobox-list">
            {filteredOptions.length === 0 ? (
              <li
                className="combobox-no-options"
                role="option"
                aria-disabled="true"
              >
                No options
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  className={`combobox-option ${
                    highlightedIndex === index ? "highlighted" : ""
                  }`}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </>
  );
};
