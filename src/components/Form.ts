import { Component } from './Component';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IFormState {
	valid: boolean;
	errors: string;
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _inputs: HTMLInputElement[];

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._inputs = ensureAllElements<HTMLInputElement>(
			'.form__input',
			this.container
		);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.setDisabled(this._submit, true);
	}

	protected onInputChange(field: keyof T, value: string) {
		this.validate();
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	validate() {
		this.valid = true;
		this.errors = '';
		this._inputs.forEach((input) => {
			if (!input.validity.valid) {
				this.valid = false;
				if (input.validity.patternMismatch) {
					this.errors += input.dataset.errorMessage + ' ';
				} else {
					this.errors += input.validationMessage + ' ';
				}
			}
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	get errors(): string {
		return this._errors.textContent;
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		this.validate();
		return this.container;
	}
}
