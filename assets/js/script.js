const ticker_list = ["AAPL","MSFT","TSLA","NVDA"];

$( function() {
    $( "#search-ticker" ).autocomplete({
      source: ticker_list
    });
  } );

// Get top news data for stocks
const url = 'https://seeking-alpha.p.rapidapi.com/news/v2/list-by-symbol?id=aapl&size=5&number=1';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'Your API Key',
		'X-RapidAPI-Host': 'seeking-alpha.p.rapidapi.com'
	}
};

fetch(url, options)
.then(function(response) {
	return response.json();
}).then(function(data){
	const newsContainer = document.querySelector('.top-stories-container');
	const dataArr = data.data;
	dataArr.forEach(news => {
		console.log(news);
		const newsparagraph = document.createElement('p');
		newsparagraph.textContent = news.attributes.title;
		newsContainer.appendChild(newsparagraph);
	});
});