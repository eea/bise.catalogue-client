###
    BISE Catalogue - http://eea.europa.eu
    a: Jon Arrien Fernandez
    m: jarrien@bilbomatica.com
    t: @jonarrien
###

Catalogue.Search = do(c = Catalogue, $$ = jQuery) ->

    _query = null
    _per = 10
    _page = 1

    _total = 0

    _facets = {}
    _results = []

    _params = {}


    addQuery = (q) ->
        if q != ''
            _query = q
            _params = {}
        do query

    removeQuery = (q) ->
        _query = null

        do $$(c.Node.Queries).html('').hide
        do $$(c.Node.Facets).html('').hide
        do $$(c.Node.Results).html('').hide
        do $$(c.Node.Pagination).hide

        do query

    mergeFacet = (facet, value) ->
        if !_params.hasOwnProperty facet
            _params[facet] = value
            _page = 1
        else
            if _params[facet] == value
                delete _params[facet]
            else
                _params[facet] = value
                _page = 1
        do query

    removeFacet = (facet, value) ->
        # if _params.hasOwnProperty facet
        #     if _params[facet] == value
        delete _params[facet]
        do query


    # Generate all the params to query
    params = () ->
        _params['query'] = _query               #_searches.join(' ')
        _params['page']  = _page
        _params['per']   = _per

        keys = Object.keys _facets
        _params


    query = () ->
        if _query
            console.log params()
            $.ajax({
                type: 'GET'
                url: do c.Core.connection
                context: document.body
                data: params()
            }).done( (data, textStatus, jqXHR) ->
                _total = data.total
                _facets = data.facets
                _results = data.results
                do drawQueries
                do drawFacets
                do drawResults
                do drawPagination
            ).error( (data, textStatus, jqXHR) ->
                c.Search.total = 0
                c.Search.facets = {}
                c.Search.results = []
                # do drawPagination
            )

    goPage = (page) ->
        _page = page

    drawQueries = () ->
        $$(c.Node.Queries).html ''
        ul = $$('<ul>')
        li = $$('<li>')
        close = $$('<span>').addClass('close').html('&#10006;')
        close.attr("data-query", _query)
        close.click( () ->
            removeQuery $$(@).data('query')
            $$(@).parent().remove()
        )
        li.append(close).append _query
        ul.append li

        # draw also selected facets
        keys = Object.keys _facets
        for k in keys
            if _params[k]
                li = $$('<li>').html k + ': ' + _params[k]
                close = $$('<span>').addClass('close').html('&#10006;')
                close.attr("data-facet", k).attr("data-value", _params[k])
                close.click( () ->
                    removeFacet $$(@).data('facet'), $$(@).data('value')
                    $$(@).parent().remove()
                )
                li.append close
                ul.append li

        $$(c.Node.Queries).append ul
        results = $$('<small>').html 'About ' + _total + ' results'
        $$(c.Node.Queries).append results
        # c.Core.showQueriesPane true

        do $$(c.Node.Queries).show

    # Only will draw unselected faceted
    drawFacets = () ->
        keys = Object.keys _facets
        $$(c.Node.Facets).html ''
        for k in keys
            if !_params[k]
                facet_container = $$('<div>')

                f = _facets[k]
                title = k.toUpperCase()

                if f['terms'] and f['terms'].length > 0
                    facet_container.append $$('<legend>').html title
                    ul = $$('<ul>')
                    for t in f['terms']
                        a = $$('<a href="#">').html t.term
                        a.attr("data-facet", k).attr("data-value", t.term)
                        a.click ->
                            mergeFacet $(@).data('facet'), $(@).data('value')
                        ul.append $$('<li>').append a
                    facet_container.append ul
                $$(c.Node.Facets).append facet_container

        do $$(c.Node.Facets).show

    drawResults = () ->
        Catalogue.Core.renderAll _results
        do $$(c.Node.Results).show

    drawPagination = () ->
        $(c.Node.Pagination).pagination 'destroy'
        pages_count = Math.ceil _total / _per
        $$(c.Node.Pagination).pagination({
            items: _total
            itemsOnPage: _per
            currentPage: _page
            # cssStyle: 'light-theme'
            cssStyle: 'compact-theme'
        })

    # query: query
    addQuery: addQuery
    removeQuery: removeQuery
    query: query
    goPage: goPage
