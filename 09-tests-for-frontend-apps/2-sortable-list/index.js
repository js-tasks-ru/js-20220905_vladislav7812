export default class SortableList {

	subElements = {};
	element;

	constructor({ items } = {}) {
		this.items = items;
		this.render();
	}

	getItems() {
		return this.items.map(item => {
			return `<li class="sortable-list__item draggable" draggable="true">${item.innerHTML}</li>
			`;
		})
			.join("");
	}

	template() {
		return `
		<ul class = "sortable-list">
			${this.getItems()}
		</ul>
	`;
	}

	render() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.template();

		this.element = wrapper.firstElementChild;

		this.subElements = this.getSubElements();

		this.initEventListeners();
	}

	deleteItem = event => {
		if (event.target.dataset.deleteHandle === "") {
			event.target.closest('.sortable-list__item').remove();
		}
	}

	initEventListeners() {
		for (const item of this.subElements) {
			item.addEventListener('dragstart', () => {
				item.classList.add('dragging');
			});
			item.addEventListener('dragend', () => {
				item.classList.remove('dragging');
			});

			item.addEventListener('pointerdown', this.deleteItem);
		}

		const container = this.element;

		container.addEventListener('dragover', e => {
			e.preventDefault();

			const afterElement = this.getDragAfterElement(container, e.clientY);
			const draggable = this.element.querySelector('.dragging');

			if (afterElement == null) {
				container.appendChild(draggable);
			} else {
				container.insertBefore(draggable, afterElement);
			}
		});
	}

	getDragAfterElement(container, y) {
		const draggableElements = [...this.element.querySelectorAll('.draggable:not(.dragging)')];

		return draggableElements.reduce((closest, child) => {
			const box = child.getBoundingClientRect();

			const offset = y - box.top - box.height / 2;

			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		}, { offset: Number.NEGATIVE_INFINITY }).element;
	}

	getSubElements() {
		const subElements = this.element.querySelectorAll('.sortable-list__item');

		return subElements;
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
