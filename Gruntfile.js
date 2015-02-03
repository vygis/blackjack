/* global module, require */

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        karma: { 
            unit: {
                configFile: 'test/karma.conf.js',
                reporters: ['story']
            }
        }
    });
    grunt.registerTask('test', ['karma:unit']);   
    grunt.registerTask('default', ['test']);
}