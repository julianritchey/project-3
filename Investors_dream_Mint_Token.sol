pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";


contract Dream_Token is ERC20, ERC20Detailed, ERC20Mintable{
    address public owner;
    uint256 public tokenPrice;
    event TokenPriceChanged(uint256 newPrice);
    event Withdrawal(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
    require(msg.sender == owner, "You are not the owner");
    _;
    }

    constructor (
        string memory _name, 
        string memory _symbol, 
        uint _initial_supply 
    ) 
    ERC20Detailed (_name, _symbol, 18) public{

        owner = msg.sender;
        tokenPrice  = 405*10**12; // 1 token costs 1 dollar (in wei)
        mint (msg.sender, _initial_supply);
    }


    function buyTokens() public payable {
        require(msg.value > 0, "You need to send ether to buy tokens");

        uint256 amount = msg.value / tokenPrice;
        require(amount <= balanceOf(owner), "Not enough tokens for sale");

        _transfer(owner, msg.sender, amount);
    }

        function setTokenPrice(uint256 _newPrice) public onlyOwner {
        tokenPrice = _newPrice;
        emit TokenPriceChanged(_newPrice);
    }

        function withdraw(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        address(uint160(owner)).transfer(_amount);
        emit Withdrawal(owner, _amount);
    }

    function fallback() external payable {}

}