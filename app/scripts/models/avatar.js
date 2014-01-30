/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var AvatarModel = Backbone.Model.extend({
        defaults : {
            id : null,
            name : null,
            svg : null
        },
        initialize: function() {
    		console.log('|---------AvatarModel start--------|');
    	},
        badRequest: function()
        {
            this.trigger('badrequest');
        },
        goodRequest: function()
        {
            this.trigger('goodrequest');
        }
    });

    return AvatarModel;
});
