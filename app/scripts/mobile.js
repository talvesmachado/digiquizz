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
		snap: {
			exports: 'Snap'
		},
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
		backbone: '../bower_components/backbone/backbone',
		underscore: '../bower_components/underscore/underscore',
		snap: '../bower_components/Snap.svg/dist/snap.svg-min',
		TweenMax: '../bower_components/greensock-js/src/uncompressed/TweenMax'
	}
});

require([
	'backbone', 'routes/mobileDesk'
], function(Backbone, MobiledeskRouter) {

	$(document).ready(function() {

		window.mobileDesk = new MobiledeskRouter()
		/*new MobiledeskView({
			el: '#mobile-app-wrapper'
		})*/
		;
		Backbone.history.start();
	});
});