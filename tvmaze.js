"use strict";

const $episodeButton=$("#get-episodes");
const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
let $searchQuery= $("#search-query");
let missingImage="http://tinyurl.com/missing-tv"
const term = $searchQuery.val();
const $episodesList=$("#episodes-list");



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

    let response=await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
    console.log(response.data);
    let shows =response.data.map(result =>{
      let show=result.show;
      return{
        id:show.id,
        name: show.name,
        summary: show.summary,
        image: show.image? show.image.medium : missingImage,
        
      };
    });

   return shows;
 
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

 //if($showsList>0){

    for (let show of shows) {
      let $show = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
           <div class="card" data-show-id="${show.id}">
             <img class="card-img-top" src="${show.image}">
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
               
               <button class="btn btn-primary" id="get-episodes">Episodes</button>
             </div>
           </div>  
         </div>
        `);
  
      $showsList.append($show); 
    }
  }




/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 * 
 * 
 */
  
/*async function searchForShowAndDisplay() {
  const term = $searchQuery.val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  
  
}  */

$searchForm.on("submit", async function handleSearch (evt) {
  evt.preventDefault();

 let term=$searchQuery.val();
 const shows=await getShowsByTerm(term);
 $episodesArea.hide();
 populateShows(shows);
});

$showsList.on("click", "#get-episodes",async function handleEpisodeClick(evt){

    let showId = $(evt.target).closest(".Show").data("show-id");
    let episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);





//$episodeButton.on("click", async function handleEpisodeClick(evt){
console.log("we got here");
 // let showId=$(evt.target).closest(".Show").data("show-id");
 // let episodes = await getEpisodesOfShow(id);
  //populateEpisodes(episodes);
  
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */


 async function getEpisodesOfShow(id) { 

  let response=await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

 let episodes=response.data.map(episode => ({
  id: episode.id,
  name: episode.name,
  season:episode.season,
  number:episode.number,
  
  }));
  console.log("something");
   return episodes;
  }
  
 //}   come back to this to see if you actually need it. 

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) {
   $episodesList.empty();
   for(let episode of episodes){
     let $episode=$(
       `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
     `);
     $episodesList.append($episode);
   }
   $episodesArea.show();
 }


