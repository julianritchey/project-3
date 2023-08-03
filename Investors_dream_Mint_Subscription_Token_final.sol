pragma solidity ^0.5.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/SafeERC20.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";



contract Dream_Token is ERC20, ERC20Detailed, ERC20Mintable{

    using SafeERC20 for IERC20;

    address public owner;
    uint256 public tokenPrice;
    event TokenPriceChanged(uint256 newPrice);
    event Withdrawal(address indexed recipient, uint256 amount);

    uint256 public monthlySubscriptionFee;
    uint256 public yearlySubscriptionFee;
    
    mapping(address => bool) public subscribedUsers;

    event MonthlySubscriptionFeeChanged(uint256 newFee);
    event YearlySubscriptionFeeChanged(uint256 newFee);
    event UserSubscribed(address indexed user);
    event UserUnsubscribed(address indexed user);

    

    modifier onlyOwner() {
    require(msg.sender == owner, "You are not the owner");
    _;
    }

    constructor (
        string memory _name, 
        string memory _symbol, 
        uint _initial_supply ,
        uint256 _monthlySubscriptionFee,
        uint256 _yearlySubscriptionFee
    )

    ERC20Detailed (_name, _symbol, 0) public{

        owner = msg.sender;
        tokenPrice  = 405*10**12; // 1 token costs 1 dollar (in wei)
        mint (msg.sender, _initial_supply);

        monthlySubscriptionFee = _monthlySubscriptionFee;
        yearlySubscriptionFee = _yearlySubscriptionFee;
    }


    function buyTokens() public payable {
        require(msg.value > 0, "You need to send ether to buy tokens");

        uint256 amount = msg.value / tokenPrice;
        require(amount <= balanceOf(owner), "Not enough tokens for sale");

        _transfer(owner, msg.sender, amount);
        increaseAllowance(msg.sender, amount);
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

    function setMonthlySubscriptionFee(uint256 _newFee) public onlyOwner {
        monthlySubscriptionFee = _newFee;
        emit MonthlySubscriptionFeeChanged(_newFee);
    }

    function setYearlySubscriptionFee(uint256 _newFee) public onlyOwner {
        yearlySubscriptionFee = _newFee;
        emit YearlySubscriptionFeeChanged(_newFee);
    }

    function subscribeMonthly() public {
        require(!subscribedUsers[msg.sender], "Already subscribed");

        require(balanceOf(msg.sender)>monthlySubscriptionFee, "You do not have enough tokens.");

        transferFrom(msg.sender, address(this), monthlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        emit UserSubscribed(msg.sender);


    }

    function subscribeYearly() public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        require(balanceOf(msg.sender)>yearlySubscriptionFee, "You do not have enough tokens.");

        transferFrom(msg.sender, address(this), yearlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        emit UserSubscribed(msg.sender);
    }

    function unsubscribe() public {
        require(subscribedUsers[msg.sender], "Not subscribed");
        subscribedUsers[msg.sender] = false;
        emit UserUnsubscribed(msg.sender);
    }

    function isUserSubscribed(address _user) public view returns (bool) {
        return subscribedUsers[_user];
    }

    function fallback() external payable {}

}