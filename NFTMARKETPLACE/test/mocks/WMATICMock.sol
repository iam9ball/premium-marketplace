// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contract/token/ERC20/ERC20.sol";

contract WMATICMock is ERC20 {

     event Deposit(address indexed from, uint256 amount);

    event Withdrawal(address indexed to, uint256 amount);
    error __WETHMock_TransferFailed();
 
    constructor() ERC20("Wrapped ETH", "WETH") {

    }

    
    function deposit() public payable virtual {
        _mint(msg.sender, msg.value);

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public virtual {
        _burn(msg.sender, amount);

        emit Withdrawal(msg.sender, amount);

       (bool success, ) =  msg.sender.call{value: amount}("");
       if (!success) {
        revert __WETHMock_TransferFailed();
       }

    }

    receive() external payable virtual {
        deposit();
    }
}
