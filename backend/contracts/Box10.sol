// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Errors
error InsufficientBalance();
error NonZeroAddress();
error UserCannotTransferToken();
error NonZeroValue();
error ApprovalsNotAllowed();

contract Box10 is ERC20, AccessControl {
    // Roles
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant CRITICAL_DISTRIBUTOR_ROLE = keccak256("CRITICAL_DISTRIBUTOR_ROLE");

    // Supply
    uint public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;

    // Events
    event Distribute(address _to, uint _amount, string _activity);
    event TransferToken(address _from, address _to, uint _amount);
    event MintToken(address _from, address _to, uint _amount);
    event BurnToken(address _from, uint _amount);
    event NewDistributorAdded(address _by, address _newDistributor);
    event DistributorRevoked(address _by, address _distributor);

    constructor(address _admin, address _criticalDistributor, address _distributor) ERC20("BOX10 Token", "BOX10") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(CRITICAL_DISTRIBUTOR_ROLE, _criticalDistributor);
        _grantRole(DISTRIBUTOR_ROLE, _distributor);

        _mint(address(this), TOTAL_SUPPLY);
    }
    /*
     * @dev Add DISTRIBUTOR_ROLE to an address. Only account who has DEFAULT_ADMIN_ROLE role can use it
     * @param _distributor Address whose role is added
     */
    function addDistributor(address _distributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_distributor == address(0)) revert NonZeroAddress();

        _grantRole(DISTRIBUTOR_ROLE, _distributor);

        emit NewDistributorAdded(msg.sender, _distributor);
    }
    /*
     * @dev Remove DISTRIBUTOR_ROLE to an address. Only account who has DISTRIBUTOR_ROLE role can use it
     * @param _distributor Address whose role is deleted
     */
    function removeDistributor(address _distributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_distributor == address(0)) revert NonZeroAddress();

        revokeRole(DISTRIBUTOR_ROLE, _distributor);

        emit DistributorRevoked(msg.sender, _distributor);
    }
    /*
     * @dev Function that check if address has DISTRIBUTOR_ROLE role
     * @param _address Address to check
     * @return true if address has DISTRIBUTOR_ROLE role
     */
    function isDistributor(address _address) external view returns (bool) {
        return hasRole(DISTRIBUTOR_ROLE, _address);
    }
    /*
     * @dev Function that check if address has CRITICAL_DISTRIBUTOR_ROLE role
     * @param _address Address to check
     * @return true if address has CRITICAL_DISTRIBUTOR_ROLE role
     */
    function isCriticalDistributor(address _address) external view returns (bool) {
        return hasRole(CRITICAL_DISTRIBUTOR_ROLE, _address);
    }
    /*
     * @dev Function to send Box10 token to an address (cannot burn or mint)
     * @param _to Address to send token
     * @param _amount Amount of token to transfer
     * @param _activity Trigger action
     */
    function distribute(address _to, uint _amount, string calldata _activity) external onlyRole(DISTRIBUTOR_ROLE) {
        if (_to == address(0)) revert NonZeroAddress();

        uint amountInWei = _amount * 10**decimals();

        if (balanceOf(address(this)) < amountInWei) revert InsufficientBalance();

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
     * @dev Burn token
     * @param _amount Amount of token to burn
     */
    function burnToken(uint _amount) external {
        if (_amount == 0) revert NonZeroValue();

        _burn(msg.sender, _amount);

        emit BurnToken(msg.sender, _amount);
    }
    /*
     * @dev Override _update function from ERC20.sol to avoid transfer between user
     * @param _from
     * @param _to
     * @param _amount
     */
    function _update(address _from, address _to, uint256 _amount) internal virtual override {
        if (_amount == 0) revert NonZeroValue();

        // Mint
        if (_from == address(0)) {
            super._update(_from, _to, _amount);

            emit MintToken(_from, _to, _amount);

            return;
        }

        // Burn
        if (_to == address(0)) {
            super._update(_from, _to, _amount);
            emit BurnToken(_from, _amount);
            return;
        }

        // Transfer
        if (_from != address(this) && !hasRole(DEFAULT_ADMIN_ROLE, _from)) revert UserCannotTransferToken();

        super._update(_from, _to, _amount);

        emit TransferToken(_from, _to, _amount);
    }
    /*
     * @dev Override _approve to block all approvals except from contract itself
     * Security : this prevents users from using approve/transferFrom to bypass transfer restrictions
     */
    function _approve(
        address owner,
        address spender,
        uint256 value,
        bool emitEvent
    ) internal virtual override {
        if (owner != address(this)) revert ApprovalsNotAllowed();

        super._approve(owner, spender, value, emitEvent);
    }
}
