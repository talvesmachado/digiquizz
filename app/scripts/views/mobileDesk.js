/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'snap',
	'TweenMax',

], function($, _, Backbone, JST, Snap, TweenMax) {
	'use strict';

	var MobiledeskView = Backbone.View.extend({
		svg: null,
		svgArray: null,
		slideIndex: 0,
		template: JST['app/scripts/templates/mobileDesk.ejs'],
		templateStep2: JST['app/scripts/templates/mobileDesk2.ejs'],
		templateStep3: JST['app/scripts/templates/mobileDesk3.ejs'],
		events: {
			'submit #email-form': 'toAvatarChoose'
		},
		initialize: function() {
			this.socket = io.connect('"http://192.168.0.55:1337');
			//	this.socket.emit('loginPlayer');
			$(window).bind("resize.app", _.bind(this.resize, this));
			this.svgArray = new Array('29715', '29779', '29882', '29926', '29940', '30018', '30055', '30069');
		},
		initStep1: function() {
			this.model.set({
				'email': null
			});
			var html = this.template();
			$(this.el).html(html);
			var firstSVG = Snap(100, 100);
			firstSVG.attr({
				id: 'mobile-init-svg',
				viewBox: '0 0 100 100'
			});
			//'#mobile-init-svg'
			$('#mobile-init-svg').appendTo($('.svgwrapper'));
			Snap.load(require.toUrl("./../images/icon_29779/icon_29779.svg"), function(f) {
				firstSVG.append(f);

			});
		},
		initStep2: function() {
			this.model.set({
				'avatar': null
			});
			var svgArray = new Array('29715', '29779', '29882', '29926', '29940', '30018', '30055', '30069');
			var that = this;
			TweenMax.to($(this.el), 0.3, {
				opacity: 0,
				onComplete: _.bind(that.renderStep2, this)
			});
		},
		renderStep2: function() {
			this.slideIndex = 0;
			TweenMax.to($('body'), 0.6, {
				css: {
					backgroundColor: '#e9e2d0'
				}
			});

			var that = this;
			var html = this.templateStep2();
			$(this.el).html(html);
			var cList = $("#avatar-list");
			_.each(this.svgArray, function(e) {
				var li = $('<li/>')
					.addClass('avatar-item')
					.attr('data-svg', e)
					.appendTo(cList);
				var currentSvg = Snap(100, 100);
				currentSvg.attr({
					id: 'svg-' + e,
					class: "svg-item",
					viewBox: '0 0 100 100'
				});
				$('#svg-' + e).appendTo(li);
				var bigCircle = currentSvg.circle(50, 50, 50);
				bigCircle.attr({
					fill: "#ffffff",
					strokeWidth: 0
				});
				Snap.load(require.toUrl("./../images/icon_" + e + "/icon_" + e + ".svg"), function(f) {
					var g = f.select("g");
					currentSvg.append(f);
				});

			});
			$$("#avatar-list").off("swipeLeft").on("swipeLeft", _.bind(that.swipeLeft, that));
			$$("#avatar-list").off("swipeRight").on("swipeRight", _.bind(that.swipeRight, that));
			$$("#avatar-list li").off("swipeUp").on("swipeUp", function() {
				var currLI = this;
				TweenMax.to($(this), 0.7, {
					css: {
						top: -1000
					},
					onComplete: function() {
						console.log($(currLI));
						that.model.set({
							'avatar': $(currLI).attr('data-svg')
						});
						Backbone.history.navigate('#step3', true)
					}

				});
			});

			this.resize();
			TweenMax.to($(this.el), 0.3, {
				opacity: 1
			});
		},
		initStep3: function() {


			var str = this.model.get('email'),
				str = str.substring(1, str.indexOf('@'));

			this.socket.emit('loginPlayer', {
				username: str,
				email: this.model.get('email'),
				avatar: this.model.get('avatar')
			});
			var that = this;
			TweenMax.to($(this.el), 0.3, {
				opacity: 0,
				onComplete: _.bind(that.renderStep3, that)
			});
		},
		renderStep3: function() {

			var html = this.templateStep3();
			$(this.el).html(html);

			/*  IO.socket wait  */
			var that = this;
			this.socket.on('newQuestion', function(questionsAray) {
				that.setAnswers(questionsAray.answersArray);
			});
			this.socket.on('badRequest', function() {
				that.badAnswer();
			});
			this.socket.on('goodRequest', function() {
				that.goodAnswer();
			});
			//this.setAnswers();
		},
		setAnswers: function(questionsAray) {
			var that = this;
			$('.questions-wrapper').html('');
			var myArray = questionsAray;
			_.each(myArray, function(obj) {


				var objKey = _.keys(obj)[0];
				var divParent = $('<div/>')
					.addClass('answer-bloc')
					.attr('data-answer', objKey)
					.appendTo($('.questions-wrapper'));
				var divChild = $('<div/>')
					.addClass('answer-bloc-content')
					.appendTo($(divParent))
					.html(obj[objKey]);

			});
			this.resize();
			var tl = new TimelineLite();
			tl.add(TweenMax.to($('body'), 0.6, {
				css: {
					backgroundColor: '#5b5b5b'
				}
			})).add(
				TweenMax.to($(this.el), 0.6, {
					opacity: 1
				}));

			$$(".answer-bloc").off("tap").on("tap", function() {
				var answerID = $(this).attr('data-answer');
				that.sendAnswer(answerID);
				$(this).css({
					"background-image": "url(../images/mobile-pattern.png)"
				});
				TweenMax.to($(this), 0.6, {
					css: {
						boxShadow: "0px 0px 20px 0px #000000",
						backgroundColor: "#7cacbc"

					}
				});
			});

		},
		sendAnswer: function(answerID) {
			//console.log("answerID = " + answerID);
			//this.badAnswer();
			this.socket.emit('sendAnswer', answerID)
		},
		goodAnswer: function() {
			var div = $('<div/>')
				.addClass('answer-bloc-good')
				.appendTo($('.questions-wrapper'))
				.html('<div class="border-anim"><h4>bonne réponse</h4></div>');
			this.resize();

			var tl = new TimelineLite();
			tl.add(
				TweenMax.fromTo(div, 0.3, {
					css: {
						opacity: 0,
					}
				}, {
					css: {
						opacity: 1,
					}
				})).add(
				TweenMax.to($('.border-anim'), 0.3, {
					css: {
						border: '20px solid #ffffff'
					}
				}));
		},
		badAnswer: function() {
			var div = $('<div/>')
				.addClass('answer-bloc-bad')
				.appendTo($('.questions-wrapper'))
				.html('<div class="border-anim"><h4>Mauvaise Réponse</h4></div>');
			this.resize();

			var tl = new TimelineLite();
			tl.add(
				TweenMax.fromTo(div, 0.3, {
					css: {
						opacity: 0,
					}
				}, {
					css: {
						opacity: 1,
					}
				})).add(
				TweenMax.to($('.border-anim'), 0.3, {
					css: {
						border: '20px solid #ffffff'
					}
				}));
		},
		swipeLeft: function() {

			var itemLength = $('.avatar-item').length;
			var firstWidth = $('.avatar-item').first().width();
			if (itemLength - 1 > this.slideIndex) {
				this.slideIndex++;
				TweenMax.to($('#avatar-list'), 0.7, {
					css: {
						left: -firstWidth * this.slideIndex
					},
					ease: Back.easeOut
				});
			};
		},
		swipeRight: function() {
			var itemLength = $('.avatar-item').length;
			var firstWidth = $('.avatar-item').first().width();
			if (this.slideIndex > 0) {

				this.slideIndex--;
				TweenMax.to($('#avatar-list'), 0.7, {
					css: {
						left: -firstWidth * this.slideIndex
					},
					ease: Back.easeOut
				});
			};
		},
		toAvatarChoose: function(e) {
			e.preventDefault();
			this.model.set({
				'email': this.$('input[name=email]').val(),
			});

			Backbone.history.navigate('#step2', true);
		},
		resize: function() {
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			if ($('#avatar-list')[0]) {
				$('#avatar-list').height(winHeight * 0.7);
				var myAvatarItem = $('.avatar-item');
				var myAvatarList = $('#avatar-list');
				var myAvatarItemLength = myAvatarItem.length;
				var myAvatarFirstWidth = myAvatarItem.first().width();
				myAvatarList.css({
					marginLeft: $("p.swipe").offset().left
				})
				myAvatarItem.each(function(e) {
					this.style.left = myAvatarFirstWidth * e + "px";
					this.style.height = this.style.width;

				});
			};
			if ($('.questions-wrapper')[0]) {
				$('.answer-bloc').width((winWidth / 2) - 2).height((winHeight / 2) - 2);

			};
			if ($('.border-anim')[0]) {
				$('.border-anim').width(winWidth - 40).height(winHeight - 40);

			};


		}
	});

	return MobiledeskView;
});