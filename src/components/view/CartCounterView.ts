import { Component } from "./Component";
import { ICustomer } from "../../types/types";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class CartCounterView extends Component<ICustomer> {
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected event: EventEmitter) {
		super(container, event);

		this._counter = ensureElement('.header__basket-counter', container);

		this.container.addEventListener('click', () => {
			this.events.emit('view.opencart');
		});
	}

	set count(count: number) {
		this.setText(this._counter, count.toString());
	}
}
