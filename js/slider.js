class Slider {
  sliderRoot = 0;
  coutElwments = 0;
  corentSlide = 1;
  coutThisSlide = 0;

  constructor(SliderElementRoot) {
    this.sliderRoot = document.querySelector(SliderElementRoot);
    if (this.sliderRoot && this.sliderRoot.children.length > 0) {
      this.coutElwments = this.sliderRoot.children.length;
      this.corentSlide = 1;
      this.createBoxControl();
    } else {
      throw new Error('Slider: There is no element');
    }
  }
  createBoxControl() {
    const controlDiv = document.createElement('div');
    controlDiv.id = 'sl-control';

    const prevDiv = document.createElement('div');
    prevDiv.id = 'sl-prev';
    prevDiv.textContent = 'Prev';
    prevDiv.addEventListener('click', () => {
      this.prev();
    });

    const nextDiv = document.createElement('div');
    nextDiv.id = 'sl-next';
    nextDiv.textContent = 'Next';
    nextDiv.addEventListener('click', () => {
      this.next();
    });

    let startX, startY;
    let isMoved = false;
    this.sliderRoot.addEventListener('touchstart', ev => {
      startX = ev.touches[0].clientX;
      startY = ev.touches[0].clientY;
      isMoved = false;
    });

    this.sliderRoot.addEventListener('touchmove', ev => {
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

    this.coutThisSlide = document.createElement('span');
    this.coutThisSlide.textContent = `${this.corentSlide}`;

    const coutTotalSlide = document.createElement('span');
    coutTotalSlide.textContent = ` / ${this.coutElwments}`;

    const coutBox = document.createElement('div');
    coutBox.appendChild(this.coutThisSlide);
    coutBox.appendChild(coutTotalSlide);

    controlDiv.appendChild(prevDiv);
    controlDiv.appendChild(coutBox);
    controlDiv.appendChild(nextDiv);

    this.sliderRoot.after(controlDiv);
  }

  next() {
    this.sliderRoot.firstElementChild.style.marginLeft = '-25%';
    this.corentSlide++;

    if (this.corentSlide > this.coutElwments) {
      this.corentSlide = 1;
    }
    if (this.coutThisSlide !== 'undefined') {
      this.coutThisSlide.textContent = `${this.corentSlide}`;
    }
    setTimeout(() => {
      const [firstElement, lastElement, clone] = this.lastAndFirstNode();
      this.sliderRoot.appendChild(clone);
      this.sliderRoot.removeChild(firstElement);
      lastElement.style.marginLeft = '0';
    }, 500);
  }
  prev() {
    const [firstElement, lastElement] = this.lastAndFirstNode();
    lastElement.style.marginLeft = '-25%';

    this.corentSlide--;

    if (this.corentSlide < 1) {
      this.corentSlide = this.coutElwments;
    }
    if (this.coutThisSlide !== 'undefined') {
      this.coutThisSlide.textContent = `${this.corentSlide}`;
    }

    const lastClone = lastElement.cloneNode(true);
    this.sliderRoot.insertBefore(lastClone, firstElement);

    setTimeout(() => {
      this.sliderRoot.querySelector('*').style.marginLeft = '0';
      this.sliderRoot.removeChild(lastElement);
    }, 0);
  }
  lastAndFirstNode() {
    const firstElement = this.sliderRoot.querySelector('*');
    const clone = this.sliderRoot.querySelector('*').cloneNode(true); //firstDiv.cloneNode(true);
    const elements = this.sliderRoot.children;
    const lastElement = elements.p;
    return [firstElement, lastElement, clone];
  }
  recalculateSize() {}
}
const test = new Slider('#root-slider');
