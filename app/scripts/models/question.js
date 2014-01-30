/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var QuestionModel = Backbone.Model.extend({
        defaults: {
        	question:null,
        	answersArray:null,
        	goodAnswer:null
        }
    });

    return QuestionModel;
});
