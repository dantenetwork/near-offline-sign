const fs = require('fs');

module.exports = {
    getPrivateKey: function(accountName) {
        let keysStr = fs.readFileSync('.keys.json');
        let privateKey = JSON.parse(keysStr)[accountName].secretKey;
        if (privateKey == null) {
            console.log('Private key not found for account: ' + accountName);
        }
        return privateKey;
    },

    savePrivateKey: function(accountName, phrase) {
        let keysStr = fs.readFileSync('.keys.json');
        let keyJson = JSON.parse(keysStr);
        keyJson[accountName] = phrase;
        
        const writerStream = fs.createWriteStream('.keys.json');
        writerStream.write(JSON.stringify(keyJson, null, 2), 'UTF8');
        writerStream.end();
    }
}