const apikey = 'e00e070ff664e28f2e1b568199db890a';
const otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0';
const ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

const urlBase = 'http://gateway.marvel.com/v1/public/characters?';

function readyFunctions(){
        console.log('readyfunction ran');
    getName();
}

function getHash(){
        console.log('getHash ran');

    let code = ts + otherkey + apikey;
        console.log('code: ' + code);

    let hash = md5(code);
    hash = hash.toString();
    hash = hash.toLowerCase();
        
        console.log('hash: ' + hash);

        return hash;
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
    $('#firstApperance').empty();

    $('#recent').empty();
    $('#movies').empty();
    
    $('#games').empty();
    $('#trending').empty();
}

function marvelAPI(searchName){
    console.log('marvelAPI ran');

    let hash = getHash();

    let marvelSearch = urlBase + 'ts=' + ts + '&apikey=' + apikey + '&hash=' + hash + '&name=' + searchName;
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
            alert("Did it!");
        }
    })
    .catch(err => alert("Couldn't that character"));

}

$(readyFunctions);