const apikey = 'e00e070ff664e28f2e1b568199db890a';
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0';
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

let code = ts + otherkey + apikey;
    console.log('code: ' + code);

let hash = md5(code);
hash = hash.toString();
hash = hash.toLowerCase();

const urlBase = 'http://gateway.marvel.com/v1/public/characters';
const urlTail = 'ts=' + ts + '&apikey=' + apikey + '&hash=' + hash;

issueName = '';
issuePicture = '';

characterID = 0;
firstSearch = '';
lastSearch = '';
issuePath = '';
issueExtension = '';

function readyFunctions(){
        console.log('readyfunction ran');
    getName();
}



async function getName(){
    
    await $('#characterSearch').off('click');

    await $('#characterSearch').on('click', '#findCharacter', function(event){
        event.preventDefault();
        
        emptyDisplays();
        let searchName = $('input[name="characterName"]').val(); 
            console.log('You are searching for: ' + searchName);
        
            marvelAPI(searchName);
        
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

 function marvelAPI(searchName){
    console.log('marvelAPI ran');

    let marvelSearch = urlBase + '?' + urlTail + '&name=' + searchName;
    //http://gateway.marvel.com/v1/public/characters?ts={{ts}}&apikey={{apikey}}&hash={{hash}}

    console.log('fetch code: ' + marvelSearch);

     fetch(marvelSearch)
    .then(response => response.json())
    .then(responseJSON => {
        if (responseJSON.data.count === 0){
            console.log('Count was: ' + responseJSON.data.count);
            throw new Error(response.status);
        }
        else{
            console.log('Count was: ' + responseJSON.data.count);
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
            console.log('Count was: ' + responseJSON.data.count);
            throw new Error(response.status);
        }
        else{
            console.log('Count was: ' + responseJSON.data.count);
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

    console.log('issueName: ' + issueName);

    console.log('issuePicture: ' + issuePicture);

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
            console.log('Count was: ' + responseJSON.data.count);
            throw new Error(response.status);
        }
        else{
            console.log('Count was: ' + responseJSON.data.count);
            latestIssues(responseJSON);
        }
    })
    .catch(err=> alert("Search Interrupted"));

}

function latestIssues(responseJSON){

    let issueCount = 5;
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


}

$(readyFunctions);