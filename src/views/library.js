define(['jquery', 'underscore', 'backbone', 'models/library', 'text!template/library.html'],
  function($, _, Backbone, Library, libraryTemplate) {

  var LibraryView = Backbone.View.extend({

    model: Library,
    template: _.template(libraryTemplate),

    events: {
      "click .all": "clearAllLibraries",
      "click .library": "toggleFilter"
    },

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    clearAllLibraries: function(e){
      el = $(e.currentTarget)
      Catalogue.removeFacet('site')
    },

    toggleFilter: function(e) {
      el = $(e.currentTarget)
      if (Catalogue.isFacetSelected(el.data('facet'), el.data('value'))) {
        Catalogue.removeFacet(el.data('facet'))
      } else {
        Catalogue.mergeFacet(el.data('facet'), el.data('value'))
      }
    },

    clear: function() {
      this.model.unbind('change', this.render, this);
      this.model.unbind('destroy', this.remove, this);
      this.model.destroy();
      this.remove();
    }

  })
  return LibraryView;
});