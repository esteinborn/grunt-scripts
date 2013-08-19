/*global module: false */
module.exports = function(grunt) {

    var globule = require('globule'); // Declare globule for use in the Gruntfile

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false // Don't change variable and function names
            },
            excelsior: {
                files:
                    globule.findMapping(
                    [
                        'excelsior/js/core/*.js', // Source files to find
                        '!excelsior/js/core/*.min.js', // Source files to exclude
                        '!excelsior/js/core/excelsior.js' // Source files to exclude
                    ],
                    {
                        ext: '.min.js', // Give them a .min.js extension
                        extDot: 'last'  // Fixes the issue of finding multiple dots in a filename
                    })
            },
        // The following pattern will be easily usable once @cowboy upstreams his node-globule
        // patch into Grunt Core: https://github.com/gruntjs/grunt/pull/750#issuecomment-17495530
        // Until then, we're forced to use the globule method above to not skip over files
        // with multiple dots in their filenames. - Eric 5/10/13
            /*  files: [
                    {
                        cwd: 'excelsior/js/core/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],
                        expand: true,
                        dest:'excelsior/js/core/',
                        ext: '.min.js'
                    }
                ]
            },*/
            foundation: {
                files:
                    globule.findMapping(
                    [
                         'excelsior/js/foundation/*.js', // Source files to find
                        '!excelsior/js/foundation/*.min.js' // Source files to exclude
                    ],
                    {
                        ext: '.min.js', // Give them a .min.js extension
                        extDot: 'last'  // Fixes the issue of finding multiple dots in a filename
                    })
            },
            /*  files: [
                    {
                        cwd: 'excelsior/js/foundation/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],
                        expand: true,
                        dest:'excelsior/js/foundation/',
                        ext: '.min.js'
                    }
                ]
            },*/
            vendor: {
                files:
                    globule.findMapping(
                    [
                         'excelsior/js/vendor/*.js', // Source files to find
                        '!excelsior/js/vendor/*.min.js', // Source files to exclude
                        '!excelsior/js/vendor/zepto.js', // Source files to exclude
                        '!excelsior/js/vendor/jquery.js' // Source files to exclude
                    ],
                    {
                        ext: '.min.js', // Give them a .min.js extension
                        extDot: 'last'  // Fixes the issue of finding multiple dots in a filename
                    })
            },
            project: {
                files:
                    globule.findMapping(
                    [
                         'project-assets/js/*.js', // Source files to find
                        '!project-assets/js/*.min.js' // Source files to exclude
                    ],
                    {
                        ext: '.min.js', // Give them a .min.js extension
                        extDot: 'last'  // Fixes the issue of finding multiple dots in a filename
                    })
            }
            /*  files: [
                    {
                        cwd: 'project-assets/js/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],
                        expand: true,
                        dest:'project-assets/js/',
                        ext: '.min.js'
                    }
                ]
            }*/
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    Modernizr: true,
                    EWF: true
                }
            },
            files: [
                'excelsior/js/core/*.js',
                'project-assets/js/*.js',
                '!excelsior/js/core/*.min.js',
                '!excelsior/js/core/excelsior.js',
                '!project-assets/js/*.min.js'
            ]
        },
        watch: {
            scripts: {
                options: {
                    interrupt: true
                },
                files: [
                    'excelsior/js/core/*.js',
                    'project-assets/js/*.js',
                    '!excelsior/js/core/*.min.js',
                    '!project-assets/js/*.min.js'
                ],
                tasks: ['jshint']
            },
            sass: {
                files: [
                    'excelsior/scss/**/*.scss',
                    'project-assets/scss/**.scss'
                ],
                tasks: [
                    'compass:excelsior',
                    'compass:project',
                    'concat:excelsiorCSS'
                ]
            }
        },
        compass: {
            options: {
                require: [
                    'breakpoint',
                    'sass-media_query_combiner',
                    'toolkit'
                ],
                cssDir: 'css',
                sassDir: 'scss',
                imagesDir: 'images',
                javascriptsDir: 'js',
                outputStyle: 'nested',
                relativeAssets: true,
                force: true
            },
            clean: {
                options: {
                    clean: true
                }
            },
            excelsior: {
                options: {
                    basePath: 'excelsior/'
                }
            },
            project: {
                options: {
                    basePath: 'project-assets/'
                }
            }
        },
        compress: {
            createZipPackage: {
                options: {
                    archive: 'excelsior.zip',
                    pretty: true
                },
                files: [
                    {
                        src: [
                            '**',
                            '!**/*.md', // We'll grab these below and convert them to .txt
                            '!.DS_Store',
                            '!.db',
                            '!.git/**',
                            '!.gitignore',
                            '!.editorconfig',
                            '!.lastBuilt',
                            '!.travis-build.sh',
                            '!.travis.yml',
                            '!excelsior.zip',
                            '!Gruntfile.js',
                            '!package.json',
                            '!.sass-cache/**',
                            '!node_modules/**',
                            '!test/**',
                            '!excelsior/.sass-cache/**',
                            '!excelsior/scss/**',
                            '!excelsior/images/excelsior-long-500.png',
                            '!excelsior/images/source/**',
                            '!excelsior/js/**', // Exclude all the JS files
                            'excelsior/js/**/*.min.js', // Include just the Min JS files
                            '!excelsior/js/core/core.*',
                            '!excelsior/js/vendor/fastclick.*',
                            '!excelsior/js/vendor/jquery.*',
                            '!excelsior/',
                            '!excelsior/css/**', // Exclude all the CSS files
                            'excelsior/css/**/*.min.css' // Include just the Min CSS files
                        ],
                        dest: 'excelsior/',
                        dot: true // be sure to grab dotfiles
                    },
                    {
                        // Rename the MD files to txt for the zip file
                        src: ['*.md', 'excelsior/**.md', 'project-assets/**.md'],
                        expand: true,
                        dest: 'excelsior/',
                        ext: '.txt'
                    }
                ]
            }
        },
        concat: {
            excelsiorCSS: {
                files: [
                    {
                        src: [
                            'excelsior/scss/foundation/normalize.css',
                            'excelsior/scss/foundation/foundation.css',
                            'excelsior/css/excelsior.css'
                        ],
                        dest: 'excelsior/css/excelsior.css'
                    }
                ]
            },
            excelsiorJS: {
                files: [
                    {
                        src: [
                            'excelsior/js/vendor/jquery.min.js',
                            'excelsior/js/vendor/fastclick.min.js',
                            'excelsior/js/core/core.js'
                        ],
                        dest: 'excelsior/js/core/excelsior.js'
                    }
                ]
            },
            excelsiorProdJS: {
                files: [
                    {
                        src: [
                            'excelsior/js/vendor/jquery.min.js',
                            'excelsior/js/vendor/fastclick.min.js',
                            'excelsior/js/core/core.min.js'
                        ],
                        dest: 'excelsior/js/core/excelsior.min.js'
                    }
                ]
            },
            addBanner: {
                options: {
                    banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | License (<%= pkg.license.type %>): <%= pkg.license.url %> */\n\n'
                },
                files: [
                    {
                        cwd: 'excelsior/',
                        src: [
                            'css/*.min.css',
                            'js/core/*.min.js',
                            '!js/core/core.min.js'
                        ],
                        expand: true,
                        dest: 'excelsior/'
                    }
                ]
            }
        },
        cssmin: {
            excelsior: {
                files: [
                    {
                        src: ['excelsior/css/excelsior.css'],
                        dest: 'excelsior/css/excelsior.min.css'
                    }
                ]

            }
        },
        copy: {
            docsCSS: {
                files: [
                    {expand: true, cwd: 'excelsior/css', src: ['*'], dest: 'test/css/', filter: 'isFile'}
                ]
            }
        },
        clean: {
            generatedFiles: {
                src: [
                    'excelsior/js/core/*.min.js',
                    'excelsior/js/core/excelsior.js',
                    'excelsior/css/*',
                    'excelsior/.sass-cache/',
                    'project-assets/.sass-cache/',
                    'excelsior.zip'
                    ]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Development
    grunt.registerTask('dev', 'Development build', function(args) {
        grunt.task.run([
            'compass:excelsior', // Create Excelsior CSS files
            'compass:project', // Create Project CSS files
            'jshint', // detect errors in Excelsior & Project JS
            'concat:excelsiorCSS', // Combine excelsior.css with foundation and normalize
            'concat:excelsiorJS', // Combine the cor js used on all Excelsior pages.
            'copy:docsCSS'
        ]);
    });

    // Only prep vendor files after they have been updated, not every time.
    grunt.registerTask('vendorprep', 'Prep Vendor Files', function(args) {
        grunt.task.run([
            'uglify:vendor', // Minify Vendor JS
            'uglify:foundation' // Minify Foundation JS
        ]);
    });

    // Production
    grunt.registerTask('prod', 'Production build', function(args) {
        grunt.task.run([
            'compass', // Clean old sass cache and generate Excelsior & Project css
            'uglify:excelsior', // minify Excelsior JS
            'uglify:project', // Minify Project Asset js
            'concat:excelsiorProdJS', // Combine the core js used on all Excelsior pages.
            'concat:excelsiorCSS', // Combine excelsior.css with foundation and normalize
            'cssmin', // minify the Excelsior & Project css
            'concat:addBanner', // add the Excelsior banner to css and JS files
            'copy:docsCSS'
        ]);
    });

    // Package Zip File for Distribution
    grunt.registerTask('package', 'Package up the project', function(args) {
        grunt.task.run([
            'clean', // clean up generated files
            'compass:clean', // clean compas cache
            'compass:excelsior', // Create Excelsior CSS files
            'uglify:excelsior', // minify Excelsior JS
            'concat:excelsiorCSS', // Combine excelsior.css with foundation and normalize
            'concat:excelsiorJS', // Combine the core js used on all Excelsior pages.
            'concat:excelsiorProdJS', // Combine the core js used on all Excelsior pages.
            'cssmin:excelsior', // minify the excelsior css
            'concat:addBanner', // add the Excelsior banner to css and JS files
            'compress', // create zip file
            'copy:docsCSS'

        ]);
    });

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
