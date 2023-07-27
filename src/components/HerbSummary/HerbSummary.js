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
        src={`images/icons/${slug}.png`}
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
            <th>באנגלית</th>
            <td>{herb.commonName["en"]}</td>
          </tr>
          {altNames ? (
            <tr>
              <th>שמות נוספים</th>
              <td>{altNames}</td>
            </tr>
          ) : null}
          <tr>
            <th>משפחה</th>
            <td>{family.name[lang]}</td>
          </tr>
          <tr>
            <th>צורת חיים</th>
            <td>
              {herb.lifeform[lang]} {herb.lifecycle[lang]}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HerbSummary;
