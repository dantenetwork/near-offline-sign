const { utils, transactions } = require("near-api-js");
const sha256 = require("js-sha256");
const path = require("path");
const fs = require("fs");
const config = require('./config');
const helper = require('./helper');

module.exports = {
    sign: function (nonce, blockHash) {
        let DEPLOY = config.deploy;
        const WASM = fs.readFileSync(path.join(__dirname, DEPLOY.WASM));
        let actions = [
            transactions.deployContract(WASM),
            transactions.functionCall("new", {owner_id: DEPLOY.OWNER,
                metadata:{
                    spec:"nft-1.0.0",
                    name:"Dante World Tree",
                    symbol:"DNFT",
                    icon:"data:image/svg+xml,%3Csvg id=\"2\" data-name=\"2\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"52\" height=\"52\" viewBox=\"0 0 130 130\"%3E%3Cimage id=\"1\" data-name=\"1\" x=\"3\" y=\"24\" width=\"73\" height=\"83\" xlink:href=\"data:img/png;base64,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\"/%3E%3Cg id=\"组_1\" data-name=\"组 1\"%3E%3Cimage id=\"7\" data-name=\"7\" x=\"122\" y=\"58\" width=\"7\" height=\"7\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAMklEQVQImQEnANj/AeNqmv/x+RIA5gYSAAQKEuoAAO8AAP/4AAAEAwr3owX29f8J+QoAOfMPeKUsJkcAAAAASUVORK5CYII=\"/%3E%3Cimage id=\"6\" data-name=\"6\" x=\"116\" y=\"49\" width=\"8\" height=\"7\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAMklEQVQImQEnANj/AeVtlf/m9h0A4woTAAQKFekAFOUKAAH2AAAEAwn3tgUG+PsJ/PgCJnkOof59xooAAAAASUVORK5CYII=\"/%3E%3Cimage id=\"5\" data-name=\"5\" x=\"102\" y=\"56\" width=\"11\" height=\"9\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAT0lEQVQImQFEALv/AeZvk//w9BgA7AMOANsOFAAEBw3xAAr4DAAQ/AIAFPcJAAQFDvIACPUMAP71AgAU+gkABAEE/JsCBvv8A/j7AAb7/AUdVBfN4sRS1wAAAABJRU5ErkJggg==\"/%3E%3Cimage id=\"4\" data-name=\"4\" x=\"80\" y=\"66\" width=\"16\" height=\"11\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAXElEQVQImQXBTQ6CMBCA0a90+hsihLN6DU/JgrgwLgymTDrAe+79fF3/30Lrlc8wsZUH31yQUHeSJsAx9sCsgQuQITckNk4TUs9UU44uiI+6+nSYt0hQJZ9KNXE3kVsiDW9QIZUAAAAASUVORK5CYII=\"/%3E%3Cimage id=\"3\" data-name=\"3\" x=\"82\" y=\"48\" width=\"15\" height=\"11\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAWklEQVQImQXB0Q2DMAxAwRfHNUHQTtnZWIoFkPgBIURp3Lh3aX5PcUbP+nixWc8yPNnN0GInfIPqSorgzkoiULULa0KpBf9lxnpTRVDtrqO1TPEPLRKjGy7CHx1zI+jnYM//AAAAAElFTkSuQmCC\"/%3E%3C/g%3E%3C/svg%3E%0A"
                }}, "30000000000000", "0")
            ];

        let secretKey = helper.getPrivateKey(DEPLOY.SENDER);
        if (secretKey == null) return;
        const keyPair = utils.key_pair.KeyPairEd25519.fromString(secretKey);
        const transaction = transactions.createTransaction(
                DEPLOY.SENDER,
                keyPair.getPublicKey(),
                DEPLOY.CONTRACT_ADDR,
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
    }
}