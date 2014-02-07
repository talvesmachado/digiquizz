/*global define*/

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var AvatarModel = Backbone.Model.extend({
		defaults: {
			id: null,
			name: null,
			email: null,
			svg: null,
			QuizzdeskView: null,
			scoreValue: 0
		},
		initialize: function(options) {
			console.log('|---------AvatarModel start--------|');
			/*this.QuizzdeskView.bind('startQuestion', function(){
                    console.log("start question");
            });*/
			console.log(this.get('QuizzdeskView'));
			/*this.get('QuizzdeskView').bind('startQuestion', function() {
				this.sampleResp()
			}, this);*/

		},
		sampleResp: function(resp) {

			var that = this;
			var answer = that.get('QuizzdeskView').validateAnswers(resp);
			if (answer) {
				that.goodRequest();
			} else {
				that.badRequest();
			};
			/*var resp = _.random(1, 4);
			var timed = _.random(1000, 9000);
			var that = this;

			setTimeout(function() {

				var answer = that.get('QuizzdeskView').validateAnswers(resp);
				if (answer) {
					that.set({
						'scoreValue': that.get('scoreValue') + 1
					});

					that.goodRequest();
				} else {
					that.badRequest();
				};

				console.log(that.id + " : " + that.get('scoreValue'));

			}, timed);*/

		},
		badRequest: function() {
			this.trigger('badrequest');
			this.get('QuizzdeskView').socket.emit('badRequest', this.get('id'));
		},
		goodRequest: function() {
			this.set({
				'scoreValue': this.get('scoreValue') + 1
			});
			this.trigger('goodrequest');
			this.get('QuizzdeskView').socket.emit('goodRequest', this.get('id'));
		}
	});

	return AvatarModel;
});