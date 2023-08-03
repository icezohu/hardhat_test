// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * 1. Finish LuckyMoneyCreator and LuckyMoney contract
 * 2. Design necessary events and use them
 * 3. Add necessary modifier(s) to predefined functions
 *
 */

/**
 * @title LuckyMoneyCreator
 * @dev Implements creating new lucky money envelope
 */
contract LuckyMoneyCreator {
    // storages
    mapping(address => LuckyMoney[]) luckMoneyContracts;

    constructor() {}

    /**
     * create an instance of lucky money contract and transfer all eth to it
     *
     *
     */
    function create(
        uint256 max_participants
    ) public payable returns (bool success) {
        LuckyMoney luckyMoney = new LuckyMoney(max_participants, msg.sender);
        payable(address(luckyMoney)).transfer(msg.sender.balance);
        luckMoneyContracts[msg.sender].push(luckyMoney);
        return true;
    }

    /**
     * @dev return all LuckyMoney created by the given user
     *
     */
    function query(address user) public returns (address[] memory) {}
}

/**
 *
 * @dev
 *
 */
contract LuckyMoney {
    address owner;
    uint256 max_participants_;
    address[] participants_;
    mapping(address => bool) participants_roll_status;

    constructor(uint256 max_participants, address creator) {
        max_participants_ = max_participants;
        owner = creator;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this function");
        _;
    }

    /**
     * @dev return all participants
     *
     */
    function participants() public view returns (address[] memory) {
        return participants_;
    }

    /**
     * @dev anyone can roll and get rewarded a random amount of remnant eth from the contract
     * as long as doesn't exceed max_participants
     * each account can only roll once
     *
     */
    function roll() public {
        if (participants_.length >= max_participants_) {
            return;
        }
        if (participants_roll_status[msg.sender] == true) {
            return;
        }
        uint256 random_number = random();
        payable(msg.sender).transfer(random_number);
        participants_roll_status[msg.sender] = true;
        participants_.push(msg.sender);
    }

    /**
     * @dev generate a random uint
     *
     */
    function random() private view returns (uint256) {
        return
            (uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        block.timestamp,
                        address(msg.sender)
                    )
                )
            ) % address(this).balance) / 2;
    }

    /**
     * @dev only owner can call
     * refund remant eth and destroy itself
     *
     */
    function refund() public onlyOwner {
        payable(owner).transfer(address(this).balance);
        // "selfdestruct" has been deprecated. The underlying opcode will eventually undergo breaking changes, and its use is not recommended.solidity(5159)
        selfdestruct(payable(owner));
    }
}
