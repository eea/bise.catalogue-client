###
simplePagination.js v1.5
A simple jQuery pagination plugin.
http://flaviusmatis.github.com/simplePagination.js/

Copyright 2012, Flavius Matis
Modified by Jon Arrien 2013
Released under the MIT license.
http://flaviusmatis.github.com/license.html
###

(($) ->
    methods =
        init: (options) ->
            o = $.extend(
                items: 1
                itemsOnPage: 1
                pages: 0
                displayedPages: 5
                edges: 2
                currentPage: 1
                hrefTextPrefix: "#page-"
                hrefTextSuffix: ""
                prevText: "Prev"
                nextText: "Next"
                ellipseText: "&hellip;"
                cssStyle: "light-theme"
                selectOnClick: true
                onPageClick: (pageNumber, event) ->
                    # Callback triggered when a page is clicked
                    # Page number is given as an optional parameter
                    # console.log ':: clicked on page'
                    console.log pageNumber
                    # console.log event
                    Catalogue.Search.goPage pageNumber
                    do Catalogue.Search.query

                onInit: ->
                    # Callback triggered immediately after initialization
            , options or {})
            self = this
            o.pages = (if o.pages then o.pages else (if Math.ceil(o.items / o.itemsOnPage) then Math.ceil(o.items / o.itemsOnPage) else 1))
            o.currentPage = o.currentPage - 1
            o.halfDisplayed = o.displayedPages / 2
            @each ->
                self.addClass(o.cssStyle + " simple-pagination").data "pagination", o
                methods._draw.call self
            o.onInit()
            this

        selectPage: (page) ->
            methods._selectPage.call this, page - 1
            this

        prevPage: ->
            o = @data("pagination")
            methods._selectPage.call this, o.currentPage - 1  if o.currentPage > 0
            this

        nextPage: ->
            o = @data("pagination")
            methods._selectPage.call this, o.currentPage + 1  if o.currentPage < o.pages - 1
            this

        getPagesCount: ->
            @data("pagination").pages

        getCurrentPage: ->
            @data("pagination").currentPage + 1

        destroy: ->
            @empty()
            this

        redraw: ->
            methods._draw.call this
            this

        disable: ->
            o = @data("pagination")
            o.disabled = true
            @data "pagination", o
            methods._draw.call this
            this

        enable: ->
            o = @data("pagination")
            o.disabled = false
            @data "pagination", o
            methods._draw.call this
            this

        _draw: ->
            o = @data("pagination")
            interval = methods._getInterval(o)
            i = undefined
            methods.destroy.call this
            $panel = (if @prop("tagName") is "UL" then this else $("<ul></ul>").appendTo(this))

            # Generate Prev link
            if o.prevText
                methods._appendItem.call this, o.currentPage - 1,
                    text: o.prevText
                    classes: "prev"


            # Generate start edges
            if interval.start > 0 and o.edges > 0
                end = Math.min(o.edges, interval.start)
                i = 0
                while i < end
                    methods._appendItem.call this, i
                    i++
                if o.edges < interval.start and (interval.start - o.edges isnt 1)
                    $panel.append "<li class=\"disabled\"><span class=\"ellipse\">" + o.ellipseText + "</span></li>"
                else methods._appendItem.call this, o.edges  if interval.start - o.edges is 1

            # Generate interval links
            i = interval.start
            while i < interval.end
                methods._appendItem.call this, i
                i++

            # Generate end edges
            if interval.end < o.pages and o.edges > 0
                if o.pages - o.edges > interval.end and (o.pages - o.edges - interval.end isnt 1)
                    $panel.append "<li class=\"disabled\"><span class=\"ellipse\">" + o.ellipseText + "</span></li>"
                else methods._appendItem.call this, interval.end++  if o.pages - o.edges - interval.end is 1
                begin = Math.max(o.pages - o.edges, interval.end)
                i = begin
                while i < o.pages
                    methods._appendItem.call this, i
                    i++

            # Generate Next link
            if o.nextText
                methods._appendItem.call this, o.currentPage + 1,
                    text: o.nextText
                    classes: "next"


        _getInterval: (o) ->
            start: Math.ceil((if o.currentPage > o.halfDisplayed then Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) else 0))
            end: Math.ceil((if o.currentPage > o.halfDisplayed then Math.min(o.currentPage + o.halfDisplayed, o.pages) else Math.min(o.displayedPages, o.pages)))

        _appendItem: (pageIndex, opts) ->
            self = this
            options = undefined
            $link = undefined
            o = self.data("pagination")
            $linkWrapper = $("<li></li>")
            $ul = self.find("ul")
            pageIndex = (if pageIndex < 0 then 0 else ((if pageIndex < o.pages then pageIndex else o.pages - 1)))
            options = $.extend(
                text: pageIndex + 1
                classes: ""
            , opts or {})
            if pageIndex is o.currentPage or o.disabled
                if o.disabled
                    $linkWrapper.addClass "disabled"
                else
                    $linkWrapper.addClass "active"
                $link = $("<span class=\"current\">" + (options.text) + "</span>")
            else
                $link = $("<a href=\"" + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + "\" class=\"page-link\">" + (options.text) + "</a>")
                $link.click (event) ->
                    methods._selectPage.call self, pageIndex, event
            $link.addClass options.classes  if options.classes
            $linkWrapper.append $link
            if $ul.length
                $ul.append $linkWrapper
            else
                self.append $linkWrapper

        _selectPage: (pageIndex, event) ->
            o = @data("pagination")
            o.currentPage = pageIndex
            methods._draw.call this  if o.selectOnClick
            o.onPageClick pageIndex + 1, event

    $.fn.pagination = (method) ->
        # Method calling logic
        if methods[method] and method.charAt(0) isnt "_"
            methods[method].apply this, Array::slice.call(arguments, 1)
        else if typeof method is "object" or not method
            methods.init.apply this, arguments
        else
            $.error "Method " + method + " does not exist on jQuery.pagination"
) jQuery
