/* global module */

module.exports = function (config) {

    'use strict';

    config.set({

        basePath: './', // base path that will be used to resolve files and excludes

        files : [
            // Test dependencies
            '../bower_components/lodash/dist/lodash.js',
            '../bower_components/jquery/jquery.js',

            // Source files
            '../js/blackjack.js',

            // Spec files
            '../test/*spec.js',
        ],

        frameworks: ['jasmine'],

        reporters: ['story'],

        browsers: ['PhantomJS'],

        autoWatch: false,

        singleRun: true,

        colors: true
    });
};
