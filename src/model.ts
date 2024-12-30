
import { IEvents } from "./components/base/events";
import { Model } from "./components/base/Model";
import { ICustomer, TProduct } from "./types/types";


export class App extends Model<TProduct[]> {    
    cart: TProduct[];
    private catalogProducts: TProduct[];
    customer: ICustomer = {
        payment: 'card',
        address: '',
        email: '',
        phone: ''
    };

    constructor(data: TProduct[], events: IEvents){
        super(data, events);
        this.catalogProducts = data;
        this.cart = [];
    }

    set catalog(products: TProduct[]){    
        this.catalogProducts = products;

        this.emitChanges('model.catalog.changed', {
            products: this.catalog
        })
    }

    get catalog(): TProduct[] {
        return this.catalogProducts;
    }

    

    addToCart(product: TProduct) {
        if (!this.checkInCart(product.id)) 
            this.cart.push(product);
    }

    checkInCart(productId: string): boolean {
        if (this.cart)
        if (this.cart.find((element)=> element.id === productId)) return true;
        return false;
    }

    deleteFromCart(productId:string) {  
        this.cart = this.cart.filter((item)=> item.id !== productId);
    }

    get cartSum(): number {
        let sum = 0;
        this.cart.forEach((item) => {
            if (item.price) sum += item.price;
        })
        return sum;
    }


}