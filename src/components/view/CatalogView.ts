import { Component } from "./Component";
import { TProduct } from "../../types/types";
import { ProductCardView } from "./ProductCardView";
import { EventEmitter } from "../base/events";
import { cloneTemplate } from "../../utils/utils";

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
