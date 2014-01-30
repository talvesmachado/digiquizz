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
], function ($, _, Backbone, JST, TweenMax, AvatarView, QuestionModel, QuestionsCollection) {
    'use strict';

    var QuizzdeskView = Backbone.View.extend({
    	α:0,
		π:Math.PI,
		t:30,
		avatarView:null,
    	initialize: function()
    	{
    		console.log('|---------QuizzdeskView START---------|');
    		$(window).bind("resize.app", _.bind(this.resize, this));
    		_.bindAll(this, 'drawTimer');
        	console.log('render');
        	var html = this.template();
   		    $(this.el).append(html);

   		    /* Lancement de la gestion des avatars */
   		    this.initAvatars();
   		    this.constructQuestions();
   		    /* Lancement de la question */
			//this.startTimer();

			this.resize();
    	},
       template: JST['app/scripts/templates/quizzDesk.ejs'],
       constructQuestions:function()
       {
   		    this.questionsCollection = new QuestionsCollection();
    		_.each(questionsFile, function(ques){ 
    			var question = new QuestionModel({question:ques.value, answersArray:ques.answers, goodAnswer:ques.goodAnswer });
    			this.questionsCollection.add(question);
    		}, this);
			this.questionsCollection.setCurrent(0);
			this.questionsCollection.bind('questionChange', this.startQuestion, this);
       },
       startQuestion : function()
       {
       		var currentQuestion = this.questionsCollection.getCurrent().get('question');
       		console.log(currentQuestion );
       		$('#question-box').html(currentQuestion); 
	       	TweenMax.to($('#question-box'), 0.6, {opacity:1 });
	       
       		this.startTimer();
       },
       startTimer : function()
       {
       		var timming = (this.t/100)/2;
			TweenMax.to($("#timer"), 0, {scale:1});
			TweenMax.to($(".time"), 0, {opacity: 1});
			this.α = 0;
	       	var tl = new TimelineMax();
	       	tl.add(TweenMax.fromTo($("#loader"), 2,{fill: '#d0e9d4'}, {fill: '#ffc529',delay:5}) );
	       	tl.add(TweenMax.to($("#loader"), 2, {fill: '#f36161', delay:2}) );
 			this.drawTimer();
       },
       drawTimer: function () 
       {
		  this.α ++;
		  this.α = ((this.α % 360) == 0)? 360 : this.α % 360;
		  var r = ( this.α * this.π / 180 )
		    , x = Math.sin( r ) * 63
		    , y = Math.cos( r ) * - 63
		    , mid = ( this.α > 180 ) ? 1 : 0
		    , anim = 'M 0 0 v -63 A 63 63 1 '+ mid + ' 1 '+  x  + ' '+  y  + ' z';
		  $('#loader').attr( 'd', anim );
		  $('#border').attr( 'd', anim );
		  if(this.α != 360) {
			setTimeout(_.bind(this.drawTimer, this), this.t);
		  } else {
		  	var initAnim = 'M 0 0 v -63 A 63 63 1 1 1 -0.1 -63 z ';
			$('#loader').attr( 'd', initAnim );
			$('#border').attr( 'd', initAnim );
			this.stopTimer();
		  };
		},
		stopTimer: function()
		{
			var that = this;
			var tl = new TimelineMax();
			tl.add(TweenMax.to($("#timer"), 0.6, {scale:0.0, ease:Back.easeIn}))
			.add(TweenMax.to($(".time"), 0.6, {opacity: 0}))
	       	.add(TweenMax.to($('#question-box'), 0.6, {opacity:0}))
	       	.add(TweenMax.delayedCall(0.1,function(){that.questionsCollection.next()} )) ;
			 
			//this.questionsCollection.next();
		},
		initAvatars: function()
		{
			this.avatarView = new AvatarView({el: $("#avatar-box")[0]});
		},
        render: function ()
        {

        },
        resize : function ()
        {
        	TweenMax.to($("#question-wrapper"), 0.5, {top: $(window).height()/4});
        }

    });

    return QuizzdeskView;
});
