import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { CDN_URL, API_URL } from './utils/constants';
import { App } from './model';
import { EventEmitter } from './components/base/events';
import {
	CartCounterView,
	CartView,
	CatalogView,
	ContactsFormView,
	OrderFormView,
	ProductCardView,
	SuccessView,
} from './view';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { IOrder, TProduct } from './types/types';

const Api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

//Elements
const galeryElement = ensureElement('.gallery');
const modalElement = ensureElement('#modal');
const previewCardElement = cloneTemplate('#card-preview');
const cartElement = cloneTemplate('#basket');
const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts') ;
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
	Api.getProductItem(data.id)
		.then((res) => {
			if (app.checkInCart(data.id)) {
				previewCard.setButton('tocart');
			} else {
				previewCard.setButton('buy');
			}

			modalView.content = previewCard.render(res);
			modalView.open();
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('view.card.buy', (data: Partial<TProduct>) => {
	Api.getProductItem(data.id)
		.then((res) => {
			app.addToCart(res);
			cartCounterView.count = app.cart.length;
			previewCard.setButton('tocart');
		})
		.catch((err) => {
			console.log(err);
		});
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
	orderFormView.paymentMethod = app.customer.payment;
	orderFormView.adress = app.customer.address;

	contactsFormView.email = app.customer.email;
	contactsFormView.phone = app.customer.phone;
	modalView.content = orderFormView.render({ valid: true, errors: '' });
});

events.on('view.order.next', () => {
	app.customer.payment = orderFormView.paymentMethod;
	app.customer.address = orderFormView.adress;

	contactsFormView.email = app.customer.email;
	contactsFormView.phone = app.customer.phone;

	modalView.content = contactsFormView.render({ valid: true, errors: '' });
});

events.on('view.contacts.order', () => {
	app.customer.email = contactsFormView.email;
	app.customer.phone = contactsFormView.phone;

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
