const apikey = 'e00e070ff664e28f2e1b568199db890a'; //marvel api
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0'; //marvel private api key
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

const bombAPI = '91c6a17d06ec9512747ce30cfef6796a316cdbdd'; //giantbomb API

const googleAPI = 'AIzaSyAGkx9PasW-0DD2okuG7OMyFGpNx3COn1U';

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

issueTitle = '';
issueDescibe = '';

issueID = '';
issueLink = '';

videoCap = '';

gameID = 0;

gameTitle = '';
gameDescibe = '';

divID = '';
divLink = '';

trendTitle = '';
trendDescibe = '';

trendID = '';
trendLink = '';
trendBack = '';
trendLine = '';

backInfo = '';
gameBack = '';

newCard = '';
cardFront= '';
cardBack= '';

issueError = 0;
gameError = 0;
trendError = 0;

appFrame = '<div><form id="characterSearch"><input type="text" name="characterName" id="characterName" value="Peter Parker" required><div><input type="submit" value="Search" class="findCharacter"></div></form><img src="logo.jpg" class="marvelLogo"><div id="errorLog"></div><div id="displayName"></div> </div><section class="basicInfo"> <div id="profile"> <div id="characterPic"></div>  </div><div id="firstApperance">  <div class="flipper"><div class="card"><div id="firstCover" class="flipSide cardFront"></div><div id="firstTitle" class="flipSide cardBack"></div></div></div></div> </section><section class="infoRow">  <div id="recent"></div>  </section><section class="infoRow">    <div id="games"></div>  </section><section class="infoRow">    <div id="trending"></div>  </section>';

function readyFunctions(){
        console.log('readyfunction ran');
    readySearch();
}

function readySearch(){
     
    $('#openingSearch').off('click');

    $('#openingSearch').on('click', '.firstFind', function(event){
       //fires twice with multiple clicks
       event.preventDefault();
       
       emptyDisplays();
        searchName = $('input[name="firstName"]').val(); 
           console.log('You are searching for: ' + searchName);

           $('#marvelApp').append(appFrame);
           $('#oGSearch').empty();
       
           marvelAPI();
       
       });
}


function getName(){
    
     $('#characterSearch').off('click');

     $('#characterSearch').on('click', '.findCharacter', function(event){
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

    $('errorLog').empty();

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

    issueDescibe = profileJSON.data.results[0].description;
    issueLink = profileJSON.data.results[0].urls[0].url;

    if (issueDescibe == 'null'){
        issueDescibe = 'A summery for this issue is not in the database';
    }

    //console.log ('The story is: ' + issueDescibe);
   
    issuePicture = '<img src="' + issuePicture + '">';

    let searchIdentity = '<h2>' + searchName + '</h2>';
    console.log('identity is ' + searchIdentity);

    issueID = 'firstCover'

    issueName = '<h2>' + issueName + '</h2>';
    issueName = issueName + '<p>' + issueDescibe + '</p>';
    issueName = '<div id=' + issueID + ' onclick="comicLink(' + issueID + ',' + issueLink + ')">' + issueName + '</div>';


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

    comicLink(issueID, issueLink);

    getName();
    getSecondID();
    findGameID();
    findTrending();
}

async function getSecondID(){

    lastSearch = urlBase + '/' + characterID + '/comics?' + urlTail + '&dateRange=1950-01-01,2090-01-01&orderBy=-onsaleDate';
    console.log("Last Search: " + lastSearch);

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
    .catch(err=>  
        {
            $('#errorLog').append('<p>Search Interrupted</p>'),
            console.log('Only ' + issueError +   ' issues are made. Need to fill space'),
            spaceFill(issueError, 'recent')
        }    
    );
    

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

        issueTitle = responseJSON.data.results[i].title;
        //console.log('the title is' + issueTitle);
        issueDescibe = responseJSON.data.results[i].description;

        if (issueDescibe === 'null'){
            issueDescibe = 'A summery for this issue is not in the database';
        }

        issueDescibe = truncate(issueDescibe);
        //console.log('the story is ' + issueDescibe);
    
        //console.log('issuePicture: ' + issuePicture);
    
        issuePicture = '<img src="' + issuePicture + '">';

        issueID = 'comic' + i;
        issueLink = responseJSON.data.results[i].urls[0].url;
        //console.log('issueLink: ' + issueLink);

        backInfo = '<h2>' + issueTitle + '</h2>';
        backInfo = backInfo + '<p>' + issueDescibe + '</p>';
        backInfo = '<div id=' + issueID + ' onclick="comicLink(' + issueID + ',' + issueLink + ')">' + backInfo + '</div>';
        //console.log('backinfo is' + backInfo);
        //backInfo = '<img src=avengers.jpg>';
        //backInfo Marker

        cardFront = issuePicture;
        cardBack = backInfo;

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";
        
        //add avengers jpg temp
    
        $('#recent').append(
            newCard
        );

        comicLink(issueID, issueLink);

        issueError++;

    }

    if (issueCount < 5){
        spaceFill(issueCount, 'recent');
    }
    
    issueError = 0;

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
       .catch(err=>  {
        $('#errorLog').append('<p>No games found</p>'),
        gameError = 0,
        console.log('Only ' + gameError +   ' games were made. Need to fill space'),
        spaceFill(gameError, 'games')
        
       });

}

async function findGames(gameJSON){
    console.log('findGames ran');

    gameID = gameJSON.results[0].guid;

    let guidSearch = corsAnywhere + 'https://www.giantbomb.com/api/character/' + gameID + '/?api_key=' + bombAPI + '&format=json';
    console.log("GUID: " + guidSearch);

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
    .catch(err=>  $('#errorLog').append('<p>No games found</p>'));

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
        divID = 'game' + i;        

      populateGames(gameCap, divID);
        
     }

     if (gameCount < 5){
        spaceFill(gameCount, 'games');
    }

    

}

