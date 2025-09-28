/**
 * Execute a proposal after voting period.
 * Usage: npx hardhat run scripts/execute.js --network hardhat --proposal 1 --amount 1000000000000000000
 */
const hre = require('hardhat');

async function main() {
  const args = process.argv.slice(2);
  const proposalArgIndex = args.indexOf('--proposal');
  const amountArgIndex = args.indexOf('--amount');
  if (proposalArgIndex === -1) throw new Error('use --proposal <id>');
  const proposalId = parseInt(args[proposalArgIndex + 1]);
  const amount = amountArgIndex !== -1 ? args[amountArgIndex + 1] : '0';

  const daoAddr = process.env.DAO_ADDRESS || '';
  const dao = await hre.ethers.getContractAt('DAOTreasury', daoAddr);
  const tx = await dao.executeProposal(proposalId, amount);
  await tx.wait();
  console.log('Executed proposal', proposalId);
}

main().catch(console.error);
