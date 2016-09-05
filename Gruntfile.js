module.exports = function (grunt) {
    loadVars();
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["build"]);

    grunt.initConfig({
        ts: {
            default: {
                tsconfig: {
                    passThrough: true,
                    tsconfig: './src/'
                }
            },

            tests: {
                tsconfig: {
                    passThrough: true,
                    tsconfig: "./tests/"
                }
            }
        },
        clean: {
            default: [
                './*.js',
                './*.js.map',
                './ts-output',
                '!./Gruntfile.js'
            ],
            tsoutput: [
                './ts-output'
            ],
            tsoutputbasedir: [
                './ts-output/.baseDir.*'
            ],
            tests: [
                './tests/*.js'
            ]
        },
        concat: {
            default: {
                src: ["./ts-output/**/*.js", "!*basedir*"],
                dest: '<%= outputFile %>'
            }
        },
        uglify: {
            default: {
                files: {
                    ['<%= minimizedFile %>']: '<%= outputFile %>'
                }
            }
        },
        jasmine: {
            outputFile: {
                src: ['<%= outputFile %>'],
                options: {
                    specs: './tests/**/*-test.js'
                }
            },
            minimizedFile: {
                src: ['<%= minimizedFile %>'],
                options: {
                    specs: './tests/**/*-test.js'
                }
            }
        }
    })

    grunt.task.registerTask('copy-output-to-min', function () {
        grunt.file.copy('<%= outputFile %>', '<%= minimizedFile %>')
    });

    grunt.task.registerTask('increment-major', function () {
        incrementBuildPart(0);
    });

    grunt.task.registerTask('increment-minor', function () {
        incrementBuildPart(1);
    });

    grunt.task.registerTask('increment-build', function () {
        incrementBuildPart(2);
    });

    grunt.task.registerTask('test', [
        "clean",
        "ts",
        "concat",
        "uglify",
        "jasmine"
    ]);

    grunt.task.registerTask('build-quick', [
        "increment-build",
        "ts:default"
    ]);

    grunt.task.registerTask('build', [
        "clean",
        "increment-build",
        "ts",
        "concat",
        "uglify"
    ]);

    grunt.task.registerTask('build-minor', [
        "clean",
        "increment-minor",
        "ts",
        "concat",
        "uglify",
        "jasmine"
    ]);

    grunt.task.registerTask('build-major', [
        "clean",
        "increment-major",
        "ts",
        "concat",
        "uglify",
        "jasmine"
    ]);

    function incrementBuildPart(n) {
        var versionParts = ver.split('.');
        if (n < versionParts.length) {
            versionParts[n]++;
            for (var i = n + 1; i < versionParts.length; i++) {
                versionParts[i] = 0;
            }
            pkg.version = versionParts.join('.');
            grunt.file.write('./package.json', JSON.stringify(pkg, null, '\t'));
        }
        loadVars();
    }

    function loadVars() {
        pkg = grunt.file.readJSON("package.json");
        ver = grunt.option("ver") || pkg.version;
        outputFile = pkg.name + "." + ver + ".js";
        minimizedFile = pkg.name + "." + ver + ".min.js";

        grunt.config.set('pkg', pkg);
        grunt.config.set('ver', ver);
        grunt.config.set('outputFile', outputFile);
        grunt.config.set('minimizedFile', minimizedFile);
    }
};