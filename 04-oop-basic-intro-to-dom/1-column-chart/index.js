export default class ColumnChart {
	chartHeight = 50;
	subElements = [];
	constructor({ data = [], label = '', value = 0, link = '', ...rest } = {}) {
		this.data = data;
		this.label = label;
		this.value = value;
		this.link = link;
		this.rest = rest;
		this.render();
	}

	destroy() {
		this.remove();
		this.element = null;
		this.subElements = {};
	}

	remove() {
		if (this.element) {
			this.element.remove();
		}
	}

	update(data) {
		if (!this.data.length) {
			this.element.classList.add('column-chart_loading');
		}

		this.data = data;

		this.subElements.body.innerHTML = this.getColumns();
	}

	getLink() {
		return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
	}

	getSum() {
		let sum = this.value.toLocaleString();
		if (this.rest['formatHeading']) {
			let { formatHeading } = this.rest;
			return formatHeading(sum);
		}
		return sum;
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

