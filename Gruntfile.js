'use strict'

var ngrok = require('ngrok');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
      cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: 'css',
            src: ['*.css', '!*.min.css'],
            dest: 'css',
            ext: '.min.css'
          },
          {
            expand: true,
            cwd: 'views/css',
            src: ['*.css', '!*.min.css'],
            dest: 'views/css',
            ext: '.min.css'
          }]
        }
      },
      uglify: {
        my_target: {
          files: {
            'js/perf.min.js': ['js/perfmatters.js']
          }
        }
      },
      imagemin: {                          // Task
        dynamic: {                         // Another target
          files: [{
            expand: true,                  // Enable dynamic expansion
            cwd: 'img/',                   // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'img/'                  // Destination path prefix
          }]
        }
      },
      pagespeed: {
        options: {
          nokey: true,
          locale: "en_GB",
          threshold: 40
        },
        local: {
          options: {
            strategy: "desktop"
          }
        },
        mobile: {
          options: {
            strategy: "mobile"
          }
        }
      }
    });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8000;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  grunt.registerTask('build', ['imagemin', 'uglify', 'cssmin']);

  // Register default tasks
  grunt.registerTask('default', ['psi-ngrok']);
}