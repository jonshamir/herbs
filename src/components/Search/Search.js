import React from "react";
import herbInfo from "../../data/herbInfo.json";
import Autosuggest from "react-autosuggest";
import lang from "../../lang";
import AutosuggestMatch from "autosuggest-highlight/match";
import AutosuggestParse from "autosuggest-highlight/parse";

import "./Search.scss";

const stringToUnicode = (str) =>
  str
    .split("")
    .map((char) => "\\u" + str.charCodeAt(0).toString(16))
    .join("");

const doesContainPrefix = (str, prefix) => {
  return str
    .split(" ")
    .reduce(
      (containsPrefix, word) =>
        containsPrefix || word.slice(0, prefix.length) === prefix,
      false
    );
};

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength <= 1) return [];

  return herbInfo.filter((herb) => {
    // console.log(doesContainPrefix(herb.commonName[lang], inputValue));
    return doesContainPrefix(
      herb.commonName[lang] + " " + herb.altNames[lang].replace(",", ""),
      inputValue
    );
  });
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.commonName[lang];

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion, { query }) => {
  const commonName = suggestion.commonName[lang];
  // Find matched name
  let allNames = suggestion.altNames[lang].split(",");
  allNames.unshift(commonName);

  const suggestionText = allNames.find((name) =>
    doesContainPrefix(name, query)
  );

  const matches = AutosuggestMatch(suggestionText, query);
  const parts = AutosuggestParse(suggestionText, matches);

  return (
    <div>
      <span className="name">
        {parts.map((part, index) => {
          const className = part.highlight ? "highlight" : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
        {suggestionText !== commonName && ` (${commonName})`}
      </span>
    </div>
  );
};

class Search extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "חיפוש",
      value,
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <div className="Search">
        <img src="/images/ui/search.svg" alt="Search" className="searchIcon" />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default Search;
