function Card(name, values, type){
	this.getName = function(){
		return name + ' of ' + type;
	}
	this.getValues = function(){
		return values;
	}

}
function Suit(type){
	return _.map(this.getCardData(), function(cardData){
		return new Card(cardData.name, cardData.values, type);
	});

}
Suit.prototype = {
	getCardData: function(){
		return [
			{
				name: 'Ace',
				values: [1, 11]
			},
			{
				name: '2',
				values: [2]
			},
			{
				name: '3',
				values: [3]
			},
			{
				name: '4',
				values: [4]
			},
			{
				name: '5',
				values: [5]
			},
			{
				name: '6',
				values: [6]
			},
			{
				name: '7',
				values: [7]
			},
			{
				name: '8',
				values: [8]
			},
			{
				name: '9',
				values: [9]
			},
			{
				name: '10',
				values: [10]
			},
			{
				name: 'Jack',
				values: [10]
			},
			{
				name: 'Queen',
				values: [10]
			},
			{
				name: 'King',
				values: [10]
			}
		]

	}
}


function Deck(customDeck){

	this.shuffleDeck = function(isNewGame) {
		var unshuffledDeck = isNewGame ? _getUnshuffledDeck() : _.map(_currentDeck, function(card){
				return card;
			}), 
			shuffledDeck = [];
		while(unshuffledDeck.length){
			shuffledDeck.push(unshuffledDeck.splice(_getRandomInteger(0, unshuffledDeck.length-1), 1)[0]);
		}
		_currentDeck = shuffledDeck;
	};

	this.getCard = function() {
		return _currentDeck.pop();
	};

	this.getCards = function(numberOfCards) {
		var cards= [], 
			cardCount = numberOfCards,
			currentCard = undefined;
		while(cardCount--){
			currentCard = this.getCard();
			if(currentCard){
				cards.push(currentCard);
			}
		}
		return cards;
	}

	var _getUnshuffledDeck = _.bind(function() {
			return _.flatten(_.map(this.getSuitTypes(), function(suitType){
				return new Suit(suitType);
			}));
		}, this),
		_getRandomInteger = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min; //solution taken from http://stackoverflow.com/questions/1527803
		},
		_currentDeck = customDeck || [];

	if(!customDeck){
		this.shuffleDeck(true);
	}


}
Deck.prototype = {
	getSuitTypes: function() {
		return ['spades', 'hearts', 'diamonds', 'clubs'];
	}
}


var BlackjackGame = function(customDeck) {
	this.init();
};
BlackjackGame.prototype = {
	init: function(customDeck) {
		this.deck = customDeck || new Deck();
		this.dealer = new Dealer();
		this.player = new Player();
		this.status = 'notStarted';
		this.currentPlayer = null;
		this.isFinished = false;
	},
	dealCards: function() {
		[this.dealer, this.player].forEach(_.bind(function(participant){
			participant.addToGame(this);
			participant.takeCards(2)
		}, this));	
		this.status = 'firstDeal';	

		this.currentPlayer = this.player;
	},
	changeStatus: function(newStatus) {
		this.status = newStatus;
		if(['draw', 'playerWins', 'dealerWins'].indexOf(newStatus) > -1){
			this.isFinished = true;
		}
	},
	checkWinner: function(){
		var playerHas21 = this.player.has21(),
			playerOver21 = this.player.over21(),
			dealerOver21 = this.dealer.over21(),
			dealerHas21 = this.dealer.has21();
		if(playerOver21){
			this.changeStatus('dealerWins');
		}
		else if (dealerOver21){
			this.changeStatus('playerWins');
		}
		else {
			if(playerHas21 && dealerHas21){
				this.changeStatus('draw');
			}
			else if(playerHas21){
				this.changeStatus('playerWins');
			}
			else if(dealerHas21){
				this.changeStatus('dealerWins');
			}
		}
	},
	newGame: function() {
		this.init();
	}
};
var BlackjackPlayer = function(){
	this.game = undefined;
	this.hand = [];
};
BlackjackPlayer.prototype = {
	over21: function(hand) { //passing hand to ease testing
		return this.getMinimumValueOfCards(hand || this.hand) > 21;
	},
	atLeast17: function(hand) {
		return this.getMinimumValueOfCards(hand || this.hand) > 16;
	},
	has21: function(hand) {
		return this.hasCardsOfValue(hand || this.hand, 21);
	},
	takeCard: function() {
		this.hand.push(this.game.deck.getCard());
	},
	takeCards: function(numberOfCards) {
		this.hand = this.hand.concat(this.game.deck.getCards(numberOfCards));
	},
	addToGame: function(game) {
		this.game = game;
	},
	hasCardsOfValue: function(cards, desiredValue) {
		var cardValueCombinations = cards.map(function(card){
				return card.getValues();
			}),
			/*two dimensional array containing all combinations of the card values in the player's hand, 
			eg. if player has a 2 and an ace, handCombinations == [[2,1], [2,11]]*/
			handCombinations = [];
		cardValueCombinations.forEach(function(valueCombination){ //loop to fill handCombinations
			if(valueCombination.length == 1){
				if(handCombinations.length){
					handCombinations.forEach(function(combination){
						combination.push(valueCombination[0]);
					})
				}
				else {
					handCombinations.push(valueCombination.map(function(v){
						return v;
					}));
				}
			}
			else {
				if(handCombinations.length) {
					var oldCombinations = handCombinations;
					handCombinations = [];
					valueCombination.forEach(function(value){
						oldCombinations.forEach(function(oldCombination){
							var newCombination = oldCombination.map(function(c){
								return c;
							})
							newCombination.push(value);
							handCombinations.push(newCombination);
						});
					});				
				}
				else {
					handCombinations = valueCombination.map(function(value){
						return [value];
					});
				}
			}
		});
		var handCombinationSums =  _.map(handCombinations,function(combination){
			return combination.reduce(function(mem, value){
				return mem + value;
			}, 0)
		});
		return !!~handCombinationSums.indexOf(desiredValue);
	},
	getMinimumValueOfCards: function(cards) {
		return this.hand.reduce(function(memo, card){
			return memo + Math.min.apply(Math, card.getValues());
		}, 0)
	},
	getMaximumValueOfCards: function(cards) {
		return this.hand.reduce(function(memo, card){
			return memo + Math.max.apply(Math, card.getValues());
		}, 0)
	}
};
var Player = function(){
	this.role = 'player';
};
Player.prototype = new BlackjackPlayer();
Player.prototype.stick = function() {
	this.game.changeStatus('afterFirstDeal');
	this.game.checkWinner();
	if(!this.game.isFinished){
		this.game.dealer.draw();
	}
}
Player.prototype.hit = function() {
	this.takeCard();
	this.stick();

}

var Dealer = function(){
	this.role = 'dealer';
};
Dealer.prototype = new BlackjackPlayer();
Dealer.prototype.draw = function() {
	this.game.currentPlayer = this;
	while(!this.atLeast17() && !this.over21()){
		this.takeCard();
	}
	this.game.checkWinner();
};




