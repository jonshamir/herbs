import React from "react";
import lang from "../../lang";
import "./HerbSummary.scss";

const HerbSummary = (props) => {
  const { slug, herb, family } = props;
  const altNames = herb.altNames[lang];

  return (
    <div className="HerbSummary">
      <img
        className="HerbIcon"
        id="herb-icon"
        src={`/herbs/images/icons/${slug}.png`}
        alt={slug}
      />
      <table className="InfoTable">
        <tbody>
          <tr>
            <td colSpan="2" className="scientificName">
              {herb.name}
            </td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{herb.commonName["en"]}</td>
          </tr>
          {altNames ? (
            <tr>
              <th>Other Names</th>
              <td>{altNames}</td>
            </tr>
          ) : null}
          <tr>
            <th>Family</th>
            <td>{family.name[lang]}</td>
          </tr>
          <tr>
            <th>Growth Form</th>
            <td>
              {herb.lifecycle[lang]} {herb.lifeform[lang]}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HerbSummary;
