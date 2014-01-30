/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    '../collections/avatars',
    '../models/avatar',
    '../views/player',

], function ($, _, Backbone, JST, AvatarsCollection, AvatarModel, PlayerView) {
    'use strict';

    var AvatarView = Backbone.View.extend({
        template: JST['app/scripts/templates/avatar.ejs'],
        initialize: function ()
        {
			console.log('|--------AvatarView start---------|');
			var that = this;
			this.listeAvatars = new AvatarsCollection();
			this.listeAvatars.bind("add", function(model){
                that.addAvatarToView(model);
            });
            this.listeAvatars.bind("remove", function(model){
                that.removeAvatarToView(model);
            });
            this.render();
        },
        addAvatarModel : function(myId, myName, mySvg)
        {
            var avatarModel = new AvatarModel({id: myId, name: myName, svg: mySvg});
            this.listeAvatars.add(avatarModel);

        },
        addAvatarToView : function (myModel)
        {
            var playView = new PlayerView({model: myModel});
            var playViewRendered = playView.render().el;
            $("#player-list").append(playViewRendered);
            playView.renderSVG();
            TweenMax.fromTo($(playViewRendered), 0.4, {css:{opacity:0, paddingTop:50}}, {css:{opacity:1, paddingTop:0}});
        },
        removeAvatarToView : function (myModel)
        {
            myModel.trigger('destroy', myModel);
        },
        render: function()
        {
            var html = this.template();
            $(this.el).append(html);
             return this;
        }
    });

    return AvatarView;
});
