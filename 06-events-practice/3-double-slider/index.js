export default class DoubleSlider {

	subElements = {};

	constructor({ maxValue = 100 } = {}) {
		this.maxValue = maxValue;
		this.render();
	}

	getSubElements() {
		const result = {};

		const ranges = this.element.querySelectorAll('div.range-slider > span');
		const [min, max] = ranges;

		result.min = min;
		result.max = max;
		result['leftThumb'] = this.element.querySelector('.range-slider__thumb-left');
		result['rightThumb'] = this.element.querySelector('.range-slider__thumb-right');
		result['slider'] = this.element.querySelector('.range-slider__inner');
		result['progress'] = this.element.querySelector('.range-slider__progress');

		return result;
	}

	setEventListeners() {
		const { min, max, leftThumb, rightThumb, slider, progress } = this.subElements;
		const sliderWidth = slider.getBoundingClientRect().width;
		const sliderX = slider.getBoundingClientRect().x;

		leftThumb.addEventListener('mousedown', (event) => {
			event.preventDefault();
			const rightEdge = (rightThumb.getBoundingClientRect().x - slider.getBoundingClientRect().x);

			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', mouseUp);

			function move(event) {
				let shiftX = event.clientX - slider.getBoundingClientRect().x;

				if (shiftX < 0) {
					shiftX = 0;
				}
				if (shiftX > rightEdge) {
					shiftX = rightEdge;
				}

				let leftValue = ((shiftX / slider.getBoundingClientRect().width) * 100);
				leftThumb.style.left = leftValue + '%';
				progress.style.left = leftValue + '%';
				min.innerHTML = '$' + leftValue.toFixed(0);
			}

			function mouseUp() {
				document.removeEventListener('mouseup', mouseUp);
				document.removeEventListener('mousemove', move);
			}
		});
		rightThumb.addEventListener('mousedown', (event) => {
			event.preventDefault();
			const leftEdge = (leftThumb.getBoundingClientRect().x - slider.getBoundingClientRect().x);

			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', mouseUp);

			let customEvent = CustomEvent('range-select', {
				detail: { from: min.innerHTML, to: max.innerHTML }
			});
			document.dispatchEvent(customEvent);

			function move(event) {
				let shiftX = event.clientX - slider.getBoundingClientRect().x;

				if (shiftX > slider.getBoundingClientRect().width) {
					shiftX = slider.getBoundingClientRect().width;
				}
				if (shiftX < leftEdge + leftThumb.getBoundingClientRect().width) {
					shiftX = leftEdge + leftThumb.getBoundingClientRect().width;
				}

				let rightValue = 100 - ((shiftX / slider.getBoundingClientRect().width) * 100);
				rightThumb.style.right = rightValue + '%';
				progress.style.right = rightValue + '%';
				max.innerHTML = '$' + (100 - rightValue.toFixed(0));
			}

			function mouseUp() {
				this.element.dispatchEvent(new CustomEvent('range-select', {
					detail: this.getValue(),
					bubbles: true
				}));
				document.removeEventListener('mouseup', mouseUp);
				document.removeEventListener('mousemove', move);
			}
		});
	}

	getValue() {
		const rangeTotal = this.max - this.min;
		const { left } = this.subElements.thumbLeft.style;
		const { right } = this.subElements.thumbRight.style;

		const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
		const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

		return { from, to };
	}

	get template() {
		return `
		<div class="range-slider">
			<span>$30</span>
			<div class="range-slider__inner">
      		<span class="range-slider__progress" style="left: 30%; right: 30%"></span>
      		<span class="range-slider__thumb-left" style="left: 30%"></span>
      		<span class="range-slider__thumb-right" style="right: 30%"></span>
			</div>
			<span>$70</span>
		</div>
		`;
	}

	render() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.template;

		this.element = wrapper.firstElementChild;

		this.subElements = this.getSubElements();

		this.setEventListeners();
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
