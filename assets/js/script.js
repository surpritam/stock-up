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
function addSearchButton(search) {
	const listItem = document.createElement('li');
	const button = document.createElement('button');
	button.textContent = search;
	button.classList.add('text-blue-500', 'hover:text-blue-700', 'underline');
	button.addEventListener('click', () => {
		localStorage.setItem('currSelection', search);
		// updateContent(search);
		fetchTopStories(search);
	});
	listItem.appendChild(button);
	recentSearchesContainer.appendChild(listItem);
}


document.addEventListener('DOMContentLoaded', function() {
	const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
	recentSearches.forEach(search => {
		// const listItem = document.createElement('li');
		// listItem.textContent = search;
		// recentSearchesContainer.appendChild(listItem);
		addSearchButton(search);
	});
});

function fetchTopStories(search) {
	// Get top news data for stocks
	const newsApiUrl = `https://seeking-alpha.p.rapidapi.com/news/v2/list-by-symbol?id=${search.toLowerCase()}&size=5&number=1`;
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'f4b36e404dmsh4d3221a5e5b0cbap156ba7jsna1d1bea94c54',
			'X-RapidAPI-Host': 'seeking-alpha.p.rapidapi.com'
		}
	};
	const baseUrl = 'https://seekingalpha.com/'
	fetch(newsApiUrl, options)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			const newsContainer = document.querySelector('.top-stories-container');
			const dataArr = data.data;
			dataArr.forEach(news => {
				console.log(news);
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
				// const newsparagraph = document.createElement('p');
				// newsparagraph.textContent = news.attributes.title;
				// newsContainer.appendChild(newsparagraph);
			});
		});
	};
