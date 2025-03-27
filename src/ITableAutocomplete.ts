/**
 * Order:           2
 * Property name:   tableAutoComplete
 * Name:            Table AutoComplete
 * Interface:       ITableAutoCompleteFactory
 */
interface ITableAutoCompleteEvent<TDooApiTable> {
	GetComponent(): ITableAutoComplete<TDooApiTable>;
}
interface ITableAutoCompleteOption<TDooApiTable> {
	value: string;
	text: string;
	fields?: ITableAutoCompleteOptionFields<TDooApiTable>;
};
interface ITableAutoCompleteChangeEvent<TDooApiTable> extends ITableAutoCompleteEvent<TDooApiTable> {
	GetOptionBefore(): ITableAutoCompleteOption<TDooApiTable>;
	GetOptionAfter(): ITableAutoCompleteOption<TDooApiTable>;
}
type TableAutoCompleteHandler<TDooApiTable> = (e: ITableAutoCompleteEvent<TDooApiTable>) => void;
type TableAutoCompleteChangeHandler<TDooApiTable> = (e: ITableAutoCompleteChangeEvent<TDooApiTable>) => void;
interface ITableAutoCompleteHandlersMap<TDooApiTable> {
	change: TableAutoCompleteChangeHandler<TDooApiTable>;
}
interface ITableAutoComplete<TDooApiTable> {
	GetId(): string;
	GetElements(): ITableAutoCompleteElements;
	GetValue(): string;
	GetText(): string;
	GetOption (): ITableAutoCompleteOption<TDooApiTable>;
	SetOption (option: ITableAutoCompleteOption<TDooApiTable> | null, silent?: boolean): this;
	SetEnabled (enabled: boolean): this;
	AddEventListener <EName extends keyof ITableAutoCompleteHandlersMap<TDooApiTable>>(
		name: EName, handler: ITableAutoCompleteHandlersMap<TDooApiTable>[EName]
	): this;
	RemoveEventListener <EName extends keyof ITableAutoCompleteHandlersMap<TDooApiTable>>(
		name: EName, handler: ITableAutoCompleteHandlersMap<TDooApiTable>[EName]
	): this;
	DispatchEvent <EName extends keyof ITableAutoCompleteHandlersMap<TDooApiTable>>(
		name: EName, event: ITableAutoCompleteEvent<TDooApiTable>
	): this;
}
type ITableAutoCompleteOptionFields<TDooApiTable> = { 
	[K in keyof TDooApiTable]?: TDooApiTable[K];
};
interface ITableAutoCompleteElements {
	input: HTMLInputElement;
	clearButton: HTMLButtonElement;
	container: HTMLDivElement;
	whisper: HTMLDivElement;
	loading: HTMLDivElement;
	options: HTMLDivElement;
	scrolls: HTMLElement[];
};
interface ITableAutoCompleteOptionEvents {
	click: (e: Event) => void;
	focus: (e: Event) => void;
	blur: (e: Event) => void;
	mouseenter: (e: Event) => void;
	mouseleave: (e: Event) => void;
};
interface ITableAutoCompleteSizes {
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
};
interface ITableAutoCompleteOptionElement<TDooApiTable> {
	option: HTMLDivElement;
	button: HTMLButtonElement;
	events: ITableAutoCompleteOptionEvents;
	data: ITableAutoCompleteOption<TDooApiTable>;
};
interface ITableAutoCompleteEvents {
	input: (e: Event) => void;
	blur: (e: Event) => void;
	focus: (e: Event) => void;
	keydown: (e: Event) => void;
	resizeInput: (e: Event) => void;
	resizeWindow: (e: Event) => void;
	scrolls: ((e: Event) => void)[];
};
interface ITableAutoCompleteColumn<TDooApiTable> {
	priority?: number;
	name: keyof TDooApiTable;
};
interface ITableAutoCompleteConfig<TDooApiTable> {
	input?: HTMLInputElement;
	selector?: string;
	tableName?: string;
	minLen?: number;
	limit?: number;
	value?: string;
	text?: string;
	columns?: ITableAutoCompleteColumn<TDooApiTable>[];
	valueField?: 'id' | (keyof TDooApiTable);
	textField?: keyof TDooApiTable;
	customValue?: boolean;
	zIndex?: number;
	maxOptionsHeight?: number;
	clearBtnText?: string;
	enabled?: boolean;
	requester?: (value: string, startsWith: boolean) => Promise<ITableAutoCompleteOption<TDooApiTable>[]>;
	optionRenderer?: (option: ITableAutoCompleteOption<TDooApiTable>, index: number) => HTMLDivElement | string;
	textRenderer?: (option: ITableAutoCompleteOption<TDooApiTable>) => string;
};
interface ITableAutoCompleteFactory {
	Create: <TDooApiTable>(config: ITableAutoCompleteConfig<TDooApiTable>) => ITableAutoComplete<TDooApiTable>;
};