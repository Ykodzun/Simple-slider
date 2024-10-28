class Slider {
  sliderRoot: HTMLElement | null = null;
  selectorElementRoot: string = 'slider';
  numberOfSlides: number = 3;
  shift: number = 100 / this.numberOfSlides;
  coutElwments: number = 0;
  corentSlide: number = 1;
  //coutThisSlideElemtnt: HTMLSpanElement = document.createElement('span');
  controlDiv: HTMLElement = document.createElement('div');
  prevDiv: HTMLElement = document.createElement('div');
  nextDiv: HTMLElement = document.createElement('div');
  coutThisSlide: HTMLSpanElement = document.createElement('span');
  coutTotalSlide: HTMLSpanElement = document.createElement('span');
  coutBox: HTMLElement = document.createElement('div');

  /**
   * Creates an instance of the Slider class. The element with the root of the slider
   * is specified by the SliderElementRoot parameter.
   * @param {string} SliderElementRoot - The css selector of the root element of the slider.
   */
  constructor(SliderElementRoot: string) {
    this.selectorElementRoot = SliderElementRoot;
    this.sliderRoot = document.querySelector(SliderElementRoot);
    if (this.sliderRoot && this.sliderRoot.children.length > 0) {
      this.coutElwments = this.sliderRoot.children.length;
      this.corentSlide = 1;
      this.createBoxControl();
      document.querySelector('head')!.innerHTML += `<style id="sl-style-54646">
        ${SliderElementRoot} {
          display: flex;
          overflow: hidden;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
        }

        ${SliderElementRoot} > div {
          flex-basis: calc(${this.shift}% - 30px);
          flex-shrink: 0;
          padding: 0 15px;
          transition: margin-left 0.5s;
          font-family: sans-serif;
          text-align: center;
        }

        ${SliderElementRoot} > div div:last-child {
          text-align: left;
        }

        ${SliderElementRoot} img {
          width: 100%;
        }</style>`;
    } else {
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
  createBoxControl() {
    this.controlDiv.id = 'sl-control';

    this.prevDiv.id = 'sl-prev';
    this.prevDiv.textContent = 'Prev';
    this.prevDiv.addEventListener('click', () => {
      this.prev();
    });

    this.nextDiv.id = 'sl-next';
    this.nextDiv.textContent = 'Next';
    this.nextDiv.addEventListener('click', () => {
      this.next();
    });

    let startX, startY;
    let isMoved = false;
    this.sliderRoot?.addEventListener('touchstart', ev => {
      startX = ev.touches[0].clientX;
      startY = ev.touches[0].clientY;
      isMoved = false;
    });

    this.sliderRoot?.addEventListener('touchmove', ev => {
      const endX = ev.touches[0].clientX;
      const endY = ev.touches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && !isMoved) {
        // движение пальцем с права на лево
        console.log(123);
        isMoved = true;
        this.next();
      }

      if (deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY) && !isMoved) {
        // движение пальцем с лева на право
        console.log(3221);
        isMoved = true;
        this.prev();
      }

      startX = endX;
      startY = endY;
    });

    this.coutThisSlide.textContent = '1';

    this.coutTotalSlide.textContent = ` / ${this.coutElwments}`;

    this.coutBox.appendChild(this.coutThisSlide);
    this.coutBox.appendChild(this.coutTotalSlide);

    this.controlDiv.appendChild(this.prevDiv);
    this.controlDiv.appendChild(this.coutBox);
    this.controlDiv.appendChild(this.nextDiv);

    if (this.sliderRoot !== null) this.sliderRoot.after(this.controlDiv);
  }

  /**
   * Advances the slider to the next slide. If the slider is currently
   * displaying the last slide, it wraps around to the first slide.
   * Updates the current slide number display and adjusts the margin
   * of the first slide element to create a sliding effect. After a
   * delay, it rearranges the DOM elements by appending a clone of the
   * first slide to the end and removing the original first slide.
   */
  next(): void {
    if (this.sliderRoot && this.sliderRoot.firstElementChild) {
      (
        this.sliderRoot.firstElementChild as HTMLElement
      ).style.marginLeft = `-${this.shift}%`;
    }

    this.corentSlide++;

    if (this.corentSlide > this.coutElwments) {
      this.corentSlide = 1;
    }

    this.coutThisSlide.textContent = `${this.corentSlide}`;

    setTimeout(() => {
      const [firstElement, lastElement, clone] = this.lastAndFirstNode();
      if (firstElement && lastElement && clone) {
        this.sliderRoot?.appendChild(clone);
        this.sliderRoot?.removeChild(firstElement);
        lastElement.style.marginLeft = '0';
      }
    }, 500);
  }

  /**
   * Moves the slider to the previous slide. If the slider is currently
   * displaying the first slide, it wraps around to the last slide. Updates
   * the current slide number display and adjusts the margin of the last
   * slide element to create a sliding effect. After a delay, it rearranges
   * the DOM elements by inserting a clone of the last slide before the
   * first slide and removing the original last slide.
   */
  prev(): void {
    const [firstElement, lastElement] = this.lastAndFirstNode();
    if (
      firstElement !== null &&
      firstElement !== undefined &&
      lastElement !== null
    ) {
      lastElement.style.marginLeft = `-${this.shift}%`;

      this.corentSlide--;

      if (this.corentSlide < 1) {
        this.corentSlide = this.coutElwments;
      }

      this.coutThisSlide.textContent = `${this.corentSlide}`;

      const lastClone = lastElement.cloneNode(true);
      this.sliderRoot?.insertBefore(lastClone, firstElement);

      setTimeout(() => {
        const tempFirstElement: HTMLElement | null | undefined =
          this.sliderRoot?.querySelector('*');
        if (tempFirstElement) tempFirstElement.style.marginLeft = '0';
        this.sliderRoot?.removeChild(lastElement);
      }, 0);
    }
  }
  /**
   * Returns an array containing the first and last elements of the slider's root
   * element, as well as a clone of the first element. This is used to create the
   * sliding effect by inserting a clone of the last or first element before or
   * after the first element, and removing the original.
   * @returns An array containing [firstElement, lastElement, firstElementClone]
   */
  lastAndFirstNode(): [
    HTMLElement | null | undefined,
    HTMLElement | null,
    HTMLElement | null | undefined
  ] {
    const firstElement: HTMLElement | null | undefined =
      this.sliderRoot?.querySelector('*');
    let tempClone: HTMLElement | null | undefined =
      this.sliderRoot?.querySelector('*');
    if (tempClone) {
      tempClone = tempClone.cloneNode(true) as HTMLElement;
    } //firstDiv.cloneNode(true);
    const elements = this.sliderRoot?.children;
    const lastElement = elements
      ? (elements[elements.length - 1] as HTMLElement)
      : null;
    return [firstElement, lastElement, tempClone];
  }
  /**
   * Recalculates the size of each slide in the slider based on the number of slides.
   * Updates the CSS style dynamically to adjust the slider's layout and appearance
   * to accommodate the specified number of slides.
   *
   * @param {number} number - The total number of slides to display in the slider.
   */
  recalculateSize(number: number) {
    this.numberOfSlides = number;
    this.shift = 100 / this.numberOfSlides;
    document.querySelector('#sl-style-54646')!.remove();
    document.querySelector('head')!.innerHTML += `<style id="sl-style-54646">
        ${this.selectorElementRoot} {
          display: flex;
          overflow: hidden;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
        }

        ${this.selectorElementRoot} > div {
          flex-basis: calc(${this.shift}% - 30px);
          flex-shrink: 0;
          padding: 0 15px;
          transition: margin-left 0.5s;
          font-family: sans-serif;
          text-align: center;
        }

        ${this.selectorElementRoot} > div div:last-child {
          text-align: left;
        }

        ${this.selectorElementRoot} img {
          width: 100%;
        }</style>`;
  }
}
