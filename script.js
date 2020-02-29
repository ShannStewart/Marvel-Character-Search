const apikey = 'e00e070ff664e28f2e1b568199db890a'; //marvel api
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0'; //marvel private api key
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

const bombAPI = '91c6a17d06ec9512747ce30cfef6796a316cdbdd';

const googleAPI = 'AIzaSyCkYLATbWVu42KN49LP6pbjM1Gqd_a_B5Y';

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

let code = ts + otherkey + apikey;
    console.log('code: ' + code);

let hash = md5(code); //Brought in md5
hash = hash.toString();
hash = hash.toLowerCase();

const urlBase = 'http://gateway.marvel.com/v1/public/characters';
const urlTail = 'ts=' + ts + '&apikey=' + apikey + '&hash=' + hash;

searchName = '';

issueName = '';
issuePicture = '';

characterID = 0;
firstSearch = '';
lastSearch = '';
issuePath = '';
issueExtension = '';

videoCap = '';

gameID = 0;

function readyFunctions(){
        console.log('readyfunction ran');
    getName();
}



function getName(){
    
     $('#characterSearch').off('click');

     $('#characterSearch').on('click', '#findCharacter', function(event){
        //fires twice with multiple clicks
        event.preventDefault();
        
        emptyDisplays();
         searchName = $('input[name="characterName"]').val(); 
            console.log('You are searching for: ' + searchName);
        
            marvelAPI();
        
        });

}

function emptyDisplays(){
    console.log('emptyDisplays ran');
    $('#characterPic').empty();
    $('#firstCover').empty();
    $('#firstTitle').empty();

    $('#recent').empty();
    $('#movies').empty();
    
    $('#games').empty();
    $('#trending').empty();
}

 function marvelAPI(){
    console.log('marvelAPI ran');

    let marvelSearch = urlBase + '?' + urlTail + '&name=' + searchName;
    //http://gateway.marvel.com/v1/public/characters?ts={{ts}}&apikey={{apikey}}&hash={{hash}}

    console.log('fetch code: ' + marvelSearch);

     fetch(marvelSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.data.count === 0){
           
            throw new Error(response.status);
        }
        else{
           
            getID(responseJSON);
        }
    })
    .catch(err=> alert("Couldn't find that character"));

}

async function getID(profileJSON){

    console.log('getID ran')

    characterID =  profileJSON.data.results[0].id;
        console.log('ID: ' + characterID);

        firstSearch = urlBase + '/' + characterID + '/comics?' + urlTail + '&dateRange=1950-01-01,2090-01-01&orderBy=onsaleDate';
            console.log('Searching: ' + firstSearch);

    await fetch(firstSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.data.count === 0){
           
            throw new Error(response.status);
        }
        else{
           
            populateProfile(responseJSON);
        }
    })
    .catch(err=> alert("Couldn't find that character"));


}

function populateProfile (profileJSON){
    console.log('populateProfile ran')

    issueName = profileJSON.data.results[0].title;

    issuePath = profileJSON.data.results[0].images[0].path;
    issueExtension = profileJSON.data.results[0].images[0].extension;
    issuePicture = issuePath + '.' + issueExtension;

    issuePicture = '<img src="' + issuePicture + '">';

    issueName = '<h2>' + issueName + '</h2>';

    $('#firstCover').append(
        issuePicture
    );

    $('#firstTitle').append(
        issueName
    );

    getSecondID();
}

async function getSecondID(){

    lastSearch = urlBase + '/' + characterID + '/comics?' + urlTail + '&dateRange=1950-01-01,2090-01-01&orderBy=-onsaleDate';

    await fetch(lastSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.data.count === 0){
           
            throw new Error(response.status);
        }
        else{
           
            latestIssues(responseJSON);
        }
    })
    .catch(err=> alert("Search Interrupted"));

}

function latestIssues(responseJSON){
    console.log('latestIssues ran');

    
    let issueCount = 5; //number of issues in the 'recent' section
       if (issueCount > responseJSON.data.count){
            issueCount = responseJSON.data.count;
        }

    for (i = 0; i < issueCount; i++){

        issuePath = responseJSON.data.results[i].images[0].path;
        issueExtension = responseJSON.data.results[i].images[0].extension;
        issuePicture = issuePath + '.' + issueExtension;
    
        console.log('issuePicture: ' + issuePicture);
    
        issuePicture = '<img src="' + issuePicture + '">';
    
        $('#recent').append(
            issuePicture
        );

    }

    findGameID();


}

async function findGameID(){
    console.log('findGameID ran');

    gameIDSearch = corsAnywhere + "https://www.giantbomb.com/api/characters?api_key=" + bombAPI + "&format=json&filter=aliases:" + searchName;

    console.log('gameIDSearch: ' + gameIDSearch);
    
   await fetch(gameIDSearch) //{mode: "no-cors"}
   .then(response => response.json())
   .then(responseJSON => {     
        if (responseJSON.number_of_total_results === 0){
            console.log('game results: ' + responseJSON.number_of_total_results);
            findMovieID();
           throw new Error(response.status);
        }
        else{
            console.log('game results: ' + responseJSON.number_of_total_results);
           latestGames(responseJSON);
        }
    })
       .catch(err=> alert("No games found"))

}

function latestGames(gameJSON){
    console.log('latestGames ran');

    console.log('Json log: ' +  gameJSON);

    findMovieID();

}

function findMovieID(){
    console.log('findMovieID ran');

    latestMovies();
}

function latestMovies(){
    console.log('latestMovies ran');
    
    findTrending();
}

async function findTrending(){
    console.log('findTrending ran');

    let googleSearch = 'https://www.googleapis.com/youtube/v3/search?key=' + googleAPI + '&part=snippet&type=video&q=' + searchName;

    console.log('googleSearch: ' + googleSearch);

   await fetch(googleSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.pageInfo.totalResults == 0){
           console.log('total results: ' + responseJSON.pageInfo.totalResults);
            throw new Error(response.status);
        }
        else{
            console.log('total results: ' + responseJSON.pageInfo.totalResults);
            getTrending(responseJSON);
        }
    })
    .catch(err=> alert("Couldn't find any videos"));

}

function getTrending(trendingJSON){
    console.log('getTrending ran');

    let videoCount = 5; //number of issues in the 'recent' section
       if (videoCount > trendingJSON.pageInfo.totalResults){
            videoCount = trendingJSON.pageInfo.totalResults;
        }

    for (i = 0; i < videoCount; i++){

        videoCap = trendingJSON.items[i].snippet.thumbnails.default.url;
    
        videoCap = '<img src="' + videoCap + '">';
    
        $('#trending').append(
            videoCap
        );

    }


}

$(readyFunctions);