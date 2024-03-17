let movies = [];
let currentPage = 1;
const moviesList = document.getElementById("movies-list");


// Fetching data from API
const renderMovies = (movies)=>{
    moviesList.innerHTML = '';
    movies.map((movie)=>{
        const favmovielist = getMovieNameFromLocalStorage();
        const {poster_path,title,vote_average,vote_count,id} = movie
        let listItem = document.createElement("li");
        listItem.classList.add("card");
        let img = ( poster_path !== null) ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
       
        listItem.innerHTML =
         ` <img
                src=${img}
                class="movie-poster"
                alt="movie-title"
        />
        
        <p class="title" >${title}</p>
        <section class="vote-section">
            <section class="vote">
                <p class="vote-count">Votes : ${vote_count}</p>
                <p class="vote-average">Rating : ${vote_average}</p>  
            </section>
            <i class="favorite-icon fa-regular fa-heart fa-2xl  ${favmovielist.find((item)=> item.trim() ==  title.trim()) ? "fa-solid" : null}" data-title = "${title} " ></i>
            
        </section> `;
       
        moviesList.appendChild(listItem);
      
        const favIconBtn = listItem.querySelector(".favorite-icon");
        favIconBtn.addEventListener('click',(event)=>{
                 let title =  event.target.dataset.title;
                 if(favIconBtn.classList.contains("fa-solid")){
                    removeMovieNameFromLocalStorage(title);
                    favIconBtn.classList.remove("fa-solid");
                 }
                 else{
                    addMovieNameToLocalStorage(title);
                    favIconBtn.classList.add("fa-solid");
                 }
              })
        
    })
   
}

//handling favorite movies
function getMovieNameFromLocalStorage(){
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    return favoriteMovies === null ? []:  favoriteMovies ; 
}

function addMovieNameToLocalStorage(movieName){
    const favMoviesNames = getMovieNameFromLocalStorage();
    localStorage.setItem("favoriteMovies", JSON.stringify([...favMoviesNames, movieName]));
}

function removeMovieNameFromLocalStorage(movieName){
    let favMoviesNames = getMovieNameFromLocalStorage();
    localStorage.setItem("favoriteMovies", JSON.stringify(favMoviesNames.filter((movName) => movName.trim() !== movieName.trim())));
}
  
const showFavorites = (favMovieName)=>{
    const { poster_path, title, vote_count, vote_average } = favMovieName;
    let listItem = document.createElement("li");
    listItem.classList.add("card");
    let img = ( poster_path !== null) ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
   
    listItem.innerHTML =
     ` <img
            src=${img}
            class="movie-poster"
            alt="movie-title"
    />
    
    <p class="title" >${title}</p>
    <section class="vote-section">
        <section class="vote">
            <p class="vote-count">Votes : ${vote_count}</p>
            <p class="vote-average">Rating : ${vote_average}</p>  
        </section>
        <i class="favorite-icon fa-solid fa-xmark fa-2xl xmark " id="${title}"></i>
        
    </section> `;
    const removeFromWishListBtn = listItem.querySelector(".xmark");
    removeFromWishListBtn.addEventListener('click',(event)=>{
         const {id} = event.target;
         removeMovieNameFromLocalStorage(id);
         fetchWishListMovie();
        });
        moviesList.appendChild(listItem);
}

