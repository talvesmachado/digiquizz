/*global define*/

define([
    'underscore',
    'backbone',
    'models/question'
], function (_, Backbone, QuestionModel) {
    'use strict';

    var QuestionsCollection = Backbone.Collection.extend({
        model: QuestionModel,
        current: null,
        initialize: function ()
        {
        	
        },
		setCurrent: function(index){
		    // ensure the requested index exists
		    if ( index > -1 && index < this.size() )
		    {
		        this.current = index;
		    }
		    else 
		    {
		        console.log('QuestionsCollection error current')
		    };
		    this.trigger('questionChange');
		},
		getSize: function ()
		{
			return this.size();
		},
		getCurrent: function ()
		{
			return this.at(this.current);
		},
		prev: function() {
			var indexValue = this.current -1;
			if(indexValue == -1)
			{
				this.setCurrent(this.size()-1); 
			}
			else
			{
			 this.setCurrent(this.current -1);
			}
		   
		   // return this.current;
		},
		next: function() {
			var indexValue = this.current +1;
			if(indexValue > this.size()-1)
			{
				this.setCurrent(0); 
			}
			else
			{
			 this.setCurrent(this.current +1);
			}		    
		    // return this.current;
		}
    });

    return QuestionsCollection;
});
