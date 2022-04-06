const { utils, transactions } = require("near-api-js");
const sha256 = require("js-sha256");
const path = require("path");
const fs = require("fs");
const homedir = require("os").homedir();
const config = require('./config');
// const CREDENTIALS_DIR = ".near-credentials";
const sender = config.SENDER;
const keyFilePath = path.resolve(
  homedir,
  `./.near-credentials/${config.NETWORK_ID}/${sender}.json`
);
const keyFile = require(keyFilePath);

// read address infomation from file
function getAddressInfo(callback) {
  let data = '';
  const readerStream = fs.createReadStream(config.ADDRESS_FILE);
  readerStream.setEncoding('UTF8');
  
  // append chunk data to transactions
  readerStream.on('data', function (chunk) {
    data += chunk;
  });

  // read stream completed, start to query transaction
  readerStream.on('end', async function () {
    callback(data)
  });
}

function parseAddressInfo(data) {
  let addrInfo = [];
  let addresses = data.split("\r\n");
  for (let i = 0; i < addresses.length; ++i) {
    let item = addresses[i];
    if (item.includes('|')) {
      let info = item.split('|');
      addrInfo.push(info);
    }
  }
  return addrInfo;
}

module.exports = {
  sign: function(nonce, blockHash) {
    getAddressInfo(async (data) => {
      console.log('data', data);
      let addrInfos = parseAddressInfo(data);
      console.log('addrInfos', addrInfos);

      let actions = [];
      for (let i = 0; i < addrInfos.length; i++) {
        let addrInfo = addrInfos[i];
        let metaData = {
          title: addrInfo[2],
          description: addrInfo[3],
          media: addrInfo[4]
        }
        console.log({ token_id: addrInfo[1], receiver_id: addrInfo[0], token_metadata: metaData });
        const action = transactions.functionCall(
            "nft_mint",
            { token_id: addrInfo[1], receiver_id: addrInfo[0], token_metadata: metaData },
            "30000000000000",
            "8000000000000000000000"
          );
        actions.push(action);
      }      
console.log('action', actions);
      const blockHashDecoded = utils.serialize.base_decode(blockHash);
      // create transaction
      const keyPair = utils.key_pair.KeyPairEd25519.fromString(keyFile.private_key);
      const transaction = transactions.createTransaction(
        sender,
        keyPair.getPublicKey(),
        config.CONTRACT_ADDR,
        nonce,
        actions,
        blockHashDecoded
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
      console.log(Buffer.from(signedSerializedTx).toString("base64"));
    })
  },
}