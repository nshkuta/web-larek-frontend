import { IEvents } from '../components/base/events';
import { TProduct, ILarekApi, TPaymentMethod } from './model';

type TDisplayType = 'catalog' | 'modal' | 'cart';
type ClickEvent<T> = { event: MouseEvent; item: T };

export interface IViewConstructor {
	new (conteiner: HTMLElement, settings?: ISettings, events?: IEvents): IView;
}

interface IView {
	render(data?: object): HTMLElement;
}

export interface ICardView {
	element: HTMLDivElement;
	priduct: TProduct;
	display: TDisplayType;
}

export interface IProductsList extends IView {
	products: TProduct[];
}

export interface ICatalogView extends IProductsList {
	element: HTMLElement;
	productsCount: number;
	onClick: ClickEvent<string>;

	loadCatalog(products: TProduct[], api: ILarekApi): never;
	showCatalog(): never;
}

export interface IModalView extends IView {
	element: HTMLDivElement;

	show(): never;
	hide(): never;
}

export interface ICartElement extends ICardView {
	set count(count: number);
	get count(): number;

	amount: number;
	plusButton: HTMLButtonElement;
	minusButton: HTMLButtonElement;
	remove(): never;
}

export interface ICartView extends IProductsList {
	element: HTMLDivElement;
}

export interface IOrderFormView extends IView {
    payment: TPaymentMethod;
    adress: string;
    submit: HTMLButtonElement;
}
    

export interface IContactsFormView extends IView {
    email: string;
    phone: string
    submit: HTMLButtonElement;
}

export interface IOrderSuccessView extends IView {
    button: HTMLButtonElement;
}

export interface ICartCounter extends IView {
    counter: number;
}

export interface IAppView extends IView {
	catalog: ICatalogView;
	modal: IModalView;
	cart: ICartView;
    orderForm: IOrderFormView;
    contactsForm: IContactsFormView;
    success: IOrderSuccessView;
}
