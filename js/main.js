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
    }

    moveRight = () => {
        if (this.lane === 2) return;
        this.lane++;
    }

    moveLeft = () => {
        if (this.lane === 0) return;
        this.lane--;
    }
}


class CarGame {
    constructor(backgroundSelector, canvasSelector, cars, player) {
        this.background = document.getElementById(backgroundSelector);

        this.canvas = document.getElementById(canvasSelector);
        this.ctx = this.canvas.getContext("2d");
        this.cars = cars || [];
        this.player = player;

        this.gameBgPosition = 1800;
        this.speed = 5;

        this.addEventHandlers()
    }

    clearCanvas = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addEventHandlers = () => {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'd') this.player.moveRight();
            else if (e.key === 'a') this.player.moveLeft();
        })
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

    animatePlayer = () => {
        const highwayWidth = HIGHWAY_WIDTHS[this.player.lane];
        this.ctx.drawImage(this.player.image, highwayWidth.x, highwayWidth.y, this.player.width, this.player.height);
    }

    gameLoop = () => {
        this.clearCanvas();

        this.animateHighway();
        // this.cars.forEach(car => this.animateCar(car));
        this.animatePlayer();

        requestAnimationFrame(this.gameLoop);
    }

    run = () => {
        this.gameLoop();
    }
}


function main() {
    const cars = [];
    CARS.forEach(car => {
        cars.push(new Car(null, null, null, null, car, 1, 2,))
    });

    const game = new CarGame(
        'game-background', 'game-canvas',
        cars, cars[0]
    );
    game.run();
}

main();
