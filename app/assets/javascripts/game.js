// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

/**
 * supplant() does variable substitution on the string. It scans
 * through the string looking for expressions enclosed in {} braces.
 * If an expression is found, use it as a key on the object,
 * and if the key has a string value or number value, it is
 * substituted for the bracket expression and it repeats. 
 */
String.prototype.supplant = function(o) {
    return this.replace(/{([^{}]*)}/g,
        function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

$(function() {
	$('.fbf-button').click(function(event) {
		event.preventDefault();
		$.ajax({
			url: '/create_and_return.json',
			dataType: 'json',
			data: $('#fb_form').serialize(),
			success: Game.showScores
		});
	})
});

/**
 * @author Andrey Bodoev (shonoru@gmail.com)
 */

var Game = Game || {};

Game = {
	score: 0,
	clearSession: function() {
		delete Game.prev_session;
		delete Game.prev_card_id;
	},
	init: function() {
		Game.score = 0;
		Game.showScore();
		Game.showContent();
		Game.hideForms();
		Game.clearSession();
		
		$('.board').html('');
		Game.MATRIX = Game.checkMatrix();
		var template = '<div class="card-container card-bg" id="{id}"><div class="cc-content cc-border"></div></div>'
		for (var i=0, length = Game.MATRIX.length; i < length; i++) {
			var obj = {
				id: i
			}
			$(template.supplant(obj)).appendTo('.board');
		}
		Game.defaultState();
	},
	checkBoard: function() {
		if (!$('.card-bg').length) {
			Game.showForm();
		};
	},
	checkMatrix: function(number) {
		return '1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8'.split(',').sort(function() {return 0.5 - Math.random()})
	},
	flipCardKey: function(card_id) {
		var delay = 500;
		// var card_id = id;
		var self = $('#' + card_id);
		if ($(self).hasClass('card-bg')) {
			var flag = true;
			if (Game.prev_card_id) {
				if (card_id === Game.prev_card_id) {
					flag = false;
				};
			};
			if (flag) {
				var current_session = {
					el: self,
					colour: Game.MATRIX[card_id]
				};
		
				$(current_session.el).addClass('colour' + current_session.colour); // show card;
		
				var prev_session = Game.prev_session;
		
				if (prev_session) {
					if (prev_session.colour === current_session.colour) {
						// closed cards, remove session;
						// remove card-bg and colour;
						setTimeout(function() {
							$(current_session.el).removeClass('colour' + current_session.colour).removeClass('card-bg');
							$(prev_session.el).removeClass('colour' + prev_session.colour).removeClass('card-bg');
							Game.checkBoard();
						}, delay);
						Game.addPoint();
					} else {
						setTimeout(function() {
							$(current_session.el).removeClass('colour' + current_session.colour);
							$(prev_session.el).removeClass('colour' + prev_session.colour);
						}, delay);
						Game.losePoint();
					};
					Game.clearSession();
				} else {
					Game['prev_session'] = current_session;
					Game['prev_card_id'] = card_id;
				};
			};
		};
	},
	defaultState: function() {
		$('#0').addClass('card-container-active');
	},
	addPoint: function() {
		Game.score += 1;
		Game.showScore();
	},
	losePoint: function() {
		Game.score -= 1;
		Game.showScore();
	},
	showScore: function() {
		var generator = function() {
			var score = Game.score;
			if (score > 0) {
				return 'Awesome!';
			} else {
				if (score > -5) {
					return '';
				} else {
					if (score > -10) {
						return 'Don\'t give up!';
					} else {
						return 'Be strong!';
					};
				}
				
			};
		};
		$('#gi_score').html(Game.score);
		$('#fb_score').val(Game.score);
	},
	hideContent: function(){
		$('.content').css('opacity', 0.1);
	},
	showContent: function() {
		$('.content').css('opacity', 1);
	},
	showForm: function() {
		Game.hideContent();
		$('.form').removeClass('hide');
		$('.card-container-active').removeClass('card-container-active');
		$('#fb_name').focus(); //.addClass('fbf-select');
	},
	hideForms: function() {
		$('.form').addClass('hide');
		$('.rank').addClass('hide');
	},
	sendScore: function(){
		
	},
	showScores: function(json) {
		$('.rank').removeClass('hide');
		$('.form').addClass('hide');
		
		var template = '<li class="r-li"><div class="r-item {current}"><div class="ri-position">{rank}</div><div class="ri-name">{name}<br /><small class="ri-email">{email}</small> </div><div class="ri-score">{score}</div></div></li>'
		var html = '<ul class="r-ul">';
		for (var i = 0, length = json.length; i < length ; i++) {
			
			if (json[i].current) {
				json[i].current = 'r-item-select';
			} else {
				json[i].current = '';
			};
			
			// html += add + json[i].rank + ': ' + json[i].name +' (' +  json[i].email +') ' + json[i].score + '<br />'
			html += template.supplant(json[i]);
		}
		html += '</ul>';
		$('.card-container-active').removeClass('card-container-active');
		$('.table-body').html(html);
		$('.rank-button').addClass('card-container-active');
	}
};

$(function() {
	Game.init();
});

/**
 * @author Andrey Bodoev (shonoru@gmail.com)
 */

$(document).keydown(function(event) {
	var cl_active = 'card-container-active'
	var current_card = $('.card-container-active');
	var card_id = $('.card-container-active').attr('id');
	switch (event.keyCode) {
	   	case 37:  // left
			if ($(current_card).attr('id') === 'restart_game') {
				$(current_card).removeClass(cl_active);
				var nextCardId = 15;
				$('#'+ nextCardId).addClass(cl_active);
			} else {
				var nextCardId = Number(card_id) - 1;

				if (nextCardId >= 0) {
					$(current_card).removeClass(cl_active);
					$('#'+ nextCardId).addClass(cl_active);
				};
			}
		break;
	   	case 38: // up
	 		// alert('up'); 
			var nextCardId = Number(card_id) - 4;
			if (nextCardId >= 0) {
				$(current_card).removeClass(cl_active);
				$('#'+ nextCardId).addClass(cl_active);
			};
		break;
	   	case 39: //right
			// alert('right'); 
			var nextCardId = Number(card_id) + 1;
			if (nextCardId === 16) {
				// move to restart!
				$('#restart_game').addClass(cl_active);
				$(current_card).removeClass(cl_active);
			} else {
				if (nextCardId <= 15) {
					$(current_card).removeClass(cl_active);
					$('#'+ nextCardId).addClass(cl_active);
				};
			};
		break; // down
	   	case 40: 
			var nextCardId = Number(card_id) + 4;
			if (nextCardId <= 15) {
				$(current_card).removeClass(cl_active);
				$('#'+ nextCardId).addClass(cl_active);
			};
		break;
		case 13: // enter
			if ($(current_card).hasClass('restart-button')) {
				$(current_card).removeClass(cl_active);
				Game.init();
			} else {
				if ($(current_card).hasClass('continue-button')) {
					// show highscores;
					
				} else {
					Game.flipCardKey(card_id);
				};
			};
		break;
		case 27: // esc; restart game;
			// Game.init();
		break;
	};
});
