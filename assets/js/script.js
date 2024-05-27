const ticker_list = ["AAPL","MSFT","TSLA","NVDA"];

$( function() {
    $( "#search-ticker" ).autocomplete({
      source: ticker_list
    });
  } );