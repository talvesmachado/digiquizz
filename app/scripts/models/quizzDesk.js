/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var QuizzdeskModel = Backbone.Model.extend({
    	initialize: function() {
    		console.log('|---------QuizzdeskModel START---------|');
    	},
        defaults: {
        }, 

    });

    return QuizzdeskModel;
});
