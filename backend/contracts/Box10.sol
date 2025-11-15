// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error InsufficientBalance();
error NonZeroValue();
error WithdrawFailed();

contract Box10 is Ownable, ReentrancyGuard {

    constructor() Ownable(msg.sender) {}

    struct Member {
        uint balance;
    }

    mapping(address => Member) members;

    event DepositFund(address by, uint amount);
    event WithdrawFund(address by, uint amount);

    function deposit() external payable {
        require(msg.value > 0, NonZeroValue());
        members[msg.sender].balance += msg.value;
        emit DepositFund(msg.sender, msg.value);
    }

    function getMyBalance() external view returns (uint) {
        return members[msg.sender].balance;
    }

    function getBalanceFor(address _address) external view returns (uint) {
        return members[_address].balance;
    }

    function withdraw(uint _amount) nonReentrant external  {
        require(_amount > 0, NonZeroValue());
        require(_amount <= members[msg.sender].balance, InsufficientBalance());

        // Pattern Checks-Effects-Interactions
        members[msg.sender].balance -= _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, WithdrawFailed());

        emit WithdrawFund(msg.sender, _amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        members[msg.sender].balance += msg.value;
        emit DepositFund(msg.sender, msg.value);
    }

    fallback() external payable {
        members[msg.sender].balance += msg.value;
        emit DepositFund(msg.sender, msg.value);
    }
}
