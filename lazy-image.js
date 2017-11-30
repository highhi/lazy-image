export default class LazyImage extends HTMLElement {
  static get template() {
    return `
      <style>
        :host {
          display: inline-block;
        }

        img {
          display: inline-block;
        }
      </style>

      <img src="#">
    `;
  }

  get src() {
    return this.getAttribute('src');
  }

  get width() {
    return this.getAttribute('width');
  }

  get height() {
    return this.getAttribute('height');
  }

  get alt() {
    return this.getAttribute('alt');
  }

  constructor() {
    super();
    this.img = null;
    this.observer = null;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = LazyImage.template;
    this.img = this.shadowRoot.querySelector('img');
    this.img.width = this.width;
    this.img.height = this.height;
    this.img.alt = this.alt;
    this.startObserve();
  }

  disconnectedCallback() {
    this.stopObserve();
  }

  startObserve() {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;
      this.img.src = `./images/${this.src}`;
      this.stopObserve();
    }, { rootMargin: "50px 0px" });
    
    this.observer.observe(this);
  }

  stopObserve() {
    if (!this.observer) return;
    this.observer.unobserve(this);
    this.observer.disconnect();
    this.observer = null;
  }
}