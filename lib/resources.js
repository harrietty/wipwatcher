const oauth = require('../oauth');

exports.getBoards = async (accessToken, accessTokenSecret) => {
  return new Promise((resolve, reject) => {
    oauth.getProtectedResource(
        'https://api.trello.com/1/members/me/boards',
        'GET',
        accessToken,
        accessTokenSecret,
        (err, data) => {
          console.log(data);
          if (err) reject(err);
          else {
            resolve(JSON.parse(data).map((d) => ({
              id: d.id,
              name: d.name,
              backgroundUrl: d.prefs.backgroundImageScaled ?
                d.prefs.backgroundImageScaled[1].url : null,
              backgroundColor: d.prefs.backgroundColor,
            })));
          }
        }
    );
  });
};
