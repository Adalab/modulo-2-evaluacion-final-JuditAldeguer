'use strict';
const searchSection = document.querySelector('.js_search');
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
const resultsSection = document.querySelector('.js_results');
const resetBtn = document.querySelector('.js_reset_btn');
let dataMoviesAll = [];
let dataMovies = [];
let favourites = [];

getFromApi();

function getFromApi() {
  fetch('https://api.tvmaze.com/search/shows?q=girls')
    .then((response) => response.json())
    .then((answer) => {
      dataMoviesAll = answer;
      console.log(dataMoviesAll);
    });
  for (const movieEl of dataMoviesAll) {
    let newdataMovie = [
      {
        name: movieEl.show.name,
        image: movieEl.show.imgage.medium,
      },
    ];
    dataMovies.push(newdataMovie);
  }
  console.log(dataMovies);
  //paintMovies();
  //setInLocalStorage();
}
//pendiente
// function paintMovies() {} //pendiente---------
// function setInLocalStorage() {} //pendiente---------
function handleSearch(ev) {
  ev.preventDefault();
  dataMovies.filter((dataEl) => dataEl.name.toLoweCase().inlcudes(input.value));
}
input.addEventListener('keyup', handleSearch);
searchBtn.addEventListener('click', handleSearch);
