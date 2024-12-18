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


## Модель
//API для работы с сервером 
ILarekApi
    loadCatalog(): Promise<string>; //загрузка каталога товаров
    order(): Promise<string>; //отправка заказа на сервер

//Товар. Поля повторяют данные, получаемые с сервера
type TProduct = {
    id: TProductId;
    description: string;
    image: string;
    title: string;
    category: TProductCategory;
    price: number;
} 

//Данные покупателя. Поля хранят данные, вводимые в представлении
type TCustomer
    payment: TPaymentMethod;
    email: string;
    phone: string;
    address: string;

//Каталог
ICatalog 
    productList: TProduct[]; // товары в каталоге
    getCatalog(api: ILarekApi): Promise<TProduct>; //загрузка товаров с сервера с использованием API

//Корзина
ICart 
    products: TProduct[];// товары в корзине
    add(product: TProduct[];): void; //добавление товара в корзину
    inCard(product: TProduct[];):boolean; //проверка наличия товара в корзине
    remove(product: TProduct[];): void; //удаление товара из корзины
    makeOrder(customer: TCusctomer, api: ILarekApi): Promise<string>; //отправка заказа на сервер с данными покупателя с использованием API



## Представление
В представлении создаются объекты для всех элементов, подлежащих изменениям или реагирующих на события:

ICardView //Карточка товара
	element: HTMLDivElement; 
	product: TProduct; //данные продукта для отображения
	display: TDisplayType; //тип отображения - в каталоге, в модальном окне или в строке корзины



ICatalogView //Вывод каталога товаров
	element: HTMLElement; 
	onClick: ClickEvent<string>; //Обработчик события клика на карточку в катаологе
	showCatalog(): never; //Вывод каталога


IModalView //Модальное окно
	element: HTMLDivElement;
	show(): never; //показать
	hide(): never; //скрыть


ICartElement //Отображение товара в козине
	delButton: HTMLButtonElement; //кнопка Удалить


ICartView // Отображение корзины
	element: HTMLDivElement;
    orderButton: HTMLButtonElement; //кнопка оформления заказа
    summ: HTMLSpanElement; //отображение суммы
    delClick: ClickEvent<string>; //Обработчик нажатия на кнопку удаления товара
    renderCart(): never; //вывод корзины


IOrderFormView //Форма заказа
    paymentCash: HTMLButtonElement; //Выбор метода платежа - безналичный
    paymentCashless: HTMLButtonElement; //Выбор метода платежа - безналичный
    adress: HTMLInputElement; //Поле ввода адреса
    submit: HTMLButtonElement; //Кнопка отправки данных

  
IContactsFormView //Форма ввода контактов
    email: HTMLInputElement; //Поле ввода почты
    phone: HTMLInputElement; //Поле ввода телефона
    submit: HTMLButtonElement; //Кнопка отправки данных

IOrderSuccessView //Сообщение об успешном заказе
    button: HTMLButtonElement; //кнопка закрытия

ICartCounter //Cчетчик товаров в корзине
    counter: HTMLSpanElement;



## Презентер
Презентер обрабатывает события, поступившие от модели или представления

От модели:
0. Загружен каталог
    Представление выводит на экран карточки товаров
1. Заказ сделан
    В модальном окне отображается сообщение "Заказ оформлен"
    Меняется шаг в модели
    Очищается корзина
    Обнуляется счетчик корзины в представлении

От представления:
0. Выбран товар
    Открывается модальное окно
    В модальном окне отображается карточка товара
    В модели выбирается текущий товар
1. Товар добавлен в корзину
    Закрывается модальное окно
    Вызывается метод добавления товара в корзину в модели
2. Открытие корзины
    Открывается модальное окно
    В модальном окне отображается список товаров в корзине
    В модели выбирается пользовательский шаг "Корзина"
3. Увеличение или уменьшение количества товара в корзине
    Вызывается соответствующий метод в модели
    Изменяется отображение количества и цены товара
    Если модель возвращает информацию о снижение количества до 0, удаляется элемент отображения товара из корзины
4. Нажата кнопка оформить заказ
    В модальном окне скрывается корзина и отображается форма оформления заказа
    Меняется шаг в модели
5. Нажата кнопка далее в окне оформления заказа
    Скрывается форма оформления заказа и отображается форма ввода контактов
    Информация об адресе и способе оплаты записывается в модель
    Меняется шаг в модели
6. Нажата кнопка Оплатить
    Меняется шаг в модели
    Вызывается метод оформления заказа в модели

 




