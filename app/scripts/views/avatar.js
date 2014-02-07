/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'../collections/avatars',
	'../models/avatar',
	'../views/player',

], function($, _, Backbone, JST, AvatarsCollection, AvatarModel, PlayerView) {
	'use strict';

	var AvatarView = Backbone.View.extend({
		QuizzdeskView: null,



		template: JST['app/scripts/templates/avatar.ejs'],
		initialize: function(option) {
			console.log('|--------AvatarView start---------|');
			var that = this;
			this.listeAvatars = new AvatarsCollection();
			this.listeAvatars.bind("add", function(model) {
				that.addAvatarToView(model);
			});
			this.listeAvatars.bind("remove", function(model) {
				that.removeAvatarToView(model);
			});

			/*   TEST DES QUESTIONS   */

			/*window.myApplication.QuizzdeskView.bind('startQuestion', function(){

            });*/
			this.QuizzdeskView = option.QuizzdeskView;

			this.render();
		},
		removeAvatarToViewTrigger: function(userID) {
			var myModel = this.listeAvatars.get(userID);
			this.listeAvatars.remove(myModel);
		},
		addAvatarModel: function(myId, myName, mySvg, myEmail) {
			var avatarModel = new AvatarModel({
				id: myId,
				name: myName,
				email: myEmail,
				svg: mySvg,
				QuizzdeskView: this.QuizzdeskView,
				scoreValue: 0
			});

			this.listeAvatars.add(avatarModel);
		},
		addAvatarToView: function(myModel) {
			var playView = new PlayerView({
				model: myModel
			});
			//console.log(playView.model.get('scoreValue'));
			var playViewRendered = playView.render().el;
			$("#player-list").append(playViewRendered);
			playView.renderSVG();
			TweenMax.fromTo($(playViewRendered), 0.4, {
				css: {
					opacity: 0,
					paddingTop: 50
				}
			}, {
				css: {
					opacity: 1,
					paddingTop: 0
				}
			});
		},
		removeAvatarToView: function(myModel) {
			/*console.log("////  DISCONNECT CALL  ===>" + user)
			console.log(user);
			var myModel = this.listeAvatars.get(user);
			console.log(myModel);*/

			myModel.trigger('destroy', myModel);
		},
		render: function() {

			var html = this.template();
			$(this.el).append(html);
			return this;
		}
	});

	return AvatarView;
});