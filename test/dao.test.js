const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DAOTreasury', function () {
  let dao, strat, deployer, user1, user2;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();
    const DAOTreasury = await ethers.getContractFactory('DAOTreasury');
    dao = await DAOTreasury.deploy(deployer.address);
    await dao.waitForDeployment();

    const StrategyMock = await ethers.getContractFactory('StrategyMock');
    strat = await StrategyMock.deploy();
    await strat.waitForDeployment();
  });

  it('should accept deposits', async function () {
    await deployer.sendTransaction({to: dao.target, value: ethers.parseEther('1')});
    const balance = await ethers.provider.getBalance(dao.target);
    expect(balance).to.equal(ethers.parseEther('1'));
  });

  it('owner/relayer can propose and users can vote and execute when passed', async function () {
    // fund treasury
    await deployer.sendTransaction({to: dao.target, value: ethers.parseEther('2')});

    // set relayer to deployer (owner by default)
    await dao.setRelayer(deployer.address);

    // create proposal
    const tx = await dao.propose(strat.target, '0x', 'test');
    await tx.wait();
    const proposalId = 1;

    // user1 vote for
    await dao.connect(user1).vote(proposalId, true);
    // user2 vote for
    await dao.connect(user2).vote(proposalId, true);

    // fast-forward blocks until after voting
    const votingPeriod = await dao.votingPeriodBlocks();
    for (let i = 0; i <= Number(votingPeriod) + 1; i++) {
      await ethers.provider.send('evm_mine');
    }

    // execute (send 1 ETH)
    await dao.executeProposal(proposalId, ethers.parseEther('1'));
    // check treasury balance decreased
    const balanceAfter = await ethers.provider.getBalance(dao.target);
    expect(balanceAfter).to.be.lt(ethers.parseEther('2'));
  });
});
