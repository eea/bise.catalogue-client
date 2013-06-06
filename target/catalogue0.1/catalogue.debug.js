/*
EEA Catalogue - http://eea.europa.eu
a: Jon Arrien Fernandez
m: jarrien@bilbomatica.com
t: @jonarrien
*/


(function() {
  var Catalogue;

  this.Catalogue = Catalogue = {};

  Catalogue.VERSION = "0.1";

  Catalogue.Config || (Catalogue.Config = {});

  Catalogue.Node || (Catalogue.Node = {});

  Catalogue.Node.Areas = '.catalogue-toolbar select';

  Catalogue.Node.Search = '.catalogue-toolbar input';

  Catalogue.Node.SearchButton = '.catalogue-toolbar button';

  Catalogue.Node.Queries = '.catalogue-queries';

  Catalogue.Node.Facets = '.catalogue-facets';

  Catalogue.Node.Content = '.catalogue-content';

  Catalogue.Node.Results = '.catalogue-content .catalogue-results';

  Catalogue.Node.Pagination = '.catalogue-content .pagination';

}).call(this);

(function() {
  Catalogue.Core = (function(c, $$) {
    var AREAS, connection, drawContainer, drawToolbar, hideSidebar, init, render, renderAll, showFacetsPane, showQueriesPane, tmpl;

    console.log(':: Core');
    AREAS = ['All the Catalogue', 'Articles', 'Documents', 'News', 'Links', 'Sites', 'Habitats', 'Species'];
    init = function() {
      drawToolbar();
      return drawContainer();
    };
    connection = function() {
      return 'http://' + c.Config.host + '/api/v1/search';
    };
    drawToolbar = function() {
      var area, area_select, area_wrapper, form, i, toolbar, _i, _len;

      toolbar = $$('<div>').addClass('catalogue-toolbar');
      area_wrapper = $$('<div>').addClass('areas');
      area_select = $$('<select>');
      for (i = _i = 0, _len = AREAS.length; _i < _len; i = ++_i) {
        area = AREAS[i];
        area_select.append($$('<option>').html(AREAS[i]));
      }
      toolbar.append(area_wrapper.append(area_select));
      form = '<form class="form-search"><input id="query" name="query" ' + 'type="text" class="input-medium search-query">' + '<button type="submit" class="btn">Search</button></form>';
      toolbar.append(form);
      $(c.Config.node).append(toolbar);
      return $$('.catalogue-toolbar form').on('submit', function(e) {
        e.preventDefault();
        c.Search.addQuery($$('.catalogue-toolbar input').val().toString());
        return $$('.catalogue-toolbar input').val('');
      });
    };
    drawContainer = function() {
      var container, content, sidebar;

      container = $$('<div>').addClass('catalogue-container');
      sidebar = $$('<div>').addClass('catalogue-sidebar span3');
      sidebar.append($$('<div>').addClass('catalogue-queries'));
      sidebar.append($$('<div>').addClass('catalogue-facets'));
      content = $$('<div>').addClass('catalogue-content span9');
      content.append($$('<ul>').addClass('catalogue-results'));
      content.append($$('<div>').addClass('pagination'));
      container.append(sidebar).append(content);
      return $(c.Config.node).append(container);
    };
    showQueriesPane = function(b) {
      if (b) {
        return $(c.Node.Queries).show();
      } else {
        return $(c.Node.Queries).hide();
      }
    };
    showFacetsPane = function(b) {
      if (b) {
        return $(c.Node.Facets).show();
      } else {
        return $(c.Node.Facets).hide();
      }
    };
    hideSidebar = function() {
      $(c.Node.Queries).fade();
      return $(c.Node.Facets).fade();
    };
    renderAll = function(resources) {
      var r, _i, _len, _results;

      $$(c.Node.Results).html('');
      _results = [];
      for (_i = 0, _len = resources.length; _i < _len; _i++) {
        r = resources[_i];
        _results.push($$(c.Node.Results).append(render(r)));
      }
      return _results;
    };
    render = function(resource) {
      var t, v;

      switch (resource._type) {
        case 'article':
          t = '<div class="article_cell">' + '<div class="cell-title"><a href="{{url}}">{{title}}</a></div>' + '<small><strong>By:</strong>{{author}}</small></div>';
          v = {
            title: resource.title,
            url: '#',
            author: resource.author
          };
          return $$('<li>').append(Catalogue.Core.tmpl(t)(v));
        case 'document':
          t = '<div class="document_cell">' + '<div class="pull-left mini-icon"></div>' + '<div class="cell-title"><a href="{{url}}">{{title}}</a></div>' + '<small><strong>By:</strong>{{author}}</small></div>';
          v = {
            title: resource.title,
            url: '#',
            author: resource.author
          };
          return $$('<li>').append(Catalogue.Core.tmpl(t)(v));
        case 'new':
          return t = '';
        case 'link':
          return t = '';
        case 'protected_area':
          return t = '';
        case 'habitats':
          return t = '';
        case 'species':
          t = '<div class="species_cell">' + '<div class="cell-title"><a href="http://eunis.eea.europa.eu/species/{{url}}">{{name}}</a></div>' + '<small><strong>Authorship:</strong>{{authorship}}</div>';
          v = {
            name: resource.binomial_name,
            url: resource.id,
            author: resource.author
          };
          return $$('<li>').append(Catalogue.Core.tmpl(t)(v));
      }
    };
    tmpl = function(template, vars) {
      var block, get, inc, tag;

      get = function(path, i) {
        var j, js, keys;

        i = 1;
        path = path.replace(/\.\.\//g, function() {
          i++;
          return "";
        });
        js = ["vars[vars.length - ", i, "]"];
        keys = (path === "." ? [] : path.split("."));
        j = 0;
        j;
        while (j < keys.length) {
          js.push("." + keys[j]);
          j++;
        }
        return js.join("");
      };
      tag = function(template) {
        return template.replace(/\{\{(!|&|\{)?\s*(.*?)\s*}}+/g, function(match, operator, context) {
          var i;

          if (operator === "!") {
            return "";
          }
          i = inc++;
          return ["\"; var o", i, " = ", get(context), ", s", i, " = (((typeof(o", i, ") == \"function\" ? o", i, ".call(vars[vars.length - 1]) : o", i, ") || \"\") + \"\"); s += ", (operator ? "s" + i : "(/[&\"><]/.test(s" + i + ") ? s" + i + ".replace(/&/g,\"&amp;\").replace(/\"/g,\"&quot;\").replace(/>/g,\"&gt;\").replace(/</g,\"&lt;\") : s" + i + ")"), " + \""].join("");
        });
      };
      block = function(template) {
        return tag(template.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g, function(match, operator, key, context) {
          var i;

          i = inc++;
          return ["\"; var o", i, " = ", get(key), "; ", (operator === "^" ? ["if ((o", i, " instanceof Array) ? !o", i, ".length : !o", i, ") { s += \"", block(context), "\"; } "] : ["if (typeof(o", i, ") == \"boolean\" && o", i, ") { s += \"", block(context), "\"; } else if (o", i, ") { for (var i", i, " = 0; i", i, " < o", i, ".length; i", i, "++) { vars.push(o", i, "[i", i, "]); s += \"", block(context), "\"; vars.pop(); }}"]).join(""), "; s += \""].join("");
        }));
      };
      inc = 0;
      return new Function("vars", "vars = [vars], s = \"" + block(template.replace(/"/g, "\\\"").replace(/\n/g, "\\n")) + "\"; return s;");
    };
    return {
      init: init,
      connection: connection,
      tmpl: tmpl,
      render: render,
      renderAll: renderAll,
      showQueriesPane: showQueriesPane,
      showFacetsPane: showFacetsPane,
      hideSidebar: hideSidebar
    };
  })(Catalogue, jQuery);

}).call(this);

