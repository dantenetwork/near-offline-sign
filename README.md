# near-offline-sign

This is a tool for `offline transaction`, can be used to sign transaction offline.

## Prerequisite
1.nodejs
2.npm

## Install
`npm install`

## Usage
1.Sign transactions

`node index.js --mint --nonce <NONCE> --block <BLOCK_HASH>`  
`<NONCE>` and `<BLOCK_HASH>` can be got by [near-online-send-tx](https://github.com/dantenetwork/near-online-send-tx)

2.Send transaction

`node index.js --send <TRANSACTION_DATA>`