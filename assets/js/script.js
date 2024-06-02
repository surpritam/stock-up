const SEEKING_ALPHA_NEWS_KEY = '__SEEKING_ALPHA_NEWS_KEY__';
const REAL_FINANCIAL_DATA_KEY = '__REAL_FINANCIAL_DATA_KEY__';

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
    
    localStorage.setItem('currSelection', 'AAPL');
    fetchTopStories('AAPL');
    fetchRealTimeFinanceData('AAPL');
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    displayRecentSearches(recentSearches);

    initializeTradingViewWidget('AAPL');

    const form = document.getElementById('dataForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchInput = document.getElementById('search-ticker');
        const searchValue = searchInput.value.trim();

        if (searchValue) {
            localStorage.setItem('currSelection', searchValue);

            let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
            if (!recentSearches.includes(searchValue)) {
                recentSearches.push(searchValue);
                localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            }

            displayRecentSearches(recentSearches);

            fetchTopStories(searchValue);

            updateTradingViewWidget(searchValue);

            fetchRealTimeFinanceData(searchValue);
        }

        searchInput.value = '';
    });

    document.querySelector('button[data-twe-collapse-init]').addEventListener('click', function() {
        document.getElementById('navbarSupportedContentY').classList.toggle('hidden');
    });
});

function displayRecentSearches(recentSearches) {
    const recentSearchesContainer = document.querySelector('#recent-searches-list');
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
    const newsApiUrl = `https://seeking-alpha.p.rapidapi.com/news/v2/list-by-symbol?id=${search.toLowerCase()}&size=5&number=1`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': SEEKING_ALPHA_NEWS_KEY,
            'X-RapidAPI-Host': 'seeking-alpha.p.rapidapi.com'
        }
    };
    const baseUrl = 'https://seekingalpha.com/';
    fetch(newsApiUrl, options)
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.querySelector('.top-stories-list');
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
}

function initializeTradingViewWidget(symbol) {
    const chartDivId = 'chart';
    const container = document.getElementById(chartDivId);
    const widgetDivId = 'tradingview-widget';

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetDivId;
    container.appendChild(widgetDiv);

    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

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

    scriptElement.textContent = JSON.stringify(config);
    container.appendChild(scriptElement);
}

function updateTradingViewWidget(symbol) {
    initializeTradingViewWidget(symbol);
}

function fetchRealTimeFinanceData(search) {
    const realTimeUrl = `https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol=${search.trim()}&language=en`;
    const realTimeOptions = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': REAL_FINANCIAL_DATA_KEY,
            'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
        }
    };
    const realTimeContainer = document.querySelector('.financial-data-list');

    fetch(realTimeUrl, realTimeOptions)
        .then(response => response.json())
        .then(data => {
            const realTimeArr = data.data;
            realTimeContainer.innerHTML = '';
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
}

function appendDataPoint(container, label, value) {
    const realTimeParagraph = document.createElement('p');
    realTimeParagraph.textContent = `${label}: ${value}`;
    container.appendChild(realTimeParagraph);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatVolume(value) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
