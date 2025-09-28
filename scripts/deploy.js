/**
 * Deploy DAOTreasury and a simple Strategy mock for demonstration.
 */
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);

  const Simple = await hre.ethers.getContractFactory('Simple');
  const simple = await Simple.deploy(42);
  console.log('Simple deployed, waiting...');
  await simple.waitForDeployment();
  console.log('Simple deployed to:', simple.target);

  console.log('Done. You can now fund the treasury with:', dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
