const realTimeUrl = 'https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol=AAPL%3ANASDAQ&language=en';
const realTimeOptions = {
	method: 'GET',
	headers: {
		//'x-rapidapi-key': '5e12ebe5c5msh196f8cfafa53e01p121694jsneaaf7d9d6e8c',
		'YOUR API HERE'
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


