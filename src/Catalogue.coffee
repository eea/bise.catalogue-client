###
    BISE Catalogue - http://eea.europa.eu
    a: Jon Arrien Fernandez
    m: jarrien@bilbomatica.com
    t: @jonarrien
###

@Catalogue = Catalogue = {}

Catalogue.VERSION = "0.1"
Catalogue.Config or (Catalogue.Config = {})

Catalogue.Node or (Catalogue.Node = {})

Catalogue.Node.Areas = '.catalogue-toolbar select'
Catalogue.Node.Search = '.catalogue-toolbar input'
Catalogue.Node.SearchButton = '.catalogue-toolbar button'
Catalogue.Node.Queries = '.catalogue-queries'
Catalogue.Node.Facets = '.catalogue-facets'

Catalogue.Node.Content = '.catalogue-content'
Catalogue.Node.Results = '.catalogue-content .catalogue-results'
Catalogue.Node.Pagination = '.catalogue-content .pagination'


