# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Типы
- type TProduct - товар
- interface ICustomer - данные покупателя
- interface IOrder extends ICustomer - данные для отправки заказа
- type TProductId - ID товара
- type TProductCategory - категория товара
- type TPaymentMethod - форма оплаты 
- type TCardButton - тип кнопки в карточке товара (купить, в корзину, нет)
= type TCardDisplay - тип отображения карточки товара (в каталоге, в корзине, на превью)

# Модель

class App extends Model<TProduct[]> // Модель приложения
    cart: TProduct[] // Товары в корзине
    private catalogProducts: TProduct[] // Товары в каталоге
    customer: ICustomer // Данные пользователя
    set catalog(products: TProduct[]) // Загрузка каталога товаров
    get catalog(): TProduct[] // Получение каталога товаров    

    addToCart(product: TProduct) //Добавление товара в корзину
    checkInCart(productId: string) //Проверка наличия товара в корзине
    deleteFromCart(productId:string) //Удаление товара из корзины
    get cartSum(): number // Получение суммарной стоимости товаров в корзине

# Представление

// Карточка товара
class ProductCardView extends Component<TProduct> 
	id: string; // ID товара

    //Элементы карточки
	protected _title: HTMLElement; 
	protected _text: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _delButton?: HTMLButtonElement;

    // События для кнопок
	protected _buttonEventBuy
	protected _buttonEventToCart

	setButton(cartButton: TCardButton) //Изменение типа кнопки


// Каталог
class CatalogView extends Component<TProduct> 
	set products //Загрузка товаров в каталог

// Корзина
class CartView extends Component<TProduct[]> 
    //Элементы корзины
	protected _list: HTMLUListElement;
	protected _sum: HTMLElement;
	protected _orderButton: HTMLButtonElement;

	set products(products: TProduct[]) //Загрузка товаров для отображения
	set sum(sum: number) // Установка суммарной стоимости


//Форма заказа
class OrderFormView extends Form<ICustomer> {
	private payment: TPaymentMethod; // Способ оплаты	

    // Установка и получение выбанного способа оплаты
	set paymentMethod(paymentMethod: TPaymentMethod)
	get paymentMethod ():TPaymentMethod 

    // Установка и получение введенного адреса
	set adress(adress: string) 
	get adress(): string 


//Форма ввода контактов
 class ContactsFormView extends Form<ICustomer> 
    //Установка и получение введенных полей
	set email(email: string)
	get email(): string 
	set phone(phone: string)
	get phone(): string


//Сообщение об успешном заказе
class SuccessView extends Component<ICustomer> 
    //Элеменеты представления
    protected _button: HTMLElement;
	protected _sum: HTMLElement;
	
	set sum(sum: number) //Отображение суммы заказа
}

//Кнопка открытия корзины с счетчиком
export class CartCounterView extends Component<ICustomer> 	
    protected _counter: HTMLElement; //Элемент счетчика
	set count(count: number) // Установка значения счетчика


# Контроллер

Контроллер обрабатывает события от модели или представления:

- model.catalog.changed - изменен состав каталога
	Отображаем новый каталог на странице

- view.catalog.select-product'- выбран продукт в каталоге
    Загружаем актуальные данные о продукте с сервера
    Открываем модальное окно с карточкой товара

- view.card.buy' - нажата кнопка купить
    Загружаем актуальные данные о продукте с сервера
    Добавляем товар в корзину
    Изменяем счетчик на кнопке открытия корзины

- view.card.tocart - нажата кнопка В корзину в карточке
    Загружаем данные в представление корзины и отображаем его в модальном окне

- 'view.card.delete' - удаление товара из корзины
	Перерисовываем корзину с новым составом товаров

- 'view.basket.order' - нажата кнопка Оформить в корзине
    Заполняем форму заказа из модели
    Отображаем форму заказа

- 'view.order.next' - нажата кнопка Далее в форме заказа
	Заполняем форму контактов из модели
    Отображаем форму контактов

- 'view.contacts.order' - нажата кнопка заказа из формы контактов
	делаем заказ через Api
    в случае успеха очищаем корзину и отображаем сообщение об успешном заказе


- 'view.success.close' - нажата кнопка закрытия в сообщении об успешном заказе
	закрываем модальное окно

- 'view.opencart' - нажата кнопка с счетчиком
	отображаем корзину в модальном окне

- 'cart.clear' - очистка корзины
	очищаем корзину в модели и отображении





