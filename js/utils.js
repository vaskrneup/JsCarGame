class Random {
    /**
     * Generates random `Number` in given range, and rounds the number to given digits if roundNumber is given else, returns non rounded number.
     *
     * @param {Number} min                  Minimum value random number.
     * @param {Number} max                  Maximum value random number.
     * @param {Number} [roundNumber]        Number of digits to round from random number.
     * */
    randRange = (min, max, roundNumber) => {
        const randomNumber = Math.random() * (max - min) + min;
        return roundNumber ? randomNumber.toFixed(roundNumber) : randomNumber;
    }

    /**
     * Generates random `Integer` in given range.
     *
     * @param {Number} min                  Minimum value random number.
     * @param {Number} max                  Maximum value random number.
     * */
    randInt = (min, max) => {
        return parseInt(this.randRange(min, max));
    }

    /**
     * Generates random `Hex color value`.
     * */
    getRandomHexColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    choice = (objects) => {
        return objects[this.randInt(0, objects.length)];
    }

    generateBoolean = (trueThreshold = 0.5) => {
        return Math.random() < trueThreshold;
    }
}

export const random = new Random();
