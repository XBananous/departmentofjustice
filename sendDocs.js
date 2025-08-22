import fetch from "node-fetch";
import fs from "fs";

const webhooks = {
  "Rapports": "https://discord.com/api/webhooks/1408562768763818204/PQhYBeQTDP5KeelYHZm4Hf1G_VsUzKC8Fja8_Oi-vTkTNJlUDLQv_DcCiqXqmWuDnPXU",
  "Mandats": "https://discord.com/api/webhooks/1408562935659364542/JQj4Wiy5SJbYCKZYbsq3YD6uVT8352ol48f4glmRxe8JST0wIHOhJfwVxMjMEs2V3eB_",
  "Audiences": "https://discord.com/api/webhooks/1408563001493033104/VwFr-CLVrw6OeUdyHwtFGqT4xD8Y9WeP1FG5paC8gdRnL0hOpWJy1tpg3cER8KlYD_1K",
  "Autres": "https://discord.com/api/webhooks/1408563052932104372/XHenKp_83g3fHHX2xdKDgb3XmsRlyE9uVndvtOFEnZO87DxSEvlmpDZ9UROofaYZXd5n"
};

// Charger ton JSON (extrait du site)
const documentsData = JSON.parse(fs.readFileSync("./documents.json", "utf-8"));

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("fr-FR");
}

async function sendDocs() {
  const yesterday = getYesterday();

  for (let category in documentsData) {
    const docs = documentsData[category].filter(d => d.date === yesterday);
    for (let doc of docs) {
      const embed = {
        embeds: [
          {
            title: doc.title,
            url: `https://xbananous.github.io/departmentofjustice/${doc.pdfUrl}`,
            author: { name: category },
            footer: { text: "📌 Envoi automatique quotidien" },
            timestamp: new Date().toISOString(),
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "📂 Voir le document",
                url: `https://xbananous.github.io/departmentofjustice/${doc.pdfUrl}`
              }
            ]
          }
        ]
      };

      console.log(`Envoi : ${doc.title} → ${category}`);
      await fetch(webhooks[category], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed)
      });
    }
  }
}

sendDocs();
