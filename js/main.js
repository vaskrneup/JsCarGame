// const {random} = require("./utils");
import {random} from './utils.js'

const CAR_PATHS = [
    'assets/images/cars/blueCar.png',
    'assets/images/cars/greenCar.png',
    'assets/images/cars/purpleCar.png',
    'assets/images/cars/redCar.png',
    'assets/images/cars/yellowCar.png',
];
const CARS = CAR_PATHS.map(carPath => {
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
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 900;


class Car {
    constructor(x, y, width, height, image, isPlayer, lane) {
        this.x = x;
        this.y = y;
        this.width = width || 30;
        this.height = height || 30;
        this.lane = lane || 1;

        this.image = image;

        this.isPlayer = isPlayer;
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
        this.y++;
    }
}


class CarGame {
    constructor(backgroundSelector, canvasSelector, cars, player) {
        this.background = document.getElementById(backgroundSelector);

        this.canvas = document.getElementById(canvasSelector);
        this.ctx = this.canvas.getContext("2d");

        this.cars = cars || [];
        this.player = player;
        this.activeCars = [];
        this.multipleCarProbability = 0.5;
        this.lastLane = null;

        this.paused = false;

        this.gameBgPosition = 1800;
        this.speed = 5;
        this.carSpeed = 2;
        this.speedIncreaseFactor = 0.1;

        this.point = 0;
        this.pointSelectorDOM = document.getElementById('game-score');

        this.addEventHandlers()
    }

    updatePointInDOM = () => {
        this.pointSelectorDOM.innerText = this.point.toString();
    }

    generateRandomCar = () => {
        if (!this.paused) {
            const lanes = [0, 1, 2];
            const lane = random.randInt(0, 3);
            const highwayWidth = HIGHWAY_WIDTHS[lane];
            this.activeCars.push(new Car(highwayWidth.x, (random.randInt(1, 10)), null, null, random.choice(this.cars), false, lane));

            if (random.generateBoolean()) {
                setTimeout(() => {
                    lanes.splice(lane, 1);
                    const newLane = random.choice(lanes);
                    this.activeCars.push(new Car(HIGHWAY_WIDTHS[newLane].x, (random.randInt(1, 10)), null, null, random.choice(this.cars), false, newLane));
                }, 200)
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
        if (this.gameBgPosition <= 900) {
            this.gameBgPosition = 1800;
        }

        this.gameBgPosition -= this.speed;
        this.background.style.top = (-this.gameBgPosition) + 'px';
    }

    animateCar = (car) => {
        car.moveDown();
        this.ctx.drawImage(car.image, car.x, car.y - 100, car.width, car.height);
    }

    animatePlayer = () => {
        const highwayWidth = HIGHWAY_WIDTHS[this.player.lane];
        this.ctx.drawImage(this.player.image, highwayWidth.x, highwayWidth.y, this.player.width, this.player.height);
    }

    calculatePoint = (car) => {
        if ((car.y - car.height - this.player.height * 2 >= HIGHWAY_WIDTHS[this.player.lane].y) && !car.hasGotPoint) {
            this.carSpeed += this.speedIncreaseFactor;
            this.speed += this.speedIncreaseFactor;
            console.log(this.speed)
            console.log(this.carSpeed)
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

    gameLoop = () => {
        if (!this.paused) {
            this.clearCanvas();

            this.animateHighway();
            this.activeCars.forEach((car, i) => {
                this.calculatePoint(car);
                this.animateCar(car);
                this.removeCar(car, i)
            });
            this.animatePlayer();
        }

        requestAnimationFrame(this.gameLoop);
    }

    run = () => {
        this.gameLoop();

        setInterval(this.generateRandomCar, 2000)
    }
}


function main() {
    const game = new CarGame(
        'game-background', 'game-canvas',
        CARS, new Car(null, null, null, null, random.choice(CARS), true, 1)
    );
    game.run();
}

main();
