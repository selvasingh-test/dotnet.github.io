require.config({
    paths: {
        "jquery": "http://code.jquery.com/jquery-2.1.1.min",
        "marked": "http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min",
        "typeahead" : "http://twitter.github.io/typeahead.js/releases/latest/typeahead.bundle"
    },
    shim: {
        "typeahead" : ["jquery"]
    }
});