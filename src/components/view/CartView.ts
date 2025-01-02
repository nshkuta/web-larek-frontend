import { TProduct } from "../../types/types";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { Component } from "./Component";
import { EventEmitter } from "../base/events";
import { ProductCardView } from "./ProductCardView";

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