/*global define*/

define([
    'jquery',
    'backbone',
    '../models/quizzDesk',
    '../views/quizzDesk'

], function ($, Backbone, QuizzdeskModel, QuizzdeskView) {
    'use strict';

    var QuizzdeskRouter = Backbone.Router.extend({
        initialize : function()
        {
            console.log('|---------QuizzdeskRouter START---------|');
            this.QuizzdeskModel = new QuizzdeskModel();
            this.QuizzdeskView = new QuizzdeskView({model :this.QuizzdeskModel, el:'#app-wrapper'});

            /*---------Creation d'avatar ------------*/
            this.QuizzdeskView.avatarView.addAvatarModel('1', 'tom', '29715')
            this.QuizzdeskView.avatarView.addAvatarModel('2', 'pierro', '29926')
            this.QuizzdeskView.avatarView.addAvatarModel('3', 'paga', '30018')
        },
        routes: {
        	'' : 'init'
        }, 
        init : function (){
            document.title = "Digital QUIZZ";
        }


    });

    return QuizzdeskRouter;
});
