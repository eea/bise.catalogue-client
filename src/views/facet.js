define(['jquery', 'underscore', 'backbone', 'models/facet', 'text!template/facet.html'],
  function($, _, Backbone, Facet, facetTemplate) {

  var FacetView = Backbone.View.extend({

    model: Facet,
    //tagName: "div",
    template: _.template(facetTemplate),
    isOpen: false,

    titles: {
      site: 'Source',
      author: 'Author',
      countries: 'Country',
      biographical_region: 'Biogeographical Region',
      languages: 'Language',
      source_db: 'Source Dataset',
      kingdom: 'Kingdom',
      phylum: 'Phylum',
      classis: 'Classis',
      species_group: 'Species Group',
      taxonomic_rank: 'Taxonomic Rank',
      genus: 'Genus',
      published_on: 'Timeline',
      strategytarget: 'Biodiversity Strategy Targets'
    },

    events: {
      "click .facet-link": "applyFilter",
      "click .facet-remove": "unapplyFilter",
      "click .facet-header": "toggleCollapse"
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.isOpen = Catalogue.containsFacetKey(this.model.title)
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      if (!this.isOpen) this.$el.find('ul').hide()
      return this;
    },

    applyFilter: function(e) {
      el = $(e.currentTarget)
      Catalogue.mergeFacet(el.data('facet'), el.data('value'))
    },

    unapplyFilter: function(e) {
      el = $(e.currentTarget)
      Catalogue.removeFacet(el.data('facet'))
    },

    titleFor: function(facet) {
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
    },

    toggleCollapse: function(e) {
      el = $(e.currentTarget).next().slideToggle($.proxy(this.rotateTriangle, this));
    },
    rotateTriangle: function(e){
      this.$el.find('.triangle').toggleClass('up');
    }
  })
  return FacetView;
});