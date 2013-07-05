BISE Catalogue Client
=====================

FURTHER DEVELOPMENT OF THE BIODIVERSITY INFORMATION SYSTEM FOR EUROPE (BISE)

### Description

This library has been developed to allow access, faceted browsing and advanced search to all cataloged and indexed information available at BISE Catalogue.

This library can be easily implemented in less than a minute in any kind of website. It is backend independant. 

It has been developed with AMD (Asynchronous Module Definitions) and client side MVC patterns. 

All the request are done in the background with ajax. No browser refresh while using this advanced search for BISE.

### Used libraries

* RequireJS
* UnderscoreJS
* BackboneJS

### Implementation

Load stylesheets and requireJS with "data-main" attributte pointing to the catalogue:
```
<link rel="stylesheet" href="src/catalogue.css" type="text/css">
<script data-main="src/catalogue" src="http://requirejs.org/docs/release/1.0.1/minified/require.js"></script>
```

Add a node with id "catalogue-app" to render catalogue-client
```
<div id="catalogue-app"></div>
```

### Credits
Created by [@jonarrien](http://twitter.com/jonarrien) (Jon Arrien).
Copyright (c) 2013 by EEA.

