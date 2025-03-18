
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PiRewardContract {
    address public owner;
    mapping(address => uint256) public rewards;

    event RewardIssued(address indexed user, uint256 amount);
    event RewardWithdrawn(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // 🔹 보상 지급
    function issueReward(address user, uint256 amount) public {
        require(msg.sender == owner, "Only owner can issue rewards");
        rewards[user] += amount;
        emit RewardIssued(user, amount);
    }

    // 🔹 보상 출금
    function withdrawReward() public {
        uint256 amount = rewards[msg.sender];
        require(amount > 0, "No rewards to withdraw");

        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit RewardWithdrawn(msg.sender, amount);
    }
}
