// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error InsufficientBalance();
error NonZeroAddress();
error UserCannotTransferToken();

contract Box10 is ERC20, Ownable {

    event Distribute(address _to, uint _amount, string _activity);
    event TransferToken(address _from, address _to, uint _amount);
    event MintToken(address _from, address _to, uint _amount);
    event BurnToken(address _from, address _to, uint _amount);

    constructor(address _owner) ERC20("BOX10 Token", "BOX10") Ownable(_owner) {
        require(_owner != address(0), "Owner cannot be zero address");

        _mint(address(this), 1000000000 * 10**decimals());
    }

    /*
     * @dev Function to send Box10 token to an address (cannot burn or mint)
     * @param _to Address to send token
     * @param _amount Amount od token to transfer
     * @param _activity Trigger action
     */
    function distribute(address _to, uint _amount, string calldata _activity) external onlyOwner {
        require(_to != address(0), NonZeroAddress());

        uint amountInWei = _amount * 10**decimals();

        require(balanceOf(address(this)) >= amountInWei, InsufficientBalance());

        _transfer(address(this), _to, amountInWei);

        emit Distribute(_to, _amount, _activity);
    }

    /*
     * @dev Get available supply of Box10 token
     * @return Balance of contract (not in wei)
     */
    function availableSupply() external view returns (uint) {
        return balanceOf(address(this)) / 10**decimals();
    }

    /*
     * @dev Override _update function from ERC20.sol to avoid transfer between user
     */
    function _update(address _from, address _to, uint256 _amount) internal virtual override {
        // Mint
        if (_from == address(0)) {
            super._update(_from, _to, _amount);
            emit MintToken(_from, _to, _amount);
            return;
        }
        // Burn
        if (_to == address(0)) {
            super._update(_from, _to, _amount);
            emit BurnToken(_from, _to, _amount);
            return;
        }
        // Transfer
        require(_from == address(this) || _from == owner(), UserCannotTransferToken());

        super._update(_from, _to, _amount);
        emit TransferToken(_from, _to, _amount);
    }
}
