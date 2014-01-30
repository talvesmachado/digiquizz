/*global define*/

define([
    'underscore',
    'backbone',
    '../models/avatar'
], function (_, Backbone, AvatarModel) {
    'use strict';

    var AvatarsCollection = Backbone.Collection.extend({
        model: AvatarModel,
        initialize: function() {
    		console.log('|---------AvatarsCollection start---------|');
    		/*---------*/

    	}
    });

    return AvatarsCollection;
});