const getMovieByName = async (movieName) => {
    try { 
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`
      );
      const result = await response.json();
      return result.results[0];
    } catch (error) {
      console.log(error);
    }
  };
const fetchWishListMovie = async ()=>{
    moviesList.innerHTML = " ";
    const movieNamesList = getMovieNameFromLocalStorage();
    for(let i=0; i<movieNamesList.length; i++){
        const movieName = movieNamesList[i];
        let movieDataFromName = await getMovieByName(movieName);
        showFavorites(movieDataFromName);
    }
}

const allTab = document.querySelector("#all-items");
const favoriteTab = document.querySelector("#favorite-items");
function dispayMovies(){
   
    if (allTab.classList.contains("active-tab")){
        location.reload()
        renderMovies(movies); //render all movies
    }
    else if(favoriteTab.classList.contains("active-tab")){
        fetchWishListMovie(); //fetch favorite movies by title
        pagination.style.display = 'none';
    }
}
function switchTabs(event){
   
    allTab.classList.remove("active-tab");
    favoriteTab.classList.remove("active-tab");

    event.target.classList.add("active-tab");
    dispayMovies();
}
favoriteTab.addEventListener('click', switchTabs);
allTab.addEventListener('click', switchTabs);

//sorting section
//1.handling buttons sortByRating
let firstSortByRating = true;
let SortByRatingButton = document.getElementById("sort-by-rating");
SortByRatingButton.addEventListener('click', sortByRating);
function sortByRating(){
    let sortedMovies;
    if(firstSortByRating){
        //sorting rating by least to most
        sortedMovies = movies.sort((a,b)=>  a.vote_average - b.vote_average);
        SortByRatingButton.innerText = "Sort by rating(most to least)";
        SortByRatingButton.style.backgroundColor = "#333";
        SortByRatingButton.style.color = "white";
        firstSortByRating = false;
    }
    else if(!firstSortByRating){
        // sorting rating by most to least
        sortedMovies = movies.sort((a,b)=>b.vote_average - a.vote_average );
        SortByRatingButton.innerText = "Sort by rating(least to most)";
        SortByRatingButton.style.removeProperty("background-color");
        SortByRatingButton.style.removeProperty("color");
        firstSortByRating = true;
    }
    renderMovies(sortedMovies);  
}

//2.handling buttons sortByDate
let firstSortByDate = true;
let SortByDateButton = document.getElementById("sort-by-date");
SortByDateButton.addEventListener('click', sortByDate);
function sortByDate(){
    let sortedMovies;
    if(firstSortByDate){
        //sorting date by oldest to latest
        sortedMovies = movies.slice().sort((a,b)=>  new Date(a.release_date) - new Date(b.release_date));
        SortByDateButton.innerText = "Sort by date(oldest to latest)";
        SortByDateButton.style.backgroundColor = "#333";
        SortByDateButton.style.color = "white";
        firstSortByDate = false;
    }
    else if(!firstSortByDate){
        // sorting date by latest to oldest
        sortedMovies = movies.sort((a,b)=>new Date(b.release_date) - new Date(a.release_date) );
        SortByDateButton.innerText = "Sort by date(latest to oldest)";
        SortByDateButton.style.removeProperty("background-color");
        SortByDateButton.style.removeProperty("color");
        firstSortByDate = true;
    }
    renderMovies(sortedMovies);  
}

//pagination section
async function fetchMovies(page){
    try{
       const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`)
        const result = await response.json();

      movies = result.results;
      renderMovies(movies);
    }catch(error){
         console.log(error);
    }
}
fetchMovies(currentPage)
const prevButton = document.querySelector("#previous-page");
const currPageButton = document.querySelector("#current-page");
const nextButton = document.querySelector("#next-page");
prevButton.disabled = true;
prevButton.addEventListener('click',()=>{
    currentPage--;
    fetchMovies(currentPage);
    currPageButton.innerText = `Current Page: ${currentPage}`;
      if(currentPage === 1){
        prevButton.disabled=true;
        nextButton.disabled = false;
      }else{
        prevButton.disabled = false;
      }
})
nextButton.addEventListener('click',()=>{
    currentPage++;
    fetchMovies(currentPage);
    currPageButton.innerText = `Current Page: ${currentPage}`;
    if(currentPage === 10){
        prevButton.disabled=false;
        nextButton.disabled = true;
    }else{
        prevButton.disabled = false; 
    }
})

//handling searches
const searchMovie = async(searchedMovie)=>{
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&include_adult=false&language=en-US&page=1&api_key=f531333d637d0c44abc85b3e74db2186`)
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    }catch(error){
        console.log(error);
    }
    
}
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");

// 1.searching movie on search button click
searchButton.addEventListener('click', ()=>{    
    let searchedMovie = searchInput.value;
    searchMovie(searchedMovie);
    pagination.style.display = "none"
})

const onSearchChange = async (event)=>{
    const {value} = event.target;
    if(!value){
        renderMovies(movies);
    }else{
        await searchMovie(value);
    }
}

// 2. throttle search
function throttle(func,delay){
    let lastCallTime = 0;
    return (event)=>{
        const now= Date.now();
        if(now - lastCallTime >= delay){
            func(event);
            lastCallTime = now;
        }
    };
}
searchInput.addEventListener('input',()=>{ 
   pagination.style.display = "none"
   throttle(onSearchChange(event),1000);
});
