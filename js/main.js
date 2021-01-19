const CAR_PATHS = [
    'assets/images/cars/blueCar.png',
    'assets/images/cars/greenCar.png',
    'assets/images/cars/purpleCar.png',
    'assets/images/cars/redCar.png',
    'assets/images/cars/yellowCar.png',
];


class Car {
    constructor(x, y, width, height, imagePath, isPlayer) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

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
        this.ctx.drawImage(car.image, 10, 10)
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
    CAR_PATHS.forEach(path => cars.push(new Car(null, null, null, null, path)));

    const game = new CarGame('game-background', 'game-canvas', cars);
    game.run();
}

main();
