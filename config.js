let mainnet = {
	ADDRESS_FILE: './work/mintAddresses.csv',
	TX_DATA: './work/txData.txt',
	NETWORK_ID: 'testnet',
	mint: {
		CONTRACT_ADDR: 'nft.georgecross.testnet',
		SENDER: 'nft.georgecross.testnet'
	},
	deploy: {
		WASM: './work/non_fungible_token.wasm',
		CONTRACT_ADDR: 'nft.georgecross.testnet',
		OWNER: 'nft.georgecross.testnet',
		SENDER: 'nft.georgecross.testnet'
	}
}

module.exports = mainnet