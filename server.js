const http = require('http');
const services = require('./services');
const url = require('url');
const jsonBody = require('body/json');
const fs = require('fs');
const formidable = require('formidable');

const server = http.createServer();
server.on('request', (request, response) => {
  request.on('error', (err) => {
    console.error('request error');
  });
  response.on('error', (err) => {
    console.error('response error');
  });
  const parsedUrl = url.parse(request.url, true);
  if (request.method === 'GET' && parsedUrl.pathname === '/metadata') {
    // curl localhost:8080/metadata\?id\=1
    const { id } = parsedUrl.query;
    const metadata = services.fetchImageMetadata(id);
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200;
    const serializedJSON = JSON.stringify(metadata);
    response.write(serializedJSON);
    response.end();
  } else if (request.method === 'POST' && parsedUrl.pathname === '/users') {
    jsonBody(request, response, (err, body) => {
      // curl --header Content-Type:application/json --request POST --data '{"userName": "SGarcia710"}' http://localhost:8080/users
      if (err) {
        console.log(err);
      } else {
        console.log(body);

        services.createUser(body['userName']);
      }
    });
  } else if (request.method === 'POST' && parsedUrl.pathname === '/upload') {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 100 * 1024 * 1024,
      encoding: 'utf-8',
      maxFields: 20,
    });
    form
      .parse(request)
      .on('fileBegin', (name, file) => {
        console.log('Our upload has started!');
      })
      .on('file', (name, file) => {
        console.log('Field + file pair has been recived');
      })
      .on('field', (name, value) => {
        console.log('Field received:');
        console.log(name, value);
      })
      .on('progress', (bytesReceived, bytesExpected) => {
        // Here we can create a upload bar at the client with sockets
        console.log(`${bytesReceived} / ${bytesExpected}`);
      })
      .on('error', (err) => {
        console.log(err);
        request.resume();
      })
      .on('aborted', () => {
        console.log(
          'The request was aborted by the user, ex: timeout, internet off'
        );
      })
      .on('end', () => {
        console.log('Done - request fully received!');
        response.statusCode = 200;
        response.end('Success!');
      });
    // , (err, fields, files) => {
    //   if (err) {
    //     console.log(err);
    //     response.statusCode = 500;
    //     response.end('Error!');
    //   } else {
    //     console.log(fields, files);
    //     response.statusCode = 200;
    //     response.end('Success!');
    //   }
    // });
  } else {
    fs.createReadStream('./index.html').pipe(response);
  }
});

// console.log(http.STATUS_CODES);
server.listen(8080);
