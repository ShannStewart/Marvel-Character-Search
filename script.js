apikey = 'e00e070ff664e28f2e1b568199db890a';
otherkey = 'a89a2c364ea62c3a0e31da7f3191b3f3177e9ae0';
ts = '1';
//hash = '175541113e757d45c978347bd7877f22';

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

}

$(readyFunctions);