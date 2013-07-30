define(['jquery', 'underscore', 'backbone', 'models/facet', 'text!template/facet.html'], function($, _, Backbone, Facet, facetTemplate){

  var FacetView = Backbone.View.extend({

    model: Facet,
    tagName:  "div",
    template: _.template(facetTemplate),

    titles: {
      sites:                'Source' ,
      authors:              'Author',
      countries:            'Country',
      biographical_region:  'Biogeographical Region',
      languages:            'Language'
    },

    events: {
      "click .facet-link"         : "filterByFacet",
      "click .facet-remove"       : "filterByFacet"
    },

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    filterByFacet: function(e) {
      el =$(e.currentTarget)
      Catalogue.mergeFacet( el.data('facet'), el.data('value'))
    },

    titleFor: function(facet){
      return this.titles[facet]
    },

    remove: function() {
      $(this.el).remove();
    },

    clear: function() {
      this.model.unbind('change', this.render, this);
      this.model.unbind('destroy', this.remove, this);
      this.model.destroy();
      this.remove();
    }

  })
  return FacetView;
});
