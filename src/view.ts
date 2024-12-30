import { EventEmitter } from './components/base/events';
import { Component } from './components/Component';
import { Form } from './components/Form';
import {
	TCardButton,
	TCardDisplay,
	ICustomer,
	TPaymentMethod,
	TProduct,
} from './types/types';
import { cloneTemplate, ensureElement } from './utils/utils';

export class ProductCardView extends Component<TProduct> {
	id: string;

	protected _title: HTMLElement;
	protected _text: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _delButton?: HTMLButtonElement;

	protected _buttonEventBuy = () => {
		this.event.emit('view.card.buy', { id: this.id });
	};
	protected _buttonEventToCart = () => {
		this.event.emit('view.card.tocart', { id: this.id });
	};

	constructor(
		container: HTMLElement,
		protected cardDisplay: TCardDisplay,
		protected cardButton: TCardButton,
		protected event: EventEmitter
	) {
		super(container, event);

		this._title = ensureElement('.card__title', this.container);
		this._price = ensureElement('.card__price', this.container);

		if (cardDisplay === 'catalog' || cardDisplay === 'preview') {
			this._category = ensureElement('.card__category', this.container);
			this._image = ensureElement<HTMLImageElement>(
				'.card__image',
				this.container
			) ;
		}

		if (cardDisplay === 'preview') {
			this._text = ensureElement('.card__text', this.container);
		}

		if (this.cardButton !== 'none') {
			this._button = ensureElement<HTMLButtonElement>(
				'.card__button',
				this.container
			);
		}

		if (cardDisplay === 'basket') {
			this._delButton = ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				this.container
			);
		}
	}

	setButton(cartButton: TCardButton) {
		this.cardButton = cartButton;
		if (this.cardButton !== 'none') {
			if (cartButton === 'buy') {
				this._button.addEventListener('click', this._buttonEventBuy);
				this._button.removeEventListener('click', this._buttonEventToCart);
			} else {
				this._button.removeEventListener('click', this._buttonEventBuy);
				this._button.addEventListener('click', this._buttonEventToCart);
			}
			this.setText(this._button, this._button.dataset[cartButton]);
		}
	}

	render(data?: Partial<TProduct>): HTMLElement {
		this.id = data.id;

		this.setText(this._title, data.title);
		this.setText(
			this._price,
			data.price
				? data.price.toString() + this._price.dataset.currency
				: this._price.dataset.priceless
		);
		this.setText(this._category, data.category);
		this.setImage(this._image, data.image, data.title);
		this.setText(this._text, data.description);

		if (this._delButton) {
			this._delButton.addEventListener('click', () => {
				this.event.emit('view.card.delete', { id: this.id });
			});
		}
		return super.render();
	}
}

export class CatalogView extends Component<TProduct> {
	constructor(container: HTMLElement, protected event: EventEmitter) {
		super(container, event);
	}

	set products(products: TProduct[]) {
		this.container.replaceChildren(
			...products.map((product) => {
				const productCard = new ProductCardView(
					cloneTemplate('#card-catalog'),
					'catalog',
					'none',
					this.events
				);

				const cardElement = productCard.render(product);
				cardElement.addEventListener('click', () => {
					this.events.emit('view.catalog.select-product', {
						id: productCard.id,
					});
				});

				return cardElement;
			})
		);
	}
}

export class CartView extends Component<TProduct[]> {
	protected _list: HTMLUListElement;
	protected _sum: HTMLElement;
	protected _orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container, events);
		this._list = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this._sum = ensureElement('.basket__price', this.container);
		this._orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._orderButton.addEventListener('click', () => {
			this.events.emit('view.basket.order');
		});
	}

	set products(products: TProduct[]) {
		this.setDisabled(this._orderButton, products.length === 0);
		let index = 1;
		this._list.replaceChildren(
			...products.map((product) => {
				const productCard = new ProductCardView(
					cloneTemplate('#card-basket'),
					'basket',
					'none',
					this.events
				);

				const cardElement = productCard.render(product);
				const indexElement = ensureElement('.basket__item-index', cardElement);
				this.setText(indexElement, index.toString());
				index++;
				return cardElement;
			})
		);
	}

	set sum(sum: number) {
		this.setText(this._sum, sum.toString() + this._sum.dataset.currency);
	}
}

export class OrderFormView extends Form<ICustomer> {
	private payment: TPaymentMethod;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container, events);

		this.container.card.addEventListener('click', () => {
			this.paymentMethod = 'card';
		});
		this.container.cash.addEventListener('click', () => {
			this.paymentMethod = 'cash';
		});

		this.container.addEventListener('submit', () => {
			this.events.emit('view.order.next');
		});
	}

	set paymentMethod(paymentMethod: TPaymentMethod) {
		this.payment = paymentMethod;
		if (paymentMethod === 'card') {
			this.addClass(this.container.card, 'button_alt-active');
			this.removeClass(this.container.cash, 'button_alt-active');
		} else {
			this.removeClass(this.container.card, 'button_alt-active');
			this.addClass(this.container.cash, 'button_alt-active');
		}
	}

	get paymentMethod(): TPaymentMethod {
		return this.payment;
	}

	set adress(adress: string) {
		this.container.address.value = adress;
	}

	get adress(): string {
		return this.container.address.value;
	}
}

export class ContactsFormView extends Form<ICustomer> {
	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container, events);

		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('view.contacts.order');
		});
	}

	set email(email: string) {
		this.container.email.value = email;
	}

	get email(): string {
		return this.container.email.value;
	}

	set phone(phone: string) {
		this.container.phone.value = phone;
	}
	get phone(): string {
		return this.container.phone.value;
	}
}

export class SuccessView extends Component<ICustomer> {
	protected _button: HTMLElement;
	protected _sum: HTMLElement;

	constructor(container: HTMLElement, protected event: EventEmitter) {
		super(container, event);
		this._button = ensureElement('.order-success__close', container);
		this._sum = ensureElement('.order-success__description', container);

		this._button.addEventListener('click', () => {
			this.events.emit('view.success.close');
		});
	}

	set sum(sum: number) {
		this.setText(
			this._sum,
			this._sum.dataset.start + sum.toString() + this._sum.dataset.end
		);
	}
}

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
