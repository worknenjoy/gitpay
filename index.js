// index.js ou bin/www
const app = require('./server');

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
