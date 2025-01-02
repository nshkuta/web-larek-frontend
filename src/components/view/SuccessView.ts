import { Component } from "./Component";
import { ICustomer } from "../../types/types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

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
