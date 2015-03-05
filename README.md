# Lexicon Demo

To try simply open up index.html in any browser. Without a live server, only the query 'master' will generate a graph.


### Live Server

The demo is currently using stub data stored in stub.js. It overwrites $.getJSON to return predefined data rather than fetching from a server.

To try with the live lexicon remove stub.js from index.html and disable CORS. This can either be done with a browser extension or running a server that serves index.html with beta.lilt.com as an allowed origin.
