var vyperAreaNonUI5 = document.getElementById('vyperNonUI5Area');

var nonUi5VyperEditor = CodeMirror(function(elt) {
    vyperAreaNonUI5.parentNode.replaceChild(elt, vyperAreaNonUI5);
    }, {
    value: "",
    extraKeys: {"Ctrl-Space": "autocomplete"},
    mode: {name: "javascript", json: true, globalVars: true},
    lineNumbers: true,
    matchBrackets: true,
    theme: "erlang-dark",
    autoCloseBrackets: true
});
//vyperEditor.setOption("theme", "erlang-dark");