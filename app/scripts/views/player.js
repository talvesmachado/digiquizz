/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates', 
    'snap'
], function ($, _, Backbone, JST, Snap) {
    'use strict';

    var PlayerView = Backbone.View.extend({
        tagName: "li",
        svg:null,
        template: JST['app/scripts/templates/player.ejs'],
        initialize: function ()
        {
            this.listenTo(this.model, 'destroy', this.removeTrigger);
            this.model.on('change', this.changeHandler, this);
            this.model.on('badrequest', this.badRequestHandler, this);
            this.model.on('goodrequest', this.goodRequestHandler, this);
        },
        badRequestHandler:function()
        {
            var tl = new TimelineMax();
            var cible = $(this.el).find('.background');
            tl.add([
                      TweenMax.to(cible , 0.3, {css:{backgroundColor:'#f36161'}}),
                      TweenMax.fromTo(cible , 0.1, {repeat:5, left:-2 }, { repeat:5,left:0})
                      ]);
            tl.add(TweenMax.to(cible , 0.3, {css:{backgroundColor:'#98c3ec'}}));
            
        },
        goodRequestHandler:function()
        {
            console.log('mlk');
            var tl = new TimelineMax();
            var cible = $(this.el).find('.background');
            tl.add([
                      TweenMax.to(cible , 0.3, {css:{backgroundColor:'#d6f361'}}),
                      TweenMax.fromTo(cible , 0.3, {rotation:0}, {rotation:360})
                      ]);
            tl.add(TweenMax.to(cible , 0.3, {css:{backgroundColor:'#98c3ec'}}));
        },
        changeHandler:function()
        {
            console.log('changed !!!!')
            this.render();
            this.renderSVG();
        },
        removeTrigger: function()
        {
            var that = this;
            var tl = new TimelineMax();
            tl.add(TweenMax.fromTo($(this.el), 0.4, {css:{opacity:1, paddingTop:0}},  {css:{opacity:0, paddingTop:50}}));
            tl.add(TweenMax.to($(this.el), 0.4, {css:{width:0}, onComplete: function(){that.remove()}}));
        },
        renderSVG: function()
        {
            var svgCible = "#svg-avatar-"+this.model.get('id');
            this.svg =  Snap(svgCible);
            Snap.load(require.toUrl("./../images/"+"icon_"+this.model.get('svg')+"/icon_"+this.model.get('svg')+".svg"), function (f) {

                var g = f.select("g");
                //console.log(this);
                this.svg.append(f);

            }, this);
            return this;
        },
        render: function()
        {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return PlayerView;
});
