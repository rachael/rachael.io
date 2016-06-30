var request = require('supertest');
var server;

process.env.SUPPRESS_LOGS = true;

function startServer() {
  delete require.cache[require.resolve('rachael-io-common/bin/www')];
  delete require.cache[require.resolve('../app')];
  server = require('rachael-io-common/bin/www');
}

function startDevServer() {
  process.env.NODE_ENV = 'development';
  startServer();
}

function startProdServer() {
  process.env.NODE_ENV = 'production';
  startServer();
}

function stopServer(done) {
  server.close(done);
}

describe('GET /', function() {

  beforeEach(startServer);

  afterEach(stopServer);

  it('should respond with gzipped html', function(done) {
    request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect('Content-Encoding', 'gzip')
      .expect(200, done);
  });

});
