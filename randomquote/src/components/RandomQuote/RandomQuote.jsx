import React, { useState, useEffect } from "react";
import styles from "./RandomQuote.module.scss";
import axios from "axios";
import { Switch } from "antd";

const quoteApiUrl = "https://type.fit/api/quotes";
const translateApiUrl = "https://translate.googleapis.com/translate_a/single";

const useFetchData = (Api) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(Api)
      .then((response) => setData(response.data))
      .finally(() => setIsLoading(false));
  }, [Api]);

  return {
    isLoading,
    data,
  };
};

const RandomQuote = () => {
  const { data, isLoading } = useFetchData(quoteApiUrl);
  const [quote, setQuote] = useState(null);
  const [translateQuoteText, setTranslateQuoteText] = useState(null);
  const [translateToRussian, setTranslateToRussian] = useState(false);
  
  const handleButtonClick = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setQuote(data[randomIndex]);
  };

  useEffect(() => {
    if (quote) {
      translateQuote(quote, setTranslateQuoteText, translateToRussian);
    }
  }, [quote, translateToRussian]);

  

  const handleSwitchChange = (checked) => {
    setTranslateToRussian(checked);
  };

  const translateQuote = (quote, setTranslateQuoteText, translateToRussian) => {
    if (quote) {
      const targetLang = translateToRussian ? "ru" : "en";
      const translatedSentences = [];
      const sentences = quote.text.split('. ');
      
      sentences.map((sentence) => {
        axios
          .post(translateApiUrl, null, {
            params: {
              client: "gtx",
              sl: 'en',
              tl: targetLang,
              dt: "t",
              q: sentence,
            },
          })
          .then((response) => {
            translatedSentences.push(response.data[0][0][0]);
            if (translatedSentences.length === sentences.length) {
              setTranslateQuoteText(translatedSentences.join('. '));
            }
          })
          .catch((error) => console.error(error));
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.quote}>
        <div className={styles.text}>
          {translateQuoteText ? translateQuoteText : (quote ? quote.text : null)}
        </div>
        <div className={styles.author}>{quote ? quote.author : null}</div>
      </div>
      <Switch defaultChecked={false} onChange={handleSwitchChange} />
      <button className={styles.generateButton} onClick={handleButtonClick}>
        generate
      </button>
    </div>
  );
};

export default RandomQuote;
