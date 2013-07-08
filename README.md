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

### Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA). All Rights Reserved.

The EEA Catalogue Client (the Original Code) is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

More details under docs/License.txt

