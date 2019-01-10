const oauth = require('../oauth');

exports.getBoards = async (accessToken, accessTokenSecret) => {
  return new Promise((resolve, reject) => {
    oauth.getProtectedResource(
        'https://api.trello.com/1/members/me/boards',
        'GET',
        accessToken,
        accessTokenSecret,
        (err, data) => {
          if (err) reject(err);
          else resolve(JSON.parse(data));
        }
    );
  });
};
