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

    event MonthlySubscriptionFeeChanged(uint256 newFee);
    event YearlySubscriptionFeeChanged(uint256 newFee);
    event UserSubscribed(address indexed user);
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
        IERC20(dreamTokenAddress).safeTransferFrom(msg.sender, address(this), monthlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        emit UserSubscribed(msg.sender);
    }

    function subscribeYearly() public {
        require(!subscribedUsers[msg.sender], "Already subscribed");
        IERC20(dreamTokenAddress).safeTransferFrom(msg.sender, address(this), yearlySubscriptionFee);
        subscribedUsers[msg.sender] = true;
        emit UserSubscribed(msg.sender);
    }

    function unsubscribe() public {
        require(subscribedUsers[msg.sender], "Not subscribed");
        IERC20(dreamTokenAddress).safeTransfer(msg.sender, monthlySubscriptionFee);
        subscribedUsers[msg.sender] = false;
        emit UserUnsubscribed(msg.sender);
    }

    function isUserSubscribed(address _user) public view returns (bool) {
        return subscribedUsers[_user];
    }
}
