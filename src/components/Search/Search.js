import React from "react";
import { Redirect } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import lang from "../../lang";

import AutosuggestMatch from "autosuggest-highlight/match";
import AutosuggestParse from "autosuggest-highlight/parse";

import herbInfo from "../../data/herbInfo.json";

import "./Search.scss";

const doesContainPrefix = (str, prefix) => {
  return str
    .split(" ")
    .reduce(
      (containsPrefix, word) =>
        containsPrefix || word.slice(0, prefix.length) === prefix,
      false
    );
};

const getMatchedName = (herb, query) => {
  let allNames = herb.altNames[lang].split(",");
  allNames.unshift(herb.commonName[lang]);
  let enNames = herb.altNames.en.toLowerCase().split(",");
  enNames.unshift(herb.commonName.en.toLowerCase());
  enNames.push(herb.name.toLowerCase());
  allNames = allNames.concat(enNames);

  const matchIndex = allNames.findIndex((name) =>
    doesContainPrefix(name, query)
  );
  const matchName = matchIndex > -1 ? allNames[matchIndex] : "";
  return { matchName, matchIndex };
};

const getMatchIndex = (herb, query) => {
  return getMatchedName(herb, query).matchIndex;
};

// How to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength <= 1) return [];

  // Sort results by index of match
  const matchedHerbs = herbInfo
    .map((herb, i) => ({
      herb,
      matchIndex: getMatchIndex(herb, inputValue),
    }))
    .filter((herb) => herb.matchIndex > -1)
    .sort((h1, h2) => h1.matchIndex - h2.matchIndex);

  return matchedHerbs.map((herb) => herb.herb);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.commonName[lang];

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion, { query }) => {
  query = query.toLowerCase();
  const commonName = suggestion.commonName[lang];
  const suggestionText = getMatchedName(suggestion, query).matchName;

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

    this.state = {
      redirect: null,
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

  onSuggestionSelected = (e, { suggestion }) => {
    this.setState({ redirect: `/herb/${suggestion.slug}` });
  };

  onKeyDown = (e) => {
    if (e.key === "Enter") {
      const { suggestions } = this.state;
      if (suggestions.length > 0) {
        this.setState({ redirect: `/herb/${suggestions[0].slug}` });
      }
    }
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} push />;

    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "חיפוש",
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    };

    return (
      <div className="Search">
        <img src="/images/ui/search.svg" alt="Search" className="searchIcon" />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default Search;
