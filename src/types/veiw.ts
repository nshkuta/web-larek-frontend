import { IEvents } from '../components/base/events';
import { TProduct, ILarekApi, TPaymentMethod } from './model';

type TDisplayType = 'catalog' | 'modal' | 'cart';
type ClickEvent<T> = { event: MouseEvent; item: T };

export interface IViewConstructor<S> {
	new (conteiner: HTMLElement, settings?: S, events?: IEvents): IView;
}

interface IView {
	render(data?: object): HTMLElement;
}

export interface ICardView {
	element: HTMLDivElement;
	product: TProduct;
	display: TDisplayType;
}
export interface ICatalogView extends IView {
	element: HTMLElement;
	onClick: ClickEvent<string>;
	showCatalog(): never;
}

export interface IModalView extends IView {
	element: HTMLDivElement;
	show(): never;
	hide(): never;
}

export interface ICartElement extends ICardView {
	delButton: HTMLButtonElement;
}

export interface ICartView extends IView {
	element: HTMLDivElement;
    orderButton: HTMLButtonElement; 
    summButton: HTMLSpanElement;
    renderCart(): never;
}

export interface IOrderFormView extends IView {
    paymentCash: HTMLButtonElement; 
    paymentCashless: HTMLButtonElement; 
    adress: HTMLInputElement; 
    submit: HTMLButtonElement; 
}
    

export interface IContactsFormView extends IView {
    email: HTMLInputElement;
    phone: HTMLInputElement;
    submit: HTMLButtonElement;
}

export interface IOrderSuccessView extends IView {
    button: HTMLButtonElement;
}

export interface ICartCounter extends IView {
    counter: number;
}

