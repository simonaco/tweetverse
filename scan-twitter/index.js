const axios = require('axios');
const TWITTER_API_URL = 'https://api.twitter.com/1.1/search/tweets.json';
const TEXT_ANALYTICS_API_URL = 'https://westeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

const SUPPORTED_LANG = ['da', 'nl', 'en', 'fi', 'fr', 'de', 'el', 'it', 'no', 'pl', 'pt-PT', 'ru', 'es', 'sv', 'tr'];
const searchTweets = async hashtag => {
  const tweets = await axios({
    url: TWITTER_API_URL,
    headers: {
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
        id: tweet.id_str,
        language: tweet.lang,
        text: tweet.text
      });
    }
  });
  return parsedTweets;
};

const postSlack = async (tweets, sentiment) => {
  let negativeTweets = [];
  sentiment.forEach(tweetSentiment => {
    if (tweetSentiment.score < 0.8) {
      negativeTweets.push(tweets.find(tweet => tweet.id_str === tweetSentiment.id));
    }
  });

  await Promise.all(
    negativeTweets.map(async tweet => {
      await axios({
        method: 'post',
        url: process.env.SLACK_API_URL,
        data: {
          text: tweet.text
        }
      });
    })
  );
};

module.exports = async function(context, req) {
  try {
    const tweets = await searchTweets(req.query.hashtag);
    const tweetsData = parseTweets(tweets);
    const tweetsSentiment = await analyzeTweets(tweetsData);
    await postSlack(tweets.statuses, tweetsSentiment.documents);
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
