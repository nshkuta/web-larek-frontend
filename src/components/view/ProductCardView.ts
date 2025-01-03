import { Component } from './Component';
import { TProduct, TCardDisplay, TCardButton } from '../../types/types';
import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class ProductCardView extends Component<TProduct> {
	id: string;

	protected _title: HTMLElement;
	protected _text: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _delButton?: HTMLButtonElement;
	protected _index?: HTMLElement;

	protected _buttonEventBuy = () => {
		this.event.emit('view.card.buy', { id: this.id });
	};
	protected _buttonEventToCart = () => {
		this.event.emit('view.opencart', { id: this.id });
	};

	constructor(
		container: HTMLElement,
		protected cardDisplay: TCardDisplay,
		protected cardButton: TCardButton,
		protected event: EventEmitter,
		protected categoryColors?: Record<string, string>
	) {
		super(container, event);

		this._title = ensureElement('.card__title', this.container);
		this._price = ensureElement('.card__price', this.container);

		if (cardDisplay === 'catalog' || cardDisplay === 'preview') {
			this._category = ensureElement('.card__category', this.container);
			this._image = ensureElement<HTMLImageElement>(
				'.card__image',
				this.container
			);
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
			this._index = ensureElement('.basket__item-index', container);
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
			this.setDisabled(this._button, false);
		}
	}

	disableButton() {
		this.setDisabled(this._button, true);
	}

	set index(index: number) {
		this.setText(this._index, index.toString());
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
		if (this.categoryColors && data.category)
			this._category.style.background = this.categoryColors[data.category];
		this.setImage(this._image, data.image, data.title);
		this.setText(this._text, data.description);

		if (this._delButton) {
			this._delButton.addEventListener('click', () => {
				this.event.emit('view.card.delete', { id: this.id });
			});
		}

		return super.render(data);
	}
}
