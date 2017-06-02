'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    injector: 'grunt-injector'
  });

  // Define the configuration for all the tasks
  grunt.initConfig({
    synergy: {
        // configurable paths
        src: 'client',
        dist: 'dist'
    },

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'server.js',
          debug: false
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    env: {
      dev: {
        NODE_ENV : 'development'
      },
      prod: {
        NODE_ENV : 'production'
      }

    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= synergy.src %>}/{app,components}/**/*.css',
          '{.tmp,<%= synergy.src %>}/{app,components}/**/*.html',
          '{.tmp,<%= synergy.src %>}/{app,components}/**/*.js',
          '!{.tmp,<%= synergy.src %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= synergy.src %>}/{app,components}/**/*.mock.js'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= synergy.src %>/../server/views/pages/index.ejs',
        ignorePath: '../../../<%= synergy.src %>',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/jquery/', '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/,'/datatables/media/css/','/pdfjs-dist/build/' ]
      }
    },

    injector: {
      options: {
          lineEnding: grunt.util.linefeed
      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->',
          lineEnding: grunt.util.linefeed
        },
        files: {
          '<%= synergy.src %>/../server/views/pages/index.ejs': [
              ['{.tmp,<%= synergy.src %>}/app/{common,config}/**/*.js',
                  '{.tmp,<%= synergy.src %>}/app/components/**/*.routes.js',
               '!{.tmp,<%= synergy.src %>}/app/app.js',
               '!{.tmp,<%= synergy.src %>}/{app}/**/*.spec.js',
               '!{.tmp,<%= synergy.src %>}/{app}/**/*.mock.js']
            ]
        }
      },
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'env:dev',
      'injector',
      'wiredep',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });
};
