# AI DAO Treasury

A decentralized autonomous organization (DAO) treasury system that uses AI/ML recommendations to allocate funds to investment strategies. The system combines on-chain governance with off-chain AI analysis for automated fund management.

## Overview

**On-chain components**
- `DAOTreasury.sol` — Treasury contract that:
  - Receives and holds ETH.
  - Accepts proposals from an owner or a configured relayer (the relayer represents the off-chain ML adapter).
  - Allows simple voting (1-address => 1-vote) during a configurable voting period.
  - Executes a passed proposal by transferring ETH to a strategy contract and calling its `execute` method.

- `IStrategy.sol` / `StrategyMock.sol` — Strategy interface & mock example.

- `DAOAccessControl.sol` — Owner + relayer pattern for submitting proposals.

**Off-chain components**
- `offchain/ml_adapter.py` — Example stub: an ML adapter that would produce strategy recommendations and write a proposal JSON file.
- `scripts/` — Hardhat scripts to propose, vote, execute.

---

## Features & Flow

1. Off-chain ML adapter analyzes on-chain & market data and recommends an allocation to `strategy_address`.
2. The adapter (or a relayer) calls `DAOTreasury.propose(...)`.
3. DAO members vote on-chain during the voting period.
4. If proposal passes, any actor can call `executeProposal(...)` specifying the amount to allocate; funds are sent to the strategy and `execute(...)` is invoked.

---

## Getting Started (Local)

Requirements:
- Node 18+
- npm
- Python 3.8+ (for ML adapter)

1. Install dependencies
```bash
npm ci
```

2. Run tests
```bash
npm test
```

3. Deploy locally (Hardhat)
```bash
npx hardhat run scripts/deploy.js
```
This prints deployed addresses. Fund the DAOTreasury with:
```bash
# in a new terminal:
npx hardhat console --network hardhat
> (await ethers.getSigners())[0].sendTransaction({to: '<DAO_ADDRESS>', value: ethers.parseEther('1')})
```

4. Generate a demo proposal using the off-chain adapter
```bash
python3 offchain/ml_adapter.py
# This writes out/proposal.json
```

5. Submit the proposal (use the `scripts/propose.js` script after setting env vars)
```bash
export DAO_ADDRESS=<deployed_dao_address>
export STRATEGY_ADDRESS=<deployed_strategy_address>
npx hardhat run scripts/propose.js
```

6. Vote via `scripts/vote.js` as different signers in Hardhat. After voting period you may call `scripts/execute.js`.

---

## Extending for Production

This template is deliberately simple. Before considering production:

- Replace voting with a token-weighted governance system (OpenZeppelin Governor or Snapshot + Gnosis Safe timelock).
- Add timelocks and multisig execution (Gnosis Safe).
- Use token-weighted voting with snapshot-based vote counting.
- Add proposal queuing and execution delays.
- Replace relayer pattern with signed messages for proposals.
- Audit contracts for reentrancy and economic attacks.
- Add keeper/automation for proposal execution windows and proposer incentives.

---

## Security Notice

This project is educational and **must not** be used to hold real funds without proper audits, multisig protection, and tested off-chain components.

---

## License

MIT
