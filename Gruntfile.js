module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");
    var ver = grunt.option("ver") || pkg.version;
    var outputFile = pkg.name + "." + ver + ".js";
    var minimizedFile = pkg.name + "." + ver + ".min.js";

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["build"]);

    grunt.initConfig({
        ts: {
            default: {
                tsconfig: "src/tsconfig.json"
            }
        },
        clean: {
            default: [
                './*.js',
                './*.js.map',
                '!./Gruntfile.js'
            ]
        },
        concat: {
            default: {
                src: ["./*js", "!./Gruntfile.js"],
                dest: outputFile
            }
        },
        uglify: {
            default: {
                files: {
                    [minimizedFile]: outputFile
                }
            }
        }
    })

    grunt.task.registerTask('copy-output-to-min', function () {
        grunt.file.copy(outputFile, minimizedFile)
    });

    grunt.task.registerTask('increment-major', function () {
        incrementBuildPart(1);
    });

    grunt.task.registerTask('increment-minor', function () {
        incrementBuildPart(1);
    });

    grunt.task.registerTask('increment-build', function () {
        incrementBuildPart(2);
    });

    grunt.task.registerTask('build-quick', [
        "increment-build",
        "ts"
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
        "uglify"
    ]);

    grunt.task.registerTask('build-major', [
        "clean",
        "increment-major",
        "ts",
        "concat",
        "uglify"
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
    }
};