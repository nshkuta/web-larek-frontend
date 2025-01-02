import { Form } from "./Form";
import { ICustomer } from "../../types/types";
import { EventEmitter } from "../base/events";

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