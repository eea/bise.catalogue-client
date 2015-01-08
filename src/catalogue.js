/*******************************************
 * BISE Catalogue - http://eea.europa.eu
 * a: Jon Arrien Fernandez
 * m: jonarrien@gmail.com
 * t: @jonarrien
 *******************************************/

require.config({
    // optimizeAllPluginResources: true,
    config: {
        'text': {
            useXhr: function (url, protocol, hostname, port) {
                return true
            }
        }
    },
    paths: {
        text       : 'lib/require/text',
        jquery     : 'lib/jquery/jquery-min',
        underscore : 'lib/underscore/underscore',
        backbone   : 'lib/backbone/backbone',
        jqcloud    : 'lib/jquery/jqcloud-min',
        bootstrap  : 'lib/bootstrap/bootstrap'
    },
    shim: {
        'text': {
            exports : 'text'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'jqcloud': {
            deps: ['jquery']
        }
    },
    tpl: {
        extension: '.html'
    }
});

require(['views/app'], function(AppView){
    window.Catalogue = new AppView({
        host: 'catalogue.biodiversity.europa.eu'
        // host: 'termite.eea.europa.eu'
        // host: 'bise.catalogue.dev'
    })
});
