//import { template } from "./@babel/core";

export default class SortableTable {

  subElements = [];

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  getDataId(config) {
    const id = config['id'];
    return id ? `data-id='${id}'` : '';
  }

  getDataSortable(config) {
    const sortable = config['sortable'];
    return sortable ? `data-sortable='${sortable}'` : '';
  }

  getTitle(config) {
    const title = config['title'];
    return title ? `${title}` : '';
  }

  getDataOrders(config) {
    const order = config['title'];
    return order ? `data - order='${order}'` : 'data - order="asc"';
  }

  getHeaderRow() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
    ${this.getHeaderCell()}
    </div>
    `;
  }

  getHeaderCell() {
    return this.headerConfig
      .map((config) => {
        return `
      <div class="sortable-table__cell" ${this.getDataId(config)} ${this.getDataSortable(config)} ${this.getDataOrders(config)}>
      <span>${this.getTitle(config)}</span>
      </div>
      `;
      }
      )
      .join('');
  }

  getBody() {
    return `
        <div data-element="body" class="sortable-table__body">
            ${this.getBodyRows(this.data)}
        </div>
      `;
  }

  getBodyRows(data = []) {
    return data
      .map((item) => {
        return `
        <a href="/products/${item['id']}" class="sortable-table__row">
        ${this.getBodyRow(item)}
        </a>
        `;
      }
      )
      .join('');
  }

  getBodyRow(data) {
    const bodyCell = this.headerConfig.map(({ id, template }) => {
      return {
        id,
        template
      };
    });

    return bodyCell
      .map(({ id, template }) => {
        return template ?
          template(data[id]) :
          `<div class="sortable-table__cell">${data[id]}</div>`;
      })
      .join('');
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
      ${this.getHeaderRow()}
      ${this.getBody()}
      </div>
    </div>
    `;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {

      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sort(fieldValue, orderValue) {
    const sortedData = this.sortData(fieldValue, orderValue);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);

    allColumns.forEach(item => {
      item.dataset.order = '';
    });

    currentColumn.dataset.order = orderValue;

    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
  }

  sortData(field, order) {
    const array = [...this.data];
    const column = this.headerConfig.find(item => item['id'] === field);
    const { sortType } = column;

    const directions = {
      asc: 1,
      desc: -1,
    };

    const direction = directions[order];

    return array.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * (a[field].localeCompare(b[field], ['ru', 'en']));
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements(element);
  }
}

