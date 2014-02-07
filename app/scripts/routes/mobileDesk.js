/*global define*/

define([
	'jquery',
	'backbone',
	'../views/mobileDesk',
	'../models/mobileDesk'

], function($, Backbone, MobiledeskView, MobiledeskModel) {
	'use strict';

	var MobiledeskRouter = Backbone.Router.extend({
		initialize: function() {
			this.MobiledeskModel = new MobiledeskModel();
			this.MobiledeskView = new MobiledeskView({
				el: '#mobile-app-wrapper',
				model: this.MobiledeskModel
			});
		},
		routes: {
			'': 'email',
			'step2': 'avatarChoose',
			'step3': 'questionsScreen',
		},
		email: function() {
			this.MobiledeskView.initStep1();
		},
		avatarChoose: function(email) {
			if (!this.MobiledeskModel.get('email')) {
				Backbone.history.navigate('', true);
			} else {
				this.MobiledeskView.initStep2();
			};
		},
		questionsScreen: function() {
			if (!this.MobiledeskModel.get('avatar')) {
				Backbone.history.navigate('#step2', true);
			} else {
				this.MobiledeskView.initStep3();

			};
		}
	});

	return MobiledeskRouter;
});