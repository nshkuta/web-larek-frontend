import { Api, ApiListResponse } from './base/api';
import { IOrder, TProduct } from '../types/types';

export interface ILarekAPI {
	getProductList: () => Promise<TProduct[]>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<TProduct[]> {
		return this.get('/product').then((data: ApiListResponse<TProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<TProduct> {
		return this.get(`/product/${id}`).then((item: TProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	order(order: IOrder): Promise<IOrder> {
		return this.post('/order', order).then((data: IOrder) => data);
	}
}
