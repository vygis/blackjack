var game = new BlackjackGame();

var GameRenderer = function(targetElement, game){

	this.targetElement = targetElement;
	this.game = game;
	var startGameButton = jQuery('<button>Start Game</button>').on('click', _.bind(function(){
			this.game.dealCards();
			this.render();
		}, this)),
		stickButton = jQuery('<button>Stick</button>').on('click', _.bind(function(){
			this.game.player.stick();
			this.render();
		}, this)),
		hitButton = jQuery('<button>Hit</button>').on('click', _.bind(function(){
			this.game.player.hit();
			this.render();
		}, this)),
		newGameButton = jQuery('<button>New Game</button>').on('click', _.bind(function(){
			this.game.newGame();
			this.render();
		}, this)),
	playerContainer = jQuery('<div/>', {
		class: 'player'
	}),
	dealerContainer = jQuery('<div/>', {
		class: 'dealer'
	});

	function _renderCardContainer(parentContainer, cards, hideFirstCard){
		var cardContainer = jQuery('<div/>', {
			class: 'cards'
		});
		cards.forEach(function(card, index){
			jQuery('<div/>', {
					class: 'card'
				})
				.html(hideFirstCard && index === 0 ? '****' : card.getName)
				.appendTo(cardContainer);
		});
		cardContainer.appendTo(parentContainer);
	}

	function _renderButtonContainer(parentContainer, playerRole, status){
		var buttonContainer = jQuery('<div/>', {
			class: 'buttons'
		});
		if(status !== 'finished') {
			if(playerRole === 'player') {
				buttonContainer.append(stickButton);
				buttonContainer.append(hitButton);
			}
		}
		buttonContainer.append(newGameButton);

		parentContainer.append(buttonContainer);
	}

	function _renderStatusMessage(parentContainer, status){
		var message = {
			draw: 'Draw',
			playerWins: 'Congratulations! You won.',
			dealerWins: 'Dealer wins. Better luck next time!'

		}[status] || '';
		var statusContainer = jQuery('<div/>', {
			class: 'status',
			style: message === '' ? 'display:none' : ''
		}).text(message);	
		statusContainer.appendTo(parentContainer);	
	}

	this.render = function(){
		targetElement.html('');
		if(game.status === 'notStarted') {
			targetElement.append(startGameButton);
		}
		else {
			dealerContainer.html('');
			playerContainer.html('');
			targetElement.append('<h2>Dealer</h2>');
			_renderCardContainer(dealerContainer, this.game.dealer.hand, game.status === 'firstDeal');
			targetElement.append(dealerContainer);
			targetElement.append('<h2>Player</h2>');
			targetElement.append(playerContainer);
			_renderCardContainer(playerContainer, this.game.player.hand, false);
			_renderButtonContainer(targetElement, this.game.currentPlayer.role);
			_renderStatusMessage(targetElement, this.game.status);
		}
	}

	this.render();
}

var gameRenderer = new GameRenderer(jQuery('#game'), game);

