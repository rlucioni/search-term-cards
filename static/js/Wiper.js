;(function() {

    var MOTION_BLUR_DETAIL = url.int('motionBlurDetail', 0);
    var FILL = url.boolean('fill', true);

    var colors = ['#e91e63', '#9e9e9e', '#03a9f4', '#ffc107'],
        transitions = {
            fromBottom: {
                before: [0, '100%'],
                after: [0, '-100%'],
                wrapper: [0, '4em']
            },
            fromTop: {
                before: [0, '-100%'],
                after: [0, '100%'],
                wrapper: [0, '-4em']
            },
            fromLeft: {
                before: ['-100%', 0],
                after: ['100%', 0],
                wrapper: ['-4em', 0]
            },
            fromRight: {
                before: ['100%', 0],
                after: ['-100%', 0],
                wrapper: ['4em', 0]
            }
        };

    var Wiper = function(container, id) {
        // console.time('Create Wiper');

        this.backgroundColors = _.shuffle(colors);

        this.container = container;

        this.id = id;

        this.motionBlur = MOTION_BLUR_DETAIL > 0;

        this.a = new Pane();
        this.b = new Pane();

        this.pane = this.a;
        this.oldPane = this.b;
        
        this.typer = new Typer(_.bind(this.onCharacters, this));

        this.el = document.createElement('div');
        this.el.className = 'wiper';
        this.el.appendChild(this.a.el);
        this.el.appendChild(this.b.el);

        var _this = this;

        this.onTransitionEnd = function(e) {

            setOffset(_this.oldPane.el, 
                transitions[_this.transition].before[0], 
                transitions[_this.transition].before[1]
            );

            setOffset(_this.oldPane.wrapper, 
                transitions[_this.transition].wrapper[0], 
                transitions[_this.transition].wrapper[1]
            );

            _this.oldPane.wrapper.style.opacity = 0;

            _this.pane.clearMotionBlur();
 
        };

        this.container.appendChild(this.el);

        this.shown = 0;
        this.selectRandomTransition();
    };


    Wiper.prototype._show = function(onComplete) {
        if (this.motionBlur) {
            if (this.transition == 'fromTop' || this.transition == 'fromBottom') {
                this.pane.setMotionBlur(false);
            } else { 
                this.pane.setMotionBlur(true);
            }
        }

        onComplete = onComplete || _.identity;

        // bandaid for whiteflash
        if (FILL) this.container.style.backgroundColor = this.backgroundColors[this.shown%this.backgroundColors.length];

        this.shown++;

        var _this = this;

        if (this.pane == this.a) {
            this.pane = this.b;
            this.oldPane = this.a;
        } else {
            this.pane = this.a;
            this.oldPane = this.b;
        }

        this.oldPane.el.style.zIndex = 0;

        transitionOffset(this.oldPane.el, 
            transitions[this.transition].after[0], 
            transitions[this.transition].after[1], 
            this.onTransitionEnd,
            400
        );

        this.selectRandomTransition();

        this.pane.clear();

        if (FILL) {
            this.pane.el.style.backgroundColor = this.backgroundColors[this.shown%this.backgroundColors.length];
            
            if (this.motionBlur) this.pane.el.style.boxShadow = '0 0 0.3em 0.3em ' + this.backgroundColors[this.shown%this.backgroundColors.length];
            else this.pane.el.style.boxShadow = 'none';
        }

        this.pane.el.style.zIndex = 1;

        transitionOffset(this.pane.el, 0, 0, undefined, 400);
        transitionOffset(this.pane.wrapper, 0, 0, undefined, 1150);

        var _this = this;

        this.pane.inputs[0].blinker.end();
    };

    Wiper.prototype.showArbitrary = function(html, onComplete) {
        this._show(onComplete);

        this.pane.arbitrary.innerHTML = html;

        onComplete();
    };

    Wiper.prototype.show = function(str, onComplete) {
        str = str.toString();

        this._show(onComplete);

        // Check string for right-to-left characters
        this.pane.el.setAttribute('dir', 'ltr');
        for (var i = 0; i < str.length; i++) {
            if (isRTL(str.charCodeAt(i))) {
                this.pane.el.setAttribute('dir', 'rtl');
            }
        }

        var _this = this;
        this.typer.start(str, function() {
            _this.pane.inputs[0].blinker.start();
            _this.pane.inputs[0].text.href = 'https://www.edx.org/course-search?search_query='+encodeURIComponent(str);
            onComplete();
        });
    };

    Wiper.prototype.onCharacters = function(c) {
        this.pane.addCharacters(c);
    };

    Wiper.prototype.selectRandomTransition = function() {
        this.transition =_.first(_.shuffle(_.keys(transitions)));
    };

    Wiper.prototype.update = function(delta) {
        this.typer.update(delta);
    };

    Wiper.prototype.onResize = function() {
        this.el.style.fontSize = Math.round(Math.min(this.container.offsetWidth, this.container.offsetHeight) / 5.8) * 1 +'px';
        this.pane.position();
    };

    var Pane = function() {
        this.el = document.createElement('div');
        this.el.classList.add('pane');

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');

        // This is used to do vertical text centering.
        this.wrapper2 = document.createElement('div');
        this.wrapper2.classList.add('wrapper2');

        // Used to turn on and off different motion blurs.
        this.blurHorizontalWrapper = document.createElement('div');
        this.blurHorizontalWrapper.classList.add('blur');
        this.blurHorizontalWrapper.classList.add('horizontal');

        this.blurVerticalWrapper = document.createElement('div');
        this.blurVerticalWrapper.classList.add('blur');
        this.blurVerticalWrapper.classList.add('vertical');

        this.arbitrary = document.createElement('div');
        this.arbitrary.classList.add('arbitrary');

        this.el.appendChild(this.arbitrary);
        this.wrapper2.appendChild(this.blurHorizontalWrapper);
        this.wrapper2.appendChild(this.blurVerticalWrapper);

        this.inputs = [];
        this.blurHorizontal = [];
        this.blurVertical = [];

        // Main typer
        var paneText = new PaneText(this.wrapper2)
        this.inputs.push(paneText);

        while (this.blurHorizontal.length < MOTION_BLUR_DETAIL) {
            paneText = new PaneText(this.blurHorizontalWrapper, this.blurHorizontal.length, true);
            this.inputs.push(paneText);
            this.blurHorizontal.push(paneText);
        }

        while (this.blurVertical.length < MOTION_BLUR_DETAIL) {
            paneText = new PaneText(this.blurVerticalWrapper, this.blurVertical.length, false);
            this.inputs.push(paneText);
            this.blurVertical.push(paneText);
        }

        this.el.appendChild(this.wrapper);
        this.wrapper.appendChild(this.wrapper2);

        this.isClear = true;
        this.centeringTransitionEnabled = true;

        this.lastCharacter = undefined;
    };

    Pane.prototype.addCharacters = function(c) {
        // Hack for long terms requiring newlines and carriage returns
        if (this.lastCharacter == ' ') {
            this.inputs.forEach(function(i) {
                i.jitterBeam();
            });
        }

        this.inputs.forEach(function(i) {
            i.text.innerHTML += c;
        });

        if (this.wrapper.style.opacity != 1) this.wrapper.style.opacity = 1;
        this.position();

        if (this.isClear) {
            this.isClear = false;
            this.enableCenteringTransition();
        }

        this.lastCharacter = c;

        this.clearMotionBlur();
    };

    Pane.prototype.disableCenteringTransition = function() {
        this.centeringTransitionEnabled = false;
        this.wrapper2.classList.remove('transition');
    };

    Pane.prototype.enableCenteringTransition = function() {
        var _this = this;
        _.defer(function() {
            _this.centeringTransitionEnabled = true;
            _this.wrapper2.classList.add('transition');
        })
    };

    Pane.prototype.clear = function() {
        this.lastCharacter = undefined;
        this.arbitrary.innerHTML = '';
        this.inputs.forEach(function(i) {
            i.text.innerHTML = '';
        })
        this.disableCenteringTransition();
        this.isClear = true;
    };

    Pane.prototype.position = function() {
        var h = this.inputs[0].el.offsetHeight;

        if (h != this.lastInputHeight) {
            if (this.centeringTransitionEnabled) 
                transitionOffset(this.wrapper2, 0, -~~(h/2) + 'px', undefined, 400);
            else
                setOffset(this.wrapper2, 0, -~~(h/2) + 'px');
        }

        this.lastInputHeight = h;
    };

    Pane.prototype.setMotionBlur = function(horizontal) {
        this.motionBlur = true;

        this.inputs[0].el.style.opacity = 1/(MOTION_BLUR_DETAIL+1);
        if (horizontal) {
            this.blurHorizontalWrapper.style.display = 'block';
        } else { 
            this.blurVerticalWrapper.style.display = 'block';
        }
    };

    Pane.prototype.clearMotionBlur = function() {
        this.motionBlur = false;
        this.inputs[0].el.style.opacity = 1;
        this.blurHorizontalWrapper.style.display = 'none';
        this.blurVerticalWrapper.style.display = 'none';
    };
    
    var PaneText = function(container, index, horizontal) {
        this.index = index || 0;

        this.el = document.createElement('span');
        this.el.classList.add('input');

        this.text = document.createElement('a');
        this.text.target = '_blank';

        this.beam = document.createElement('span');
        this.beam.classList.add('beam');

        this.el.appendChild(this.text);
        this.el.appendChild(this.beam);

        this.blinker = new Blinker(this.beam);

        container.appendChild(this.el);

        this.el.style.opacity = 1/(MOTION_BLUR_DETAIL+1);

        if (horizontal !== undefined) {
            var offset = (this.index - (MOTION_BLUR_DETAIL+1)/2) * 0.02 + 'em';

            if (horizontal) {
                setOffset(this.el, offset, 0);
            } else { 
                setOffset(this.el, 0, offset);
            }
        }
    }

    PaneText.prototype.jitterBeam = function() {
        var _this = this;
        this.beam.style.display = 'none';
        _.defer(function() {
            _this.beam.style.display = 'inline-block';
        });
    };

    window.Wiper = Wiper;
})();
