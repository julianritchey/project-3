pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";

contract Dream_Token is ERC20, ERC20Detailed, ERC20Mintable {
    using SafeERC20 for IERC20;

    address public owner;
    uint256 public tokenPrice;
    event TokenPriceChanged(uint256 newPrice);
    event Withdrawal(address indexed recipient, uint256 amount);

    uint256 public monthlySubscriptionFee;
    uint256 public yearlySubscriptionFee;
    
    mapping(address => bool) public subscribedUsers;
    mapping(address => string) public userStrategy; // Store the chosen strategy for each user

    event MonthlySubscriptionFeeChanged(uint256 newFee);
    event YearlySubscriptionFeeChanged(uint256 newFee);
    event UserSubscribed(address indexed user, string strategy);
    event UserUnsubscribed(address indexed user);

    // Define the trading strategy names as constant variables
    string constant public MACDstrategy = "MACD strategy";
    string constant public TRIXstrategy = "TRIX strategy";
    string constant public KDJstrategy = "KDJ strategy";

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor (
        string memory _name,
        string memory _symbol,
        uint _initial_supply,
        uint256 _monthlySubscriptionFee,
        uint256 _yearlySubscriptionFee
    )
    ERC20Detailed (_name, _symbol, 0)
    public {
        owner = msg.sender;
        tokenPrice = 405 * 10**12; // 1 token costs 1 dollar (in wei)
        mint(msg.sender, _initial_supply);

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

    function subscribeMonthly(string memory strategy) public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        require(balanceOf(msg.sender) > monthlySubscriptionFee, "You do not have enough tokens.");

        transferFrom(msg.sender, address(this), monthlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        userStrategy[msg.sender] = strategy; // Store the selected strategy
        emit UserSubscribed(msg.sender, strategy);
    }

    function subscribeYearly(string memory strategy) public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        require(balanceOf(msg.sender) > yearlySubscriptionFee, "You do not have enough tokens.");

        transferFrom(msg.sender, address(this), yearlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        userStrategy[msg.sender] = strategy; // Store the selected strategy
        emit UserSubscribed(msg.sender, strategy);
    }

    function unsubscribe() public {
        require(subscribedUsers[msg.sender], "Not subscribed");
        subscribedUsers[msg.sender] = false;
        delete userStrategy[msg.sender]; // Remove the stored strategy
        emit UserUnsubscribed(msg.sender);
    }

    function isUserSubscribed(address _user) public view returns (bool) {
        return subscribedUsers[_user];
    }

    function getUserStrategy(address _user) public view returns (string memory) {
        return userStrategy[_user];
    }

    function fallback() external payable {}

}
