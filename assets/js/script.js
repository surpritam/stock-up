const topStoriesApiKey = 'f4b36e404dmsh4d3221a5e5b0cbap156ba7jsna1d1bea94c54';
const financialDataApiKey = '5e12ebe5c5msh196f8cfafa53e01p121694jsneaaf7d9d6e8c';
// Initial page load with autocomplete from ticker_list.json
document.addEventListener('DOMContentLoaded', function () {
	fetch('assets/data/ticker_list.json')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(stockSymbols => {
			$("#search-ticker").autocomplete({
				source: stockSymbols,
				minLength: 2
			});
		})
		.catch(error => console.error('There has been a problem with your fetch operation:', error));
	// Set default currSelection to AAPL at page load
	localStorage.setItem('currSelection', 'AAPL');
	fetchTopStories('AAPL');
	fetchRealTimeFinanceData('AAPL');
	let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
	displayRecentSearches(recentSearches);

	//Set default ticker symbol to be AAPL
	initializeTradingViewWidget('AAPL');

	// Event listener for form element
	const form = document.getElementById('dataForm');
	form.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent default form submission

		const searchInput = document.getElementById('search-ticker');
		const searchValue = searchInput.value.trim();

		if (searchValue) {
			// Update currSelection in localStorage
			localStorage.setItem('currSelection', searchValue);

			// Update recentSearches in localStorage
			let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
			if (!recentSearches.includes(searchValue)) {
				recentSearches.push(searchValue);
				localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
			}

			//call to update Recent Search list items
			displayRecentSearches(recentSearches);

			// Call fetchTopStories with the new search value
			fetchTopStories(searchValue);

			// Update chart with new serch ticker
			updateTradingViewWidget(searchValue);

			// Update Financial data
			fetchRealTimeFinanceData(searchValue);

		}

		// Clear the input field
		searchInput.value = '';
	});
});

function displayRecentSearches(recentSearches) {
	const recentSearchesContainer = document.querySelector('#recent-searches-list');
	// Clear the existing news
	recentSearchesContainer.innerHTML = '';
	recentSearches.forEach(search => {
		const listItem = document.createElement('li');
		const button = document.createElement('button');
		button.textContent = search;
		button.classList.add('text-blue-500', 'hover:text-blue-700', 'underline');
		button.addEventListener('click', () => {
			localStorage.setItem('currSelection', search);
			fetchTopStories(search);
			updateTradingViewWidget(search);
			fetchRealTimeFinanceData(search);
		});
		listItem.appendChild(button);
		recentSearchesContainer.appendChild(listItem);
	});
}

function fetchTopStories(search) {
	// Get top news data for stocks
	const newsApiUrl = `https://seeking-alpha.p.rapidapi.com/news/v2/list-by-symbol?id=${search.toLowerCase()}&size=5&number=1`;
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': topStoriesApiKey,
			'X-RapidAPI-Host': 'seeking-alpha.p.rapidapi.com'
		}
	};
	const baseUrl = 'https://seekingalpha.com/'
	fetch(newsApiUrl, options)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			const newsContainer = document.querySelector('.top-stories-list');
			// Clear the existing news
			newsContainer.innerHTML = '';
			const dataArr = data.data;
			dataArr.forEach(news => {
				const newsDiv = document.createElement('div');
				newsDiv.classList.add('news-item', 'p-4', 'mb-4', 'bg-white', 'shadow', 'rounded-lg', 'hover:bg-gray-200');

				const link = document.createElement('a');
				link.href = baseUrl + news.links.self;
				link.textContent = news.attributes.title;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.classList.add('text-blue-500', 'hover:text-blue-700', 'underline');
				newsDiv.appendChild(link);
				newsContainer.appendChild(newsDiv);
			});
		});
};

// Function to set the symbol dynamically
function initializeTradingViewWidget(symbol) {
	const chartDivId = 'chart';
	const container = document.getElementById(chartDivId);
	const widgetDivId = 'tradingview-widget';

	// Remove existing content inside the container including any scripts or divs
	container.innerHTML = '';

	// Create a new div for the widget
	const widgetDiv = document.createElement('div');
	widgetDiv.id = widgetDivId;
	container.appendChild(widgetDiv);

	const scriptElement = document.createElement('script');
	scriptElement.type = 'text/javascript';
	scriptElement.async = true;
	scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

	// Configuration for the widget
	const config = {
		"width": "100%",
		"height": 610,
		"symbol": symbol,
		"interval": "D",
		"timezone": "Etc/UTC",
		"theme": "dark",
		"style": "1",
		"locale": "en",
		"allow_symbol_change": true,
		"container_id": widgetDivId
	};

	// Embed the configuration directly into the script content
	scriptElement.textContent = JSON.stringify(config);
	container.appendChild(scriptElement);
}

function updateTradingViewWidget(symbol) {
	initializeTradingViewWidget(symbol);
}


function fetchRealTimeFinanceData(search) {
	// Get real-time financial data
	const realTimeUrl = `https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol=${search.trim()}&language=en`;
	const realTimeOptions = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': financialDataApiKey,
			'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
		}
	};
	// Define the container
	const realTimeContainer = document.querySelector('.financial-data-list');


	// Set up the fetch for Real Time Financial Data
	fetch(realTimeUrl, realTimeOptions)
		.then(response => response.json())
		.then(data => {
			const realTimeArr = data.data;
			// Remove existing content inside the container including any scripts or divs
			realTimeContainer.innerHTML = '';
			// Appending chosen data points to the document
			appendDataPoint(realTimeContainer, 'Price', formatCurrency(realTimeArr.price));
			appendDataPoint(realTimeContainer, 'Open', formatCurrency(realTimeArr.open));
			appendDataPoint(realTimeContainer, 'High', formatCurrency(realTimeArr.high));
			appendDataPoint(realTimeContainer, 'Low', formatCurrency(realTimeArr.low));
			appendDataPoint(realTimeContainer, 'Volume', formatVolume(realTimeArr.volume) + ' shares');
			appendDataPoint(realTimeContainer, 'Previous Close', formatCurrency(realTimeArr.previous_close));
			appendDataPoint(realTimeContainer, 'Year Low', formatCurrency(realTimeArr.year_low));
			appendDataPoint(realTimeContainer, 'Year High', formatCurrency(realTimeArr.year_high));
			appendDataPoint(realTimeContainer, 'Average Volume', formatVolume(realTimeArr.avg_volume) + ' shares');
			appendDataPoint(realTimeContainer, 'Company PE Ratio', realTimeArr.company_pe_ratio.toFixed(2));
			appendDataPoint(realTimeContainer, 'Company Market Cap', formatCurrency(realTimeArr.company_market_cap));
			appendDataPoint(realTimeContainer, 'Company Dividend Yield', realTimeArr.company_dividend_yield.toFixed(2) + '%');
		})
		.catch(error => {
			console.error('Error fetching financial data', error);
		});

};

function appendDataPoint(container, label, value) {
	const realTimeParagraph = document.createElement('p');
	realTimeParagraph.textContent = `${label}: ${value}`;
	container.appendChild(realTimeParagraph);
};

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatVolume(value) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}