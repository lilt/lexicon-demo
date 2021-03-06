function searchLexicon(query) {
  var links = [];
  async.waterfall([
    function(callback) {
      $.getJSON('http://beta.lilt.com/translate/lexicon', {
        query: query,
        source: 'en',
        target: 'es'
      }, function(response) {
        if (response.translations.length <= 0) return callback("No results");
        _.each(response.translations, function(translation) {
          if (translation.frequency > 0) {
            links.push({ source: query, score: translation.frequency*translation.frequency, target: translation.target });
          }
        });
        callback(null, _.pluck(response.translations, 'target'));
      });
    },
    function(queries, callback) {
      async.map(queries, function(q, callback) {
        $.getJSON('http://beta.lilt.com/translate/lexicon', {
          query: q,
          source: 'es',
          target: 'en'
        }, function(response) {
          if (response.translations.length > 0) {
            _.each(response.translations, function(translation) {
              if (translation.target !== query && translation.frequency > 0) {
                links.push({ target: q, score: translation.frequency*translation.frequency, source: translation.target });
              }
            });
          }
          callback(null);
        });
      }, callback);
    }
  ], function(err) {
    if (links.length > 0) {
      drawChart(links)
    }
  });
}

function drawChart(links) {
  var data = _.map(links, function(link) {
    return [link.source, link.target, link.score];
  });
  var table = new google.visualization.DataTable();
  table.addColumn('string', 'From');
  table.addColumn('string', 'To');
  table.addColumn('number', 'Weight');
  table.addRows(data);
  var options = {
    height: 600,
    width: 600,
    sankey: {
      link: {
        color: {
          fill: '#f2b50f'
        }
      },
      node: {
        label: {
          fontFamily: 'Helvetica',
          fontSize: 14
        }
      }
    }
  };
  var chart = new google.visualization.Sankey($('.result-container').get(0));
  chart.draw(table, options);
}


$(document).ready(function() {
  $('#search').autocomplete({
    source: [
      'comet',
      'dojo',
      'galaxy',
      'map',
      'master',
      'meteor'
    ],
    select: function(event, ui) {
      searchLexicon(ui.item.value);
    }
  });
});
