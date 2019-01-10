const OAuth = require('oauth').OAuth;

const requestURL = 'https://trello.com/1/OAuthGetRequestToken';
const accessURL = 'https://trello.com/1/OAuthGetAccessToken';
const authCallbackPath = `/cb`;

module.exports = new OAuth(
    requestURL,
    accessURL,
    process.env.TRELLO_CLIENT_API_KEY,
    process.env.TRELLO_CLIENT_SECRET_KEY,
    '1.0A',
    `http://localhost:${3000}${authCallbackPath}`,
    'HMAC-SHA1'
);
