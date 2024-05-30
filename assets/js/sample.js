// Get real time financial data for stocks
const realTimeUrl = 'https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol=S%26P%20500&language=en';
const realTimeOptions = {
	method: 'GET',
	headers: {
		'Your API Here',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
	}
};

fetch(realTimeUrl, realTimeOptions)
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    const realTimeContainer = document.querySelector('.real-time-financial-data-container');
    const realTimeArr = data.data;
    realTimeArr.forEach(news => {
      console.log(news);
      const realTimeParagraph = document.createElement('p');
      realTimeParagraph.textContent = news.attributes.title;
      realTimeContainer.appendChild(realTimeParagraph);
    });
  });
}