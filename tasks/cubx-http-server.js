'use strict';
var _ = require('lodash');
var Server = require('cubx-http-server');
var opener = require('opener');
var Divhide = require('divhide');
var path = require('path');

module.exports = function (grunt) {
  var requestLogger = function (req, res, error) {
    var date = (new Date()).toUTCString();
    if (error) {
      console.log('[%s] "%s %s" Error (%s): "%s"', date, req.method.red, req.url.red, error.status.toString().red,
        error.message.red);
    } else {
      console.log('[%s] "%s %s" "%s"', date, req.method.cyan, req.url.cyan, req.headers[ 'user-agent' ]);
    }
  };

  grunt.registerMultiTask(
    'cubx-http-server',
    'Run a http-Server to get http access to your project files and data.',
    function () {
      var done = this.async();
      var defaults = {
        root: process.cwd(),
        port: 8282,
        host: '127.0.0.1',
        cache: 20,
        showDir: true,
        autoIndex: true,
        ext: 'html',
        runInBackground: false,
        cors: false,
        logFn: requestLogger,
        https: false,
        openBrowser: false
      };

      var options = _.extend({}, defaults, this.data);
      options.port = typeof options.port === 'function' ? options.port() : options.port;
      options.npu = options.networkProxyUrl && options.networkProxyUrl.trim().length > 0 ? options.networkProxyUrl : null;

      // get the host to use on urls
      var urlHost = options.host !== '0.0.0.0' ? options.host : '127.0.0.1';

      // initialize url string with default https protocol, no need for port here since using 443
      var url = 'https://' + urlHost;

      // sanitize root
      options.root = options.root ? options.root : './';

      // default module https support
      if (options.https !== null && options.https === true) {
        options.https = {
          cert: path.join(__dirname, '/../files/cert.pem'),
          key: path.join(__dirname, '/../files/key.pem')
        };
      } else if (options.https === null || options.https === false) {
        // no https config, use regular protcol/host/port string
        url = 'http://' + urlHost + ':' + options.port;
      }

      // setup middleware
      options.before = Divhide.Safe.array(options.before);

      // create http-server
      var server = Server.createServer(options);

      // start server
      server.listen(options.port, options.host, function () {
        var msgData = _.extend({}, options, {
          protocol: options.https ? 'https' : 'http'
        });

        console.log(
          _.template('Server running on <%= protocol %>://<%= host %>:<%= port %>/')(msgData));
        console.log('Hit CTRL-C to stop the server');

        if (options.openBrowser) {
          opener(url, {
            command: options.openBrowser !== true ? options.openBrowser : null
          });
        }
      });

      process.on('SIGINT', function () {
        console.log('cubx-http-server stopped');
        server.close();
        done();
        process.exit();
      });

      // async support - run in background
      if (options.runInBackground) {
        done();
      }
    });
};
