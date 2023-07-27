import React from "react";

import "./ZaatarBlends.scss";

const blendInfo = [
  {
    slug: "industrial",
    title: "תעשייתי",
    ingredients: ["עלי זעתר", "מלח לימון", "שומשום", "מלח", "חיטה"],
  },
  {
    slug: "palestine",
    title: "פלסטיני",
    ingredients: ["עלי זעתר", "סומק", "שומשום", "מלח", "שמן זית"],
  },
  {
    slug: "lebannon",
    title: "לבנוני",
    ingredients: ["עלי זעתר", "סומק", "שומשום", "מלח", "חומוס קלוי"],
  },
  {
    slug: "syria",
    title: "סורי",
    ingredients: [
      "עלי זעתר",
      "סומק",
      "שומשום",
      "מלח",
      "חומוס קלוי",
      "אגוזי מלך",
      "פיסטוק",
      "גרעיני דלעת",
      "כמון",
      "קימל",
    ],
  },
];

const ZaatarBlends = (props) => {
  return (
    <span className="ZaatarBlends">
      {blendInfo.map((blend) => (
        <span className="blend" key={blend.slug}>
          <span className="blend-title">{blend.title}</span>
          {blend.ingredients.map((name, i) => (
            <span className="pile" key={blend.slug + i}>
              <img
                src={`/herbs/images/recipes/zaatar-mix/blends/${blend.slug}/${i}.png`}
                alt={name}
              />
              <span className="label">{name}</span>
            </span>
          ))}
          <span className="blend-title">
            <br />
            {blend.title}
          </span>
        </span>
      ))}
    </span>
  );
};

export default ZaatarBlends;
