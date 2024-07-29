export {}

declare global {

	const doo: IDoo;



	//#region copy/pase
	interface ITabidooAutocompleteEvent<TDooApiTable> {
		GetComponent(): ITabidooAutocompleteComponent<TDooApiTable>;
	}
	interface ITabidooAutocompleteChangeEvent<TDooApiTable> extends ITabidooAutocompleteEvent<TDooApiTable> {
		GetOptionBefore(): ITabidooautocompleteOption<TDooApiTable>;
		GetOptionAfter(): ITabidooautocompleteOption<TDooApiTable>;
	}
	type TabidooAutocompleteHandler<TDooApiTable> = (e: ITabidooAutocompleteEvent<TDooApiTable>) => void;
	type TabidooAutocompleteChangeHandler<TDooApiTable> = (e: ITabidooAutocompleteChangeEvent<TDooApiTable>) => void;
	interface ITabidooAutocompleteHandlersMap<TDooApiTable> {
		change: TabidooAutocompleteChangeHandler<TDooApiTable>;
	}
	interface ITabidooAutocompleteComponent<TDooApiTable> {
		GetId(): string;
		GetElements(): ITabidooAutocompleteElements;
		GetValue(): string;
		GetText(): string;
		//GetOption(): ITabidooautocompleteOption<TDooApiTable>;
		AddEventListener <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(
			name: EName, handler: ITabidooAutocompleteHandlersMap<TDooApiTable>[EName]
		): ITabidooAutocompleteComponent<TDooApiTable>;
		RemoveEventListener <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(
			name: EName, handler: ITabidooAutocompleteHandlersMap<TDooApiTable>[EName]
		): ITabidooAutocompleteComponent<TDooApiTable>;
		DispatchEvent <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(
			name: EName, event: ITabidooAutocompleteEvent<TDooApiTable>
		): ITabidooAutocompleteComponent<TDooApiTable>;
	}
	type ITabidooautocompleteOptionFields<TDooApiTable> = { 
		[K in keyof TDooApiTable]?: TDooApiTable[K];
	};
	interface ITabidooautocompleteOption<TDooApiTable> {
		value: string;
		text: string;
		fields?: ITabidooautocompleteOptionFields<TDooApiTable>;
	}
	interface ITabidooAutocompleteElements {
		input: HTMLInputElement;
		clearButton: HTMLButtonElement;
		container: HTMLDivElement;
		whisper: HTMLDivElement;
		loading: HTMLDivElement;
		options: HTMLDivElement;
		scrolls: HTMLElement[];
	}
	interface ITabidooAutocompleteOptionEvents {
		click: (e: Event) => void;
		focus: (e: Event) => void;
		blur: (e: Event) => void;
		mouseenter: (e: Event) => void;
		mouseleave: (e: Event) => void;
	}
	interface ITabidooAutocompleteSizes {
		scrollTop: number;
		scrollLeft: number;
		controlBorderHSize: number;
		controlBorderVSize: number;
		
		whisperPaddHSize: number;
		whisperPaddVSize: number;
		whisperBorderHSize: number;
		whisperBorderVSize: number;

		fullScreen: boolean;
		fixedPositioning: boolean;
	}
	interface ItabidooAutocompleteOptionElement<TDooApiTable> {
		option: HTMLDivElement;
		button: HTMLButtonElement;
		events: ITabidooAutocompleteOptionEvents;
		data: ITabidooautocompleteOption<TDooApiTable>;
	}
	interface ITabidooAutocompleteEvents {
		input: (e: Event) => void;
		blur: (e: Event) => void;
		focus: (e: Event) => void;
		keydown: (e: Event) => void;
		resizeInput: (e: Event) => void;
		resizeWindow: (e: Event) => void;
		scrolls: ((e: Event) => void)[];
	}
	interface ITabidooAutocompleteColumn<TDooApiTable> {
		priority?: number;
		name: keyof TDooApiTable;
	}
	interface ITabidooAutocompleteConfig<TDooApiTable> {
		selector?: string;
		tableName?: string;
		minLen?: number;
		limit?: number;
		value?: string;
		text?: string;
		columns?: ITabidooAutocompleteColumn<TDooApiTable>[];
		valueField?: keyof TDooApiTable;
		textField?: keyof TDooApiTable;
		zIndex?: number;
		maxOptionsHeight?: number;
		clearBtnText?: string;
		requester?: (value: string, startsWith: boolean) => Promise<ITabidooautocompleteOption<TDooApiTable>[]>;
		optionRenderer?: (option: ITabidooautocompleteOption<TDooApiTable>, index: number) => HTMLDivElement | string;
		textRenderer?: (option: ITabidooautocompleteOption<TDooApiTable>) => string;
	}
	interface ITabidooAutocomplete {
		CreateInstance: <TDooApiTable>(config: ITabidooAutocompleteConfig<TDooApiTable>) => ITabidooAutocompleteComponent<TDooApiTable>;
	}
	

	//#endregion
}