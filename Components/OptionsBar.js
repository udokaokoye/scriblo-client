import React from "react";
function OptionBar({ options, source, searchQuery }) {
    // searchQuery args will only come form the seach page
  return (
    <div className="optionBar">
      {source == "/"
        ? options?.length > 0 &&
          options?.map((option, index) => (
            <a href={`/${index !== 0 ? `?category=${option}`: ''}`} className="option">
              <div key={index}>{option}</div>
            </a>
          ))
        : ""}

        {
            source == '/search' &&
            options?.map((option, index) => (
                // searchQuery will be what the user is searching eg ~Javascript
                // option will be the class eg: ~articles or ~people
                <a href={`/search?q=${searchQuery}&class=${option.toLowerCase()}`} className="option">
                  <div key={index}>{option}</div>
                </a>
              ))
        }
        {/* <p>Hello</p> */}
    </div>
  );
}

export default OptionBar;
