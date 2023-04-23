// SPDX-License-Identifier: MIT
// @author: Developed by Pinqode.
// @descpriton: Chaincity Game
// 0xC410679CEE6faf3e5D0F99666FCEAa6236564157
// https://mumbai.polygonscan.com/address/0xC410679CEE6faf3e5D0F99666FCEAa6236564157#code

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./inner/Cities.sol";
import "./inner/IChaincity.sol";

contract Chaincity is IChaincity, Cities, ReentrancyGuard {
    using SafeMath for uint256;

    ERC20 public token; // Game token
    address payable public wallet; // Address where tokens and stakes left (not stakes) are stored as pool

    string private _auth; // App auth key

    uint256 private _totalCities;
    uint256 private _totalGames;

    

    Game[] private _games;

    uint256 public immutable POOL_CONSTANT;
    uint256 public poolEth;
    uint256 public poolTokens;

    constructor(address payable _wallet, ERC20 _token) payable {
        require(_wallet != address(0), "Wallet address cannot be zero address");
        require(msg.value > 0, "No value sent");

        wallet = _wallet;
        token = _token;

        poolTokens = token.balanceOf(_wallet);
        poolEth = address(this).balance;

        POOL_CONSTANT = poolTokens.mul(poolEth);
    }

    /**
     * @dev Fallback function ***DO NOT OVERRIDE***
     */
    fallback() external payable {}

    /**
     * @dev Receive function ***DO NOT OVERRIDE***
     */
    receive() external payable {}

    /**
     * MODIFIERS
     */

    // Modifier to check if caller is auth
    modifier isAuth(string memory _inputAuth) {
        require(
            keccak256(abi.encodePacked(_auth)) ==
                keccak256(abi.encodePacked(_inputAuth)),
            "Caller is not authenticated"
        );
        _;
    }

    // Modifier to check if the game exists
    modifier gameExists(uint256 _gameId) {
        require(_gameId > 0, "Game ID not valid!");
        require(_gameId <= _games.length, "Game ID not valid!");
        _;
    }

    // Modifier to check if the game has started
    modifier gameStarted(uint256 _gameId) {
        require(_games[_gameId - 1].playing == true, "Game not started");
        _;
    }

    // Modifier to check if the game has not started
    modifier gameNotStarted(uint256 _gameId) {
        require(_games[_gameId - 1].playing != true, "Game already started");
        _;
    }

    // Getter function to retrieve the auth key (only accessible by contract owner)
    function getAuth() public view override onlyOwner returns (string memory) {
        return _auth;
    }

    // Function to update the auth key (only accessible by contract owner)
    function updateAuth(string memory _inputAuth) public override onlyOwner {
        _auth = _inputAuth;
    }

    // Function to create a new game
    function createGame(
        uint256 _cityId,
        uint256 _startingCash,
        string memory _inputAuth
        ) public override cityExists(_cityId) isAuth(_inputAuth) returns (uint256) {
        require(_startingCash > 0, "Starting Cash too low");
        uint256 cityIndex = cityIndexFromId(_cityId);
        address gameOwner = _cities[cityIndex].cityOwner;
        _games.push();
        Game storage game = _games[_totalGames];
        game.id = _totalGames + 1;
        game.totalPlayers = 0;
        game.totalStake = 0;
        game.startingCash = _startingCash;
        game.gameOwner = gameOwner;
        game.cash = 0;
        game.city = _cityId;
        game.totalStake = 0;
        game.playing = false;

        _totalGames++;

        // Emit the GameCreated event
        emit GameCreated(_totalGames, _cityId, gameOwner);

        return _totalGames;
    }

    // Getter function to retrieve the total number of games
    function totalGames( string memory _inputAuth) public view override isAuth(_inputAuth) returns (uint256) {
        return _totalGames;
    }

    // Getter function to retrieve information about a specific game
    function getGame(uint256 _gameId, string memory _inputAuth)
        external
        view
        override
        gameExists(_gameId)
        isAuth(_inputAuth)
        returns (
            uint256 id,
            uint256 totalPlayers,
            uint256 totalStake,
            uint256 startingCash,
            address gameOwner,
            uint256 city,
            uint256 cash,
            bool playing
        )
    {
        Game storage game = _games[_gameId - 1];
        id = game.id;
        totalPlayers = game.totalPlayers;
        startingCash = game.startingCash;
        gameOwner = game.gameOwner;
        cash = game.cash;
        city = game.city;
        totalStake = game.totalStake;
        playing = game.playing;
    }

    // Function to get the game index from the game ID
    function gameIndexFromId(uint256 _gameId, string memory _inputAuth)
        public
        view
        override
        isAuth(_inputAuth)
        gameExists(_gameId)
        returns (uint256)
    {
        return _gameId - 1;
    }

    // Function to add a player to a game
    function addPlayer(uint256 _cityId, uint256 _gameId, string memory _inputAuth)
        public
        payable
        override
        isAuth(_inputAuth)
        cityExists(_cityId)
        gameExists(_gameId)
        gameNotStarted(_gameId)
    {
        uint256 cityIndex = _cityId - 1;
        uint256 gameIndex = _gameId - 1;
        Game storage game = _games[gameIndex];

        require(
            game.playerExists[msg.sender] == false,
            "Player already exists"
        );
        require(msg.value >= _cities[cityIndex].minStake, "Not enough stake");

        // Add player to the game
        uint256 totalPlayers = game.totalPlayers;
        game.players[totalPlayers + 1] = Player({
            addr: msg.sender,
            stake: msg.value
        });
        game.playerExists[msg.sender] = true;
        game.totalPlayers++;
        game.totalStake += msg.value;

        // Stake tokens
        if (payable(msg.sender) != wallet) {
            _stake();
        }

        game.cash += msg.value;

        // Emit the PlayerJoined event
        emit PlayerJoined(_gameId, msg.sender, msg.value);
    }

    // Getter function to retrieve the list of players in a game
    function getPlayers(uint256 _gameId, string memory _inputAuth)
    public
    view
    override
    isAuth(_inputAuth)
    gameExists(_gameId)
    gameStarted(_gameId)
    returns (Player[] memory)
    {
        uint256 gameIndex = _gameId - 1;
         Player[] memory players_ = new Player[](_games[gameIndex].totalPlayers);
        for (uint256 i = 1; i <= _games[gameIndex].totalPlayers; i++) {
            players_[i - 1] = _games[gameIndex].players[i];
        }

        return players_;
    }

    // Function to start a game
    function startGame(uint256 _gameId, string memory _inputAuth)
        public
        override
        isAuth(_inputAuth)
        gameExists(_gameId)
        gameNotStarted(_gameId)
    {
        Game storage game = _games[_gameId - 1];

        uint256 totalPlayers = game.totalPlayers;
        require(totalPlayers > 0, "No players in game");
        require(totalPlayers >= 2, "Not enough players (>=2)");

        uint256 totalStake = game.totalStake;
        require(totalStake > 0, "No stake in game");

        game.playing = true;

        // Emit the GameStarted event
        emit GameStarted(_gameId);
    }

    // Function to end a game and distribute winnings to players
    function endGame(
        uint256 _gameId,
        uint256[] memory _winAddrOrder,
        uint256 _winCash,
        string memory _inputAuth
    ) public override isAuth(_inputAuth) gameExists(_gameId) gameStarted(_gameId) {
        uint256 gameIndex = _gameId - 1;
        Game storage game = _games[gameIndex];
        require(
            _winAddrOrder.length == game.totalPlayers,
            "Invalid number of players' cash"
        );

        for (uint256 i = 0; i < _winAddrOrder.length; i++) {
            require(
                game.playerExists[game.players[_winAddrOrder[i]].addr],
                "Player does not exist!"
            );
        }

        uint256 winIdx = _winAddrOrder[0];
        require(game.players[winIdx].addr == msg.sender, "Ender is not winner!");

       _cashoutAll(gameIndex, _winCash, _winAddrOrder);

        _deleteGame(gameIndex);

        // Emit the GameEnded event
        emit GameEnded(_gameId);
    }

    // Private function to handle staking of tokens
    function _stake() private {
        require(msg.value >= 0, "msg.value is less than or 0");

        payable(address(this)).transfer(msg.value);
    }


    /**
    * POOL FUNCTIONS
    */
    // Function to check the contract's Ether balance
    function getBalance() external view override returns (uint256) {
        return address(this).balance;
    }

    function buyTokens(address payable _beneficiary) public payable {
        require(msg.value > 0, "Sent Zero value");
         require(_beneficiary != address(0), "Beneficiary must be non-zero");
        uint256 amount = msg.value;
        (uint256 tokensBought) = _calculateTokensBought(amount);
        
        require(token.transferFrom(wallet, _beneficiary, tokensBought), "Transaction failed!");

        payable(address(this)).transfer(amount);

        poolEth += amount;
        poolTokens = token.balanceOf(wallet);

    }

    // Atomatic Market Maker  (AMM) logic
    function _calculateTokensBought(uint256 _ethAmount) private returns 
    (uint256 tokensBought) {
        poolTokens = token.balanceOf(wallet);

        uint256 poolEthAfter = poolEth.add(_ethAmount);

        uint256 poolTokensAfter = POOL_CONSTANT.div(poolEthAfter);

        tokensBought = poolTokens.sub(poolTokensAfter);

    }


    /**
    * INTERNAL FUNCTIONS
    */
 // Function to calculate and distribute winnings to all players
    function _cashoutAll(
        uint256 _gameIndex,
        uint256 _winCash,
        uint256[] memory _winAddrOrder
    ) private {
        Game storage game = _games[_gameIndex];
         
        (
            uint256 winnerStakeReturn,
            uint256 winnerTokenReturn,
            uint256 stakeLeft
        ) = _calculateWinnerPayout(game, _winCash, _winAddrOrder[0]);


            _payout(
                game.players[_winAddrOrder[0]].addr,
                winnerStakeReturn,
                winnerTokenReturn
            );
     

        // totalCash / totalStake
        uint256 oneTokenValue = (game.startingCash.mul(game.totalPlayers)).div(
            game.totalStake
        );

        for (uint256 i = 1; i < _winAddrOrder.length; i++) {
            uint256 idx = _winAddrOrder[i];
            uint256 playerStake = game.players[idx].stake;
            uint256 playerPercentStake = playerStake.div(game.totalStake);
            // player stake return in tokens
            uint256 playerTokenReturn = stakeLeft.mul(playerPercentStake).mul(oneTokenValue);

                _payout(
                    game.players[idx].addr,
                    0,
                    playerTokenReturn
                );
          
        }

        if (stakeLeft <= address(this).balance) {
            if (stakeLeft > 0) {
                wallet.transfer(stakeLeft);
            }
            
        }
        
    } 
   

    // Function to calculate the payout for the winner
    function _calculateWinnerPayout(
        Game storage game,
        uint256 _winCash,
        uint256 winnerIndex
    )
        internal
        view
        returns (
            uint256 winnerStakeReturn,
            uint256 winnerTokenReturn,
            uint256 stakeLeft
        )
    {
        
        uint256 winnerInitStake = game.players[winnerIndex].stake;
        uint256 winCash2Stake = _winCash.mul(winnerInitStake).div(game.startingCash);
        uint256 winnerPercentStake = winnerInitStake.div(game.totalStake);
        // uint256 winnerCashGain = _winCash.sub(game.startingCash);
        // uint256 winnerStakeGain = winCash2Stake.sub(winnerInitStake);
        
        // totalCash / totalStake
        uint256 oneTokenValue = (game.startingCash.mul(game.totalPlayers)).div(
            game.totalStake
        );

        if (winCash2Stake <= game.totalStake) {
            winnerStakeReturn = winCash2Stake;
            stakeLeft = game.totalStake.sub(winnerStakeReturn);
        } else {
            winnerStakeReturn = game.totalStake;
            stakeLeft = winCash2Stake.sub(winnerStakeReturn);
        }

        winnerTokenReturn = (stakeLeft.mul(oneTokenValue)).mul(winnerPercentStake);
    }

    
    // Function to handle the payout to a player
    function _payout(
        address _playerAddr,
        uint256 _stakeReturn,
        uint256 _tokenReturn
    ) private {
        // Check if the smart contract has enough allowance to transfer tokens on behalf of the sender
        require(
            token.allowance(wallet, address(this)) >= _tokenReturn,
            "Insufficient allowance"
        );

        if (wallet != payable(_playerAddr)) {
            // Transfer tokens from the sender to the recipient
            require(
                token.transferFrom(wallet, payable(_playerAddr), _tokenReturn),
                "Token transfer failed"
            );
        }
        

        if (_stakeReturn > 0) {
            // Send the specified amount of Ether to the recipient address
            payable(_playerAddr).transfer(_stakeReturn);
        
        }

        // Emit the PlayerPayout event
        emit PlayerPayout(_playerAddr, _stakeReturn, _tokenReturn);
    }

    
    // Function to delete a game from the list of games
    function _deleteGame(uint256 _gameIndex) private {
        uint256 len = _totalGames;
        uint256 gameIndex = _gameIndex;

        for (uint256 i = gameIndex; i < len - 1; i++) {
            Game storage game = _games[i + 1];
            game = game;
        }
        _games.pop();
        _totalGames--;
    }
}