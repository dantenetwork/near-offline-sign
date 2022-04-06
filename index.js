const { program } = require('commander');
const mint = require('./mint');

async function main() {
	program
	  .version('0.1.0')
	  .option('-m, --mint', 'sign minting transaction')
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
}

main()