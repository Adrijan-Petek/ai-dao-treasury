// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrategy.sol";
import "./DAOAccessControl.sol";

/// @title DAOTreasury
/// @notice Holds funds for DAO and manages simple proposal & voting life-cycle for strategy allocation.
/// @dev This is a template. Important production concerns (vote snapshots, timelocks, governance tokens)
/// should be implemented using battle-tested libraries (OpenZeppelin Governor, Safe, Gnosis) before production.
contract DAOTreasury is DAOAccessControl {
    struct Proposal {
        address proposer;
        address strategy;
        bytes data; // calldata to pass to strategy.execute(...)
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        string description;
    }

    constructor(address initialOwner) DAOAccessControl(initialOwner) {}

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    // Simple on-chain voting using 1-address = 1-vote model for demo purposes.
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public votingPeriodBlocks = 100; // default voting period (~100 blocks)

    event ProposalCreated(uint256 indexed id, address indexed proposer, address strategy, string description);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id, address indexed executor, bool success);
    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Create a proposal. Only relayer or owner can create proposals in this template.
    function propose(address strategy, bytes calldata data, string calldata description) external onlyRelayerOrOwner returns (uint256) {
        require(strategy != address(0), "invalid strategy");
        proposalCount++;
        uint256 id = proposalCount;
        proposals[id] = Proposal({
            proposer: msg.sender,
            strategy: strategy,
            data: data,
            votesFor: 0,
            votesAgainst: 0,
            startBlock: block.number,
            endBlock: block.number + votingPeriodBlocks,
            executed: false,
            description: description
        });
        emit ProposalCreated(id, msg.sender, strategy, description);
        return id;
    }

    /// @notice Vote on a proposal. Simple 1-address = 1-vote. In practice replace with token-weighted votes.
    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.number >= p.startBlock, "voting not started");
        require(block.number <= p.endBlock, "voting ended");
        require(!hasVoted[proposalId][msg.sender], "already voted");
        hasVoted[proposalId][msg.sender] = true;

        uint256 weight = 1;
        if (support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }
        emit Voted(proposalId, msg.sender, support, weight);
    }

    /// @notice Execute a proposal if it has passed. Moves funds to strategy and calls execute on strategy.
    function executeProposal(uint256 proposalId, uint256 amount) external {
        Proposal storage p = proposals[proposalId];
        require(block.number > p.endBlock, "voting not finished");
        require(!p.executed, "already executed");
        require(p.votesFor > p.votesAgainst, "proposal did not pass");
        require(address(this).balance >= amount, "insufficient treasury balance");

        p.executed = true;
        // send funds to strategy
        (bool sent, ) = p.strategy.call{value: amount}("");
        require(sent, "transfer failed");

        // call execute on strategy
        bool success = IStrategy(p.strategy).execute(p.data);
        emit ProposalExecuted(proposalId, msg.sender, success);
    }

    /// @notice Owner may withdraw small emergency funds
    function emergencyWithdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient balance");
        to.transfer(amount);
        emit Withdraw(to, amount);
    }

    function setVotingPeriodBlocks(uint256 blocks) external onlyOwner {
        votingPeriodBlocks = blocks;
    }
}
