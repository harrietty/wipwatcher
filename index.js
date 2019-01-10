require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const oauth = require('./oauth');
const resources = require('./lib/resources');
const auth = require('./lib/auth');

const authorizeURL = 'https://trello.com/1/OAuthAuthorizeToken';
const authCallbackPath = `/cb`;
const appName = 'WipWatcher';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const token = auth.getAccessToken();

  if (token) {
    console.log('Token found, fetching boards');
    try {
      const boards = await resources.getBoards(token.accessToken, token.accessTokenSecret);
      res.render('home', {boards});
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  } else {
    res.render('signup');
  }
});

app.get('/oauth', (req, res) => {
  oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
    if (error) console.log(error);

    // TODO: store in a cache, this token is only shortlived
    auth.saveTempCredentials(token, tokenSecret);
    res.redirect(`${authorizeURL}?oauth_token=${token}&name=${appName}`);
  });
});

app.get(authCallbackPath, (req, res) => {
  const token = req.query.oauth_token;
  const verifier = req.query.oauth_verifier;
  const tempCredentials = auth.getTempCredentials();

  if (tempCredentials) {
    console.log('Retrieved temporary credentials, swapping for access token', tempCredentials);
    oauth.getOAuthAccessToken(
        token,
        tempCredentials.tokenSecret,
        verifier,
        // TODO: store access token in a DB, it is long lived
        (err, accessToken, accessTokenSecret) => {
          auth.saveAccessToken(accessToken, accessTokenSecret);
          res.redirect('/');
        }
    );
  }
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