(function() {
  Catalogue.Facet = (function(cat) {
    return console.log(':: Facet');
  })(Catalogue);

}).call(this);

(function() {
  Catalogue.Search = (function(c, $$) {
    var addQuery, drawFacets, drawPagination, drawQueries, drawResults, goPage, mergeFacet, params, query, removeFacet, removeQuery, _facets, _page, _params, _per, _query, _results, _total;

    _query = null;
    _per = 10;
    _page = 1;
    _total = 0;
    _facets = {};
    _results = [];
    _params = {};
    addQuery = function(q) {
      if (q !== '') {
        _query = q;
        _params = {};
      }
      return query();
    };
    removeQuery = function(q) {
      _query = null;
      $$(c.Node.Queries).html('').hide();
      $$(c.Node.Facets).html('').hide();
      $$(c.Node.Results).html('').hide();
      $$(c.Node.Pagination).hide();
      return query();
    };
    mergeFacet = function(facet, value) {
      if (!_params.hasOwnProperty(facet)) {
        _params[facet] = value;
        _page = 1;
      } else {
        if (_params[facet] === value) {
          delete _params[facet];
        } else {
          _params[facet] = value;
          _page = 1;
        }
      }
      return query();
    };
    removeFacet = function(facet, value) {
      delete _params[facet];
      return query();
    };
    params = function() {
      var keys;

      _params['query'] = _query;
      _params['page'] = _page;
      _params['per'] = _per;
      keys = Object.keys(_facets);
      return _params;
    };
    query = function() {
      if (_query) {
        console.log(params());
        return $.ajax({
          type: 'GET',
          url: c.Core.connection(),
          context: document.body,
          data: params()
        }).done(function(data, textStatus, jqXHR) {
          _total = data.total;
          _facets = data.facets;
          _results = data.results;
          drawQueries();
          drawFacets();
          drawResults();
          return drawPagination();
        }).error(function(data, textStatus, jqXHR) {
          c.Search.total = 0;
          c.Search.facets = {};
          return c.Search.results = [];
        });
      }
    };
    goPage = function(page) {
      return _page = page;
    };
    drawQueries = function() {
      var close, k, keys, li, results, ul, _i, _len;

      $$(c.Node.Queries).html('');
      ul = $$('<ul>');
      li = $$('<li>');
      close = $$('<span>').addClass('close').html('&#10006;');
      close.attr("data-query", _query);
      close.click(function() {
        removeQuery($$(this).data('query'));
        return $$(this).parent().remove();
      });
      li.append(close).append(_query);
      ul.append(li);
      keys = Object.keys(_facets);
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        if (_params[k]) {
          li = $$('<li>').html(k + ': ' + _params[k]);
          close = $$('<span>').addClass('close').html('&#10006;');
          close.attr("data-facet", k).attr("data-value", _params[k]);
          close.click(function() {
            removeFacet($$(this).data('facet'), $$(this).data('value'));
            return $$(this).parent().remove();
          });
          li.append(close);
          ul.append(li);
        }
      }
      $$(c.Node.Queries).append(ul);
      results = $$('<small>').html('About ' + _total + ' results');
      $$(c.Node.Queries).append(results);
      return $$(c.Node.Queries).show();
    };
    drawFacets = function() {
      var a, f, facet_container, k, keys, t, title, ul, _i, _j, _len, _len1, _ref;

      keys = Object.keys(_facets);
      $$(c.Node.Facets).html('');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        if (!_params[k]) {
          facet_container = $$('<div>');
          f = _facets[k];
          title = k.toUpperCase();
          if (f['terms'] && f['terms'].length > 0) {
            facet_container.append($$('<legend>').html(title));
            ul = $$('<ul>');
            _ref = f['terms'];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              t = _ref[_j];
              a = $$('<a href="#">').html(t.term);
              a.attr("data-facet", k).attr("data-value", t.term);
              a.click(function() {
                return mergeFacet($(this).data('facet'), $(this).data('value'));
              });
              ul.append($$('<li>').append(a));
            }
            facet_container.append(ul);
          }
          $$(c.Node.Facets).append(facet_container);
        }
      }
      return $$(c.Node.Facets).show();
    };
    drawResults = function() {
      Catalogue.Core.renderAll(_results);
      return $$(c.Node.Results).show();
    };
    drawPagination = function() {
      var pages_count;

      $(c.Node.Pagination).pagination('destroy');
      pages_count = Math.ceil(_total / _per);
      return $$(c.Node.Pagination).pagination({
        items: _total,
        itemsOnPage: _per,
        currentPage: _page,
        cssStyle: 'compact-theme'
      });
    };
    return {
      addQuery: addQuery,
      removeQuery: removeQuery,
      query: query,
      goPage: goPage
    };
  })(Catalogue, jQuery);

}).call(this);

