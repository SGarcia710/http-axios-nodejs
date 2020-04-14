const http = require('http');

const data = JSON.stringify({
  userName: 'lolx201',
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    Authorization: Buffer.from('myUserName' + ':' + 'myPassword').toString(
      'base64'
    ),
  },
};

const request = http.request(options, (response) => {
  console.log(`statusCode: ${response.status}`);
  console.log(response.headers);

  response.on('data', (chunk) => {
    console.log(chunk.toString());
  });
});

request.on('error', (err) => {
  console.error(err);
});

request.write(data);

request.end();
