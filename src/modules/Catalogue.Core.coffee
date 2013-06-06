###
    BISE Catalogue - http://eea.europa.eu
    a: Jon Arrien Fernandez
    m: jarrien@bilbomatica.com
    t: @jonarrien
###

Catalogue.Core = do(c = Catalogue, $$ = jQuery) ->
    console.log ':: Core'

    AREAS = [
        'All the Catalogue', 'Articles', 'Documents', 'News', 'Links',
        'Sites', 'Habitats', 'Species'
    ]

    # ---------- RENDER UI LAYOUTS

    init = () ->
        do drawToolbar
        do drawContainer

    # ---------- CONNECTION

    connection = ->
        'http://' + c.Config.host + '/api/v1/search'

    # ---------- TOOLBAR (AREAS & SEARCH FORM)

    drawToolbar = () ->
        toolbar = $$('<div>').addClass('catalogue-toolbar')
        area_wrapper = $$('<div>').addClass('areas')
        area_select = $$('<select>')
        for area, i in AREAS
            area_select.append $$('<option>').html AREAS[i]
        toolbar.append area_wrapper.append area_select
        form =  '<form class="form-search"><input id="query" name="query" ' +
                'type="text" class="input-medium search-query">' +
                '<button type="submit" class="btn">Search</button></form>'
        toolbar.append form
        $(c.Config.node).append toolbar
        $$('.catalogue-toolbar form').on 'submit', (e) ->
            do e.preventDefault
            c.Search.addQuery $$('.catalogue-toolbar input').val().toString()
            $$('.catalogue-toolbar input').val('')


    # ---------- CONTAINER (SIDEBAR & CONTENT)

    drawContainer = () ->
        container = $$('<div>').addClass('catalogue-container')

        sidebar = $$('<div>').addClass('catalogue-sidebar span3')
        sidebar.append $$('<div>').addClass('catalogue-queries')
        sidebar.append $$('<div>').addClass('catalogue-facets');

        content = $$('<div>').addClass('catalogue-content span9')
        content.append $$('<ul>').addClass('catalogue-results')
        content.append $$('<div>').addClass('pagination')

        container.append(sidebar).append(content)
        $(c.Config.node).append container

    showQueriesPane = (b) ->
        if b
            do $(c.Node.Queries).show
        else
            do $(c.Node.Queries).hide

    showFacetsPane = (b) ->
        if b
            do $(c.Node.Facets).show
        else
            do $(c.Node.Facets).hide

    hideSidebar = () ->
        do $(c.Node.Queries).fade
        do $(c.Node.Facets).fade

    # clearResults = () ->
    #     $$('.catalogue-content .catalogue-results').html('')

    # ---------- RENDER RESOURCES

    renderAll = (resources) ->
        $$(c.Node.Results).html ''
        for r in resources
            $$(c.Node.Results).append render r

    render = (resource) ->
        switch resource._type
            when 'article'
                t = '<div class="article_cell">' +
                    '<div class="cell-title"><a href="{{url}}">{{title}}</a></div>' +
                    '<small><strong>By:</strong>{{author}}</small></div>'
                v = { title: resource.title, url: '#', author: resource.author }
                $$('<li>').append Catalogue.Core.tmpl(t)(v)
            when 'document'
                t = '<div class="document_cell">' +
                    '<div class="pull-left mini-icon"></div>' +
                    '<div class="cell-title"><a href="{{url}}">{{title}}</a></div>' +
                    '<small><strong>By:</strong>{{author}}</small></div>'
                v = { title: resource.title, url: '#', author: resource.author }
                $$('<li>').append Catalogue.Core.tmpl(t)(v)
            when 'new'
                t = ''
            when 'link'
                t = ''
            when 'protected_area'
                t = ''
            when 'habitats'
                t = ''
            when 'species'
                # renderSpecies resource
                t = '<div class="species_cell">' +
                    '<div class="cell-title"><a href="http://eunis.eea.europa.eu/species/{{url}}">{{name}}</a></div>' +
                    '<small><strong>Authorship:</strong>{{authorship}}</div>'
                v = {
                        name: resource.binomial_name,
                        url: resource.id,
                        author: resource.author
                    }
                $$('<li>').append Catalogue.Core.tmpl(t)(v)





    tmpl = (template, vars) ->
        get = (path, i) ->
            i = 1
            path = path.replace(/\.\.\//g, ->
              i++
              ""
            )
            js = ["vars[vars.length - ", i, "]"]
            keys = ((if path is "." then [] else path.split(".")))
            j = 0
            j
            while j < keys.length
              js.push "." + keys[j]
              j++
            js.join ""
        tag = (template) ->
            template.replace /\{\{(!|&|\{)?\s*(.*?)\s*}}+/g, (match, operator, context) ->
                return ""  if operator is "!"
                i = inc++
                ["\"; var o", i, " = ", get(context), ", s", i, " = (((typeof(o", i, ") == \"function\" ? o", i, ".call(vars[vars.length - 1]) : o", i, ") || \"\") + \"\"); s += ", ((if operator then ("s" + i) else "(/[&\"><]/.test(s" + i + ") ? s" + i + ".replace(/&/g,\"&amp;\").replace(/\"/g,\"&quot;\").replace(/>/g,\"&gt;\").replace(/</g,\"&lt;\") : s" + i + ")")), " + \""].join ""
        block = (template) ->
            tag template.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g, (match, operator, key, context) ->
                i = inc++
                ["\"; var o", i, " = ", get(key), "; ", ((if operator is "^" then ["if ((o", i, " instanceof Array) ? !o", i, ".length : !o", i, ") { s += \"", block(context), "\"; } "] else ["if (typeof(o", i, ") == \"boolean\" && o", i, ") { s += \"", block(context), "\"; } else if (o", i, ") { for (var i", i, " = 0; i", i, " < o", i, ".length; i", i, "++) { vars.push(o", i, "[i", i, "]); s += \"", block(context), "\"; vars.pop(); }}"])).join(""), "; s += \""].join ""
            )
        inc = 0
        new Function("vars", "vars = [vars], s = \"" + block(template.replace(/"/g, "\\\"").replace(/\n/g, "\\n")) + "\"; return s;")

    # -------------------------------------------------------------------------

    init: init
    connection: connection
    tmpl: tmpl

    render: render
    renderAll: renderAll

    showQueriesPane: showQueriesPane
    showFacetsPane: showFacetsPane
    hideSidebar: hideSidebar
    # clearResults: clearResults
