const { utils, transactions } = require("near-api-js");
const { generateSeedPhrase } = require("near-seed-phrase");
const sha256 = require("js-sha256");
const config = require('./config');
const helper = require("./helper");
const fs = require('fs');

module.exports = {
    sign: function(nonce, blockHash, newAccount, sender) {
        let privateKey = helper.getPrivateKey(sender);
        if (privateKey == null) return;
        const keyPair = utils.key_pair.KeyPairEd25519.fromString(privateKey);

        const seedPhrase = generateSeedPhrase();
        console.log('seedPhrase', seedPhrase);
        const newKeyPair = utils.key_pair.KeyPairEd25519.fromString(seedPhrase.secretKey);

        let actions = [
            transactions.createAccount(),
            transactions.transfer("1000000000000000000000000"),  // at least 1820000000000000000000
            transactions.addKey(newKeyPair.getPublicKey(), transactions.fullAccessKey())
        ];

        const transaction = transactions.createTransaction(
            sender,
            keyPair.getPublicKey(),
            newAccount,
            nonce,
            actions,
            utils.serialize.base_decode(blockHash)
        );
        
        const serializedTx = utils.serialize.serialize(
            transactions.SCHEMA,
            transaction
        );
        
        const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
        const signature = keyPair.sign(serializedTxHash);
        const signedTransaction = new transactions.SignedTransaction({
            transaction,
            signature: new transactions.Signature({
              keyType: transaction.publicKey.keyType,
              data: signature.signature,
            }),
        });
        const signedSerializedTx = signedTransaction.encode();
        
        const writerStream = fs.createWriteStream(config.TX_DATA);
        writerStream.write(Buffer.from(signedSerializedTx).toString("base64"), 'UTF8');
        writerStream.end();

        helper.savePrivateKey(newAccount, seedPhrase);
    }
}