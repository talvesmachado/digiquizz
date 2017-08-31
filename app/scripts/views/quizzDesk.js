/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'TweenMax',
	'../views/avatar',
	'../models/question',
	'../collections/questions'
], function($, _, Backbone, JST, TweenMax, AvatarView, QuestionModel, QuestionsCollection) {
	'use strict';

	var QuizzdeskView = Backbone.View.extend({α: 0,
		π: Math.PI,
		decountTime: null,
		avatarView: null,
		decountTimeOut: null,
		circleTimeOut: null,
		socket: null,
		template: JST['app/scripts/templates/quizzDesk.ejs'],
		initialize: function() {
			var that = this;
			this.socket = io.connect('"http://192.168.0.55:1337');
			this.socket.emit('loginMaster');
			this.socket.on('newPlayer', function(user) {
				that.avatarView.addAvatarModel(user.id, user.username, user.avatar, user.email);
			});
			this.socket.on('disconnectedPlayer', function(user) {

				that.avatarView.removeAvatarToViewTrigger(user.id);
			});
			this.socket.on('answerSended', function(answerObj) {
				var currentUser = that.avatarView.listeAvatars.get(answerObj.user.id);
				currentUser.sampleResp(answerObj.answerID);
			});
			console.log('|---------QuizzdeskView START---------|');
			$(window).bind("resize.app", _.bind(this.resize, this));
			_.bindAll(this, 'drawTimer');
			var html = this.template();
			$(this.el).append(html);
			this.initAvatars();
			this.constructQuestions();
			this.resize();
		},

		constructQuestions: function() {
			this.questionsCollection = new QuestionsCollection();
			_.each(questionsFile, function(ques) {
				var question = new QuestionModel({
					question: ques.value,
					answersArray: ques.answers,
					goodAnswer: ques.goodAnswer
				});
				this.questionsCollection.add(question);
			}, this);
			this.questionsCollection.setCurrent(0);
			this.questionsCollection.bind('questionChange', this.startQuestion, this);
		},
		validateAnswers: function(answerID) {
			var goodAnswer = this.questionsCollection.getCurrent().get('goodAnswer');
			if (answerID == goodAnswer) {
				return true;
			} else {
				return false;
			};
			return false;
		},
		startQuestion: function() {
			var currentQuestion = this.questionsCollection.getCurrent().get('question');
			$('#question-box').html(currentQuestion);
			TweenMax.to($('#question-box'), 0.8, {
				opacity: 1
			});
			this.startTimer();
			this.socket.emit('startQuestion', {
				answersArray: this.questionsCollection.getCurrent().get('answersArray')
			});

		},
		startTimer: function() {
			TweenMax.to($("#timer"), 0, {
				scale: 1
			});
			TweenMax.to($(".time"), 0, {
				opacity: 1
			});
			this.α = 0;
			this.decountTime = 10;
			var tl = new TimelineMax();
			tl.add(TweenMax.fromTo($("#loader"), 2, {
				fill: '#d0e9d4'
			}, {
				fill: '#ffc529',
				delay: 5
			}));
			tl.add(TweenMax.to($("#loader"), 2, {
				fill: '#f36161',
				delay: 2
			}));
			this.validateAnswers();
			this.decount();
			this.drawTimer();
			this.trigger('startQuestion');
		},
		decount: function() {
			var zero = (this.decountTime == 10) ? "" : "0";
			$(".time").html("00:" + zero + this.decountTime)
			this.decountTime--;
			this.decountTimeOut = setTimeout(_.bind(this.decount, this), 1000);
		},
		drawTimer: function() {
			this.α++;
			this.α = ((this.α % 360) == 0) ? 360 : this.α % 360;
			var r = (this.α*this.π / 180),
				x = Math.sin(r) * 63,
				y = Math.cos(r) * -63,
				mid = (this.α > 180) ? 1 : 0,
				anim = 'M 0 0 v -63 A 63 63 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';
			$('#loader').attr('d', anim);
			$('#border').attr('d', anim);
			if (this.α != 360) {
				this.circleTimeOut = setTimeout(_.bind(this.drawTimer, this), 28);
			} else {
				var initAnim = 'M 0 0 v -63 A 63 63 1 1 1 -0.1 -63 z ';
				$('#loader').attr('d', initAnim);
				$('#border').attr('d', initAnim);
				this.stopTimer();
			};
		},
		stopTimer: function() {
			this.socket.emit('stopQuestion');
			this.trigger('stopQuestion');
			var that = this;
			clearTimeout(this.circleTimeOut);
			clearTimeout(this.decountTimeOut);
			var tl = new TimelineMax();
			tl.add(TweenMax.to($('#question-box'), 0.6, {
				opacity: 0
			}))
				.add(TweenMax.to($("#timer"), 0.6, {
					scale: 0.0,
					ease: Back.easeIn
				}))
				.add(TweenMax.to($(".time"), 0.6, {
					opacity: 0
				}))
				.add(TweenMax.delayedCall(0.1, function() {
					that.questionsCollection.next()
				}));
			//this.questionsCollection.next();
		},
		initAvatars: function() {
			this.avatarView = new AvatarView({
				el: $("#avatar-box")[0],
				QuizzdeskView: this
			});
		},
		resize: function() {
			TweenMax.to($("#question-wrapper"), 0.5, {
				top: $(window).height() / 4
			});
		}

	});

	return QuizzdeskView;
});