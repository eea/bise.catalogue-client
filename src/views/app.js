define(['jquery', 'underscore', 'backbone', 'collections/results', 'views/results', 'views/facet', 'text!template/main.html'],
  function($, _, Backbone, ResultsCollection, ResultView, FacetView, mainTemplate){

  var AppView = Backbone.View.extend({

    el: $("#catalogue-app"),
    mainTemplate: _.template(mainTemplate),
    areas: [
      'All the Catalogue', 'Articles', 'Documents', 'News', 'Links',
      'Sites', 'Habitats', 'Species'
    ],
    queryparams: {
      query: 'a',
      page: 1,
      per_page: 10
    },
    events: {
      "submit #catalogue-search-form"     : "setQuery",
      "change #catalogue-sort select"     : "setSorting",
      "change #catalogue-per-page select" : "setPerPage"
    },

    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render', 'mergeFacet')

      // Add main template
      $(this.$el.selector).append(this.mainTemplate)

      this.Results = new ResultsCollection()
      this.Results.bind('add', this.addOne)
      this.Results.bind('reset', this.addAll)
      this.Results.bind('all', this.render)

      this.runQuery()
    },

    runQuery: function(e){
      this.Results.fetch({ data: $.param(this.queryparams) })
    },

    setQuery: function(e){
      e.preventDefault()
      this.queryparams.query = $('#catalogue-search-form input').val()
      $('#catalogue-search-form input').val('')
      this.runQuery()
    },

    setSorting: function(e){
      this.queryparams.sort = $('#catalogue-sort select').val()
      this.runQuery()
    },

    setPerPage: function(e){
      this.queryparams.per_page = $('#catalogue-per-page select').val()
      this.runQuery()
      this.Results.fetch({ data: $.param(this.queryparams) })
    },

    render: function() {
      this._drawSearches()
      this._drawCount()
      this._drawFacets()
    },

    _drawSearches: function(){
      close = $('<span>').addClass('close').html('✖')
      li = $('<li>').append(close).append(this.queryparams.query)
      this.$('#catalogue-queries ul').html(li)
    },

    _drawCount: function(){
      count = 'About <strong>' + this.Results.total + '</strong> results.'
      this.$('#results-count').html(count)
    },

    _drawFacets: function(){
      this.$("#catalogue-facets").html('')
      facet_names = Object.keys(this.Results.facets)
      for (var i=0; i<facet_names.length; i++){
        title = facet_names[i]
        facet = this.Results.facets[title]
        m = new Backbone.Model(facet)
        m.title = title

        var view = new FacetView({model: m})
        this.$("#catalogue-facets").append(view.render().el)
      }
    },

    mergeFacet: function(key, value){
      if (_.has(this.queryparams, key))
        delete this.queryparams[key]
      else
        this.queryparams[key] = value
      this.runQuery()
    },

    addOne: function(result) {
      var view = new ResultView({model: result})
      this.$("#catalogue-results").append(view.render().el)
    },

    addAll: function() {
      this.$('#catalogue-results').html('')
      this.Results.each(this.addOne)
    }

  })
  return AppView
})
