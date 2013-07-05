define(['underscore', 'backbone', 'models/result'], function(_, Backbone, Result){

  var ResultsCollection = Backbone.Collection.extend({

    model: Result,
    url: 'http://194.30.43.115:3000/api/v1/search',

    parse: function(data) {
      this.total = data.total
      this.facets = data.facets

      return data.results;
    }

  })
  return ResultsCollection

});
