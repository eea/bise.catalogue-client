define([
    'jquery',
    'underscore',
    'backbone',
    'models/result',
    'text!template/result.html',
    'text!template/cells/article.html',
    'text!template/cells/document.html',
    'text!template/cells/species.html',
    'text!template/cells/habitat.html',
    'text!template/cells/site.html'
  ], function($, _, Backbone, Result, resultTemplate, art, doc, spc, hab, sit){

  var ResultView = Backbone.View.extend({

    model: Result,
    tagName:  "li",

    art_tmpl: _.template(art),
    doc_tmpl: _.template(doc),
    new_tmpl: '',
    lnk_tmpl: '',
    spc_tmpl: _.template(spc),
    hab_tmpl: _.template(hab),
    sit_tmpl: _.template(sit),

    template: _.template(resultTemplate),

    events: {
      "click .cell-title a"     : "showResult",
    },

    initialize: function() {
      _.bindAll(this, 'render');

      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      var m = this.model.toJSON();

      if (m._type === "article")
        $(this.el).html(this.art_tmpl(m))
      else if (m._type === "document"){
        m.published_on = /([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/.exec(m.published_on);
        console.log(m.published_on)
        $(this.el).html(this.doc_tmpl(m))
      }
      else if (m._type === "species"){
        $(this.el).html(this.spc_tmpl(m))
      }
      else if (m._type === "protected_area"){
        $(this.el).html(this.sit_tmpl(m))
      }
      // save a reference to the DOM element to avoid extra lookups
      this.input = this.$('.cell');
      return this;
    },

    showResult: function(e){
      e.preventDefault()
      if ($(this.el).find('.preview').length > 0){
        $(this.el).find('.preview').remove()
      } else {
        var d = $('<div class="preview">');
        $(this.el).find('.catalogue-cell').append(d)
      }
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