/*
simplePagination.js v1.5
A simple jQuery pagination plugin.
http://flaviusmatis.github.com/simplePagination.js/

Copyright 2012, Flavius Matis
Modified by Jon Arrien 2013
Released under the MIT license.
http://flaviusmatis.github.com/license.html
*/


(function() {
  (function($) {
    var methods;

    methods = {
      init: function(options) {
        var o, self;

        o = $.extend({
          items: 1,
          itemsOnPage: 1,
          pages: 0,
          displayedPages: 5,
          edges: 2,
          currentPage: 1,
          hrefTextPrefix: "#page-",
          hrefTextSuffix: "",
          prevText: "Prev",
          nextText: "Next",
          ellipseText: "&hellip;",
          cssStyle: "light-theme",
          selectOnClick: true,
          onPageClick: function(pageNumber, event) {
            console.log(pageNumber);
            Catalogue.Search.goPage(pageNumber);
            return Catalogue.Search.query();
          },
          onInit: function() {}
        }, options || {});
        self = this;
        o.pages = (o.pages ? o.pages : (Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1));
        o.currentPage = o.currentPage - 1;
        o.halfDisplayed = o.displayedPages / 2;
        this.each(function() {
          self.addClass(o.cssStyle + " simple-pagination").data("pagination", o);
          return methods._draw.call(self);
        });
        o.onInit();
        return this;
      },
      selectPage: function(page) {
        methods._selectPage.call(this, page - 1);
        return this;
      },
      prevPage: function() {
        var o;

        o = this.data("pagination");
        if (o.currentPage > 0) {
          methods._selectPage.call(this, o.currentPage - 1);
        }
        return this;
      },
      nextPage: function() {
        var o;

        o = this.data("pagination");
        if (o.currentPage < o.pages - 1) {
          methods._selectPage.call(this, o.currentPage + 1);
        }
        return this;
      },
      getPagesCount: function() {
        return this.data("pagination").pages;
      },
      getCurrentPage: function() {
        return this.data("pagination").currentPage + 1;
      },
      destroy: function() {
        this.empty();
        return this;
      },
      redraw: function() {
        methods._draw.call(this);
        return this;
      },
      disable: function() {
        var o;

        o = this.data("pagination");
        o.disabled = true;
        this.data("pagination", o);
        methods._draw.call(this);
        return this;
      },
      enable: function() {
        var o;

        o = this.data("pagination");
        o.disabled = false;
        this.data("pagination", o);
        methods._draw.call(this);
        return this;
      },
      _draw: function() {
        var $panel, begin, end, i, interval, o;

        o = this.data("pagination");
        interval = methods._getInterval(o);
        i = void 0;
        methods.destroy.call(this);
        $panel = (this.prop("tagName") === "UL" ? this : $("<ul></ul>").appendTo(this));
        if (o.prevText) {
          methods._appendItem.call(this, o.currentPage - 1, {
            text: o.prevText,
            classes: "prev"
          });
        }
        if (interval.start > 0 && o.edges > 0) {
          end = Math.min(o.edges, interval.start);
          i = 0;
          while (i < end) {
            methods._appendItem.call(this, i);
            i++;
          }
          if (o.edges < interval.start && (interval.start - o.edges !== 1)) {
            $panel.append("<li class=\"disabled\"><span class=\"ellipse\">" + o.ellipseText + "</span></li>");
          } else {
            if (interval.start - o.edges === 1) {
              methods._appendItem.call(this, o.edges);
            }
          }
        }
        i = interval.start;
        while (i < interval.end) {
          methods._appendItem.call(this, i);
          i++;
        }
        if (interval.end < o.pages && o.edges > 0) {
          if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end !== 1)) {
            $panel.append("<li class=\"disabled\"><span class=\"ellipse\">" + o.ellipseText + "</span></li>");
          } else {
            if (o.pages - o.edges - interval.end === 1) {
              methods._appendItem.call(this, interval.end++);
            }
          }
          begin = Math.max(o.pages - o.edges, interval.end);
          i = begin;
          while (i < o.pages) {
            methods._appendItem.call(this, i);
            i++;
          }
        }
        if (o.nextText) {
          return methods._appendItem.call(this, o.currentPage + 1, {
            text: o.nextText,
            classes: "next"
          });
        }
      },
      _getInterval: function(o) {
        return {
          start: Math.ceil((o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, o.pages - o.displayedPages), 0) : 0)),
          end: Math.ceil((o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages)))
        };
      },
      _appendItem: function(pageIndex, opts) {
        var $link, $linkWrapper, $ul, o, options, self;

        self = this;
        options = void 0;
        $link = void 0;
        o = self.data("pagination");
        $linkWrapper = $("<li></li>");
        $ul = self.find("ul");
        pageIndex = (pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1));
        options = $.extend({
          text: pageIndex + 1,
          classes: ""
        }, opts || {});
        if (pageIndex === o.currentPage || o.disabled) {
          if (o.disabled) {
            $linkWrapper.addClass("disabled");
          } else {
            $linkWrapper.addClass("active");
          }
          $link = $("<span class=\"current\">" + options.text + "</span>");
        } else {
          $link = $("<a href=\"" + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + "\" class=\"page-link\">" + options.text + "</a>");
          $link.click(function(event) {
            return methods._selectPage.call(self, pageIndex, event);
          });
        }
        if (options.classes) {
          $link.addClass(options.classes);
        }
        $linkWrapper.append($link);
        if ($ul.length) {
          return $ul.append($linkWrapper);
        } else {
          return self.append($linkWrapper);
        }
      },
      _selectPage: function(pageIndex, event) {
        var o;

        o = this.data("pagination");
        o.currentPage = pageIndex;
        if (o.selectOnClick) {
          methods._draw.call(this);
        }
        return o.onPageClick(pageIndex + 1, event);
      }
    };
    return $.fn.pagination = function(method) {
      if (methods[method] && method.charAt(0) !== "_") {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.pagination");
      }
    };
  })(jQuery);

}).call(this);

(function() {
  Catalogue.init = function(config) {
    Catalogue.Config = config;
    return Catalogue.Core.init();
  };

}).call(this);
