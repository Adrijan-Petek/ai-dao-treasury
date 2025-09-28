/**
 * Submit a proposal using the relayer/owner account.
 * Usage: npx hardhat run scripts/propose.js --network hardhat
 */
const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const daoAddr = process.env.DAO_ADDRESS || '';
  if (!daoAddr) throw new Error('Please set DAO_ADDRESS env var in .env or export it');

  const dao = await hre.ethers.getContractAt('DAOTreasury', daoAddr);
  const strategy = process.env.STRATEGY_ADDRESS || '';
  if (!strategy) throw new Error('Please set STRATEGY_ADDRESS env var');

  const description = 'Allocate 1 ETH to strategy mock - proposed by ML adapter';
  const tx = await dao.propose(strategy, '0x', description); // no calldata
  const receipt = await tx.wait();
  console.log('Proposal tx:', receipt.transactionHash);
}

main().catch(console.error);
