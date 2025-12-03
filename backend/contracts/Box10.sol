// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error InsufficientBalance();
error NonZeroAddress();
error UserCannotTransferToken();
error NonZeroValue();

contract Box10 is ERC20, AccessControl {
    // Roles
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    // Supply
    uint public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;

    // Events
    event Distribute(address _to, uint _amount, string _activity);
    event TransferToken(address _from, address _to, uint _amount);
    event MintToken(address _from, address _to, uint _amount);
    event BurnToken(address _from, address _to, uint _amount);
    event NewDistributorAdded(address _by, address _newDistributor);
    event DistributorRevoked(address _by, address _distributor);

    constructor(address _admin, address _distributor) ERC20("BOX10 Token", "BOX10") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(DISTRIBUTOR_ROLE, _distributor);

        _mint(address(this), TOTAL_SUPPLY);
    }

    function addDistributor(address _distributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_distributor != address(0), NonZeroAddress());

        _grantRole(DISTRIBUTOR_ROLE, _distributor);

        emit NewDistributorAdded(msg.sender, _distributor);
    }

    function removeDistributor(address _distributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_distributor != address(0), NonZeroAddress());

        revokeRole(DISTRIBUTOR_ROLE, _distributor);

        emit DistributorRevoked(msg.sender, _distributor);
    }

    function isDistributor(address account) external view returns (bool) {
        return hasRole(DISTRIBUTOR_ROLE, account);
    }

    /*
     * @dev Function to send Box10 token to an address (cannot burn or mint)
     * @param _to Address to send token
     * @param _amount Amount od token to transfer
     * @param _activity Trigger action
     */
    function distribute(address _to, uint _amount, string calldata _activity) external onlyRole(DISTRIBUTOR_ROLE) {
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

    function burn(uint _amount) external {
        require(_amount > 0, NonZeroValue());

        _update(msg.sender, address(0), _amount);

        emit BurnToken(msg.sender, address(0), _amount);
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
        require(_from == address(this) || hasRole(DEFAULT_ADMIN_ROLE, _from), UserCannotTransferToken());

        super._update(_from, _to, _amount);
        emit TransferToken(_from, _to, _amount);
    }
}
