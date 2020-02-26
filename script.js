const apikey = 'e00e070ff664e28f2e1b568199db890a';
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0';
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

let code = ts + otherkey + apikey;
    console.log('code: ' + code);

let hash = md5(code);
hash = hash.toString();
hash = hash.toLowerCase();

const urlBase = 'http://gateway.marvel.com/v1/public/characters?';
const urlTail = 'ts=' + ts + '&apikey=' + apikey + '&hash=' + hash;

issueName = '';
issuePicture = '';

characterID = 0;

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

    let marvelSearch = urlBase + urlTail + '&name=' + searchName;
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
            populateProfile(responseJSON);
        }
    })
    .catch(err=> alert("Couldn't find that character"));

}

 async function populateProfile (profileJSON){
    console.log('populateProfile ran')

    characterID =  profileJSON.data.results[0].id;

    issueName = profileJSON.data.results[0].comics.items[0].name;

    console.log('issueName: ' + issueName);

    let issueData = profileJSON.data.results[0].comics.items[0].resourceURI;
    issueData = issueData + '?' + urlTail;

    console.log('issueData: ' + issueData);
    
    await fetch(issueData)
    .then(response => response.json())
    .then(responseJSON => issueCover(responseJSON))
    .catch(err => alert('error'));

    issuePicture = '<img src="' + issuePicture + '">';

    issueName = '<h2>' + issueName + '</h2>';

    $('#firstCover').append(
        issuePicture
    );

    $('#firstTitle').append(
        issueName
    );

    let issueCount = 6;
        if (issueCount > profileJSON.data.results[0].comics.available){
            issueCount = profileJSON.data.results[0].comics.available;
            issueCount = issueCount + 1;
        }

    for (i = 1; i < issueCount; i++){

    }

}

function issueCover(coverData){
console.log('issueCover ran');

    jpegFirst = coverData.data.results[0].images[0].path;
    jpegSecond = coverData.data.results[0].images[0].extension;

    issuePicture = jpegFirst + '.' + jpegSecond;

    console.log('image link : ' + issuePicture);


}

$(readyFunctions);