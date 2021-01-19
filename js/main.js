class CarGame {
    constructor(canvasSelector) {
        this.canvas = document.getElementById(canvasSelector);

        this.gameBgPosition = 1800;
        this.speed = 5;
    }

    animateHighway = () => {
        if (this.gameBgPosition <= 900) {
            this.gameBgPosition = 1800;
        }
        this.gameBgPosition -= this.speed;

        this.canvas.style.top = (-this.gameBgPosition) + 'px';
    }

    gameLoop = () => {
        this.animateHighway();
        
        requestAnimationFrame(this.gameLoop);
    }

    run = () => {
        this.gameLoop();
    }
}


function main() {
    const game = new CarGame('game-canvas');
    game.run();
}

main();
