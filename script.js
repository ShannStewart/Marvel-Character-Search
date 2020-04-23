const apikey = 'e00e070ff664e28f2e1b568199db890a'; //marvel api
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0'; //marvel private api key
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

const bombAPI = '91c6a17d06ec9512747ce30cfef6796a316cdbdd'; //giantbomb API

const googleAPI = 'AIzaSyCnkPdlkgj_wSO3QJS9GY4xwWyNtHFU9f0';

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

let code = ts + otherkey + apikey;
    console.log('code: ' + code);

let hash = md5(code); //Brought in md5
hash = hash.toString();
hash = hash.toLowerCase();

const urlBase = 'https://gateway.marvel.com/v1/public/characters';
const urlTail = 'ts=' + ts + '&apikey=' + apikey + '&hash=' + hash;

searchName = '';

searchPicture = '';

issueName = '';
issuePicture = '';

characterID = 0;
firstSearch = '';
lastSearch = '';
issuePath = '';
issueExtension = '';

videoCap = '';

gameID = 0;

backInfo = '';

newCard = '';
cardFront= '';
cardBack= '';

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
    $('#displayName').empty();
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

            console.log('Fetching for character path: ' + profileJSON.data.results[0].thumbnail.path); 

        let characterPath = profileJSON.data.results[0].thumbnail.path;
        console.log('Searching for character path: ' + characterPath);
        let characterExtension = profileJSON.data.results[0].thumbnail.extension;
        searchPicture = characterPath + '.' + characterExtension;

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

    let searchIdentity = '<h2>' + searchName + '</h2>';
    console.log('identity is ' + searchIdentity);

    issueName = '<h2>' + issueName + '</h2>';


    //console.log('Searching for character picture: ' + searchPicture);
    searchPicture = '<img src="' + searchPicture + '">';

    $('#characterPic').append(
        searchPicture
    );
    $('#displayName').append(
        searchIdentity
    );

    $('#firstCover').append(
        issuePicture
    );

    $('#firstTitle').append(
        issueName
    );

    getSecondID();
    findGameID();
    //findTrending();
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
    .catch(err=>  $('#errorLog').append(<p>Search Interrupted</p>));

}

function latestIssues(responseJSON){
    console.log('latestIssues ran');

    
    let issueCount = 5; //number of issues in the 'recent' section
       if (issueCount > responseJSON.data.count){
            issueCount = responseJSON.data.count;
        }

        console.log('issueCount: ' + issueCount);

    for (i = 0; i < issueCount; i++){ //I need to add a if clause for empty objects 

        issuePath = responseJSON.data.results[i].images[0].path;
        issueExtension = responseJSON.data.results[i].images[0].extension;
        issuePicture = issuePath + '.' + issueExtension;
    
        //console.log('issuePicture: ' + issuePicture);
    
        issuePicture = '<img src="' + issuePicture + '">';

        backInfo = '<img src=avengers.jpg>';

        cardFront = issuePicture;
        cardBack = backInfo;

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";
        
        //add avengers jpg temp
    
        $('#recent').append(
            newCard
        );

    }

    if (issueCount < 5){
        spaceFill(issueCount, )
    }


}

async function findGameID(){
    console.log('findGameID ran');

    let gameIDSearch = corsAnywhere + "https://www.giantbomb.com/api/characters?api_key=" + bombAPI + "&format=json&filter=aliases:" + searchName;

    console.log('gameIDSearch: ' + gameIDSearch);
    
   await fetch(gameIDSearch) //{mode: "no-cors"}
   .then(response => response.json())
   .then(responseJSON => {     
        if (responseJSON.number_of_total_results === 0){
            console.log('game results: ' + responseJSON.number_of_total_results);
           throw new Error(response.status);
        }
        else{
            console.log('game results: ' + responseJSON.number_of_total_results);
           findGames(responseJSON);
        }
    })
       .catch(err=>  $('#errorLog').append(<p>No games found</p>));

}

async function findGames(gameJSON){
    console.log('findGames ran');

    gameID = gameJSON.results[0].guid;

    let guidSearch = corsAnywhere + 'https://www.giantbomb.com/api/character/' + gameID + '/?api_key=' + bombAPI + '&format=json';

    await fetch(guidSearch) //{mode: "no-cors"}
   .then(response => response.json())
   .then(responseJSON => {     
        if (responseJSON.number_of_total_results === 0){
            console.log('game results: ' + responseJSON.number_of_total_results);
           throw new Error(response.status);
        }
        else{
            console.log('game results: ' + responseJSON.number_of_total_results);
           latestGames(responseJSON);
        }
    })
    .catch(err=>  $('#errorLog').append(<p>No games found</p>));

}

function latestGames(guidJSON){
    console.log('latestGames ran');

    let gameCount = 5; //number of issues in the 'recent' section
    if (gameCount > guidJSON.results.games.length){
        gameCount = guidJSON.results.games.length;
     }

     console.log('There are ' + gameCount + ' games');  

     let gameCap = '';

     for (i = 0; i < gameCount; i++){

        gameCap = guidJSON.results.games[i].api_detail_url;
        

      populateGames(gameCap);
        
     }

     if (gameCount < 5){
        spaceFill(gameCount, 'games');
    }

    

}

async function populateGames(newGame){
    console.log('populateGames ran');

    newGame = corsAnywhere + newGame + '?api_key=' + bombAPI + '&format=json';

    await fetch(newGame) //{mode: "no-cors"}
   .then(response => response.json())
   .then(responseJSON => loadGame(responseJSON))
   .catch(err=>  $('#errorLog').append(<p>Game error</p>));

}

function loadGame(coverJSON){
    console.log('loadGame ran');

    let gameCover = coverJSON.results.image.medium_url;

    gameCover = '<img src="' + gameCover + '">';

    backInfo = '<img src="avengers.jpg">';

        cardFront = gameCover;
        cardBack = backInfo;

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";

    $('#games').append(
        newCard
    );

    //console.log('cover jpg: ' + gameCover);

}

async function findTrending(){
    console.log('findTrending ran');

    let googleSearch = 'https://www.googleapis.com/youtube/v3/search?key=' + googleAPI + '&part=snippet&type=video&q=' + searchName;

   await fetch(googleSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.pageInfo.totalResults == 0){
            throw new Error(response.status);
        }
        else{       
            getTrending(responseJSON);
        }
    })
    .catch(err=>  $('#errorLog').append(<p>Couldn't find any videos</p>));

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

function spaceFill(counter, space){
    console.log('spaceFill ran');

    space = '#' + space;

    console.log ('spaceholders are going to ' + space);

    for (i = counter; i < 5; i++){

        cardFront = '<img src=avengers.jpg>';
        cardBack = '<img src=avengers.jpg>';

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";
    
        $(space).append(
            newCard
        );
    }
}

$(readyFunctions);
