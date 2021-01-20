// const {random} = require("./utils");
import {random} from './utils.js'

const CAR_PATHS = [
    'assets/images/cars/blueCar.png',
    'assets/images/cars/greenCar.png',
    'assets/images/cars/purpleCar.png',
    'assets/images/cars/redCar.png',
    'assets/images/cars/yellowCar.png',
];
const ROTATED_CAR_PATHS = [
    'assets/images/cars/blueCarRotate.png',
    'assets/images/cars/greenCarRotate.png',
    'assets/images/cars/purpleCarRotate.png',
    'assets/images/cars/redCarRotate.png',
    'assets/images/cars/yellowCarRotate.png',
];
const CARS = CAR_PATHS.map(carPath => {
    const carImg = new Image();
    carImg.src = carPath;
    return carImg;
});
const ROTATED_CARS = ROTATED_CAR_PATHS.map(carPath => {
    const carImg = new Image();
    carImg.src = carPath;
    return carImg;
});
const HIGHWAY_WIDTHS = {
    '0': {
        x: 48,
        y: 110
    },
    '1': {
        x: 135,
        y: 110
    },
    '2': {
        x: 219,
        y: 110
    }
}


class Car {
    constructor(x, y, width, height, image, isPlayer, lane, speed) {
        this.x = x;
        this.y = y;
        this.width = width || 30;
        this.height = height || 30;
        this.lane = lane;

        this.image = image;
        this.speed = speed;

        this.hasGotPoint = false;
    }

    moveRight = () => {
        if (this.lane === 2) return;
        this.lane++;
    }

    moveLeft = () => {
        if (this.lane === 0) return;
        this.lane--;
    }

    moveDown = () => {
        this.y += this.speed;
    }
}


class CarGame {
    constructor(backgroundSelector, canvasSelector, cars, player) {
        this.background = document.getElementById(backgroundSelector);

        this.canvas = document.getElementById(canvasSelector);
        this.ctx = this.canvas.getContext("2d");

        this.cars = cars || [];
        this._cars = cars || [];
        this.player = player;
        this._player = player;
        this.activeCars = [];
        this.multipleCarProbability = 0.5;

        this.paused = true;

        this.gameBgPosition = 1800;
        this.speed = 5;
        this.carSpeed = 1;
        this.speedIncreaseFactor = 0.03;

        this.point = 0;
        this.highScore = +localStorage.getItem('highScore') || 0;
        this.pointSelectorDOM = document.getElementById('game-score');
        this.highScoreSelectorDOM = document.getElementById('high-score');

        this.startGameBtn = document.getElementById('start-game-btn');
        this.gameOverText = document.getElementById('game-over-text');
        this.startScreen = document.querySelector('.start-screen');

        this.first = true;
        this.addEventHandlers();
    }

    updatePointInDOM = () => {
        this.pointSelectorDOM.innerText = this.point.toString();
        this.updateHighScoreInDOM();
    }

    updateHighScoreInDOM = () => {
        this.highScoreSelectorDOM.innerText = this.highScore;
    }

    handleGameOver = () => {
        if (this.highScore < this.point) {
            localStorage.setItem('highScore', this.point);
            this.highScore = this.point;
            this.updateHighScoreInDOM();
        }

        this.startScreen.style.display = 'block';
        this.gameOverText.style.display = 'block';
        this.startGameBtn.innerText = 'PLAY AGAIN';

        this.cars = this._cars;
        this.player = this._player;
        this.activeCars = [];
        this.multipleCarProbability = 0.5;

        this.paused = true;

        this.gameBgPosition = 1800;
        this.speed = 5;
        this.carSpeed = 1;
        this.speedIncreaseFactor = 0.03;

        this.point = 0;
        this.first = false;
    }

    generateRandomCar = () => {
        if (!this.paused) {
            const lanes = [0, 1, 2];
            const lane = random.randInt(0, 3);
            const highwayWidth = HIGHWAY_WIDTHS[lane];
            this.activeCars.push(new Car(highwayWidth.x, -100, null, null, random.choice(this.cars), false, lane, this.carSpeed));

            if (random.generateBoolean(this.multipleCarProbability)) {
                setTimeout(() => {
                    if (!this.paused) {
                        lanes.splice(lane, 1);
                        const newLane = random.choice(lanes);
                        this.activeCars.push(new Car(HIGHWAY_WIDTHS[newLane].x, -100, null, null, random.choice(this.cars), false, newLane, this.carSpeed));
                    }
                }, random.randRange(300, 900))
            }
        }
    }

    clearCanvas = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addEventHandlers = () => {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'd') this.player.moveRight();
            else if (e.key === 'a') this.player.moveLeft();
        });

        document.addEventListener('visibilitychange', () => this.paused = !this.paused);
    }

    animateHighway = () => {
        if (this.gameBgPosition <= 800) {
            this.gameBgPosition = 1800;
        }

        this.gameBgPosition -= this.speed;
        this.background.style.top = (-this.gameBgPosition) + 'px';
    }

    animateCar = (car) => {
        car.speed = this.carSpeed;
        car.moveDown();
        this.ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
    }

    animatePlayer = () => {
        const highwayWidth = HIGHWAY_WIDTHS[this.player.lane];
        this.ctx.drawImage(this.player.image, highwayWidth.x, highwayWidth.y, this.player.width, this.player.height);
    }

    calculatePoint = (car) => {
        if ((car.y >= HIGHWAY_WIDTHS[this.player.lane].y) && !car.hasGotPoint) {
            this.carSpeed += this.speedIncreaseFactor;
            this.speed += this.speedIncreaseFactor;
            this.multipleCarProbability += 0.02;
            this.point++;
            car.hasGotPoint = true;
            this.updatePointInDOM();
        }
    }

    removeCar = (car, index) => {
        if (car.y >= 270) {
            this.activeCars.splice(index, 1);
        }
    }

    detectCrash = (car) => {
        const playerY = HIGHWAY_WIDTHS[this.player.lane].y;

        if ((this.player.lane === car.lane) && ((playerY + this.player.height >= car.y) && (playerY <= car.y + car.height))) {
            this.handleGameOver();
        }
    }

    gameLoop = () => {
        if (!this.paused) {
            this.clearCanvas();

            this.animateHighway();
            this.activeCars.forEach((car, i) => {
                this.calculatePoint(car);
                this.animateCar(car);
                this.removeCar(car, i)
                this.detectCrash(car)
            });
            this.animatePlayer();
        }

        requestAnimationFrame(this.gameLoop);
    }

    run = () => {
        this.updateHighScoreInDOM();
        this.paused = false;
        // this.generateRandomCar();
        if (this.first) {
            setInterval(this.generateRandomCar, 2000)
            this.gameLoop();
        }
    }
}


function main() {
    const game = new CarGame(
        'game-background', 'game-canvas',
        ROTATED_CARS, new Car(null, null, null, null, random.choice(CARS), true, 1)
    );

    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', () => {
        const startScreen = document.querySelector('.start-screen');
        startScreen.style.display = 'none';
        game.run();
    });
}

main();