async function populateGames(newGame, ID){
    console.log('populateGames ran');

    newGame = corsAnywhere + newGame + '?api_key=' + bombAPI + '&format=json';
    console.log("new game: " + newGame);

    await fetch(newGame) //{mode: "no-cors"}
   .then(response => response.json())
   .then(responseJSON => loadGame(responseJSON, ID))
   .catch(err=>  $('#errorLog').append('<p>Game error</p>'));

}

function loadGame(coverJSON, backID){
    console.log('loadGame ran');

    let gameCover = coverJSON.results.image.medium_url;

    gameCover = '<img src="' + gameCover + '">';

    gameTitle = coverJSON.results.name;
    //console.log('title: ' + gameTitle);

    divLink = coverJSON.results.site_detail_url;
    //console.log('link: ' + divLink);

    //backInfo = '<img src="avengers.jpg">';
    gameBack = '<h2>' + gameTitle + '</h2>';
    //gameBack = '<div id=' + backID + '>' + gameBack + '</div>';
    gameBack = '<div id=' + backID + ' onclick="comicLink(' + backID + ',' + divLink + ')">' + gameBack + '</div>';

        cardFront = gameCover;
        cardBack = gameBack;

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";

    $('#games').append(
        newCard
    );

    comicLink(backID, divLink);
    
        gameError ++;
        
    //console.log('cover jpg: ' + gameCover);

}

async function findTrending(){
    console.log('findTrending ran');

    let googleSearch = 'https://www.googleapis.com/youtube/v3/search?key=' + googleAPI + '&part=snippet&type=video&q=' + searchName;
    console.log('google search: ' + googleSearch);

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
    .catch(err=> {
            $('#errorLog').append("<p>Couldn't find any videos</p>"),
            console.log('Only ' + trendError +   ' videos were made. Need to fill space'),
            spaceFill(trendError, 'trending')
    });

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

        trendID = 'trend' + i;

        trendLink = trendingJSON.items[i].id.videoId;
        console.log ('video id: ' + trendLink);
        trendLink = 'https://www.youtube.com/watch?v=' + trendLink;

        trendtitle = trendingJSON.items[i].snippet.title;
        trendDescibe = trendingJSON.items[i].snippet.description;
        
        trendDescibe = truncate(trendDescibe);

        //trendBack = '<img src="avengers.jpg">';

        trendBack = '<h2>' + trendtitle + '</h2>';
        trendBack = trendBack + '<p>' + trendDescibe + '</p>';
        //trendBack = '<div id="' + trendID + '">' + trendBack + '</div>';
        trendBack = '<div id=' + trendID + ' onclick="comicLink(' + trendID + ',' + trendLink + ')">' + trendBack + '</div>';

        cardFront = videoCap;
        cardBack = trendBack;

        newCard = " <div class='flipper'><div class='card'> <div class='flipSide cardFront'>" + cardFront + "</div> <div class='flipSide cardBack'>" + cardBack + "</div> </div> </div>";
    
        $('#trending').append(
            newCard
        );

        comicLink(trendID, trendLink);

    }

    
    if (videoCount < 5){
        spaceFill(videoCount, 'trending');
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

function truncate(str) {
    let newStr = str.split(" ").splice(0,35).join(" ");
    newStr = newStr + '...';
    return newStr; 
}

function comicLink(page, link){
    page = '#' + page;
    $(page).on('click', function(){
        window.open(link);    
   });
       
}

$(readyFunctions);
