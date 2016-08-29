const cheerio = require('cheerio');
const fetch = require('node-fetch');

const resultsUrl = 'http://www.portlandoregon.gov/parks/finder/index.cfm?ShowResults=yes';

function parseParkDom(html) {
  return {
    getName() {
      const name = cheerio('a', html).text();
      return name ? name.trim() : "";
    }
  };
}

fetch(resultsUrl)
  .then(response => response.text())
  .then(body => {
    const $html = cheerio.load(body);
    const parkElements = $html('#parksbody .searchParkBlk');

    const data = [];
    parkElements.each((i, element) => {
      const domInterface = parseParkDom(cheerio(element).html());
      const datum = {};
      datum.name = domInterface.getName();
      data.push(datum);
    });

    // parklandia shape
    console.log(data);
  })
  .catch(e => console.log(e));