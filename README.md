# cubx-grunt-http-server

Grunt integration to serve local static files and getting non-local dependencies from given remote. This grunt task is part of the Cubbles Development Tools.

Wan't to get to know the [Cubbles Platform](http://cubbles.github.io/)?

## Usage

```javascript
grunt.initConfig({
  'cubx-http-server': {
      'dev': {
          // the server root directory
          root: 'public',

          // the server port
          // can also be written as a function, e.g.
          // port: function() { return 8282; }
          // default is '8080'
          port: 8282,

          // the host ip address
          // If specified to, for example, '127.0.0.1' the server will
          // only be available on that ip.
          // Specify '0.0.0.0' to be available everywhere
          host: 'localhost',

          cache: 1,
          showDir: true,
          autoIndex: true,

          // server default file extension
          ext: 'html',

          // run in parallel with other tasks
          runInBackground: false,

          // specify a logger function. By default the requests are
          // sent to stdout.
          logFn: function (req, res, error) {
          },

          // Proxies all requests which can't be resolved locally to the given url
          // Note this this will disable 'showDir'
          proxy: 'http://www.example.com',

          // open browser after start
          openBrowser: true,

          // set networkProxyUrl if you need to connect to given proxy server using a proxy
          // Note: depending wether your 'proxy' property above points to a https or http target be sure that the given
          // networkProxyUrl can handle the protocol (https or http)!
          // networkProxyUrl: '[proto]://[host]:[port]' e.g. 'http://proxy:1234'
      }
  }
})
```
