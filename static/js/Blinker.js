// fallback to blink caret for browsers without css animations
;(function() {
    var delay = 500;

    var Blinker = function(el) {
        this.el = el;
        this.showing = true;
        this._alternate = _.bind(this.alternate, this);
    };

    Blinker.prototype.start = (function() {
        if (Modernizr.cssanimations) {
            return function() {
                this.el.classList.add('blink');
            }
        } else { 
            return function() {
                this.timeout = setTimeout(this._alternate, delay);
            }
        }
    })();

    Blinker.prototype.end = (function() {
        if (Modernizr.cssanimations) {
            return function() {
                this.el.classList.remove('blink');
            }
        } else { 
            return function() {
                clearTimeout(this.timeout);
                this.el.style.opacity = 1;
            }
        }
    })();

    Blinker.prototype.alternate = function() {
        this.showing = !this.showing;
        this.el.style.opacity = this.showing ? 1 : 0;
        this.timeout = setTimeout(this._alternate, delay);
    }

    window.Blinker = Blinker;
})();
