const ticker_list = ["AAPL", "MSFT", "TSLA", "NVDA"];

$(function () {
  $("#search-ticker").autocomplete({
    source: ticker_list
  });
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
  displayInputs();
});


