define(['jquery', 'underscore', 'backbone', 'models/result', 'text!template/result.html'], function($, _, Backbone, Result, resultTemplate){

  var ResultView = Backbone.View.extend({

    model: Result,
    tagName:  "li",
    template: _.template(resultTemplate),
    events: {

    },

    initialize: function() {
      _.bindAll(this, 'render');

      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      // save a reference to the DOM element to avoid extra lookups
      this.input = this.$('.cell');
      return this;
    },

    remove: function() {
      $(this.el).remove();
    },

    clear: function() {
      this.model.unbind('change', this.render, this)
      this.model.unbind('destroy', this.remove, this)
      this.model.destroy()
      this.remove()
    }

  });
  return ResultView;
});
