// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IStrategy.sol";

contract StrategyMock is IStrategy {
    event Executed(address indexed caller, bytes data);
    function execute(bytes calldata data) external override returns (bool) {
        emit Executed(msg.sender, data);
        // pretend we do something useful with the funds
        return true;
    }

    function name() external pure override returns (string memory) {
        return "StrategyMock";
    }
}
