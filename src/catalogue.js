/*******************************************
 * BISE Catalogue - http://eea.europa.eu
 * a: Jon Arrien Fernandez
 * m: jonarrien@gmail.com
 * t: @jonarrien
 *******************************************/

require.config({
    optimizeAllPluginResources: true,
    text: {
        useXhr: function (url, protocol, hostname, port) {
            return true
        }
    },
    paths: {
        jquery     : 'lib/jquery/jquery-min',
        underscore : 'lib/underscore/underscore',
        backbone   : 'lib/backbone/backbone',
        text       : 'lib/require/text'
    }
});

require(['views/app'], function(AppView){
    window.Catalogue = new AppView();
});
