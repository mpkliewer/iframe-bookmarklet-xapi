// this js should be loaded in your iframe to communicate with the bookmarklet

// this is the interface for the parent window
// and the bookmarklet

$(function() {

    // when client sends message
    window.addEventListener('message', function(e) {

        var data = e.data;

        // it's trying to trigger
        // an arbitrary custom event
        if(!!data && data.event) {
            $('body').trigger(data.event, data.args);
        }

    }, false);

});

// example close button, which can communicate back with the bookmarklet code
$(function() {

    $('a.ui-close').click(function(e) {
        $(this).trigger('post-message', [{
            event: 'unload-bookmarklet'
        }]);
        e.preventDefault();
    });

});

$('body')
    .live('post-message', function(e, d) {
        window.parent.postMessage(d, '*');
    });