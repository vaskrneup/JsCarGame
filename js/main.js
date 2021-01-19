const CAR_PATHS = [
    'assets/images/cars/blueCar.png',
    'assets/images/cars/greenCar.png',
    'assets/images/cars/purpleCar.png',
    'assets/images/cars/redCar.png',
    'assets/images/cars/yellowCar.png',
];
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
    constructor(x, y, width, height, imagePath, isPlayer, lane) {
        this.x = x;
        this.y = y;
        this.width = width || 30;
        this.height = height || 30;
        this.lane = lane || 1;

        this.image = new Image();
        this.image.src = imagePath;

        this.isPlayer = isPlayer;
    }
}


class CarGame {
    constructor(backgroundSelector, canvasSelector, cars) {
        this.background = document.getElementById(backgroundSelector);

        this.canvas = document.getElementById(canvasSelector);
        this.ctx = this.canvas.getContext("2d");
        this.cars = cars || [];

        this.gameBgPosition = 1800;
        this.speed = 5;
    }

    animateHighway = () => {
        if (this.gameBgPosition <= 900) {
            this.gameBgPosition = 1800;
        }

        this.gameBgPosition -= this.speed;
        this.background.style.top = (-this.gameBgPosition) + 'px';
    }

    animateCar = (car) => {
        const highwayWidth = HIGHWAY_WIDTHS[car.lane];
        this.ctx.drawImage(car.image, highwayWidth.x, highwayWidth.y, car.width, car.height);
    }

    gameLoop = () => {
        this.animateHighway();
        this.cars.forEach(car => this.animateCar(car));

        requestAnimationFrame(this.gameLoop);
    }

    run = () => {
        this.gameLoop();
    }
}


function main() {
    const cars = [];
    CAR_PATHS.forEach(path => cars.push(new Car(null, null, null, null, path, 1, 2)));

    const game = new CarGame('game-background', 'game-canvas', cars);
    game.run();
}

main();
