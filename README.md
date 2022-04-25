# near-offline-sign

This is a tool for `offline transaction`, can be used to sign transaction offline.

## Prerequisite
1.nodejs
2.npm

## Install
`npm install`

## Usage
1.Create sub account

`node index.js --sub_account <NEW_ACCOUNT>,<FROM_ACCOUNT> --nonce <NONCE> --block <BLOCK_HASH>`  
`<NEW_ACCOUNT>` must be derived from `<FROM_ACCOUNT>`. For example, derive `nft.test.testnet` from `test.testnet`.

`<NONCE>` and `<BLOCK_HASH>` can be got by [near-online-send-tx](https://github.com/dantenetwork/near-online-send-tx)

2.Deploy contract

`node index.js --deploy --nonce <NONCE> --block <BLOCK_HASH>`  
Field `deploy` of `config.js` needs to be changed.

3.Mint NFT

`node index.js --mint --nonce <NONCE> --block <BLOCK_HASH>`  
Field `mint` of `config.js` needs to be changed.

2.Send transaction

`node index.js --send <TRANSACTION_DATA>`