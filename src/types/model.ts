import { Api } from "../components/base/api";
import { IEvents } from "../components/base/events";

//Служебные типы
export type TProductId = string;
export type TProductCategory = string;
export type TPaymentMethod = 'online' | 'offline';


//API
export interface ILarekApi extends Api {
    loadCatalog(): Promise<string>;
    order(): Promise<string>;
}

//Товар
export type TProduct = {
    id: TProductId;
    description: string;
    image: string;
    title: string;
    category: TProductCategory;
    price: number;
} 

//Данные покупателя
export type TCustomer = {
    payment: TPaymentMethod;
    email: string;
    phone: string;
    address: string;  
}

//Каталог
export interface ICatalog {
    set productList(Products: TProduct[]);
    get productList(): TProduct[];
}

//Корзина
export interface ICart {
    products: TProduct[];
    add(product: TProduct[]): void;
    inCard(product: TProduct[]):boolean;
    remove(product: TProduct[]): void;
}