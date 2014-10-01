define(['underscore', 'backbone'], function(_, Backbone) {

  var LibraryModel = Backbone.Model.extend({
    defaults: {
      _type: "terms",
      missing: 0,
      other: 0,
      terms: [],
      total: 0
    },

    initialize: function() {

    }
  });

  return LibraryModel;
});
