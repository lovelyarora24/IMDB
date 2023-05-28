

const searchBar = document.querySelector("#search-bar");
const moviesSlotContainer = document.querySelector("#movie-container");
const movieSingle = document.querySelector("#movie-description");
const favouriteButton = document.querySelector("#favourite-btn");



//search movies on home page

searchBar.addEventListener('keyup' , ()=>{
	let searchText = searchBar.value;
	
	if(searchText.length > 0){
		let searchData = encodeURI(searchText);
		const searchResult = fetch(`http://www.omdbapi.com/?apikey=52a8736d&s=${searchData}`)
			.then((response) => response.json())
			.then((data) =>{
				console.log(data);
				localStorage.setItem("search_keyword", searchData);
				moviesList = data.Search;
				renderList("favourite");
			})
	}
})


// render movie List 
// create move cards using elements of moviesList array 

function renderList(actionForButton){
	moviesSlotContainer.innerHTML = '';

	for(let i = 0; i<moviesList.length; i++){

		// creating div element for movie card and setting class and id to it
		let moviesSlot = document.createElement('div');
		moviesSlot.classList.add("movie-card");
    let favMovieList = JSON.parse(localStorage.getItem("myFavourite4"));
		
		var redHeartClass ="";
		if(favMovieList.find(element => element == moviesList[i].imdbID)){
				var redHeartClass = "red";
		}
		moviesSlot.innerHTML = `<div class="grid_4">
          <div class="box">
            <a href="movie.html?id=${moviesList[i].imdbID}" target="_blank" class="gall_item"><img src="${moviesList[i].Poster}" alt=""><span></span></a>
            <div class="box_bot">
              <div class="box_bot_title">${moviesList[i].Title}</div>
              <a href="movie.html?id=${moviesList[i].imdbID}" class="view-btn btn"><i class="fa fa-eye" aria-hidden="true"></i></a><a id="favourite-btn" onclick="favourite(this)" class="fav-btn btn ${redHeartClass}" data-name="new" data-id="${ moviesList[i].imdbID }"><i class="fa fa-heart" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>`;

		moviesSlotContainer.append(moviesSlot); //appending card to the movie container view
	}
}



// get movie information by movie id for movie page

function getMovie( movieId ) {
	if(movieId.length > 0) {
		const searchResult = fetch(`http://www.omdbapi.com/?apikey=52a8736d&i=${movieId}&plot=full`)
			.then((response) => response.json())
			.then((data) =>{
				console.log(data);
				movie = data;
				renderSingleMovie();
			})
	}

}


// renders movie details on web-page
function renderSingleMovie(){	
	let movieDetailbox = document.createElement('div');
	movieDetailbox.classList.add('detail-movie-card');

	document.getElementById("movie-name").innerHTML =  movie.Title;
	document.getElementById("movie-description").innerHTML = `
		<div class="movie-intro">
			<div class="movie-poster">
				<img src="${movie.Poster}" class="img_inner" align="left">
			</div>
			<div class="movie-info">	
				<h2>${movie.Title}</h2>
				<p>Release Date:<span>${movie.Released}</span></p>
				<p>Actors:<span>${movie.Actors}</span></p>
				<p>Duration:<span>${movie.Runtime}</span></p>
				<p>Country:<span>${movie.Country}</span></p>
				<p>Director<span>${movie.Director}</span></p>
				<p>Rating:<span>${movie.imdbRating}</span></p>
				<p>Votes:<span>${movie.imdbVotes}</span></p>
				<p>Awards:<span>${movie.Awards}</span></p>
				<p>Language:<span>${movie.Language}</span></p>
			</div>
		</div>
		<div class="detail-movie-plot">
			<p>${movie.Plot}</p>
		</div>
	`;
}


// Load movies from recent search

function getMoviesFromRecentSearch() {

	var searchKeyword = localStorage.getItem("search_keyword");
	if(searchKeyword != null) {
		const searchResult = fetch(`http://www.omdbapi.com/?apikey=52a8736d&s=${searchKeyword}`)
		.then((response) => response.json())
		.then((data) =>{
			console.log(data);
			moviesList = data.Search;
			renderList("favourite");
		})
	}
}
getMoviesFromRecentSearch();



// function to add movie into favourite section
function favourite(element){
	var movieId = element.getAttribute('data-id');

  if( localStorage.getItem("myFavourite4")) {
		let favMovieList = JSON.parse(localStorage.getItem("myFavourite4"));

		if(favMovieList.find(element => element == movieId)) {
			const index = favMovieList.indexOf(movieId);
			if (index > -1) {           
			  favMovieList.splice(index, 1);  
			}
			element.classList.remove("red");
			localStorage.setItem("myFavourite4", JSON.stringify(favMovieList));
		}	
		else{
			favMovieList.push(movieId);
			element.classList.add("red");
			localStorage.setItem("myFavourite4", JSON.stringify(favMovieList));
		}
	}
	else{
			favMovieList = new Array();
			favMovieList = [movieId];
			localStorage.setItem("myFavourite4", JSON.stringify(favMovieList));
	}
}



function listFavouriteMovieList() {
	var favMovieList = JSON.parse(localStorage.getItem("myFavourite4"));
	reponseData = new Array();

	if(favMovieList != null) {
		for (let i in favMovieList) {
	  	const searchResult = fetch(`http://www.omdbapi.com/?apikey=52a8736d&i=${favMovieList[i]}`)
			.then((response) => response.json())
			.then((data) =>{
				reponseData.push(data);
				movie = data;
				renderfavList("favourite");
			})
		}	
	}
}



//Render movie list on my favourite page

function renderfavList(action){
	let moviesSlot = document.createElement('div');
		moviesSlot.classList.add("movie-card");
		moviesSlot.innerHTML = `<div class="grid_4">
    <div class="box">
      <a href="movie.html?id=${movie.imdbID}" target="_blank" class="gall_item"><img src="${movie.Poster}" alt=""><span></span></a>
      <div class="box_bot">
        <div class="box_bot_title">${movie.Title}</div>
        <a href="movie.html?id=${movie.imdbID}" class="view-btn btn"><i class="fa fa-eye" aria-hidden="true"></i></a><a id="favourite-btn" onclick="remove_favourite(this)" class="fav-btn btn red" data-name="new" data-id="${ movie.imdbID }"><i class="fa fa-heart" aria-hidden="true"></i></a>
      </div>
    </div>
  </div>`;
	document.getElementById('movie-container').append(moviesSlot); //appending card to the movie container view
}


// function to rwmove movie from favourite section
function remove_favourite(element) {

	var movieId = element.getAttribute('data-id');
	var favMovieList = JSON.parse(localStorage.getItem("myFavourite4"));
  
  if( localStorage.getItem("myFavourite4")) {
		if(favMovieList.find(element => element == movieId)) {
			const index = favMovieList.indexOf(movieId);

			if (index > -1) {           // only splice array when item is found
			  favMovieList.splice(index, 1);  // 2nd parameter means remove one item only

			}
			localStorage.setItem("myFavourite4", JSON.stringify(favMovieList));
		}	
	}

 document.getElementById('movie-container').innerHTML='';
 listFavouriteMovieList();
}



