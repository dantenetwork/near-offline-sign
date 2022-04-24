const { utils, transactions } = require("near-api-js");
const sha256 = require("js-sha256");
const fs = require("fs");
const config = require('./config');
const helper = require("./helper");
// const CREDENTIALS_DIR = ".near-credentials";

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
    const sender = config.mint.SENDER;
    
    getAddressInfo(async (data) => {
      let addrInfos = parseAddressInfo(data);

      let actions = [];
      for (let i = 0; i < addrInfos.length; i++) {
        let addrInfo = addrInfos[i];
        let metaData = {
          title: addrInfo[2],
          description: addrInfo[3],
          media: addrInfo[4]
        }
        
        const action = transactions.functionCall(
            "nft_mint",
            { token_id: addrInfo[1], receiver_id: addrInfo[0], token_metadata: metaData },
            "10000000000000",
            "10000000000000000000000"
          );
        actions.push(action);
      }
      
      const blockHashDecoded = utils.serialize.base_decode(blockHash);
      // create transaction
      let privateKey = helper.getPrivateKey(sender);
      const keyPair = utils.key_pair.KeyPairEd25519.fromString(privateKey);
      const transaction = transactions.createTransaction(
        sender,
        keyPair.getPublicKey(),
        config.mint.CONTRACT_ADDR,
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

      // create write stream to write data to file
      const writerStream = fs.createWriteStream(config.TX_DATA);
      writerStream.write(Buffer.from(signedSerializedTx).toString("base64"), 'UTF8');
      writerStream.end();
    })
  },
}