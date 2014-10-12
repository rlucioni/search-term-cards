;(function() {
    var Typer = function(onCharacters) {
        this.characterSpeeds = [];
        this.onCharacters = onCharacters;
    };

    Typer.prototype.start = function(str, onComplete) {
        // Make a random speed seed for each character.
        this.characterSpeeds.length = 0;
        while (this.characterSpeeds.length < str.length) {
            this.characterSpeeds.push(Math.random() * 0.02 + 0.017);
        }

        // Randomize a "global" speed.
        // (Some people are just slow typers.)
        this.speedMultiplier = this.forceSpeed ? this.forceSpeed : Math.random() * 0.25 + 0.2; //url.float('speed', Math.random() * 0.25 + 0.2);

        this.str = str;
        this.charIndex = 0;
        this.charIndexInteger = 0;
        this.lastCharIndexInteger = 0;
        this.onComplete = onComplete;
        this.completed = false;

        if (!this.str) { 
            this.completed = true;
            this.onComplete();
        }
    };

    Typer.prototype.update = function(delta) {
        if (this.charIndex <= this.str.length+1) {
            var s = this.characterSpeeds[this.charIndexInteger] * delta * this.speedMultiplier;
            var c = this.str.charAt(this.charIndex);

            // Slow down for capital letters and such
            if (c != ' ' && (isUppercase(c) || isNotRomanAlpha(c)))
                s /= 3;

            this.charIndex += s;
            this.lastCharIndexInteger = this.charIndexInteger;
            this.charIndexInteger = Math.floor(this.charIndex);

            if (this.lastCharIndexInteger < this.charIndexInteger) {
                this.onCharacters(
                    this.str.substring(this.lastCharIndexInteger, 
                        this.charIndexInteger
                    )
                );
            }
        } else if (!this.completed) { 
            this.onComplete();
            this.completed = true;
        }
    };

    function isNotRomanAlpha(c) {
        return c.toLowerCase() == c.toUpperCase();
    }

    function isUppercase(c) {
        return c.toLowerCase() != c;
    }

    window.Typer = Typer;
})();
