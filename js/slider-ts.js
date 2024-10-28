var Slider = /** @class */ (function () {
    /**
     * Creates an instance of the Slider class. The element with the root of the slider
     * is specified by the SliderElementRoot parameter.
     * @param {string} SliderElementRoot - The css selector of the root element of the slider.
     */
    function Slider(SliderElementRoot) {
        this.sliderRoot = null;
        this.selectorElementRoot = 'slider';
        this.numberOfSlides = 3;
        this.shift = 100 / this.numberOfSlides;
        this.coutElwments = 0;
        this.corentSlide = 1;
        //coutThisSlideElemtnt: HTMLSpanElement = document.createElement('span');
        this.controlDiv = document.createElement('div');
        this.prevDiv = document.createElement('div');
        this.nextDiv = document.createElement('div');
        this.coutThisSlide = document.createElement('span');
        this.coutTotalSlide = document.createElement('span');
        this.coutBox = document.createElement('div');
        this.selectorElementRoot = SliderElementRoot;
        this.sliderRoot = document.querySelector(SliderElementRoot);
        if (this.sliderRoot && this.sliderRoot.children.length > 0) {
            this.coutElwments = this.sliderRoot.children.length;
            this.corentSlide = 1;
            this.createBoxControl();
            document.querySelector('head').innerHTML += "<style id=\"sl-style-54646\">\n        ".concat(SliderElementRoot, " {\n          display: flex;\n          overflow: hidden;\n          flex-direction: row;\n          flex-wrap: nowrap;\n          align-items: center;\n          justify-content: flex-start;\n        }\n\n        ").concat(SliderElementRoot, " > div {\n          flex-basis: calc(").concat(this.shift, "% - 30px);\n          flex-shrink: 0;\n          padding: 0 15px;\n          transition: margin-left 0.5s;\n          font-family: sans-serif;\n          text-align: center;\n        }\n\n        ").concat(SliderElementRoot, " > div div:last-child {\n          text-align: left;\n        }\n\n        ").concat(SliderElementRoot, " img {\n          width: 100%;\n        }</style>");
        }
        else {
            throw new Error('Slider: There is no element');
        }
    }
    /**
     * Initializes and creates the control box for the slider.
     * This includes the previous and next navigation buttons,
     * as well as the display for the current slide number and
     * total number of slides. The control is appended to the
     * slider root element.
     */
    Slider.prototype.createBoxControl = function () {
        var _this = this;
        var _a, _b;
        this.controlDiv.id = 'sl-control';
        this.prevDiv.id = 'sl-prev';
        this.prevDiv.textContent = 'Prev';
        this.prevDiv.addEventListener('click', function () {
            _this.prev();
        });
        this.nextDiv.id = 'sl-next';
        this.nextDiv.textContent = 'Next';
        this.nextDiv.addEventListener('click', function () {
            _this.next();
        });
        var startX, startY;
        var isMoved = false;
        (_a = this.sliderRoot) === null || _a === void 0 ? void 0 : _a.addEventListener('touchstart', function (ev) {
            startX = ev.touches[0].clientX;
            startY = ev.touches[0].clientY;
            isMoved = false;
        });
        (_b = this.sliderRoot) === null || _b === void 0 ? void 0 : _b.addEventListener('touchmove', function (ev) {
            var endX = ev.touches[0].clientX;
            var endY = ev.touches[0].clientY;
            var deltaX = endX - startX;
            var deltaY = endY - startY;
            if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && !isMoved) {
                // движение пальцем с права на лево
                console.log(123);
                isMoved = true;
                _this.next();
            }
            if (deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY) && !isMoved) {
                // движение пальцем с лева на право
                console.log(3221);
                isMoved = true;
                _this.prev();
            }
            startX = endX;
            startY = endY;
        });
        this.coutThisSlide.textContent = '1';
        this.coutTotalSlide.textContent = " / ".concat(this.coutElwments);
        this.coutBox.appendChild(this.coutThisSlide);
        this.coutBox.appendChild(this.coutTotalSlide);
        this.controlDiv.appendChild(this.prevDiv);
        this.controlDiv.appendChild(this.coutBox);
        this.controlDiv.appendChild(this.nextDiv);
        if (this.sliderRoot !== null)
            this.sliderRoot.after(this.controlDiv);
    };
    /**
     * Advances the slider to the next slide. If the slider is currently
     * displaying the last slide, it wraps around to the first slide.
     * Updates the current slide number display and adjusts the margin
     * of the first slide element to create a sliding effect. After a
     * delay, it rearranges the DOM elements by appending a clone of the
     * first slide to the end and removing the original first slide.
     */
    Slider.prototype.next = function () {
        var _this = this;
        if (this.sliderRoot && this.sliderRoot.firstElementChild) {
            this.sliderRoot.firstElementChild.style.marginLeft = "-".concat(this.shift, "%");
        }
        this.corentSlide++;
        if (this.corentSlide > this.coutElwments) {
            this.corentSlide = 1;
        }
        this.coutThisSlide.textContent = "".concat(this.corentSlide);
        setTimeout(function () {
            var _a, _b;
            var _c = _this.lastAndFirstNode(), firstElement = _c[0], lastElement = _c[1], clone = _c[2];
            if (firstElement && lastElement && clone) {
                (_a = _this.sliderRoot) === null || _a === void 0 ? void 0 : _a.appendChild(clone);
                (_b = _this.sliderRoot) === null || _b === void 0 ? void 0 : _b.removeChild(firstElement);
                lastElement.style.marginLeft = '0';
            }
        }, 500);
    };
    /**
     * Moves the slider to the previous slide. If the slider is currently
     * displaying the first slide, it wraps around to the last slide. Updates
     * the current slide number display and adjusts the margin of the last
     * slide element to create a sliding effect. After a delay, it rearranges
     * the DOM elements by inserting a clone of the last slide before the
     * first slide and removing the original last slide.
     */
    Slider.prototype.prev = function () {
        var _this = this;
        var _a;
        var _b = this.lastAndFirstNode(), firstElement = _b[0], lastElement = _b[1];
        if (firstElement !== null &&
            firstElement !== undefined &&
            lastElement !== null) {
            lastElement.style.marginLeft = "-".concat(this.shift, "%");
            this.corentSlide--;
            if (this.corentSlide < 1) {
                this.corentSlide = this.coutElwments;
            }
            this.coutThisSlide.textContent = "".concat(this.corentSlide);
            var lastClone = lastElement.cloneNode(true);
            (_a = this.sliderRoot) === null || _a === void 0 ? void 0 : _a.insertBefore(lastClone, firstElement);
            setTimeout(function () {
                var _a, _b;
                var tempFirstElement = (_a = _this.sliderRoot) === null || _a === void 0 ? void 0 : _a.querySelector('*');
                if (tempFirstElement)
                    tempFirstElement.style.marginLeft = '0';
                (_b = _this.sliderRoot) === null || _b === void 0 ? void 0 : _b.removeChild(lastElement);
            }, 0);
        }
    };
    /**
     * Returns an array containing the first and last elements of the slider's root
     * element, as well as a clone of the first element. This is used to create the
     * sliding effect by inserting a clone of the last or first element before or
     * after the first element, and removing the original.
     * @returns An array containing [firstElement, lastElement, firstElementClone]
     */
    Slider.prototype.lastAndFirstNode = function () {
        var _a, _b, _c;
        var firstElement = (_a = this.sliderRoot) === null || _a === void 0 ? void 0 : _a.querySelector('*');
        var tempClone = (_b = this.sliderRoot) === null || _b === void 0 ? void 0 : _b.querySelector('*');
        if (tempClone) {
            tempClone = tempClone.cloneNode(true);
        } //firstDiv.cloneNode(true);
        var elements = (_c = this.sliderRoot) === null || _c === void 0 ? void 0 : _c.children;
        var lastElement = elements
            ? elements[elements.length - 1]
            : null;
        return [firstElement, lastElement, tempClone];
    };
    Slider.prototype.recalculateSize = function (number) {
        this.numberOfSlides = number;
        this.shift = 100 / this.numberOfSlides;
        document.querySelector('#sl-style-54646').remove();
        document.querySelector('head').innerHTML += "<style id=\"sl-style-54646\">\n        ".concat(this.selectorElementRoot, " {\n          display: flex;\n          overflow: hidden;\n          flex-direction: row;\n          flex-wrap: nowrap;\n          align-items: center;\n          justify-content: flex-start;\n        }\n\n        ").concat(this.selectorElementRoot, " > div {\n          flex-basis: calc(").concat(this.shift, "% - 30px);\n          flex-shrink: 0;\n          padding: 0 15px;\n          transition: margin-left 0.5s;\n          font-family: sans-serif;\n          text-align: center;\n        }\n\n        ").concat(this.selectorElementRoot, " > div div:last-child {\n          text-align: left;\n        }\n\n        ").concat(this.selectorElementRoot, " img {\n          width: 100%;\n        }</style>");
    };
    return Slider;
}());
var test = new Slider('#root-slider');
