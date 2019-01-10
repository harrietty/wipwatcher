const fs = require('fs');
const path = require('path');

const tokenFilePath = path.join(__dirname, '..', 'accessToken');
const tempTokenFilePath = path.join(__dirname, '..', 'tempToken');

exports.getAccessToken = () => {
  let token;
  try {
    token = fs.readFileSync(tokenFilePath, 'utf8');
    token = token.split(',');
  } catch (e) {
    console.log('No access token saved');
    return null;
  }

  return {
    accessToken: token[0],
    accessTokenSecret: token[1],
  };
};

exports.saveAccessToken = (token, tokenSecret) => {
  fs.writeFileSync(
      tokenFilePath,
      `${token},${tokenSecret}`,
      'utf8'
  );
};

exports.saveTempCredentials = (token, tokenSecret) => {
  fs.writeFileSync(
      tempTokenFilePath,
      `${token},${tokenSecret}`,
      'utf8'
  );
};

exports.getTempCredentials = () => {
  let credentials;
  try {
    credentials = fs.readFileSync(tempTokenFilePath, 'utf8');
    credentials = credentials.split(',');
  } catch (e) {
    console.log('No temporary credentials located');
    return null;
  }

  return {
    token: credentials[0],
    tokenSecret: credentials[1],
  };
};
