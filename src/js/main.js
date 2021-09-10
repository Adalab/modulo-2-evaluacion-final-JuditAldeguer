'use strict';
const searchSection = document.querySelector('.js_search');
const favoritesSection = document.querySelector('.js_favorites_section');
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
const resultsSection = document.querySelector('.js_results');
const resetBtn = document.querySelector('.js_reset_btn');
let favorites = [];
let movies = [];

//llamamos 1ra función
getLocalStorage();
listenMovies(); //quizas se deba quitar---------------------

//Filter
function handleFilter(ev) {
  ev.preventDefault();
  getLocalStorage();
  paintMovies();
}
function isValidMovie(movie) {
  const filterValue = input.value.toLowerCase();
  return movie.name.toLowerCase().includes(filterValue);
}
searchBtn.addEventListener('click', handleFilter);

//Favoritos
function handleMovie(ev) {
  const selectedMovie = parseInt(ev.currentTarget.id);
  const objetClicked = movies.find((movie) => {
    return movie.id === selectedMovie;
  }); //desconozco si funcionará-------------------------------------
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === selectedMovie;
  }); //desconozco si funcionará-------------------------------------
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
  } else {
    favorites.splice(favoritesFound, 1);
  }
  paintMovies(); // en Favoritos lugar: favoritesSection ----------------------------------
}
function listenMovies() {
  const movies = document.querySelectorAll('.js_movies');
  for (const movie of movies) {
    movie.addEventListener('click', handleMovie);
  }
}

//isFavorite
function isFavorite(movie) {
  const favoriteFound = favorites.find((fav) => {
    return fav.id === movie.id;
  });
  //   console.log(fav);
  //   console.log(movie);
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}
//Pintar
function paintMovies() {
  let html = '';
  let favClass = '';
  let movieImg = '';
  for (const movie of movies) {
    let isValidClass;
    if (isValidMovie(movie)) {
      isValidClass = '';
    } else {
      isValidClass = 'movie--hidden';
    }
    const isFav = isFavorite(movie);
    if (isFav) {
      favClass = 'movie--favorite';
    } else {
      favClass = '';
    }

    if (movie.image === null) {
      movieImg = `https://via.placeholder.com/210x295/ffffff/666666/?text=${movie.name}`;
    } else {
      movieImg = movie.image.medium;
    }
    html += `<div class="movie--container js_movies ${favClass} ${isValidClass}" id="${movie.id}">`;
    html += `<img class="movie--img" src="${movieImg}" alt="${movie.name}">`; //pendiente si no hay imagen poner placeholder
    html += `<h2>${movie.name}</h2>`;
    html += `</div>`;
  }
  resultsSection.innerHTML = html;
  listenMovies(); //quizas se debe quitar-------------------------------------
}

//Local Storage - OK
function setInLocalStorage() {
  const stringMovies = JSON.stringify(movies);
  localStorage.setItem('movies', stringMovies);
}

//Get from API - OK
function getFromApi() {
  fetch(`https://api.tvmaze.com/search/shows?q=${input.value}`)
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((answer) => {
      const moviesAll = answer;
      movies = moviesAll.map((moviesEl) => {
        const objectMovies = {
          name: moviesEl.show.name,
          image: moviesEl.show.image,
          id: moviesEl.show.id,
        };
        return objectMovies;
      });
      console.log(movies);
      paintMovies();
      setInLocalStorage();
    })
    .catch((err) => console.error('error', err));
}

//Confirmar si Local Storage esta lleno - OK
function getLocalStorage() {
  const localStoragePalettes = localStorage.getItem('movies');
  if (localStoragePalettes === '[]' || 'null') {
    getFromApi();
  } else {
    const arrayMovies = JSON.parse(localStoragePalettes);
    movies = arrayMovies;
    console.log(movies);
    paintMovies();
  }
}
