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
    fullData: boolean;  
}

//Каталог
export interface ICatalog {
    productList: TProduct[];
    getCatalog(api: ILarekApi): Promise<TProduct>;
}

//Корзина
export interface ICart {
    products: Map<TProduct, number>;
    add(product: TProductId): void;
    inCard(product: TProductId):boolean;
    remove(product: TProductId): void;
    makeOrder(): Promise<string>;
}