import "./VRC25.sol";

contract VRC25Token is VRC25 {
    using Address for address;

    constructor() public VRC25("Supersquad Token", "SQT", 18) {}

    /**
     * @notice Calculate fee required for action related to this token
     * @param value Amount of fee
     */
    function _estimateFee(
        uint256 value
    ) internal view override returns (uint256) {
        return value + minFee();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override returns (bool) {
        return
            interfaceId == type(IVRC25).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @notice Issues `amount` tokens to the designated `address`.
     *
     * Can only be called by the current owner.
     */
    function mint(
        address recipient,
        uint256 amount
    ) external onlyOwner returns (bool) {
        _mint(recipient, amount);
        return true;
    }
}
