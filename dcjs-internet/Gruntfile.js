/*global module: false */
module.exports = function(grunt) {

  var globule = require('globule'); // Declare globule for use in the Gruntfile

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        //mangle: false // Don't change variable and function names
      },
      dcjs: {
        files:
          globule.findMapping(
          [
            '*.js', // Source files to find
          ],
          {
            srcBase: "js/src",
            destBase: "js",
            ext: '.js', // Give them a .min.js extension
            extDot: 'last'  // Fixes the issue of finding multiple dots in a filename
          })
      }
    // The following pattern will be easily usable once @cowboy upstreams his node-globule
    // patch into Grunt Core: https://github.com/gruntjs/grunt/pull/750#issuecomment-17495530
    // Until then, we're forced to use the globule method above to not skip over files
    // with multiple dots in their filenames. - Eric 5/10/13
      /*  files: [
          {
            cwd: 'js/src/',
            src: [
              '*.js',
              '!*.min.js'
            ],
            expand: true,
            dest:'js/',
            ext: '.min.js'
          }
        ]
      },*/
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        //'-W083': false, // this stops the Function Within a loop error from the UnoSlider plugin
        globals: {
          jQuery: true
        }
      },
      files: [
        'js/src/*.js'
      ]
    },
    watch: {
      sass: {
        files: [
          '/scss/**/*.scss'
        ],
        tasks: [
          'compass:dev',
          'beep:3'
        ]
      },
      scripts: {
        options: {
          interrupt: true
        },
        files: [
          'js/src/*.js'
        ],
        tasks: [
          'jshint',
          'copy:jsDev',
          'beep:3'
        ]
      }
    },
    compass: {
      options: {
        require: [
          'breakpoint',
          //'sass-media_query_combiner',
          //'toolkit'
        ],
        //basePath: "/",
        cssDir: 'css',
        sassDir: 'scss',
        environment: 'development',
        imagesDir: 'images',
        javascriptsDir: 'js',
        outputStyle: 'expanded', //nested, expanded, compact, compressed
        //noLineComments: true,
        relativeAssets: true,
        //sourcemap: true,
        force: true
      },
      dev: {
        options: {
          basePath: "/"
          //debugInfo: true
        }
      },
      prod: {
        options: {
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },
    copy: {
      jsDev: {
        files: [
          {expand: true, flatten: true, cwd: 'js', src: ['src/**/*.js'], dest: 'js', filter: 'isFile'}
        ]
      },
      jsQA: {
        files: [
          {expand: true, cwd: 'js', src: ['body.js', 'dcjs.js', 'homepage.js'], dest: 'k:/js/', filter: 'isFile'}
        ]
      },
      jsProd: {
        files: [
          {expand: true, cwd: 'js', src: ['body.js', 'dcjs.js', 'homepage.js'], dest: 'l:/js/', filter: 'isFile'}
        ]
      },
      cssQA: {
        files: [
          {expand: true, cwd: 'css', src: ['style.css'], dest: 'k:/css/', filter: 'isFile'}
        ]
      },
      cssProd: {
        files: [
          {expand: true, cwd: 'css', src: ['style.css'], dest: 'l:/css/', filter: 'isFile'}
        ]
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-beep');

  // Development
  grunt.registerTask('dev', 'Development build', function(args) {
     // grunt.log.write("my message");
    grunt.task.run([
      'compass:dev',
      'jshint',
      'copy:jsDev',
      'beep:3'
    ]);
  });

  grunt.registerTask('prod', 'Production build', function(args) {
    grunt.task.run([
      'compass:prod',
      'uglify',
      'beep:3'
    ]);
  });

  grunt.registerTask('prodCSS', 'Production build', function(args) {
    grunt.task.run([
      'compass:prod',
      'copy:cssQA',
      'copy:cssProd',
      'beep:3'
    ]);
  });

  grunt.registerTask('prodJS', 'Production build', function(args) {
    grunt.task.run([
      'uglify',
      'copy:jsQA',
      'copy:jsProd',
      'beep:3'
    ]);
  });

  // Default task (Force to development build)
  grunt.registerTask('default', 'dev');
};
