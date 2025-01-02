import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { CDN_URL, API_URL } from './utils/constants';
import { App } from './components/App';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { ICustomer, IOrder, TPaymentMethod, TProduct } from './types/types';

import { CatalogView } from './components/view/CatalogView';
import { CartCounterView } from './components/view/CartCounterView';
import { CartView } from './components/view/CartView';
import { ProductCardView } from './components/view/ProductCardView';
import { OrderFormView } from './components/view/OrderFormView';
import { ContactsFormView } from './components/view/ContactsFormView';
import { SuccessView } from './components/view/SuccessView';

const Api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

//Elements
const galeryElement = ensureElement('.gallery');
const modalElement = ensureElement('#modal');
const previewCardElement = cloneTemplate('#card-preview');
const cartElement = cloneTemplate('#basket');
const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const sucessElement = cloneTemplate('#success');
const cartCounterElement = ensureElement('.header__basket');

//Model
const app = new App([], events);

//View
const catalogView = new CatalogView(galeryElement, events);
const cartView = new CartView(cartElement, events);
const modalView = new Modal(modalElement, events);
const orderFormView = new OrderFormView(orderFormElement, events);
const contactsFormView = new ContactsFormView(contactsFormElement, events);
const successView = new SuccessView(sucessElement, events);
const cartCounterView = new CartCounterView(cartCounterElement, events);
const previewCard = new ProductCardView(
	previewCardElement,
	'preview',
	'buy',
	events
);

//Initial data response
Api.getProductList()
	.then((res) => {
		app.catalog = res;
	})
	.catch((err) => {
		console.log(err);
	});

//Events handlers
events.on('model.catalog.changed', () => {
	catalogView.products = app.catalog;
});

events.on('view.catalog.select-product', (data: Partial<TProduct>) => {
	if (app.checkInCart(data.id) || !app.getProduct(data.id).price) {
		previewCard.setButton('tocart');
	} else {
		previewCard.setButton('buy');
	}

	modalView.content = previewCard.render(app.getProduct(data.id));
	modalView.open();
});

events.on('view.card.buy', (data: Partial<TProduct>) => {
	app.addToCart(app.getProduct(data.id));
	cartCounterView.count = app.cart.length;
	previewCard.setButton('tocart');
});

events.on('view.card.tocart', () => {
	cartView.products = app.cart;
	cartView.sum = app.cartSum;
	modalView.content = cartView.render();
	modalView.open();
});

events.on('view.card.delete', (data: Partial<TProduct>) => {
	app.deleteFromCart(data.id);
	cartView.products = app.cart;
	cartView.sum = app.cartSum;
	cartCounterView.count = app.cart.length;
});

events.on('view.basket.order', () => {
	modalView.content = orderFormView.render({ valid: false, errors: '' });
	orderFormView.paymentMethod = app.customer.payment;
	orderFormView.adress = app.customer.address;
});

events.on('view.order.next', () => {
	modalView.content = contactsFormView.render({ valid: false, errors: '' });
	contactsFormView.email = app.customer.email;
	contactsFormView.phone = app.customer.phone;
});

events.on('view.contacts.order', () => {
	const items = app.cart.map((item) => item.id);

	const order: IOrder = {
		address: app.customer.address,
		payment: app.customer.payment,
		email: app.customer.email,
		phone: app.customer.phone,
		items: items,
		total: app.cartSum,
	};

	Api.order(order)
		.then((res) => {
			events.emit('cart.clear');
			successView.sum = res.total;
			modalView.content = successView.render();
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('view.success.close', () => {
	modalView.close();
});

events.on('view.opencart', () => {
	cartView.products = app.cart;
	cartView.sum = app.cartSum;
	modalView.content = cartView.render();
	modalView.open();
});

events.on('cart.clear', () => {
	app.cart = [];
	cartView.products = [];
	cartCounterView.count = 0;
});

events.on(
	'view.form.order.address:change',
	(data: { field: keyof ICustomer; value: string }) => {
		app.customer.address = data.value;
	}
);

events.on(
	'view.form.order.payment:change',
	(data: { field: keyof ICustomer; value: TPaymentMethod }) => {
		app.customer.payment = data.value;
	}
);

events.on(
	'view.form.contacts.phone:change',
	(data: { field: keyof ICustomer; value: string }) => {
		app.customer.phone = data.value;
	}
);

events.on(
	'view.form.contacts.email:change',
	(data: { field: keyof ICustomer; value: string }) => {
		app.customer.email = data.value;
	}
);
