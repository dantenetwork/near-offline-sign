const { program } = require('commander');
const mint = require('./mint');
const createSubAccount = require('./createSubAccount');
const deployContract = require('./deployContract');

async function main() {
	function list(val) {
		return val.split(',')
	}
	
	program
	  .version('0.1.0')
	  .option('-m, --mint', 'sign minting transaction')
	  .option('-d, --deploy', 'deploy contract')
	  .option('-s, --sub_account <new_account_name, from_account_name>', 'create sub account', list)
	  .option('-n, --nonce <nonce>', 'nonce for first transaction')
	  .option('-b, --block <block>', 'block address')
	  .parse(process.argv);
	console.log(program.opts())

	let nonce = program.opts().nonce;
	let block = program.opts().block;
	if (!nonce) {
		console.log('nonce is needed');
		return;
	}

	if (!block) {
		console.log('block is needed');
		return;
	}
	
	if (program.opts().mint) {
		mint.sign(nonce, block);
	}
	else if (program.opts().sub_account) {
		let params = program.opts().sub_account;
		createSubAccount.sign(nonce, block, params[0], params[1]);
	}
	else if (program.opts().deploy) {
		deployContract.sign(nonce, block);
	}
}

main()