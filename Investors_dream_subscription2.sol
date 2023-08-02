pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/julianritchey/project-3/blob/Dmitry/Investors_dream_Mint_Token.sol";

contract DreamSubscription is Ownable {
    using SafeERC20 for IERC20;

    address public dreamTokenAddress;
    uint256 public monthlySubscriptionFee;
    uint256 public yearlySubscriptionFee;
    mapping(address => bool) public subscribedUsers;
    mapping(address => uint256) public subscriptionEndTimestamp;

    event MonthlySubscriptionFeeChanged(uint256 newFee);
    event YearlySubscriptionFeeChanged(uint256 newFee);
    event UserSubscribed(address indexed user, uint256 endTimestamp);
    event UserUnsubscribed(address indexed user);

    constructor(
        address _dreamTokenAddress,
        uint256 _monthlySubscriptionFee,
        uint256 _yearlySubscriptionFee
    ) public {
        dreamTokenAddress = _dreamTokenAddress;
        monthlySubscriptionFee = _monthlySubscriptionFee;
        yearlySubscriptionFee = _yearlySubscriptionFee;
    }

    modifier onlyActiveSubscription(address subscriber) {
        require(isSubscriptionActive(subscriber), "Subscription not active");
        _;
    }

    function setMonthlySubscriptionFee(uint256 _newFee) public onlyOwner {
        require(_newFee > 0, "Fee must be greater than 0");
        monthlySubscriptionFee = _newFee;
        emit MonthlySubscriptionFeeChanged(_newFee);
    }

    function setYearlySubscriptionFee(uint256 _newFee) public onlyOwner {
        require(_newFee > 0, "Fee must be greater than 0");
        yearlySubscriptionFee = _newFee;
        emit YearlySubscriptionFeeChanged(_newFee);
    }

    function subscribeMonthly() public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        IERC20(dreamTokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            monthlySubscriptionFee
        );
        subscribedUsers[msg.sender] = true;
        subscriptionEndTimestamp[msg.sender] = now + 30 days;
        emit UserSubscribed(msg.sender, subscriptionEndTimestamp[msg.sender]);
    }

    function subscribeYearly() public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        IERC20(dreamTokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            yearlySubscriptionFee
        );
        subscribedUsers[msg.sender] = true;
        subscriptionEndTimestamp[msg.sender] = now + 365 days;
        emit UserSubscribed(msg.sender, subscriptionEndTimestamp[msg.sender]);
    }

    function unsubscribe() public onlyActiveSubscription(msg.sender) {
        IERC20(dreamTokenAddress).safeTransfer(
            msg.sender,
            getSubscriptionFee(msg.sender)
        );
        subscribedUsers[msg.sender] = false;
        emit UserUnsubscribed(msg.sender);
    }

    function isSubscriptionActive(address subscriber) public view returns (bool) {
        return now < subscriptionEndTimestamp[subscriber];
    }

    function getSubscriptionFee(address subscriber) public view returns (uint256) {
        if (isSubscriptionActive(subscriber)) {
            if (subscriptionEndTimestamp[subscriber] == now) {
                return monthlySubscriptionFee;
            } else {
                return yearlySubscriptionFee;
            }
        } else {
            return 0;
        }
    }
}
