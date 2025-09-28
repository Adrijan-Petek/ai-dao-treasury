// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategy {
    function execute(bytes calldata data) external returns (bool);
    function name() external view returns (string memory);
}
