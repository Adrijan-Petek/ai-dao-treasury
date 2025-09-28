/**
 * Deploy DAOTreasury and a simple Strategy mock for demonstration.
 */
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);

  const DAOTreasury = await hre.ethers.getContractFactory('DAOTreasury');
  const dao = await DAOTreasury.deploy();
  await dao.deployed();
  console.log('DAOTreasury deployed to:', dao.address);

  const StrategyMock = await hre.ethers.getContractFactory('StrategyMock');
  const strat = await StrategyMock.deploy();
  await strat.deployed();
  console.log('StrategyMock deployed to:', strat.address);

  console.log('Done. You can now fund the treasury with:', dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
