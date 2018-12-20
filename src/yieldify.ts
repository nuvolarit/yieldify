class Ball {
    static DAMPING: number = .8;
    static FRICTION: number = .020;
    static GRAVITY: number = 9.8;

    element: HTMLElement;
    vx: number;
    vy: number;
    timestamp: number;

    constructor(public x: number, public y: number, public v: number, public alpha: number) {
        this.element = $("<div class='ball'></div>")[0];
        this.vx = v * Math.cos(alpha)
        this.vy = v * Math.sin(alpha)
        this.timestamp = Date.now();
    }

    updateLayout() {
        $(this.element).css({
            left: this.x,
            bottom: this.y
        });
    }

    updatePosition(dt: number) {
        this.x = this.x + (this.vx * dt);
        this.y = this.y + (this.vy * dt);
        this.vx = this.vx - (Ball.FRICTION * this.vx * dt);
        this.vy = this.vy - (Ball.GRAVITY * dt);

        if (this.y < 0)
            this.vy = Math.abs(this.vy) * Ball.DAMPING;

        this.updateLayout();
    }
}

class Board {
    static BALL_TIMEOUT = 30000;
    static BALL_MIN_VELOCITY = 10;
    static BALL_MAX_VELOCITY = 80;
    static DELTA_TIME = .06;
    static UPDATE_BOARD_INTERVAL = 15;

    balls: Array<Ball> = [];

    private _interval;

    constructor(public element: HTMLElement) {
        $(this.element).on('click', (evt: JQueryEventObject) => {
            if (evt.target == this.element)
                this.addBall(evt.offsetX, this.element.offsetHeight - evt.offsetY)
        });
    }

    private addBall(x, y) {
        let ball: Ball = new Ball(x, y,
            Board.BALL_MIN_VELOCITY + Math.floor(Math.random() * Board.BALL_MAX_VELOCITY),
            Math.random() * Math.PI);

        this.balls.push(ball);
        this.element.appendChild(ball.element);

        ball.updateLayout();
    }

    private removeBall(ball: Ball) {
        this.element.removeChild(ball.element);
        this.balls.splice(this.balls.indexOf(ball), 1);
    }

    private updateBoard() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            let ball = this.balls[i];
            ball.updatePosition(Board.DELTA_TIME);
            if (ball.x < 0
                || ball.x > this.element.offsetWidth
                || ball.y > this.element.offsetHeight
                || Date.now() - ball.timestamp > Board.BALL_TIMEOUT)
                this.removeBall(ball);
        }
    }

    start() {
        this._interval = setInterval(() => {
            this.updateBoard();
        }, Board.UPDATE_BOARD_INTERVAL);
    }

    stop() {
        if (this._interval)
            clearInterval(this._interval);
    }
}

class Game {
    private _board: Board;

    constructor() {
        this._board = new Board($("#board")[0]);
    }

    startGame() {
        this._board.start();
    }

    stopGame() {
        this._board.stop();
    }
}

$(() => {
    var game = new Game();
    game.startGame();
});
