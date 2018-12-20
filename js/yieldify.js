var Ball = (function () {
    function Ball(x, y, v, alpha) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.alpha = alpha;
        this.element = $("<div class='ball'></div>")[0];
        this.vx = v * Math.cos(alpha);
        this.vy = v * Math.sin(alpha);
        this.timestamp = Date.now();
    }
    Ball.prototype.updateLayout = function () {
        $(this.element).css({
            left: this.x,
            bottom: this.y
        });
    };
    Ball.prototype.updatePosition = function (dt) {
        this.x = this.x + (this.vx * dt);
        this.y = this.y + (this.vy * dt);
        this.vx = this.vx - (Ball.FRICTION * this.vx * dt);
        this.vy = this.vy - (Ball.GRAVITY * dt);
        if (this.y < 0)
            this.vy = Math.abs(this.vy) * Ball.DAMPING;
        this.updateLayout();
    };
    Ball.DAMPING = .8;
    Ball.FRICTION = .020;
    Ball.GRAVITY = 9.8;
    return Ball;
}());
var Board = (function () {
    function Board(element) {
        var _this = this;
        this.element = element;
        this.balls = [];
        $(this.element).on('click', function (evt) {
            if (evt.target == _this.element)
                _this.addBall(evt.offsetX, _this.element.offsetHeight - evt.offsetY);
        });
    }
    Board.prototype.addBall = function (x, y) {
        var ball = new Ball(x, y, Board.BALL_MIN_VELOCITY + Math.floor(Math.random() * Board.BALL_MAX_VELOCITY), Math.random() * Math.PI);
        this.balls.push(ball);
        this.element.appendChild(ball.element);
        ball.updateLayout();
    };
    Board.prototype.removeBall = function (ball) {
        this.element.removeChild(ball.element);
        this.balls.splice(this.balls.indexOf(ball), 1);
    };
    Board.prototype.updateBoard = function () {
        for (var i = this.balls.length - 1; i >= 0; i--) {
            var ball = this.balls[i];
            ball.updatePosition(Board.DELTA_TIME);
            if (ball.x < 0
                || ball.x > this.element.offsetWidth
                || ball.y > this.element.offsetHeight
                || Date.now() - ball.timestamp > Board.BALL_TIMEOUT)
                this.removeBall(ball);
        }
    };
    Board.prototype.start = function () {
        var _this = this;
        this._interval = setInterval(function () {
            _this.updateBoard();
        }, Board.UPDATE_BOARD_INTERVAL);
    };
    Board.prototype.stop = function () {
        if (this._interval)
            clearInterval(this._interval);
    };
    Board.BALL_TIMEOUT = 30000;
    Board.BALL_MIN_VELOCITY = 10;
    Board.BALL_MAX_VELOCITY = 80;
    Board.DELTA_TIME = .06;
    Board.UPDATE_BOARD_INTERVAL = 15;
    return Board;
}());
var Game = (function () {
    function Game() {
        this._board = new Board($("#board")[0]);
    }
    Game.prototype.startGame = function () {
        this._board.start();
    };
    Game.prototype.stopGame = function () {
        this._board.stop();
    };
    return Game;
}());
$(function () {
    var game = new Game();
    game.startGame();
});
//# sourceMappingURL=yieldify.js.map