import { Form } from "./Form";
import { ICustomer, TPaymentMethod } from "../../types/types";
import { EventEmitter } from "../base/events";


export class OrderFormView extends Form<ICustomer> {
    private payment: TPaymentMethod;

    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);

        this.container.card.addEventListener('click', () => {
            this.paymentMethod = 'card';
            this.events.emit(`view.form.odred.payment:change`, {field: 'payment', value: 'card'});
        });
        this.container.cash.addEventListener('click', () => {
            this.paymentMethod = 'cash';
            this.events.emit(`view.form.odred.payment:change`, {field: 'payment', value: 'cash'});
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