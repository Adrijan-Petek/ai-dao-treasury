/**
 * Vote on a proposal (simple demo).
 * Usage: npx hardhat run scripts/vote.js --network hardhat --proposal 1 --support true
 */
const hre = require('hardhat');

async function main() {
  const args = process.argv.slice(2);
  const proposalArgIndex = args.indexOf('--proposal');
  const supportArgIndex = args.indexOf('--support');
  if (proposalArgIndex === -1) throw new Error('use --proposal <id>');
  const proposalId = parseInt(args[proposalArgIndex + 1]);
  const support = supportArgIndex !== -1 ? (args[supportArgIndex + 1] === 'true') : true;

  const daoAddr = process.env.DAO_ADDRESS || '';
  const dao = await hre.ethers.getContractAt('DAOTreasury', daoAddr);
  const tx = await dao.vote(proposalId, support);
  await tx.wait();
  console.log('Voted on proposal', proposalId, 'support=', support);
}

main().catch(console.error);
