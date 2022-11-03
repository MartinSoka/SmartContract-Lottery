// enter lottery and pay entrance fee
// randomly select winner every X sec

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Lottery__InsufficientFunds();

contract Lottery {
    uint256 private immutable i_entranceFee;

    //if one of them wins we need to pay them that's why its payable
    address payable[] private players;

    event LotteryEnter(address indexed player);

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterLottery() public payable {
        if (msg.value < i_entranceFee) revert Lottery__InsufficientFunds();
        players.push(payable(msg.sender));

        emit LotteryEnter(msg.sender);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return players[index];
    }
}
