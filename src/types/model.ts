import { Api } from "../components/base/api";
import { IEvents } from "../components/base/events";

//Служебные типы
export type TProductId = string;
export type TProductCategory = string;
export type TPaymentMethod = 'online' | 'offline';
export type TCustomerStep = 'cart' | 'order' | 'contacts' | 'done' | 'none';


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
    productListCount: number;    
    getCatalog(api: ILarekApi): Promise<string>;
}

export interface ICart {
    products: Map<TProduct, number>;
    add(products: TProduct): void;
    remove(products: TProduct): void;
}

//Состояние приложения
export interface IAppState{    
    consctuctor(events: IEvents, api: ILarekApi): IAppState;

    catlog: ICatalog;
    customer: TCustomer;
    cart: ICart;

    events: IEvents;
    api: ILarekApi;
    
    orderLog: string[];

    setPayadress(method: TPaymentMethod, address: string): boolean;
    setPhoneemail(phone: string, email: string): boolean;

    set step(step: TCustomerStep);
    get step(): TCustomerStep;
    
    set curentProduct(product: TProduct);
    get curentProduct(): TProduct;

    makeOrder(): Promise<string>;
}