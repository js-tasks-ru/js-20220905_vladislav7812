import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
	chartHeight = 50;
	subElements = {};
	constructor({ data = [], label = '', value = 0, link = '', formatHeading = data => data, url = '', range = { from: new Date(), to: new Date() } } = {}) {
		this.data = data;
		this.label = label;
		this.value = value;
		this.link = link;
		this.url = new URL(url, BACKEND_URL);
		this.formatHeading = formatHeading;
		this.render();
	}

	destroy() {
		this.remove();
		this.element = null;
		this.subElements = {};
	}

	getUrl(from, to) {
		const start = from.toISOString().split('T')[0];
		const end = to.toISOString().split('T')[0];
		return `${this.url}?from=${start}T11%3A07%3A55.908Z&to=${end}T11%3A07%3A55.908Z`;
	}


	remove() {
		if (this.element) {
			this.element.remove();
		}
	}

	async update(from, to) {
		this.element.classList.add('column-chart_loading');

		const response = await fetchJson(this.getUrl(from, to));

		this.data = Object.values(response);
		this.value = this.data.reduce((sum, current) => sum + current);

		if (this.data.length) {
			this.element.classList.remove('column-chart_loading');
		}

		this.subElements.body.innerHTML = this.getColumns();
		this.subElements.header.innerHTML = this.getSum();

		return response;
	}

	getLink() {
		return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
	}

	getSum() {
		let sum = this.value.toLocaleString();
		return this.formatHeading(sum);
	}

	getColumns() {
		const maxValue = Math.max(...this.data);
		const scale = this.chartHeight / maxValue;
		return this.data
			.map((value) => {
				const percent = ((value / maxValue) * 100).toFixed(0);
				return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${percent}%"></div>`;
			})
			.join("");
	}

	get template() {
		return `
		<div class="column-chart column-chart_loading" style="--chart-height: 50">
			<div class="column-chart__title">
				Total ${this.label}
				${this.getLink()}
			</div>
			<div class="column-chart__container">
				<div data-element="header" class="column-chart__header">
				${this.getSum()}
				</div>
				<div data-element="body" class="column-chart__chart">
				${this.getColumns()}
				</div>
			</div>
		</div > `;
	}

	getSubElements() {
		const result = {};

		const elements = this.element.querySelectorAll('[data-element]');

		for (const subElement of elements) {
			const name = subElement.dataset.element;

			result[name] = subElement;
		}

		return result;

	}

	render() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.template;

		this.element = wrapper.firstElementChild;

		if (this.data.length) {
			this.element.classList.remove('column-chart_loading');
		}

		this.subElements = this.getSubElements();
	}
}
