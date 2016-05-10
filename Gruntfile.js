'use strict';

module.exports = function(grunt) {

  var workspaceConfigPath = 'test/webpackages/.workspace';
  var workspaceName = 'webpackages';

  // Project configuration.
  grunt.initConfig({
    workspaceName: workspaceName,
    workspaceConfigPath: workspaceConfigPath,
    workspaceConfig: grunt.file.readJSON(workspaceConfigPath),

    nodeunit: {
      files: ['test/*_test.js'],
    },

    'cubx-http-server': {
      'dev': {
        port: '8282',
        root: 'test/<%= workspaceName %>',
        proxy: '<%= workspaceConfig.remoteStoreUrl %>',
        networkProxyUrl: 'http://192.168.70.107:808'
      }
    },

    jshint: {
      files: ['tasks/**/*.js', 'Gruntfile.js']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};
