// attempts to normalize transition strategies across browsers
// css3 transitions vs. $.animate
;(function() {    
    var BIG_WEBKIT, SOFTWARE_TRANSITION, CSS_TRANSITION, CSS_3D, CSS_2D;

    // http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
    var VENDOR_TRANSITION_END = (function() {
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (var t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    })();

    // http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
    var VENDOR_TRANSFORM = (function() {
        var el = document.createElement('p'), 
            transforms = {
                'webkitTransform':'-webkit-transform',
                // 'msTransform':'-ms-transform', // not using that because you don't have transitions ...
                // 'MozTransform':'-moz-transform', // doesn't honor their old prefixes ...
                // 'OTransform':'-o-transform', // doesn't honor their old prefixes ...
                'transform':'transform'
            };

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                return transforms[t];
            }
        }
    })();

    // safari and uiwebview doing all sorts of crazy stuff trying to css transform really big divs.
    BIG_WEBKIT = (navigator.userAgent.indexOf('AppleWebKit') != -1 && navigator.userAgent.indexOf('Chrome') == -1) &&
                    (window.innerWidth > 1800 || window.innerHeight > 1950); // fairly arbitrary, only counts on load.

    SOFTWARE_TRANSITION = url.boolean('forceSoftware'); // || BIG_WEBKIT;

    CSS_TRANSITION = !SOFTWARE_TRANSITION && Modernizr.csstransitions;

    CSS_3D = !SOFTWARE_TRANSITION && 
                        Modernizr.csstransitions &&
                        Modernizr.csstransforms3d;

    CSS_2D = !SOFTWARE_TRANSITION && 
                        Modernizr.csstransitions &&
                        Modernizr.csstransforms;

    window.transitionOffset = function(el, x, y, callback, dur) {
        if (CSS_TRANSITION) {
            if (callback) {
                var _callback = function() {
                    callback.call(el);
                    el.removeEventListener(VENDOR_TRANSITION_END, _callback, false);
                };

                el.addEventListener(VENDOR_TRANSITION_END, _callback, false);
            }

            // If CSS transitions are on, just set the offset.
            setOffset(el, x, y);
        } else { 
            $(el).stop().animate({
                left: x,
                top: y
            }, dur, 'easeOutExpo', callback);
        }
    };

    window.setOffset = function(el, x, y) {
        if (CSS_3D) {
            el.style[VENDOR_TRANSFORM] = 'translate3d('+x+','+y+', 0)';
        } else if (CSS_2D) {
            el.style[VENDOR_TRANSFORM] = 'translate('+x+','+y+')';
        } else {
            el.style.left = x;
            el.style.top = y;
        }
    };
})();
