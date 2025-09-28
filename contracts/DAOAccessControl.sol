// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal access control that allows owner to manage DAO parameters and relayer
contract DAOAccessControl is Ownable {
    address public relayer; // off-chain ML adapter / relayer address

    constructor(address initialOwner) Ownable(initialOwner) {}

    event RelayerUpdated(address indexed oldRelayer, address indexed newRelayer);

    function setRelayer(address _relayer) external onlyOwner {
        emit RelayerUpdated(relayer, _relayer);
        relayer = _relayer;
    }

    modifier onlyRelayerOrOwner() {
        require(msg.sender == relayer || msg.sender == owner(), "Not relayer or owner");
        _;
    }
}
