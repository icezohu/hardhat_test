
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
    // todo
    
    constructor(){
      // todo
    }
    
    /**
     * create an instance of lucky money contract and transfer all eth to it
     * @max_participants
     * 
     */
    function create(uint max_participants) payable 
    returns(bool success) {
        // todo
    }
    
    /**
     * @dev return all LuckyMoney created by the given user
     * 
     */
    function query(address user) constant returns(address[]){
        // todo
    }
}

/**
 * 
 * @dev 
 * 
 */
contract LuckyMoney {
    
    constructor(uint max_participants, address creator) {
        // todo
    }
    
    /**
     * @dev return all participants
     * 
     */
    function participants() returns(address[]){
        //todo
    }
    
    /**
     * @dev anyone can roll and get rewarded a random amount of remnant eth from the contract
     * as long as doesn't exceed max_participants
     * each account can only roll once
     * 
     */
    function roll() {
        // todo
    }
    
    /**
     * @dev generate a random uint
     * 
     */
    function random() private returns(uint){
        
    }
    
    /**
     * @dev only owner can call
     * refund remant eth and destroy itself
     * 
     */
    function refund() {
        
    }
    
    
}