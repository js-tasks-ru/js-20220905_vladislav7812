class Tooltip {

  static Instance = null;

  element;
  subElements = {};

  constructor() {
    if (!Tooltip.Instance) {
      Tooltip.Instance = this;
    } else {
      return Tooltip.Instance;
    }
    this.render();
  }

  getSubElements(event) {
    const result = {};

    result['x'] = event.clientX;
    result['y'] = event.clientY;

    return result;
  }

  move(event) {
    this.subElements = this.getSubElements(event);
    this.element.style.left = this.subElements['x'] + 'px';
    this.element.style.top = this.subElements['y'] + 'px';
  }

  setMessage(event, eventTarget) {
    document.body.append(this.element);

    this.element.innerHTML = eventTarget.dataset.tooltip;

    eventTarget.addEventListener("mousemove", event => this.move(event));
  }

  initialize() {
    document.addEventListener('mouseover', (event) => {
      switch (event.target.dataset.tooltip) {
        case 'foo':
          this.setMessage(event, event.target);
          break;
        case 'bar-bar-bar':
          this.setMessage(event, event.target);
          break;
        default:
          this.remove();
      }
    });
  }

  render(data = 'div') {

    const wrapper = document.createElement(data);

    wrapper.style.cssText = `
    color: blue;
    background-color: grey;
    text-align: center;
    position: absolute;
    padding: 5px;
    border-radius: 5px;
    `;

    this.element = wrapper;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default Tooltip;
