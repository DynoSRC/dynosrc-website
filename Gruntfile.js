var _ = require('underscore')._,
    path = require('path'),

    DEFAULT_CONFIG = {
      COPY: {
        expand: true,
        cwd: 'src/html/',
        src: ['**/*.html'],
        dest: 'build/html/'
      },
      REPLACE: {
        options: {
          patterns: [{
            match: /\{% extends '/g,
            replacement: function (match) {
              return match + __dirname + '/build/html';
            }
          }]
        },
        expand: true,
        cwd: 'build/html/',
        src: ['**/*.html'],
        dest: 'build/html/'
      },
      JSHINT: {
        options: {
          // TODO
          //jshintrc: './.jshintrc'
        },
        expand: true,
        cwd: 'src/js/',
        // Lint everything but third party code.
        src: ['**/*.js', '!third-party/**/*.js']
      },
      UGLIFY: {
        expand: true,
        cwd: 'build/js/',
        src: ['**/*.js'],
        dest: 'build/js/',
        ext: '.js'
      },
      LESS: {
        options: {
          paths: ['src/css'],
          ieCompat: false
        },
        expand: true,
        cwd: 'src/css/',
        src: ['**/*.less'],
        dest: 'build/css/',
        ext: '.css'
      },
      CONNECT: {
        options: {
          port: 9000,
          base: 'test_client/'
        }
      },
      QUNIT: {
        options: {
          urls: ['http://localhost:9000?phantom=1']
        }
      }
    },

    DEFAULT_TASKS = {
      dev: ['copy', 'replace', 'jshint', 'less', 'connect', 'qunit'],
      production: ['copy', 'replace', 'uglify', 'less']
    };

function getTaskList (env, tasks) {
  return tasks.map(function (task) { return task + ':' + env; });
}

module.exports = function (grunt) {
  var env = grunt.option('env') || 'dev',
      defaultTasks = getTaskList(env, DEFAULT_TASKS[env]);

  if (env  !== 'production') defaultTasks.push('watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: DEFAULT_CONFIG.COPY,
      production : DEFAULT_CONFIG.COPY
    },

    replace: {
      dev: DEFAULT_CONFIG.REPLACE,
      production : DEFAULT_CONFIG.REPLACE
    },

    jshint: {
      dev: DEFAULT_CONFIG.JSHINT
    },

    uglify: {
      production : DEFAULT_CONFIG.UGLIFY
    },

    less: {
      dev: DEFAULT_CONFIG.LESS,
      production : DEFAULT_CONFIG.LESS
    },

    connect: {
      dev: DEFAULT_CONFIG.CONNECT
    },

    qunit: {
      dev: DEFAULT_CONFIG.QUNIT
    },

    watch: {
      html: {
        files: 'src/html/**/*.html',
        tasks: getTaskList(env, ['copy', 'replace'])
      },
      css: {
        files: 'src/css/**/*.less',
        tasks: getTaskList(env, ['less'])
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: getTaskList(env, ['jshint'])
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', defaultTasks);
  grunt.registerTask('debug', ['connect:dev', 'watch']);
};
