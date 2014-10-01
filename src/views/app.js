define([
  'jquery', 'underscore', 'backbone', 'jqcloud', 'bootstrap',
  'collections/results', 'views/results',
  'views/library', 'views/facet', 'text!template/main.html'],
  function($, _, Backbone, jQCloud, Bootstrap,
    ResultsCollection, ResultView,
    LibraryView, FacetView, mainTemplate){

  var AppView = Backbone.View.extend({

    searchType: null,
    host: null,
    el: $("#catalogue-app"),
    mainTemplate: _.template(mainTemplate),

    bise_indexes: {
      documents: 'Documents',
      links: 'Links',
      articles: 'Web Pages'
    },

    all_indexes: {
      documents: 'Documents',
      links: 'Links',
      articles: 'Web Pages',
      species: 'Species',
      habitats: 'Habitat types',
      protected_areas: 'Sites'
    },

    // Structure to query backend
    queryparams: {
      indexes: [],
      query: '',
      page: 1,
      per: 10
    },

    events: {
      "submit #catalogue-search-form"  : "fillQueryAndRun",
      "click #catalogue-sort li a"     : "setSorting",
      "click #catalogue-per-page li a" : "setPerPage",
      "click .pager .p"                : "goPrevPage",
      "click .pager .n"                : "goNextPage"
    },

    initialize: function(options) {
      _.bindAll(this, 'addOne', 'addAll', 'render',
                'mergeFacet', 'removeFacet', 'isFacetSelected')

      // Fix for IE8
      $.support.cors = true;
      this._checkIE();

      // Add main template
      $(this.$el.selector).append(this.mainTemplate)

      // Options
      this.host = options['host']
      if (this.$el.data('type') === 'advanced'){
        this.searchType = 'advanced'
        this.queryparams.indexes = Object.keys(this.all_indexes);
      } else {
        this.searchType = 'bise'
        this.queryparams.indexes = Object.keys(this.bise_indexes);
      }
      this.refreshEndpoint()

      // Get query
      q = this.$el.data('query')
      if (q != 'undefined' && q != '') this.queryparams.query = q

      // If CORS not enabled in IE8, show message to activate it
      if (this._isIE() === 8){
        $('.catalogue-ie-msg').show()
      }
      this.runQuery()
    },


    /*
     * Minor fix to allow Object.keys in IE8
     */
    _checkIE: function(){
      if (!Object.keys) {
        Object.keys = function(obj) {
          var keys = [];
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) keys.push(i);
          }
          return keys;
        };
      }
    },

    /*
     * Returns IE version or false
     */
    _isIE: function() {
      var myNav = navigator.userAgent.toLowerCase();
      return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    },

    /*
     * Returns API endpoint (BISE or Advanced Search)
     */
    _getEndpoint: function(){
      this.url = 'http://'+this.host+'/api/v1/'
      if (this.searchType === 'advanced') this.url += 'search'
      else this.url += 'bise_search'
      return this.url;
    },

    /*
     * Refresh data from endpoint
     */
    refreshEndpoint: function(){
      this.Results = new ResultsCollection(this._getEndpoint())
      this.Results.bind('add', this.addOne)
      this.Results.bind('reset', this.addAll)
      this.Results.bind('all', this.render)
    },

    fillQueryAndRun: function(e){
      console.log(':: fillQueryAndRun...')
      e.preventDefault()
      var q = $('#catalogue-search-form #query').val()
      $('#catalogue-search-form input').val('')
      this.queryparams = {
        indexes: this._getSelectedCategories(),
        query: q.replace(/(<([^>]+)>)/ig,""),
        page: 1, per: 10
      }
      this._drawSearches()
      this.runQuery()
    },

    runQuery: function(){
      this.Results.fetch({ data: $.param(this.queryparams) })
    },

    /***************************************************************************
     * Search Options
     **************************************************************************/

    setSorting: function(e){
      this.queryparams.sort = $('#catalogue-sort select').val()
      this.runQuery()
    },
    setPerPage: function(e){
      this.queryparams.page = 1
      this.queryparams.per = parseInt($(e.target).html());
      this.runQuery()
    },
    goPrevPage: function(e){
      if (this.queryparams.page > 1){
        this.queryparams.page -= 1;
        this.runQuery()
      }
    },
    goNextPage: function(e){
      if (this.queryparams.page < this._getLastPage()){
        this.queryparams.page += 1;
        this.runQuery()
      }
    },


    /*
     * Returns array of selected indexes
     */
    _getSelectedCategories: function(){
      var array = _.map(this.$('#catalogue-categories input:checked'), function (x){
        return $(x).val()
      })
      if (_.isEmpty(array)) array = _.map(this.$('#catalogue-categories input'), function (x){
        return $(x).val()
      })
      return array
    },

    /*
     * Render the pagination with Bootstrap style
     */
    _drawPagination: function(){
      this.$el.find('.catalogue-status').html(this.queryparams.page+'/'+this._getLastPage())

      if (this.queryparams.page == 1) this.$('.p').parent().addClass('disabled')
      else this.$('.p').parent().removeClass('disabled')

      if (this.queryparams.page == this._getLastPage())
        this.$('.n').parent().addClass('disabled')
      else
        this.$('.n').parent().removeClass('disabled')
    },
    _getLastPage: function(){
      var pages = Math.floor(this.Results.total / this.queryparams.per)
      if (this.Results.total % this.queryparams.per > 0)
        pages += 1;
      return pages;
    },

    /*
     * Renders the performed search information
     */
    _drawSearches: function(){
      if (this.queryparams.query != '' && this.queryparams.query != undefined){
        text = 'for <em>' + this.queryparams.query + '</em>'
        this.$('.catalogue-query').html(text)
      } else {
        this.$('.catalogue-query em').html('...')
      }
    },

    /*
     * Renders the number of results
     */
    _drawCount: function(){
      if (this.Results.total == undefined)
        this.$('#results-count').html("No search")
      else
        this.$('#results-count').html('<strong>' + this.Results.total + '</strong> results.')
    },

    /*
     * Renders Library filters
     */
    _drawLibraries: function(){
      if (_.has(this.Results.facets, 'site')){
        facet = this.Results.facets['site']

        this.$('.catalogue-libraries').html('')
        m = new Backbone.Model(facet)
        this.$(".catalogue-libraries").append( $('<ul>') )
        new LibraryView({
          el: this.$('.catalogue-libraries ul'),
          model: m
        }).render()

        // sdlkfjdslkfj
        // var li = $('<li>').append($('<a>').html('All Libraries'))
        // this.$('.catalogue-libraries ul').append(li)
        // for (var i=0; i < facet.terms.length; i++){
        //   var term = facet.terms[i]
        //   var lbl = term.term + ' (' + term.count + ')'
        //   var li = $('<li>').append($('<a>').html(lbl))
        //   this.$('.catalogue-libraries ul').append(li)
        // }

        // this.$('.catalogue-libraries ul > li > a').on('click', $.proxy(this.fillQueryAndRun, this))
      } else {
        console.log(':: no facet for libraries...')
      }
    },

    /*
     * Renders available categories
     */
    _drawCategories: function(){
      this.$("#catalogue-categories").html('');

      var input;
      if (this.searchType === 'advanced'){
        for (var k in this.all_indexes){
          var checked = _.contains(this.queryparams.indexes, k)
          if (this.queryparams.indexes.length == 0) checked = true;
          input = $('<input>').attr({
            type: 'checkbox',
            id:   k,
            name: k,
            value: k,
            checked: checked
          });
          this._addWrappedCategory(input, k)
        }
      } else {
        for (var k in this.bise_indexes){
          var checked = _.contains(this.queryparams.indexes, k)
          if (this.queryparams.indexes.length == 0) checked = true;
          input = $('<input>').attr({
            type: 'checkbox',
            id:   k,
            name: k,
            value: k,
            checked: checked
          })
          this._addWrappedCategory(input, k)
        }
      }
      this.$('#catalogue-categories input').on('change', $.proxy(this.fillQueryAndRun, this))
    },

    _addWrappedCategory: function(input, key){
      var label = $('<label>').append(input).append(this.all_indexes[key])
      this.$("#catalogue-categories").append(label).append('<br>')
    },

    /*
     * Renders facets on sidebar
     */
    _drawFacets: function(){
      this.$("#catalogue-facets").html('')
      if (this.Results.total > 0){
        facet_names = Object.keys(_.omit(this.Results.facets, 'site'))
        for (var i=0; i < facet_names.length; i++){
          title = facet_names[i]
          facet = this.Results.facets[title]

          if ((typeof(facet.terms) != 'undefined' && facet.terms.length > 0) ||
              (typeof(facet.entries) != 'undefined' && facet.entries.length > 0)){

            m = new Backbone.Model(facet)
            m.title = title

            var n = $('<div>').addClass('catalogue-facet '+title)
            this.$("#catalogue-facets").append(n)
            new FacetView({
              el: this.$('.catalogue-facet.'+title),
              model: m
            }).render()
          }
        }
      }
    },

    /*
     * TODO: Add suggestions for searches
     */
    _drawSuggestions: function(){
      // TODO: Implement suggestions from ElasticSearch
      // if (this.Results.suggestions){
      //   var opts = this.Results.suggestions[1];
      //   if (opts.length > 0){
      //     opts = opts[0]
      //     $('.catalogue-suggestions ul').html('')
      //     for (var i=0; i < opts.options.length; i++){
      //       var suggestion = opts.options[i];
      //       var li = $('<li>').html(suggestion.text + ' with '+suggestion.score+'score')
      //       $('.catalogue-suggestions').append(li)
      //     }
      //   }
      // }
    },


    /*
     * Show / Hide different sections when results found or not.
     */
    _showResults: function(){
      this.$('.catalogue-container').show()
      this.$('.catalogue-no-results').hide()
      this.$('.catalogue-statistics').hide()
      this.$('.catalogue-available-content').hide()
      this.$('.catalogue-libraries').show()
      this.$('.catalogue-navigation-bar').show()

      this._drawPagination()
    },
    _showNoResults: function(){
      this.$('.catalogue-container').hide()
      this.$('.catalogue-no-results').show()
      this.$('.catalogue-statistics').show()
      this.$('.catalogue-available-content').show()
      this.$('.catalogue-libraries').hide()
      this.$('.catalogue-navigation-bar').hide()
      this._renderStatistics()
    },


    /*
     * Renders statistics if no results found...
     */
    _renderStatistics: function(){
      $.get("http://"+this.host+"/api/v1/stats.json", function( data ) {
        // Show cloud tags
        if (!$('.catalogue-cloud-tags').hasClass('jqcloud')){
          $('.catalogue-cloud-tags').jQCloud(data.tags);
        }

        // Render last added content
        _.each(data.last, function(item){
          var cell = $('<li>').addClass('catalogue-cell')
          var link = $('<a>').attr('href', item.link).html(item.title)
          cell.append($('<div>').addClass('cell-title').append(link))

          var subtitle = $('<div>').addClass('cell-subtitle')
          subtitle.append($('<strong>').html(item.type))
          subtitle.append('&nbsp;').append(item.published_on)
          cell.append(subtitle)
          $('.catalogue-last-added').append(cell)
        });

        // Render count of iterms in the catalogue
        _.each(data.counts, function(count, item){
          $('.catalogue-available-content .span2.'+item+' > h1').html(count)
        });
      });
    },

    /***************************************************************************
     * FACETS
     **************************************************************************/

    mergeFacet: function(key, value){
      this.queryparams[key] = value
      this.queryparams['page'] = 1
      this.runQuery()
    },
    removeFacet: function(key) {
      delete this.queryparams[key];
      this.queryparams['page'] = 1
      this.runQuery()
    },
    containsFacetKey: function(key){
      if (_.has(this.queryparams, key)) return true
      return false
    },
    isFacetSelected: function(key, value){
      // If no value passed, will check if exist on queryparams
      if (value === undefined && !this.queryparams.hasOwnProperty(key))
        return true
      // Checks if key present and contains value
      if (_.has(this.queryparams, key))
        if (this.queryparams[key] == value)
          return true
      return false
    },

    /*
     * Backbone Render method
     */
    render: function() {
      this._drawSearches();
      this._drawCount();
      this._drawLibraries();
      this._drawCategories();
      this._drawFacets();
      this._drawSuggestions();
      if (this.Results.total == 0) this._showNoResults(); else this._showResults();
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
