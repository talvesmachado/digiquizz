/*global define*/

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var MobiledeskModel = Backbone.Model.extend({
		defaults: {
			email: null,
			avatar: null
		}
	});

	return MobiledeskModel;
});