var vyperArea = document.getElementById('vyperArea');

var vyperEditor = CodeMirror(function(elt) {
    vyperArea.parentNode.replaceChild(elt, vyperArea);
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