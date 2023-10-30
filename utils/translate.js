import axios from "axios";

export const translate = async (text, languageFrom, languageTo) => {
  const options = {
    method: "GET",
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    params: {
      text: text,
      to: languageTo,
      from: languageFrom,
    },
    headers: {
      "X-RapidAPI-Key": "ff30a98331msh75e685d2bc814dfp1cda18jsn7d59d1282eea",
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
  };

  const res = await axios.request(options);
  if (res.status !== 200) {
    console.log(response);
    throw new Error("Error. Estatus: " + res.status);
  }

  return res.data;
};
