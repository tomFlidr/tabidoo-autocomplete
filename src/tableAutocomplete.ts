/**
 * Order:			2
 * Property name:	tableAutoComplete
 * Name:			Table AutoComplete
 * Interface:		ITableAutoCompleteFactory
 */
var tableAutoCompleteFactory = (async (doo: IDoo): Promise<ITableAutoCompleteFactory> => {
	// v2025.03.27
	return <ITableAutoCompleteFactory>{
		Create: <TDooApiTable>(config: ITableAutoCompleteConfig<TDooApiTable>): ITableAutoComplete<TDooApiTable> => {
			//#region css selectors and classes
			const SELS_BASE = 'table-autocomplete-';
			class Selectors {
				public static readonly UNIQUE_ID_BASE = `${SELS_BASE}{0}`;
				public static readonly SEL_DEFAULT = 'input.table-autocomplete';
				public static readonly INIT_CLS = `${SELS_BASE}initialized`;
				public static readonly CONT_CLS = `${SELS_BASE}container`;
				public static readonly FIXED_CLS = `${SELS_BASE}fixed`;
				public static readonly WHISPER_CLS = `${SELS_BASE}whisper`;
				public static readonly LOADING_CLS = `${SELS_BASE}loading`;
				public static readonly OPTIONS_CLS = `${SELS_BASE}options`;
				public static readonly OPTION_CLS = `${SELS_BASE}option`;
				public static readonly ACTIVE_CLS = `${SELS_BASE}option-active`;
				public static readonly BUTTON_CLS = `${SELS_BASE}button`;
				public static readonly CLEAR_BUTTON_CLS = `${SELS_BASE}clear-button`;
				public static readonly INPUT_CLS = `${SELS_BASE}input`;
				public static readonly INPUT_ID_TPL = `${SELS_BASE}input-id-{0}`;
				public static readonly CONT_ID_TPL = `${SELS_BASE}cont-id-{0}`;
				public static readonly HIDDEN_CLS = `${SELS_BASE}hidden`;
				public static readonly DISABLED_CLS = `disabled`;
			}
			//#endregion
			//#region event structures
			class AutoCompleteEvent<T extends TDooApiTable> implements ITableAutoCompleteEvent<T> {
				protected component: ITableAutoComplete<T>;
				constructor (component: ITableAutoComplete<T>) {
					this.component = component;
				}
				public GetComponent (): ITableAutoComplete<T> {
					return this.component;
				}
			}
			class ChangeEvent<T extends TDooApiTable> extends AutoCompleteEvent<T> implements ITableAutoCompleteChangeEvent<T> {
				protected optionBefore: ITableAutoCompleteOption<T>;
				protected optionAfter:  ITableAutoCompleteOption<T>;
				constructor (component: ITableAutoComplete<T>, optionBefore: ITableAutoCompleteOption<T>, optionAfter: ITableAutoCompleteOption<T>) {
					super(component);
					this.optionBefore = optionBefore;
					this.optionAfter = optionAfter;
				}
				public GetOptionBefore(): ITableAutoCompleteOption<T> {
					return this.optionBefore;
				}
				public GetOptionAfter(): ITableAutoCompleteOption<T> {
					return this.optionAfter;
				}
			}
			//#endregion
			//#region main component
			class TableAutoComplete<T extends TDooApiTable> implements ITableAutoComplete<T> {
				//#region properties
				public static readonly SELECTORS = Selectors;
				public static readonly CONFIG_DEFAULTS = {
					MIN_LEN: 3,
					LIMIT: 100,
					Z_INDEX: 100000,
					MAX_OPTIONS_HEIGHT: 300,
					CREAR_BTN_TEXT: '&#x00D7;',
				}
				public static readonly RESIZE_INTERVAL_TIME = 500;
				public static readonly LOCAL_STORRAGE_KEY = 'TA_v0.1'
				protected static instances = new Map<string, TableAutoComplete<TDooApiTable>>();
				protected static staticInit: boolean = false;
				public Static: typeof TableAutoComplete<T>;
				protected id: string;
				protected input: HTMLInputElement;
				protected config: ITableAutoCompleteConfig<T>;
				protected events: ITableAutoCompleteEvents;
				/** @var string - Real input value or empty string. */
				protected value: string;
				/** @var string - Visible text value or empty string. */
				protected text: string;
				/** @var object - Visible text value or empty string. */
				protected option: ITableAutoCompleteOption<T>;
				protected typingValue: string;
				protected notFoundValue: string;
				protected requestsCount: number;
				protected elms: ITableAutoCompleteElements;
				protected options = new Map<number, ITableAutoCompleteOptionElement<T>>();
				protected optionSelected: number;
				protected sizes: ITableAutoCompleteSizes;
				protected opened: boolean;
				protected handlers: Map<keyof ITableAutoCompleteHandlersMap<T>, Set<TableAutoCompleteHandler<T>>>;
				protected resizing: {
					hash: string;
					interval: number | null;
				};
				//#endregion
				//#region static members
				public static Create (config: ITableAutoCompleteConfig<TDooApiTable>): ITableAutoComplete<TDooApiTable> {
					var sels = this.SELECTORS,
						instance: TableAutoComplete<TDooApiTable>,
						instanceId: string,
						cleanUp: boolean = false,
						input: HTMLInputElement,
						classUniqueKey: string = 'TableAutoComplete',
						context: typeof TableAutoComplete<TDooApiTable> = window[classUniqueKey] != null
							? window[classUniqueKey]
							: this ;
					window[classUniqueKey] = context;
					if (!context.staticInit) {
						context.initStatic();
					} else {
						cleanUp = true;
					}
					config = context.addConfigDefaults(config);
					input = config.input ?? document.querySelector(config.selector) as HTMLInputElement;
					if (doo.domHelpers.HasClass(input, sels.INIT_CLS)) {
						instance = context.instances.get(input.dataset.tabidooAutocompleteId);
					} else {
						instance = new TableAutoComplete<TDooApiTable>(input, config);
						context.instances.set(instance.GetId(), instance);
					}
					if (cleanUp) {
						instanceId = instance.GetId();
						for (var subInstance of context.instances.values()) {
							if (subInstance.GetId() !== instanceId)
								context.cleanUpInstance(subInstance);
						}
					}
					return instance;
				}
				protected static cleanUpInstance (instance: TableAutoComplete<TDooApiTable>): void {
					var current: any = instance.elms.input,
						latestNode = current;
					while (true) {
						if (current.parentNode == null) {
							latestNode = current;
							break;
						}
						current = current.parentNode;
					}
					if (latestNode !== document) {
						// outside of real DOM:
						instance.handleUnload();
					}
				}
				protected static addConfigDefaults (config: ITableAutoCompleteConfig<TDooApiTable>): ITableAutoCompleteConfig<TDooApiTable> {
					var defaults = this.CONFIG_DEFAULTS;
					config.selector = config.selector ?? this.SELECTORS.SEL_DEFAULT;
					config.minLen = config.minLen ?? defaults.MIN_LEN;
					config.limit = config.limit ?? defaults.LIMIT;
					config.zIndex = config.zIndex ?? defaults.Z_INDEX;
					config.maxOptionsHeight = config.maxOptionsHeight ?? defaults.MAX_OPTIONS_HEIGHT;
					config.clearBtnText = config.clearBtnText ?? defaults.CREAR_BTN_TEXT;
					return config;
				}
				protected static initStatic (): void {
					this.initStyleSheet();
					window['TableAutoComplete'] = this;
					this.staticInit = true;
				}
				protected static remove (id: string): void {
					this.instances.delete(id);
				}
				protected static initStyleSheet (): void {
					var style: HTMLStyleElement,
						uniqueId: string | null = window.sessionStorage.getItem(this.LOCAL_STORRAGE_KEY),
						elmId: string;
					if (uniqueId != null) {
						elmId = this.SELECTORS.UNIQUE_ID_BASE.replace('{0}', uniqueId);
						style = document.getElementById(elmId) as HTMLStyleElement;
						if (style == null)
							uniqueId = null;
					}
					if (uniqueId == null) {
						uniqueId =  doo.domHelpers.GetRandomString(16, true);
						style = document.createElement('style');
						elmId = this.SELECTORS.UNIQUE_ID_BASE.replace('{0}', uniqueId);
						style.setAttribute('id', elmId);
						style.innerHTML = STYLESHEET;
						document.body.appendChild(style);
						window.sessionStorage.setItem(this.LOCAL_STORRAGE_KEY, uniqueId);
					}
				}
				//#endregion
				//#region public instance members
				public GetId (): string {
					return this.id;
				}
				public GetElements (): ITableAutoCompleteElements {
					return this.elms;
				}
				public GetValue (): string {
					return this.value;
				}
				public GetText (): string {
					return this.text;
				}
				public GetOption (): ITableAutoCompleteOption<T> {
					return this.option;
				}
				public SetOption (option: ITableAutoCompleteOption<T> | null, silent: boolean = true): this {
					var optionBefore = this.option;
					if (option == null) {
						this.option = null;
						this.value = '';
						this.text = '';
					} else {
						this.option = option;
						this.value = option.value;
						if (this.config.textRenderer != null) {
							this.text = this.config.textRenderer.call(this, <ITableAutoCompleteOption<T>>{
								text: option.text,
								value: this.value
							});
						} else {
							this.text = option.text != null ? option.text : this.value;
						};
					}
					this.hideWhisper();
					this.elms.input.value = this.text;
					if (!silent) {
						this.DispatchEvent('change', new ChangeEvent(
							this, optionBefore, this.option
						));
					}
					return this;
				}
				public SetEnabled (enabled: boolean): this {
					var disabledCls = this.Static.SELECTORS.DISABLED_CLS,
						addClass = doo.domHelpers.AddClass.bind(doo.domHelpers),
						removeClass = doo.domHelpers.RemoveClass.bind(doo.domHelpers),
						clearBtn = this.elms.clearButton,
						inputElm = this.elms.input;
					if (enabled) {
						removeClass(clearBtn, disabledCls);
						removeClass(inputElm, disabledCls);
					} else {
						addClass(clearBtn, disabledCls);
						addClass(inputElm, disabledCls);
					}
					clearBtn.disabled = !enabled;
					inputElm.disabled = !enabled;
					return this;
				}
				public AddEventListener <EName extends keyof ITableAutoCompleteHandlersMap<T>>(name: EName, handler: ITableAutoCompleteHandlersMap<T>[EName]): this {
					if (!this.handlers.has(name)) 
						this.handlers.set(name, new Set<TableAutoCompleteHandler<T>>());
					var handlers = this.handlers.get(name),
						handlersItem = handler as TableAutoCompleteHandler<T>;
					if (!handlers.has(handlersItem as TableAutoCompleteHandler<T>))
						handlers.add(handlersItem);
					return this;
				}
				public RemoveEventListener <EName extends keyof ITableAutoCompleteHandlersMap<T>>(name: EName, handler: ITableAutoCompleteHandlersMap<T>[EName]): this {
					if (!this.handlers.has(name)) 
						this.handlers.set(name, new Set<TableAutoCompleteHandler<T>>());
					var handlers = this.handlers.get(name),
						handlersItem = handler as TableAutoCompleteHandler<T>;
					if (handlers.has(handlersItem as TableAutoCompleteHandler<T>))
						handlers.delete(handlersItem);
					return this;
				}
				public DispatchEvent <EName extends keyof ITableAutoCompleteHandlersMap<T>>(name: EName, event: ITableAutoCompleteEvent<T>): this {
					if (this.handlers.has(name)) {
						var handlers = this.handlers.get(name);
						for (var handler of handlers)
							handler.call(null, event);
					}
					return this;
				}
				//#endregion
				//#region initialization
				protected constructor (input: HTMLInputElement, config: ITableAutoCompleteConfig<T>) {
					this
						.initProps(new.target, input, config)
						.initElements()
						.initEvents();
				}
				protected initProps (staticContext: typeof TableAutoComplete<T>, input: HTMLInputElement, config: ITableAutoCompleteConfig<T>): this {
					this.Static = staticContext;
					this.config = config;
					this.elms = <ITableAutoCompleteElements>{
						input: input
					};
					this.value = config.value != null ? config.value : input.value;
					if (this.config.textRenderer != null) {
						this.text = this.config.textRenderer.call(this, <ITableAutoCompleteOption<T>>{
							text: config.text,
							value: this.value
						});
					} else {
						this.text = config.text != null ? config.text : this.value;
					};
					input.value = this.text;
					this.option = <ITableAutoCompleteOption<T>>{
						value: this.value,
						text: this.text
					};
					this.typingValue = this.text;
					this.notFoundValue = null;
					this.handlers = new Map<keyof ITableAutoCompleteHandlersMap<T>, Set<TableAutoCompleteHandler<T>>>();
					this.id =  doo.domHelpers.GetRandomString(16, true);
					this.requestsCount = 0;
					this.opened = false;
					this.resizing = {
						interval: null,
						hash: ''
					};
					this.sizes = <ITableAutoCompleteSizes>{
						scrollTop: 0,
						scrollLeft: 0,
						fullScreen: false,
						fixedPositioning: false
					};
					this.options = new Map<number, ITableAutoCompleteOptionElement<T>>();
					this.optionSelected = -1;
					return this;
				}
				//#endregion
				//#region elements initialization
				protected initElements (): this {
					this
						.initElementInput()
						.initElementsSizes()
						.initElementsScrolls()
						.initElementsWhispering();
						//.handleResizeClearButton(this.elms.input.getBoundingClientRect());
					return this;
				}
				protected initElementInput (): this {
					var sels = this.Static.SELECTORS,
						input = this.elms.input,
						enabled = this.config.enabled,
						addClass = doo.domHelpers.AddClass.bind(doo.domHelpers);
					input.setAttribute('autocomplete', 'off');
					if (!input.hasAttribute('id'))
						input.setAttribute('id', sels.INPUT_ID_TPL.replace('{0}', this.id));
					input.dataset.tabidooAutocompleteId = this.id;
					addClass(input, [sels.INPUT_CLS, sels.INIT_CLS].join(' '));
					var clearBtn = document.createElement('button');
					clearBtn.type = 'button';
					clearBtn.innerHTML = this.config.clearBtnText;
					addClass(clearBtn, sels.CLEAR_BUTTON_CLS);
					this.elms.clearButton = input.parentElement.insertBefore(clearBtn, input) as HTMLButtonElement;
					if (enabled != null) {
						input.disabled = !enabled;
						clearBtn.disabled = !enabled;
						if (!enabled) {
							addClass(input, sels.DISABLED_CLS);
							addClass(clearBtn, sels.DISABLED_CLS);
						}
					}
					return this;
				}
				protected initElementsSizes (): this {
					var borderLeft = doo.domHelpers.GetStyleAlt<number>(this.elms.input, 'border-left-width', true),
						borderRight = doo.domHelpers.GetStyleAlt<number>(this.elms.input, 'border-right-width', true),
						borderTop = doo.domHelpers.GetStyleAlt<number>(this.elms.input, 'border-left-top', true),
						borderBottom = doo.domHelpers.GetStyleAlt<number>(this.elms.input, 'border-right-bottom', true);
					borderLeft = !window.isNaN(borderLeft) ? borderLeft : 0;
					borderRight = !window.isNaN(borderRight) ? borderRight : 0;
					borderTop = !window.isNaN(borderTop) ? borderTop : 0;
					borderBottom = !window.isNaN(borderBottom) ? borderBottom : 0;
					this.sizes.controlBorderHSize = borderLeft + borderRight;
					this.sizes.controlBorderVSize = borderTop + borderBottom;
					return this;
				}
				protected initElementsScrolls (): this {
					var overflow: string,
						verticalOverflow: string,
						horizontalOverflow: string,
						scrollValues = ['auto', 'scroll'],
						scrolling: boolean,
						fixedPositioning: boolean = false,
						docIncluded: boolean = false,
						current: HTMLElement = this.elms.input,
						bodyParent = document.body.parentElement;
					this.elms.scrolls = [];
					while (true) {
						overflow = doo.domHelpers.GetStyleAlt<string>(current, 'overflow', false);
						verticalOverflow = doo.domHelpers.GetStyleAlt<string>(current, 'overflow-y', false);
						horizontalOverflow = doo.domHelpers.GetStyleAlt<string>(current, 'overflow-x', false);
						fixedPositioning = fixedPositioning || doo.domHelpers.GetStyleAlt<string>(current, 'position', false) === 'fixed';
						if (
							scrollValues.indexOf(overflow) != -1 || 
							scrollValues.indexOf(verticalOverflow) != -1 || 
							scrollValues.indexOf(horizontalOverflow) != -1
						) {
							scrolling = true;
						}
						if (current === document.body || current === bodyParent) {
							if (
								overflow === 'visible' || 
								verticalOverflow === 'visible' || 
								horizontalOverflow === 'visible'
							) {
								scrolling = true;
								docIncluded = docIncluded || current === bodyParent;
							}
						}
						if (scrolling)
							this.elms.scrolls.push(current);
						docIncluded = docIncluded || current === bodyParent;
						if (current.parentElement == null || fixedPositioning) break;
						current = current.parentElement;
					};
					if (!docIncluded)
						this.elms.scrolls.push(bodyParent);
					this.sizes.fixedPositioning = fixedPositioning;
					return this;
				}
				protected initElementsWhispering (): this {
					var sels = this.Static.SELECTORS,
						zIndex = this.config.zIndex,
						container: HTMLDivElement,
						loading: HTMLDivElement,
						options: HTMLDivElement,
						whisper: HTMLDivElement;
					// container
					container = document.createElement('div')
					container.setAttribute('id', sels.CONT_ID_TPL.replace('{0}', this.id))
					doo.domHelpers.AddClass(container, sels.CONT_CLS);
					doo.domHelpers.SetStyles(container, { zIndex: zIndex });
					if (this.sizes.fixedPositioning)
						doo.domHelpers.AddClass(container, sels.FIXED_CLS);
					// loading
					loading = document.createElement('div');
					doo.domHelpers.AddClass(loading, sels.LOADING_CLS);
					doo.domHelpers.SetStyles(loading, {zIndex: zIndex + 2});
					// options
					options = document.createElement('div');
					doo.domHelpers.AddClass(options, sels.OPTIONS_CLS);
					doo.domHelpers.SetStyles(options, {zIndex: zIndex + 3});
					// whisper
					whisper = document.createElement('div');
					doo.domHelpers.AddClass(whisper, [sels.WHISPER_CLS, sels.HIDDEN_CLS].join(' '));
					doo.domHelpers.SetStyles(whisper, {zIndex: zIndex + 1, maxHeight: this.config.maxOptionsHeight + 'px' });
					// completing together
					whisper.appendChild(loading);
					whisper.appendChild(options);
					whisper = container.appendChild(whisper);
					container = document.body.appendChild(container);
					this.elms.container = container;
					this.elms.whisper = whisper;
					this.elms.loading = loading;
					this.elms.options = options;
					return this;
				}
				//#endregion
				//#region main events initialization
				protected initEvents (): this {
					this.events = <ITableAutoCompleteEvents>{};
					this.elms.input.addEventListener('focus', this.events.focus = this.handleFocus.bind(this));
					this.elms.input.addEventListener('input', this.events.input = this.handleInput.bind(this));
					this.elms.input.addEventListener('keydown', this.events.keydown = this.handleKeydown.bind(this), true);
					this.elms.input.addEventListener('blur', this.events.blur = this.handleBlur.bind(this));
					this.elms.input.addEventListener('resize', this.events.resizeInput = this.handleResize.bind(this, false));
					this.elms.clearButton.addEventListener('click', this.handleClearButtonClick.bind(this));
					window.addEventListener('resize', this.events.resizeWindow = this.handleResize.bind(this, false));
					this.initEventsScrollElms();
					this.handleScroll();
					this.initEventInputUnload();
					this.initEventLocationHrefChange();
					return this;
				}
				protected initEventsScrollElms (): void {
					var scrollElm: HTMLElement,
						scrollEvent: (e: Event) => void;
					this.events.scrolls = [];
					for (var i = 0, l = this.elms.scrolls.length; i < l; i++) {
						scrollElm = this.elms.scrolls[i];
						scrollEvent = this.handleScroll.bind(this);
						scrollElm.addEventListener('scroll', scrollEvent, true);
						this.events.scrolls.push(scrollEvent);
					}
					scrollEvent = this.handleScroll.bind(this);
					document.addEventListener('scroll', scrollEvent, true);
					this.events.scrolls.push(scrollEvent);
				}
				protected unloadScrollEvents (): void {
					if (this.events == null) 
						return;
					var scrollElm: HTMLElement,
						scrollEvent: (e: Event) => void;
					for (var i = 0, l = this.elms.scrolls.length; i < l; i++) {
						scrollElm = this.elms.scrolls[i];
						scrollEvent = this.events.scrolls[i];
						try {
							scrollElm.removeEventListener('scroll', scrollEvent);
						} catch (e) {
						}
					}
					scrollEvent = this.events.scrolls[this.events.scrolls.length - 1];
					document.removeEventListener('scroll', scrollEvent, true);
					this.events.scrolls = [];
				}
				protected initEventInputUnload (): void {
					var observer: MutationObserver = null;
					observer = new MutationObserver(mutations => {
						for (let mutation of mutations) {
							if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
								var removedNodes = Array.from(mutation.removedNodes);
								for (var removedNode of removedNodes) {
									if (removedNode === this.elms.input) {
										observer.disconnect();
										this.handleUnload();
										break;
									}
								}
							}
						}
					});

					observer.observe(this.elms.input.parentElement, <MutationObserverInit>{
						childList: true,
						subtree: true
					});
				}
				protected initEventLocationHrefChange (): void {
					var oldHref = document.location.href,
						bodyList = document.querySelector('body'),
						observer: MutationObserver = null;
					observer = new MutationObserver(mutations => {
						if (oldHref != document.location.href) {
							oldHref = document.location.href;
							observer.disconnect();
							this.handleUnload();
						}
					});
					observer.observe(bodyList, <MutationObserverInit>{
						childList: true,
						subtree: true
					});
				}
				protected initResizingInterval (): void {
					clearInterval(this.resizing.interval);
					this.resizing = {
						hash: this.getResizingHash(),
						interval: setInterval(this.handleCheckResize.bind(this), this.Static.RESIZE_INTERVAL_TIME)
					}
				}
				//#endregion
				//#region main handlers
				protected handleScroll (e?: Event): void {
					var scrollElm: HTMLElement;
					if (!this.sizes.fixedPositioning) {
						this.sizes.scrollTop = 0;
						this.sizes.scrollLeft = 0;
						for (scrollElm of this.elms.scrolls) {
							this.sizes.scrollTop += scrollElm.scrollTop;
							this.sizes.scrollLeft += scrollElm.scrollLeft;
						}
					}
					if (this.opened)
						this.handleResize(false);
				}
				protected handleUnload (): void {
					this.unloadScrollEvents();
					this.unloadOptionsEvents();
					if (this.events != null) {
						this.elms.input.removeEventListener('focus', this.events.input);
						this.elms.input.removeEventListener('input', this.events.blur);
						this.elms.input.removeEventListener('keydown', this.events.blur);
						this.elms.input.removeEventListener('blur', this.events.blur);
						this.elms.input.removeEventListener('resize', this.events.resizeInput);
						window.removeEventListener('resize', this.events.resizeWindow);
						this.events = null;
					}

					if (this.elms.input.parentNode != null && this.elms.input.parentNode.parentNode != null)
						this.elms.input.parentNode.parentNode.removeChild(this.elms.input.parentNode);

					// for diconnected instances from DOM:
					if (this.elms.container != null) {
						this.elms.container = document.getElementById(this.elms.container.id) as HTMLDivElement;
						if (this.elms.container != null)
							this.elms.container.parentNode.removeChild(this.elms.container);
					}

					//if (this.elms.container.parentNode != null)
					//	this.elms.container.parentNode.removeChild(this.elms.container);

					this.Static.remove(this.id);
				}
				protected handleFocus (e: Event): void {
					if (this.value === '') {
						if (this.config.minLen === 0) {
							this.handleRequest('');
						}
					} /*else {
						// do nothing if there is completed value
					}*/
				}
				protected handleBlur (e: Event): void {
					this.hideWhisper();
					if (!this.config.customValue) {
						this.elms.input.value = this.text;
						if (this.text === '') 
							this.notFoundValue = null;
					} else {
						var value = this.elms.input.value.trim();
						if (value === '') 
							this.notFoundValue = null;
						var optionBefore = this.option;
						var optionNew = <ITableAutoCompleteOption<T>>{
							text: value,
							value: value,
							fields: null
						};
						this.option = optionNew;
						this.value = value;
						if (this.config.textRenderer != null) {
							this.text = this.config.textRenderer.call(this, optionNew);
						} else {
							this.text = value;
						}
						this.DispatchEvent('change', new ChangeEvent(
							this, optionBefore, optionNew
						));
					}
				}
				protected handleInput (e: Event): void {
					var value = this.elms.input.value.trim();
					if (value === '') 
						this.notFoundValue = null;
					if (value.length >= this.config.minLen && this.typingValue !== value) {
						this.typingValue = value;
						if (!(this.notFoundValue != null && this.typingValue.indexOf(this.notFoundValue) === 0))
							this.handleRequest(this.typingValue);
					}
					if (this.config.customValue) {
						var typingOption = <ITableAutoCompleteOption<T>>{
							text: this.typingValue,
							value: this.typingValue,
							fields: null
						};
						this.value = this.typingValue;
						if (this.config.textRenderer != null) {
							this.text = this.config.textRenderer.call(this, typingOption);
						} else {
							this.text = this.typingValue;
						}
						this.DispatchEvent('change', new ChangeEvent<T>(
							this, this.option, typingOption
						));
					}
				}
				protected handleKeydown (e: KeyboardEvent): void {
					var keyUpper = e.key.toUpperCase(),
						stopEvent = false;
					if (keyUpper === 'ARROWDOWN' || keyUpper === 'DOWN') {
						this.activatePrevNextOption(true);
						stopEvent = true;
					} else if (keyUpper === 'ARROWUP' || keyUpper === 'UP') {
						this.activatePrevNextOption(false);
						stopEvent = true;
					} else if (keyUpper === 'ENTER') {
						this.selectOptionCheckMinMaxIndex();
						if (this.optionSelected !== -1 && this.options.size > 0)
							this.selectOption(this.optionSelected);
						stopEvent = true;
					} else if (keyUpper === ' ' ||keyUpper === 'SPACE') {
						if (e.ctrlKey) {
							this.showWhisper();
							stopEvent = true;
						}
					} else if (keyUpper === 'ESCAPE' || keyUpper === 'ESC') {
						this.hideWhisper();
						stopEvent = true;
					}
					if (stopEvent) {
						e.preventDefault();	
						e.stopPropagation();
						e.stopImmediatePropagation();
					}
				}
				protected handleClearButtonClick (e: Event): void {
					var valueBefore = this.value,
						textBefore = this.text;
					this.value = '';
					this.text = '';
					this.option = null;
					this.typingValue = '';
					this.notFoundValue = null;
					this.hideWhisper();
					this.elms.input.value = '';
					this.DispatchEvent('change', new ChangeEvent(
						this, 
						<ITableAutoCompleteOption<T>>{
							value: valueBefore,
							text: textBefore,
							fields: this.option?.fields ?? null
						}, <ITableAutoCompleteOption<T>>{
							value: this.value,
							text: this.text,
							fields: null
						}
					));
					this.elms.input.focus();
				}
				//#endregion
				//#region data requesting
				protected handleRequest (value: string): void {
					this.requestsCount += 1;
					this.hideOptions();
					this.showWhisper(true);
					if (this.config.requester != null) {
						this.handleRequestByConfig(value);
					} else {
						this.handleRequestAuto(value);
					}
				}
				protected handleRequestByConfig (value: string, startsWith: boolean = true): void {
					(async () => {
						var options = await this.config.requester(value, startsWith);
						if (startsWith && options.length === 0) {
							options = await this.config.requester(value, false);
						}
						this.handleResponse(value, options);
					})();
				}
				protected handleRequestAuto (value: string, startsWith: boolean = true): void {
					var filters: IPublicApiFilter[] = [],
						sort: string[] = [];
					for (var col of config.columns) {
						filters.push(<IPublicApiFilter>{
							field: col.name, 
							operator: startsWith ? 'startswith' : 'contains', 
							value: value
						});
						sort.push(col.name.toString());
					}
					var containsFilter = <IDooGetDataOption>{
						filter: filters,
						filterOperator: 'OR',
						limit: this.config.limit,
						sort: sort.join(',')
					};
					(async () => {
						var response = await doo.table.getData(this.config.tableName, containsFilter),
							options: ITableAutoCompleteOption<T>[] = [],
							optionValue: any,
							optionValueField = this.config.valueField,
							optionValueFieldIsId = optionValueField === 'id',
							textField = this.config.textField;
						if (response?.data == null || response.data.length === 0) {
							if (startsWith) {
								this.handleRequestAuto(value, false);
							} else {
								this.handleResponse(value, options);
							}
						} else {
							for (var item of response.data) {
								optionValue = optionValueFieldIsId 
									? item.id 
									: item.fields[optionValueField];
								options.push(<ITableAutoCompleteOption<T>>{
									value: optionValue,
									text: item.fields[textField],
									fields: item.fields
								});
							}
							this.handleResponse(value, options);
						}
					})();
				}
				protected handleResponse (value: string, options: ITableAutoCompleteOption<T>[]): void {
					this.requestsCount -= 1;
					if (this.requestsCount < 0) this.requestsCount = 0;
					if (this.requestsCount === 0) this.hideLoading();
					if (this.typingValue === value) {
						if (options.length === 0) 
							this.notFoundValue = value;
						this.renderOptions(options);
					}
				}
				//#endregion
				//#region options rendering
				protected renderOptions (options: ITableAutoCompleteOption<T>[]): void {
					this.unloadOptionsEvents();
					if (options.length === 0) {
						if (this.requestsCount === 0) {
							this.hideWhisper();
						} else {
							this.hideOptions();
							this.handleResize(false);
						}
						this.elms.options.innerHTML = '';
						this.options = new Map<number, ITableAutoCompleteOptionElement<T>>()
					} else {
						this.renderOptionsInitNew(options);
						this.showOptions();
						this.handleResize(false);
					}
				}
				protected unloadOptionsEvents (): void {
					var btnElm: HTMLButtonElement,
						optionEvents: ITableAutoCompleteOptionEvents;
					for (var activeOption of this.options.values()) {
						optionEvents = activeOption.events;
						btnElm = activeOption.button;
						btnElm.removeEventListener('click', optionEvents.click);
						btnElm.removeEventListener('focus', optionEvents.focus);
						btnElm.removeEventListener('blur', optionEvents.blur);
						btnElm.removeEventListener('mouseenter', optionEvents.mouseenter);
						btnElm.removeEventListener('mouseleave', optionEvents.mouseleave);
					}
				}
				protected renderOptionsInitNew (dataOptions: ITableAutoCompleteOption<T>[]): void {
					var optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						optionElms: HTMLDivElement[] = [],
						options = new Map<number, ITableAutoCompleteOptionElement<T>>(),
						optionEvents: ITableAutoCompleteOptionEvents,
						index: number = 0,
						initializer = this.config.optionRenderer != null
							? this.renderOptionInitElementsUser.bind(this)
							: this.renderOptionInitElementsAuto.bind(this);
					for (var dataOption of dataOptions) {
						[optionElm, btnElm] = initializer.call(this, dataOption, index);
						optionEvents = this.renderOptionInitEvents(btnElm, index);
						optionElms.push(optionElm);
						options.set(index, <ITableAutoCompleteOptionElement<T>>{
							option: optionElm,
							button: btnElm,
							events: optionEvents,
							data: dataOption
						});
						index++;
					}
					this.elms.options.replaceChildren(...optionElms);
					this.options = options;
				}
				protected renderOptionInitElementsAuto (dataOption: ITableAutoCompleteOption<T>, index: number): [HTMLDivElement, HTMLButtonElement] {
					var sels = this.Static.SELECTORS,
						optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						zIndexBase: number = this.config.zIndex + 4;
					btnElm = document.createElement('button');
					btnElm.type = 'button';
					btnElm.value = dataOption.value;
					btnElm.innerHTML = dataOption.text;
					doo.domHelpers.AddClass(btnElm, sels.BUTTON_CLS);
					optionElm = document.createElement('div');
					doo.domHelpers.AddClass(optionElm, sels.OPTION_CLS);
					btnElm = optionElm.appendChild(btnElm);
					doo.domHelpers.SetStyles(optionElm, {zIndex: zIndexBase + index});
					return [optionElm, btnElm];
				}
				protected renderOptionInitElementsUser (dataOption: ITableAutoCompleteOption<T>, index: number): [HTMLDivElement, HTMLButtonElement] {
					var sels = this.Static.SELECTORS,
						optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						zIndexBase: number = this.config.zIndex + 4;
					var userResult = this.config.optionRenderer.call(this, dataOption, index);
					if (userResult instanceof HTMLDivElement) {
						optionElm = userResult as HTMLDivElement;
						doo.domHelpers.AddClass(optionElm, sels.OPTION_CLS);
						btnElm = optionElm.querySelector('button');
						doo.domHelpers.AddClass(btnElm, sels.BUTTON_CLS);
						btnElm.type = 'button';
						btnElm.value = dataOption.value;
					} else if (typeof userResult === 'string' || userResult instanceof String) {
						var cont = document.createElement('div');
						cont.innerHTML = String(userResult);
						optionElm = cont.querySelector('div');
						doo.domHelpers.AddClass(optionElm, sels.OPTION_CLS);
						btnElm = optionElm.querySelector('button');
						doo.domHelpers.AddClass(btnElm, sels.BUTTON_CLS);
						btnElm.type = 'button';
						btnElm.value = dataOption.value;
					} else {
						[optionElm, btnElm] = this.renderOptionInitElementsAuto(dataOption, index);
					}
					doo.domHelpers.SetStyles(optionElm, {zIndex: zIndexBase + index});
					return [optionElm, btnElm];
				}
				protected renderOptionInitEvents (btnElm: HTMLButtonElement, index: number): ITableAutoCompleteOptionEvents {
					var result = <ITableAutoCompleteOptionEvents>{};
					btnElm.addEventListener('mousedown', result.click = this.handleOptionClick.bind(this, index), true);
					btnElm.addEventListener('mouseenter', result.mouseenter = this.handleOptionMouseEnter.bind(this, index));
					btnElm.addEventListener('mouseleave', result.mouseleave = this.handleOptionMouseLeave.bind(this, index));
					return result;
				}
				//#endregion
				//#region option handlers
				protected handleOptionClick (index: number, e: Event): void {
					this.selectOption(index);
				}
				protected handleOptionMouseEnter (index: number, e: Event): void {
					if (this.optionSelected !== index)
						this.activateOption(index, false);
				}
				protected handleOptionMouseLeave (index: number, e: Event): void {
					if (this.optionSelected !== index)
						this.deactivateOption(index);
				}
				//#endregion
				//#region selection methods
				protected selectOptionCheckMinMaxIndex (): void {
					var lastOptionIndex = this.options.size - 1;
					if (this.optionSelected === -1) {
						this.optionSelected = 0;
					} else if (this.optionSelected > lastOptionIndex) {
						this.optionSelected = lastOptionIndex;
					}
				}
				protected activatePrevNextOption (arrowDown: boolean): void {
					var lastOptionIndex = this.options.size - 1;
					this.deactivateOption(this.optionSelected);
					if (arrowDown) {
						if (this.optionSelected === -1 || this.optionSelected + 1 > lastOptionIndex) {
							this.optionSelected = 0;
						} else if (this.optionSelected > lastOptionIndex) {
							this.optionSelected = lastOptionIndex;
						} else {
							this.optionSelected += 1;
						}
					} else {
						if (this.optionSelected === -1 || this.optionSelected === 0) {
							this.optionSelected = lastOptionIndex;
						} else {
							this.optionSelected -= 1;
						}
					}
					this.activateOption(this.optionSelected, true);
				}
				protected deactivateOption (index: number): void {
					var sels = this.Static.SELECTORS,
						selectedOptionElm: ITableAutoCompleteOptionElement<T>;
					if (index !== -1 && index < this.options.size - 1) {
						selectedOptionElm = this.options.get(index);
						doo.domHelpers.RemoveClass(selectedOptionElm.option, sels.ACTIVE_CLS);
					}
				}
				protected activateOption (index: number, scrollIntoView: boolean = false): void {
					var sels = this.Static.SELECTORS,
						selectedOptionElm: ITableAutoCompleteOptionElement<T>;
					selectedOptionElm = this.options.get(index);
					doo.domHelpers.AddClass(selectedOptionElm.option, sels.ACTIVE_CLS);
					if (scrollIntoView) {
						selectedOptionElm.option.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center'
						});
					}
				}
				protected selectOption (index: number): void {
					var sels = this.Static.SELECTORS,
						valueBefore = this.value,
						textBefore = this.text,
						optionBefore = this.option,
						selectedOptionElm: ITableAutoCompleteOptionElement<T>;
					this.optionSelected = index;
					selectedOptionElm = this.options.get(this.optionSelected);
					doo.domHelpers.AddClass(selectedOptionElm.option, sels.ACTIVE_CLS);
					selectedOptionElm.option.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center'
					});
					this.option = selectedOptionElm.data;
					this.value = selectedOptionElm.data.value;
					if (this.config.textRenderer != null) {
						this.text = this.config.textRenderer.call(this, <ITableAutoCompleteOption<T>>{
							text: selectedOptionElm.data.text,
							value: this.value,
							fields: this.option.fields
						});
					} else {
						this.text = selectedOptionElm.data.text;
					}
					this.hideWhisper();
					this.elms.input.value = this.text;
					this.DispatchEvent('change', new ChangeEvent(
						this, 
						<ITableAutoCompleteOption<T>>{
							value: valueBefore,
							text: textBefore,
							fields: optionBefore?.fields ?? null
						}, <ITableAutoCompleteOption<T>>{
							value: this.value,
							text: this.text,
							fields: this.option.fields
						}
					));
				}
				//#endregion
				//#region resizing
				protected handleCheckResize (): void {
					var hash = this.getResizingHash();
					if (hash != this.resizing.hash) {
						this.resizing.hash = hash;
						this.handleResize(true);
					}
				}
				protected handleResize (byInterval: boolean = false): void {
					if (!this.opened) return;
					var domRect = this.elms.input.getBoundingClientRect();
					this.handleResizeWhisper(domRect);
					//this.handleResizeClearButton(domRect);
					if (!byInterval)
						this.resizing.hash = this.getResizingHash(domRect);
				}
				protected handleResizeWhisper (domRect: DOMRect): void {
					var input = this.elms.input,
						whisper = this.elms.whisper;
					this.handleResizeWhisperSizes();
					var minWidth = input.offsetWidth - (this.sizes.whisperPaddHSize + this.sizes.whisperBorderHSize);
					var [topPos, maxHeight] = this.handleResizeTopMaxHeight(domRect, whisper.offsetHeight);
					var leftPos = this.handleResizeLeft(domRect, whisper.offsetWidth);
					doo.domHelpers.SetStyles(whisper, {
						top: topPos + 'px',
						left: leftPos + 'px',
						minWidth: minWidth + 'px',
						maxHeight: maxHeight == null ? 'none' : maxHeight + 'px',
					});
				}
				/*protected handleResizeClearButton (domRect: DOMRect): this {
					var input = this.elms.input,
						inputWidth = input.offsetWidth,
						clearBtn = this.elms.clearButton,
						clearBtnMargin = (input.offsetHeight - clearBtn.offsetHeight) / 2;
					doo.domHelpers.SetStyles(clearBtn, {
						top: (domRect.top + clearBtnMargin) + 'px',
						left: (domRect.left + inputWidth - clearBtnMargin - clearBtn.offsetWidth) + 'px'
					});
					return this;
				}*/
				protected handleResizeWhisperSizes (): void {
					var whisper = this.elms.whisper,
						paddLeft = doo.domHelpers.GetStyleAlt<number>(whisper, 'padding-left', true),
						paddRight = doo.domHelpers.GetStyleAlt<number>(whisper, 'padding-right', true),
						paddTop = doo.domHelpers.GetStyleAlt<number>(whisper, 'padding-top', true),
						paddBottom = doo.domHelpers.GetStyleAlt<number>(whisper, 'padding-bottom', true);
					paddLeft =   !window.isNaN(paddLeft)  ? paddLeft : 0;
					paddRight =  !window.isNaN(paddRight)  ? paddRight : 0;
					paddTop =	!window.isNaN(paddTop)	? paddTop : 0;
					paddBottom = !window.isNaN(paddBottom) ? paddBottom : 0;
					this.sizes.whisperPaddHSize = paddLeft + paddRight;
					this.sizes.whisperPaddVSize = paddTop  + paddBottom;
					
					var borderLeft = doo.domHelpers.GetStyleAlt<number>(whisper, 'border-left-width', true),
						borderRight = doo.domHelpers.GetStyleAlt<number>(whisper, 'border-right-width', true),
						borderTop = doo.domHelpers.GetStyleAlt<number>(whisper, 'border-top-width', true),
						borderBottom = doo.domHelpers.GetStyleAlt<number>(whisper, 'border-bottom-width', true);
					borderLeft =   !window.isNaN(borderLeft)   ? borderLeft : 0;
					borderRight =  !window.isNaN(borderRight)  ? borderRight : 0;
					borderTop =	!window.isNaN(borderTop)	? borderTop : 0;
					borderBottom = !window.isNaN(borderBottom) ? borderBottom : 0;
					this.sizes.whisperBorderHSize = borderLeft + borderRight;
					this.sizes.whisperBorderVSize = borderTop  + borderBottom;
				}
				protected handleResizeTopMaxHeight (domRect: DOMRect, whisperHeight: number): [number, number] {
					var topPos: number,
						maxHeight: number,
						visualSpaceUp = domRect.top,
						visualSpaceDown = window.innerHeight - (domRect.top + domRect.height);
					if (visualSpaceDown < whisperHeight) {
						if (visualSpaceUp > visualSpaceDown) {
							if (visualSpaceUp > this.config.maxOptionsHeight) {
								topPos = visualSpaceUp - this.config.maxOptionsHeight;
								maxHeight = this.config.maxOptionsHeight;
							} else {
								topPos = (this.sizes.scrollTop + domRect.top) - whisperHeight;
								maxHeight = visualSpaceUp - this.sizes.whisperBorderVSize;
							}
						} else {
							topPos = this.sizes.scrollTop + domRect.top + domRect.height;
							maxHeight = visualSpaceDown - this.sizes.whisperBorderVSize;
						}
					} else {
						topPos = this.sizes.scrollTop + domRect.top + domRect.height;
						maxHeight = this.config.maxOptionsHeight;
					}
					return [topPos, maxHeight];
				}
				protected handleResizeLeft (domRect: DOMRect, whisperWidth: number): number {
					var leftPos: number,
						visualSpaceLeft = domRect.left,
						visualSpaceRight = window.innerWidth - (domRect.left + domRect.width);
					if (visualSpaceRight < (whisperWidth - domRect.width)) {
						if (visualSpaceLeft > visualSpaceRight) {
							leftPos = (this.sizes.scrollLeft + domRect.left) - (whisperWidth - domRect.width);
						} else {
							leftPos = this.sizes.scrollLeft + domRect.left;
						}
					} else {
						leftPos = this.sizes.scrollLeft + domRect.left;
					}
					return leftPos;
				}
				//#endregion
				//#region local helpers
				protected getResizingHash (domRect?: DOMRect): string {
					var domRect = domRect ?? this.elms.input.getBoundingClientRect();
					return [
						domRect.top,   domRect.left, 
						domRect.width, domRect.height, 
						this.sizes.scrollTop, this.sizes.scrollLeft,
						window.innerWidth, window.innerHeight
					].join(',');
				}
				protected showWhisper (showLoading: boolean = false): this {
					var sels = this.Static.SELECTORS;
					this.opened = true;
					doo.domHelpers.RemoveClass(this.elms.whisper, sels.HIDDEN_CLS);
					if (showLoading) this.showLoading();
					this.handleResize(false);
					this.initResizingInterval();
					return this;
				}
				protected showLoading (): this {
					var sels = this.Static.SELECTORS;
					doo.domHelpers.RemoveClass(this.elms.loading, sels.HIDDEN_CLS);
					return this;
				}
				protected showOptions (): this {
					var sels = this.Static.SELECTORS;
					doo.domHelpers.RemoveClass(this.elms.options, sels.HIDDEN_CLS);
					return this;
				}
				protected hideWhisper (): this {
					var sels = this.Static.SELECTORS;
					doo.domHelpers.AddClass(this.elms.whisper, sels.HIDDEN_CLS);
					this.opened = false;
					clearInterval(this.resizing.interval);
					return this;
				}
				protected hideLoading(): this {
					var sels = this.Static.SELECTORS;
					doo.domHelpers.AddClass(this.elms.loading, sels.HIDDEN_CLS);
					return this;
				}
				protected hideOptions(): this {
					var sels = this.Static.SELECTORS;
					doo.domHelpers.AddClass(this.elms.options, sels.HIDDEN_CLS);
					return this;
				}
				//#endregion
			}
			const STYLESHEET = `CSS_CODE_REPLACEMENT`;
			//#endregion
			return TableAutoComplete.Create(config);
		}
	};
});