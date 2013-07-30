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

    formatDate: function(dateString){
      var d= new Date(Date.parse(dateString))
      var dd = d.getDay();
      var mm = d.getMonth()+1;//January is 0!
      var yyyy = d.getFullYear();
      if(dd<10){ dd='0'+dd }
      if(mm<10){ mm='0'+mm }
      return mm+'/'+dd+'/'+yyyy
    },

    render: function() {
      var m = this.model.toJSON();

      if (m._type === "article")
        $(this.el).html(this.art_tmpl(m))
      else if (m._type === "document"){
        m.published_on = this.formatDate(m.published_on)
        $(this.el).html(this.doc_tmpl(m))
      }
      else if (m._type === "species"){
        $(this.el).html(this.spc_tmpl(m))
      }
      else if (m._type === "protected_area"){
        $(this.el).html(this.sit_tmpl(m))
      }
      else if (m._type === "habitat"){
        $(this.el).html(this.hab_tmpl(m))
      }
      this.input = this.$('.cell');
      return this;
    },

    showResult: function(e){
      e.preventDefault()
      if ($(this.el).find('.preview').length > 0){
        $(this.el).find('.preview').remove()
      } else {
        this.$el.parent().find('.preview').remove()
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
