import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

	element;
	subElements;
	from = new Date(new Date().setMonth(new Date().getMonth() - 1));
	to = new Date();

	constructor() {
		this.render();
	}

	initRangePicker() {
		const rangePicker = new RangePicker({
			from: this.from,
			to: this.to,
		});

		rangePicker.element.addEventListener('date-select', event => {
			this.from = event.detail.from;
			this.to = event.detail.to;
		});

		return rangePicker.element;
	}

	initOrdersChart() {
		const ordersChart = new ColumnChart({
			url: 'api/dashboard/orders',
			range: {
				from: this.from,
				to: this.to
			},
			label: 'orders',
			link: '#'
		});

		this.element.addEventListener('date-select', async () => {
			await ordersChart.update(this.from, this.to);
		});

		return ordersChart.element;
	}

	initSalesChart() {
		const salesChart = new ColumnChart({
			url: 'api/dashboard/sales',
			range: {
				from: this.from,
				to: this.to
			},
			label: 'sales',
			formatHeading: data => `$${data}`
		});

		this.element.addEventListener('date-select', async () => {
			await salesChart.update(this.from, this.to);
		});

		return salesChart.element;
	}

	initCustomersChart() {
		const customersChart = new ColumnChart({
			url: 'api/dashboard/customers',
			range: {
				from: this.from,
				to: this.to
			},
			label: 'customers',
		});

		this.element.addEventListener('date-select', async () => {
			await customersChart.update(this.from, this.to);
		});

		return customersChart.element;
	}

	initSortableTable() {
		const sortableTable = new SortableTable(header, {
			url: 'api/dashboard/bestsellers',
		});

		document.removeEventListener('scroll', sortableTable.onWindowScroll);

		this.element.addEventListener('date-select', async () => {
			const data = await sortableTable.loadData({ from: this.from, to: this.to });
			sortableTable.renderRows(data);
		});

		return sortableTable.element;
	}

	template() {
		return `
		<div class="dashboard">
			<div class="content__top-panel">
				<h2 class="page-title">Dashboard</h2>
				<div data-element="rangePicker"></div>
			</div>
			<div data-element="chartsRoot" class="dashboard__charts">
				<div data-element="ordersChart" class="dashboard__chart_orders">
				
				</div>
				<div data-element="salesChart" class="dashboard__chart_sales"></div>
				<div data-element="customersChart" class="dashboard__chart_customers"></div>
			</div>

      	<h3 class="block-title">Best sellers</h3>

			<div data-element="sortableTable">
			</div>
   	</div>
	`;
	}

	getSubElements() {
		const result = {};

		const subElements = this.element.querySelectorAll('[data-element]');

		for (const subElement of subElements) {
			result[subElement.dataset.element] = subElement;
		}

		return result;
	}

	async render() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.template();

		this.element = wrapper.firstElementChild;

		this.subElements = this.getSubElements();

		this.subElements.rangePicker.append(this.initRangePicker());
		this.subElements.ordersChart.append(this.initOrdersChart());
		this.subElements.salesChart.append(this.initSalesChart());
		this.subElements.customersChart.append(this.initCustomersChart());
		this.subElements.sortableTable.append(this.initSortableTable());

		return this.element;
	}

	remove() {
		if (this.element) {
			this.element.remove()
		}
	}

	destroy() {
		this.remove();
		this.element = null;
		this.subElements = null;
	}
}
