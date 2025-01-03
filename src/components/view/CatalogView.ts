import { Component } from './Component';
import { TProduct } from '../../types/types';
import { EventEmitter } from '../base/events';

export class CatalogView extends Component<TProduct> {
	constructor(container: HTMLElement, protected event: EventEmitter) {
		super(container, event);
	}

	set products(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}
}
