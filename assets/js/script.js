// Autocomplete from ticker_list.json
document.addEventListener('DOMContentLoaded', function() {
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
});


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
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    const newsContainer = document.querySelector('.top-stories-container');
    const dataArr = data.data;
    dataArr.forEach(news => {
      console.log(news);
      const newsparagraph = document.createElement('p');
      newsparagraph.textContent = news.attributes.title;
      newsContainer.appendChild(newsparagraph);
    });
  });

// Get real-time financial data
const realTimeUrl = 'https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol=AAPL&language=en';
const realTimeOptions = {
	method: 'GET',
	headers: {
    'x-rapidapi-key': 'Your API Here',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
	}
};
// Define the container
const realTimeContainer = document.querySelector('.real-time-financial-data-container');


// Set up the fetch for Real Time Financial Data
fetch(realTimeUrl, realTimeOptions)
  .then(response => response.json())
  .then(data => {
    const realTimeArr = data.data;
    // Appending chosen data points to the document
    appendDataPoint(realTimeContainer, 'Price', realTimeArr.price);
    appendDataPoint(realTimeContainer, 'Open', realTimeArr.open);
    appendDataPoint(realTimeContainer, 'High', realTimeArr.high);
    appendDataPoint(realTimeContainer, 'Low', realTimeArr.low);
    appendDataPoint(realTimeContainer, 'Volume', realTimeArr.volume);
    appendDataPoint(realTimeContainer, 'Previous Close', realTimeArr.previous_close);
    appendDataPoint(realTimeContainer, 'Year Low', realTimeArr.year_low);
    appendDataPoint(realTimeContainer, 'Year High', realTimeArr.year_high);
    appendDataPoint(realTimeContainer, 'Average Volume', realTimeArr.avg_volume);
    appendDataPoint(realTimeContainer, 'Company PE Ratio', realTimeArr.company_pe_ratio);
    appendDataPoint(realTimeContainer, 'Company Market Cap', realTimeArr.company_market_cap);
    appendDataPoint(realTimeContainer, 'Company Dividend Yield', realTimeArr.company_dividend_yield);
    appendDataPoint(realTimeContainer, 'About', realTimeArr.about);
  })
  .catch(error => {
    console.error('Error fetching financial data', error);
  });

function appendDataPoint(container, label, value) {
  const realTimeParagraph = document.createElement('p');
  realTimeParagraph.textContent = `${label}: ${value}`;
  container.appendChild(realTimeParagraph);
}

// Search and store to local storage
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('dataForm');
  const inputList = document.getElementById('search-ticker');
  
  // Function to display past inputs
  function displayStocks() {
      inputList.innerHTML = ''; // Clear current list
      const inputs = JSON.parse(localStorage.getItem('search-ticker')) || [];
      inputs.forEach(input => {
          const li = document.createElement('li');
          li.textContent = input;
          inputList.appendChild(li);
      });
  }

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      const userInput = document.getElementById('search-ticker').value;
      if (userInput) {
          let inputs = JSON.parse(localStorage.getItem('search-ticker')) || [];
          inputs.push(userInput); // Add new input to array
          localStorage.setItem('search-ticker', JSON.stringify(inputs)); // Save array to local storage
          displayStocks(); // Update the display
          alert('Data saved to local storage!');
          console.log(inputs)
      } else {
          alert('Please enter something.');
      }
      form.reset();
  });

  // Display past inputs when the page loads
  displayStocks();
});