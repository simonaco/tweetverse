const axios = require('axios');
const TWITTER_API_URL = 'https://api.twitter.com/1.1/search/tweets.json';
const TEXT_ANALYTICS_API_URL = 'https://westeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
const SUPPORTED_LANG = ['da', 'nl', 'en', 'fi', 'fr', 'de', 'el', 'it', 'no', 'pl', 'pt-PT', 'ru', 'es', 'sv', 'tr'];
const searchTweets = async hashtag => {
  const tweets = await axios({
    url: TWITTER_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    },
    params: {
      q: hashtag
    }
  });
  return tweets.data;
};

const analyzeTweets = async tweetData => {
  const response = await axios({
    url: TEXT_ANALYTICS_API_URL,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.TEXT_ANALYTICS_API_KEY
    },
    data: {
      documents: tweetData
    }
  });
  return response.data;
};

const parseTweets = tweets => {
  let parsedTweets = [];
  tweets.statuses.forEach(tweet => {
    if (SUPPORTED_LANG.includes(tweet.lang)) {
      parsedTweets.push({
        id: tweet.id,
        language: tweet.lang,
        text: tweet.text
      });
    }
  });
  return parsedTweets;
};

module.exports = async function(context) {
  try {
    const tweets = await searchTweets('nasa');
    const tweetsData = parseTweets(tweets);
    const tweetsSentiment = await analyzeTweets(tweetsData);
    context.res = {
      body: { tweets: tweetsSentiment }
    };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'An error has occured, please try again later' }
    };
  }
};
