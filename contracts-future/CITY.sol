// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CITY is ERC20, Ownable {
    uint constant _initial_supply = 1000000 * (1**18);

    constructor() ERC20("CITY", "CITY" ) {
        _mint(owner(), _initial_supply);
    }

    function mint(address to, uint256 amount ) public onlyOwner {
        _mint(to, amount);
    }
}