let apikey = 'e00e070ff664e28f2e1b568199db890a';
let otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0';
let ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

let baseURL = 'http://gateway.marvel.com/v1/public/characters?';

function readyFunctions(){
        console.log('readyfunction ran');
    getHash();
}

function getHash(){
        console.log('getHash ran');

    let code = ts + otherkey + apikey;
        console.log('code: ' + code);

    let hash = md5(code);
    hash = hash.toString();
    hash = hash.toLowerCase();
        
        console.log('hash: ' + hash);

        getName();
}

async function getName(){
    
    await $('#characterSearch').off('click');

    await $('#characterSearch').on('click', '#findCharacter', function(event){
        event.preventDefault();
        
        emptyDisplays();
        let searchName = $('input[name="characterName"]').val(); 
            console.log('You are searching for: ' + searchName);
        
            marvelAPI();
        
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

function marvelAPI(){
    console.log('marvelAPI ran');
}

$(readyFunctions);