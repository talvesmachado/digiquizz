/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }, 
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        snap: '../bower_components/Snap.svg/dist/snap.svg-min',
        TweenMax : '../bower_components/greensock-js/src/uncompressed/TweenMax'
    }
});

require([
    'backbone', 'routes/quizzDesk'
], function (Backbone, QuizzdeskRouter) {

    window.myApplication = null;
    
    $(document).ready(function () {

        myApplication = new QuizzdeskRouter();
        Backbone.history.start();
    });
});
