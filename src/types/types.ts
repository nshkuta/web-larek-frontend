//Служебные типы
export type TProductId = string;
export type TProductCategory = string;
export type TPaymentMethod = 'card' | 'cash';
export type TCardButton = 'buy' | 'tocart' | 'none';
export type TCardDisplay = 'catalog' | 'preview' | 'basket';

//Товар
export type TProduct = {
	id: TProductId;
	description: string;
	image: string;
	title: string;
	category: TProductCategory;
	price: number;
};

//Данные покупателя
export interface ICustomer {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
}

//Заказ
export interface IOrder extends ICustomer {
	items: TProductId[];
	total: number;
}
