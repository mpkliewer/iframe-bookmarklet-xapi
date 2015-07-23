javascript:(function() {

    if(!window.your_bookmarklet) {

        var doc = document,
            js = doc.createElement('script');

        js.type = 'text/javascript';
        js.src = 'loader.js';
        js.async = true;

        doc.getElementsByTagName('head')[0].appendChild(js);

    }

})();