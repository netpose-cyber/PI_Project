
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PiPaymentContract {
    address public owner;
    mapping(address => uint256) public balances;

    event PaymentReceived(address indexed user, uint256 amount);
    event PaymentSent(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // 🔹 결제 처리
    function pay(address recipient, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit PaymentSent(msg.sender, amount);
    }

    // 🔹 입금 기능
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }
}
