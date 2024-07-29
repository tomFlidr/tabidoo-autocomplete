var autoCompleteFactory = (async (doo: IDoo): Promise<ITabidooAutocomplete> => {
	return <ITabidooAutocomplete>{
		CreateInstance: <TDooApiTable>(config: ITabidooAutocompleteConfig<TDooApiTable>): ITabidooAutocompleteComponent<TDooApiTable> => {
			//#region DOM helpers
			class Helpers {
				private static _uniqueStrs: Set<string> = new Set<string>();
				public static HasClass (elm: HTMLElement, cssClass: string): boolean {
					return String(
						' ' + elm.className.replace(/\s{2,}/g, ' ').trim() + ' '
					).indexOf(' ' + cssClass + ' ') != -1;
				}
				public static RemoveClass (elm: HTMLElement, cssClass: string): HTMLElement {
					var rg = new RegExp(' ' + cssClass + ' ', 'gi');
					elm.className = String(
							' ' + 
							elm.className.replace(/\s{2,}/g, ' ').trim() + 
							' '
						)
						.replace(rg, ' ')
						.replace(/\s{2,}/g, ' ')
						.trim();
					return elm;
				}
				public static AddClass (elm: HTMLElement, cssClass: string): HTMLElement {
					var className = elm.className.replace(/\s{2,}/g, ' ').trim();
					var classes = className.split(' ');
					var classCatched = false;
					for (var c = 0, d = classes.length; c < d; c += 1) {
						if (classes[c] == cssClass) {
							classCatched = true;
							break;
						}
					};
					if (!classCatched) 
						elm.className = className + ' ' + cssClass;
					return elm;
				}
				public static SetAttrs (elm: HTMLElement, attrs: object): HTMLElement {
					for (var name in attrs)
						elm.setAttribute(name, attrs[name]);
					return elm;
				}
				public static SetStyles (elm: HTMLElement, styles: object): HTMLElement {
					var style = elm.style;
					for (var name in styles)
						style[name] = styles[name];
					return elm;
				}
				public static GetStyle (elm: HTMLElement, cssPropName: string, asNumber: boolean = false): string | null {
					return elm.ownerDocument.defaultView.getComputedStyle(elm, '').getPropertyValue(cssPropName);
				}
				public static GetStyleAlt<TResult extends (string | number)>(elm: HTMLElement, cssPropName: string, asNumber: boolean = true): TResult | null {
					var result = this.GetStyle(elm, cssPropName, asNumber);
					if (result != null && asNumber) 
						return parseInt(result, 10) as any;
					return result as any;
				}
				/** @summary Get unique or nonunique random string. */
				public static GetRandomString (length: number, unique: boolean = false): string {
					var result = '',
						chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
						charsLength = chars.length;
					while (true) {
						for (var i = 0; i < length; i++)
							result += chars.charAt(Math.floor(Math.random() * charsLength));
						if (unique) {
							if (!this._uniqueStrs.has(result)) {
								this._uniqueStrs.add(result);
								break;
							}
						} else {
							break;
						}
					}
					return result;
				}
				public static GetPageSizes (currentElm: HTMLElement): {PageXStart: number, PageYStart: number, PageXEnd: number, PageYEnd: number} {
					var current = currentElm,
						left = 0,
						top = 0,
						lefts = [currentElm.offsetLeft],
						tops = [currentElm.offsetTop];
					while (true) {
						if (current.offsetParent == null) break;
						current = current.offsetParent as HTMLElement;
						lefts.push(current.offsetLeft);
						tops.push(current.offsetTop);
					}
					lefts = lefts.reverse();
					tops = tops.reverse();
					lefts.map(n => {
						left += n;
					});
					tops.map(n => {
						top += n;
					});
					return {
						PageXStart: left,
						PageYStart: top,
						PageXEnd: left + currentElm.offsetWidth,
						PageYEnd: top + currentElm.offsetHeight
					}
				}
			}
			//#endregion
			//#region css selectors and classes
			const SELS_BASE = 'tabidoo-autocomplete-';
			class Selectors {
				public static readonly SEL_DEFAULT = 'input.tabidoo-autocomplete';
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
			}
			//#endregion
			//#region event structures
			class TabidooAutocompleteEvent<T extends TDooApiTable> implements ITabidooAutocompleteEvent<T> {
				protected component: TabidooAutocompleteComponent<T>;
				constructor (component: TabidooAutocompleteComponent<T>) {
					this.component = component;
				}
				public GetComponent (): TabidooAutocompleteComponent<T> {
					return this.component;
				}
			}
			class TabidooAutocompleteChangeEvent<T extends TDooApiTable> extends TabidooAutocompleteEvent<T> implements ITabidooAutocompleteChangeEvent<T> {
				protected optionBefore: ITabidooautocompleteOption<T>;
				protected optionAfter:  ITabidooautocompleteOption<T>;
				constructor (component: TabidooAutocompleteComponent<T>, optionBefore: ITabidooautocompleteOption<T>, optionAfter: ITabidooautocompleteOption<T>) {
					super(component);
					this.optionBefore = optionBefore;
					this.optionAfter = optionAfter;
				}
				public GetOptionBefore(): ITabidooautocompleteOption<T> {
					return this.optionBefore;
				}
				public GetOptionAfter(): ITabidooautocompleteOption<T> {
					return this.optionAfter;
				}
			}
			//#endregion
			//#region main component
			class TabidooAutocompleteComponent<T extends TDooApiTable> implements ITabidooAutocompleteComponent<T> {
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
				protected static instances = new Map<string, TabidooAutocompleteComponent<any>>();
				protected static staticInit: boolean = false;
				public Static: typeof TabidooAutocompleteComponent<TDooApiTable>;
				protected id: string;
				protected input: HTMLInputElement;
				protected config: ITabidooAutocompleteConfig<TDooApiTable>;
				protected events: ITabidooAutocompleteEvents;
				protected value: string;
				protected text: string;
				protected option: ITabidooautocompleteOption<TDooApiTable>;
				protected typingValue: string;
				protected requestsCount: number;
				protected elms: ITabidooAutocompleteElements;
				protected options = new Map<number, ItabidooAutocompleteOptionElement<TDooApiTable>>();
				protected optionSelected: number;
				protected sizes: ITabidooAutocompleteSizes;
				protected opened: boolean;
				protected handlers: Map<keyof ITabidooAutocompleteHandlersMap<TDooApiTable>, Set<TabidooAutocompleteHandler<TDooApiTable>>>;
				protected resizing: {
					hash: string;
					interval: number | null;
				};
				//#endregion
				//#region static members
				public static CreateInstance (config: ITabidooAutocompleteConfig<TDooApiTable>): ITabidooAutocompleteComponent<TDooApiTable> {
					var sels = this.SELECTORS,
						instance: TabidooAutocompleteComponent<TDooApiTable>,
						input: HTMLInputElement;
					if (!this.staticInit) this.initStatic();
					config = this.addConfigDefaults(config);
					input = document.querySelector(config.selector) as HTMLInputElement;
					if (Helpers.HasClass(input, sels.INIT_CLS)) {
						instance = this.instances.get(input.dataset.tabidooAutocompleteId);
					} else {
						instance = new TabidooAutocompleteComponent<TDooApiTable>(input, config);
						this.instances.set(instance.GetId(), instance);
					}
					return instance;
				}
				protected static addConfigDefaults (config: ITabidooAutocompleteConfig<TDooApiTable>): ITabidooAutocompleteConfig<TDooApiTable> {
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
					this.staticInit = true;
				}
				protected static remove (id: string): void {
					this.instances.delete(id);
				}
				protected static initStyleSheet (): void {
					var style = document.createElement('style'),
						id =  Helpers.GetRandomString(16, true);
					style.setAttribute('id', this.SELECTORS.INPUT_ID_TPL.replace('{0}', id));
					style.innerHTML = STYLESHEET;
					document.body.appendChild(style);
				}
				//#endregion
				//#region public instance members
				public GetId (): string {
					return this.id;
				}
				public GetElements (): ITabidooAutocompleteElements {
					return this.elms;
				}
				public GetValue (): string {
					return this.value;
				}
				public GetText (): string {
					return this.text;
				}
				public GetOption (): ITabidooautocompleteOption<TDooApiTable> {
					return this.option;
				}
				public AddEventListener <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(name: EName, handler: ITabidooAutocompleteHandlersMap<TDooApiTable>[EName]): this {
					if (!this.handlers.has(name)) 
						this.handlers.set(name, new Set<TabidooAutocompleteHandler<TDooApiTable>>());
					var handlers = this.handlers.get(name),
						handlersItem = handler as TabidooAutocompleteHandler<TDooApiTable>;
					if (!handlers.has(handlersItem as TabidooAutocompleteHandler<TDooApiTable>))
						handlers.add(handlersItem);
					return this;
				}
				public RemoveEventListener <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(name: EName, handler: ITabidooAutocompleteHandlersMap<TDooApiTable>[EName]): this {
					if (!this.handlers.has(name)) 
						this.handlers.set(name, new Set<TabidooAutocompleteHandler<TDooApiTable>>());
					var handlers = this.handlers.get(name),
						handlersItem = handler as TabidooAutocompleteHandler<TDooApiTable>;
					if (handlers.has(handlersItem as TabidooAutocompleteHandler<TDooApiTable>))
						handlers.delete(handlersItem);
					return this;
				}
				public DispatchEvent <EName extends keyof ITabidooAutocompleteHandlersMap<TDooApiTable>>(name: EName, event: TabidooAutocompleteEvent<TDooApiTable>): this {
					if (this.handlers.has(name)) {
						var handlers = this.handlers.get(name);
						for (var handler of handlers)
							handler.call(null, event);
					}
					return this;
				}
				//#endregion
				//#region initialization
				public constructor (input: HTMLInputElement, config: ITabidooAutocompleteConfig<TDooApiTable>) {
					this
						.initProps(new.target, input, config)
						.initElements()
						.initEvents();
				}
				protected initProps (staticContext: typeof TabidooAutocompleteComponent<TDooApiTable>, input: HTMLInputElement, config: ITabidooAutocompleteConfig<TDooApiTable>): this {
					this.Static = staticContext;
					this.config = config;
					this.elms = <ITabidooAutocompleteElements>{
						input: input
					};
					this.value = config.value != null ? config.value : input.value;
					if (this.config.textRenderer != null) {
						this.text = this.config.textRenderer.call(this, <ITabidooautocompleteOption<TDooApiTable>>{
							text: config.text,
							value: this.value
						});
					} else {
						this.text = config.text != null ? config.text : this.value;
					}
					input.value = this.text;
					this.option = <ITabidooautocompleteOption<TDooApiTable>>{
						value: this.value,
						text: this.text
					}
					this.typingValue = this.text;
					this.handlers = new Map<keyof ITabidooAutocompleteHandlersMap<TDooApiTable>, Set<TabidooAutocompleteHandler<TDooApiTable>>>();
					this.id =  Helpers.GetRandomString(16, true);
					this.requestsCount = 0;
					this.opened = false;
					this.resizing = {
						interval: null,
						hash: ''
					};
					this.sizes = <ITabidooAutocompleteSizes>{
						scrollTop: 0,
						scrollLeft: 0,
						fullScreen: false,
						fixedPositioning: false
					}
					this.options = new Map<number, ItabidooAutocompleteOptionElement<TDooApiTable>>();
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
						input = this.elms.input;
						input.setAttribute('autocomplete', 'off');
					if (!input.hasAttribute('id'))
						input.setAttribute('id', sels.INPUT_ID_TPL.replace('{0}', this.id));
					input.dataset.tabidooAutocompleteId = this.id;
					Helpers.AddClass(input, [sels.INPUT_CLS, sels.INIT_CLS].join(' '));
					var clearBtn = document.createElement('button');
					clearBtn.type = 'button';
					clearBtn.innerHTML = this.config.clearBtnText;
					Helpers.AddClass(clearBtn, sels.CLEAR_BUTTON_CLS);
					this.elms.clearButton = input.parentElement.insertBefore(clearBtn, input) as HTMLButtonElement;
					return this;
				}
				protected initElementsSizes (): this {
					var borderLeft = Helpers.GetStyleAlt<number>(this.elms.input, 'border-left-width', true),
						borderRight = Helpers.GetStyleAlt<number>(this.elms.input, 'border-right-width', true),
						borderTop = Helpers.GetStyleAlt<number>(this.elms.input, 'border-left-top', true),
						borderBottom = Helpers.GetStyleAlt<number>(this.elms.input, 'border-right-bottom', true);
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
						overflow = Helpers.GetStyleAlt<string>(current, 'overflow', false);
						verticalOverflow = Helpers.GetStyleAlt<string>(current, 'overflow-y', false);
						horizontalOverflow = Helpers.GetStyleAlt<string>(current, 'overflow-x', false);
						fixedPositioning = fixedPositioning || Helpers.GetStyleAlt<string>(current, 'position', false) === 'fixed';
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
					Helpers.AddClass(container, sels.CONT_CLS);
					Helpers.SetStyles(container, { zIndex: zIndex });
					if (this.sizes.fixedPositioning)
						Helpers.AddClass(container, sels.FIXED_CLS);
					// loading
					loading = document.createElement('div');
					Helpers.AddClass(loading, sels.LOADING_CLS);
					Helpers.SetStyles(loading, {zIndex: zIndex + 2});
					// options
					options = document.createElement('div');
					Helpers.AddClass(options, sels.OPTIONS_CLS);
					Helpers.SetStyles(options, {zIndex: zIndex + 3});
					// whisper
					whisper = document.createElement('div');
					Helpers.AddClass(whisper, [sels.WHISPER_CLS, sels.HIDDEN_CLS].join(' '));
					Helpers.SetStyles(whisper, {zIndex: zIndex + 1, maxHeight: this.config.maxOptionsHeight + 'px' });
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
					this.events = <ITabidooAutocompleteEvents>{};
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
					var observer = new MutationObserver(mutations => {
						for (let mutation of mutations) {
							if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
								var removedNodes = Array.from(mutation.removedNodes);
								for (var removedNode of removedNodes) {
									if (removedNode === this.elms.input) {
										this.handleUnload();
										break;
									}
								}
							}
						}
					});
					observer.observe(this.elms.input.parentNode, { childList: true });
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
					this.elms.container.parentNode.removeChild(this.elms.container);
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
					this.elms.input.value = this.text;
				}
				protected handleInput (e: Event): void {
					var value = this.elms.input.value.trim();
					if (value.length < this.config.minLen || this.typingValue === value) return;
					this.typingValue = value;
					this.handleRequest(this.typingValue);
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
					this.hideWhisper();
					this.elms.input.value = '';
					this.DispatchEvent('change', new TabidooAutocompleteChangeEvent(
						this, 
						<ITabidooautocompleteOption<TDooApiTable>>{
							value: valueBefore,
							text: textBefore,
							fields: this.option?.fields ?? null
						}, <ITabidooautocompleteOption<TDooApiTable>>{
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
					var containsFilter = <IDooGetDataOption<any>>{
						filter: filters,
						filterOperator: 'OR',
						limit: this.config.limit,
						sort: sort.join(',')
					};
					(async () => {
						var response = await doo.table.getData(this.config.tableName, containsFilter),
							options: ITabidooautocompleteOption<TDooApiTable>[] = [],
							valueField = this.config.valueField,
							textField = this.config.textField;
						if (response?.data == null || response.data.length === 0) {
							if (startsWith) {
								this.handleRequestAuto(value, false);
							} else {
								this.handleResponse(value, options);
							}
						} else {
							for (var item of response.data) {
								options.push(<ITabidooautocompleteOption<TDooApiTable>>{
									value: item.fields[valueField],
									text: item.fields[textField],
									fields: item.fields
								});
							}
							this.handleResponse(value, options);
						}
					})();
				}
				protected handleResponse (value: string, options: ITabidooautocompleteOption<TDooApiTable>[]): void {
					this.requestsCount -= 1;
					if (this.requestsCount < 0) this.requestsCount = 0;
					if (this.requestsCount === 0) this.hideLoading();
					if (this.typingValue === value) this.renderOptions(options);
				}
				//#endregion
				//#region options rendering
				protected renderOptions (options: ITabidooautocompleteOption<TDooApiTable>[]): void {
					this.unloadOptionsEvents();
					if (options.length === 0) {
						if (this.requestsCount === 0) {
							this.hideWhisper();
						} else {
							this.hideOptions();
							this.handleResize(false);
						}
						this.elms.options.innerHTML = '';
						this.options = new Map<number, ItabidooAutocompleteOptionElement<TDooApiTable>>()
					} else {
						this.renderOptionsInitNew(options);
						this.showOptions();
						this.handleResize(false);
					}
				}
				protected unloadOptionsEvents (): void {
					var btnElm: HTMLButtonElement,
						optionEvents: ITabidooAutocompleteOptionEvents;
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
				protected renderOptionsInitNew (dataOptions: ITabidooautocompleteOption<TDooApiTable>[]): void {
					var optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						optionElms: HTMLDivElement[] = [],
						options = new Map<number, ItabidooAutocompleteOptionElement<TDooApiTable>>(),
						optionEvents: ITabidooAutocompleteOptionEvents,
						index: number = 0,
						initializer = this.config.optionRenderer != null
							? this.renderOptionInitElementsUser.bind(this)
							: this.renderOptionInitElementsAuto.bind(this);
					for (var dataOption of dataOptions) {
						[optionElm, btnElm] = initializer.call(this, dataOption, index);
						optionEvents = this.renderOptionInitEvents(btnElm, index);
						optionElms.push(optionElm);
						options.set(index, <ItabidooAutocompleteOptionElement<TDooApiTable>>{
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
				protected renderOptionInitElementsAuto (dataOption: ITabidooautocompleteOption<TDooApiTable>, index: number): [HTMLDivElement, HTMLButtonElement] {
					var sels = this.Static.SELECTORS,
						optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						zIndexBase: number = this.config.zIndex + 4;
					btnElm = document.createElement('button');
					btnElm.type = 'button';
					btnElm.value = dataOption.value;
					btnElm.innerHTML = dataOption.text;
					Helpers.AddClass(btnElm, sels.BUTTON_CLS);
					optionElm = document.createElement('div');
					Helpers.AddClass(optionElm, sels.OPTION_CLS);
					btnElm = optionElm.appendChild(btnElm);
					Helpers.SetStyles(optionElm, {zIndex: zIndexBase + index});
					return [optionElm, btnElm];
				}
				protected renderOptionInitElementsUser (dataOption: ITabidooautocompleteOption<TDooApiTable>, index: number): [HTMLDivElement, HTMLButtonElement] {
					var sels = this.Static.SELECTORS,
						optionElm: HTMLDivElement,
						btnElm: HTMLButtonElement,
						zIndexBase: number = this.config.zIndex + 4;
					var userResult = this.config.optionRenderer.call(this, dataOption, index);
					if (userResult instanceof HTMLDivElement) {
						optionElm = userResult as HTMLDivElement;
						Helpers.AddClass(optionElm, sels.OPTION_CLS);
						btnElm = optionElm.querySelector('button');
						Helpers.AddClass(btnElm, sels.BUTTON_CLS);
						btnElm.type = 'button';
						btnElm.value = dataOption.value;
					} else if (typeof userResult === 'string' || userResult instanceof String) {
						var cont = document.createElement('div');
						cont.innerHTML = String(userResult);
						optionElm = cont.querySelector('div');
						Helpers.AddClass(optionElm, sels.OPTION_CLS);
						btnElm = optionElm.querySelector('button');
						Helpers.AddClass(btnElm, sels.BUTTON_CLS);
						btnElm.type = 'button';
						btnElm.value = dataOption.value;
					} else {
						[optionElm, btnElm] = this.renderOptionInitElementsAuto(dataOption, index);
					}
					Helpers.SetStyles(optionElm, {zIndex: zIndexBase + index});
					return [optionElm, btnElm];
				}
				protected renderOptionInitEvents (btnElm: HTMLButtonElement, index: number): ITabidooAutocompleteOptionEvents {
					var result = <ITabidooAutocompleteOptionEvents>{};
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
						selectedOptionElm: ItabidooAutocompleteOptionElement<TDooApiTable>;
					if (index !== -1 && index < this.options.size - 1) {
						selectedOptionElm = this.options.get(index);
						Helpers.RemoveClass(selectedOptionElm.option, sels.ACTIVE_CLS);
					}
				}
				protected activateOption (index: number, scrollIntoView: boolean = false): void {
					var sels = this.Static.SELECTORS,
						selectedOptionElm: ItabidooAutocompleteOptionElement<TDooApiTable>;
					selectedOptionElm = this.options.get(index);
					Helpers.AddClass(selectedOptionElm.option, sels.ACTIVE_CLS);
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
						selectedOptionElm: ItabidooAutocompleteOptionElement<TDooApiTable>;
					this.optionSelected = index;
					selectedOptionElm = this.options.get(this.optionSelected);
					Helpers.AddClass(selectedOptionElm.option, sels.ACTIVE_CLS);
					selectedOptionElm.option.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center'
					});
					this.option = selectedOptionElm.data;
					this.value = selectedOptionElm.data.value;
					if (this.config.textRenderer != null) {
						this.text = this.config.textRenderer.call(this, <ITabidooautocompleteOption<TDooApiTable>>{
							text: selectedOptionElm.data.text,
							value: this.value,
							fields: this.option.fields
						});
					} else {
						this.text = selectedOptionElm.data.text;
					}
					this.hideWhisper();
					this.elms.input.value = this.text;
					this.DispatchEvent('change', new TabidooAutocompleteChangeEvent(
						this, 
						<ITabidooautocompleteOption<TDooApiTable>>{
							value: valueBefore,
							text: textBefore,
							fields: optionBefore?.fields ?? null
						}, <ITabidooautocompleteOption<TDooApiTable>>{
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
					Helpers.SetStyles(whisper, {
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
					Helpers.SetStyles(clearBtn, {
						top: (domRect.top + clearBtnMargin) + 'px',
						left: (domRect.left + inputWidth - clearBtnMargin - clearBtn.offsetWidth) + 'px'
					});
					return this;
				}*/
				protected handleResizeWhisperSizes (): void {
					var whisper = this.elms.whisper,
						paddLeft = Helpers.GetStyleAlt<number>(whisper, 'padding-left', true),
						paddRight = Helpers.GetStyleAlt<number>(whisper, 'padding-right', true),
						paddTop = Helpers.GetStyleAlt<number>(whisper, 'padding-top', true),
						paddBottom = Helpers.GetStyleAlt<number>(whisper, 'padding-bottom', true);
					paddLeft =   !window.isNaN(paddLeft)  ? paddLeft : 0;
					paddRight =  !window.isNaN(paddRight)  ? paddRight : 0;
					paddTop =    !window.isNaN(paddTop)    ? paddTop : 0;
					paddBottom = !window.isNaN(paddBottom) ? paddBottom : 0;
					this.sizes.whisperPaddHSize = paddLeft + paddRight;
					this.sizes.whisperPaddVSize = paddTop  + paddBottom;
					
					var borderLeft = Helpers.GetStyleAlt<number>(whisper, 'border-left-width', true),
						borderRight = Helpers.GetStyleAlt<number>(whisper, 'border-right-width', true),
						borderTop = Helpers.GetStyleAlt<number>(whisper, 'border-top-width', true),
						borderBottom = Helpers.GetStyleAlt<number>(whisper, 'border-bottom-width', true);
					borderLeft =   !window.isNaN(borderLeft)   ? borderLeft : 0;
					borderRight =  !window.isNaN(borderRight)  ? borderRight : 0;
					borderTop =    !window.isNaN(borderTop)    ? borderTop : 0;
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
					Helpers.RemoveClass(this.elms.whisper, sels.HIDDEN_CLS);
					if (showLoading) this.showLoading();
					this.handleResize(false);
					this.initResizingInterval();
					return this;
				}
				protected showLoading (): this {
					var sels = this.Static.SELECTORS;
					Helpers.RemoveClass(this.elms.loading, sels.HIDDEN_CLS);
					return this;
				}
				protected showOptions (): this {
					var sels = this.Static.SELECTORS;
					Helpers.RemoveClass(this.elms.options, sels.HIDDEN_CLS);
					return this;
				}
				protected hideWhisper (): this {
					var sels = this.Static.SELECTORS;
					Helpers.AddClass(this.elms.whisper, sels.HIDDEN_CLS);
					this.opened = false;
					clearInterval(this.resizing.interval);
					return this;
				}
				protected hideLoading(): this {
					var sels = this.Static.SELECTORS;
					Helpers.AddClass(this.elms.loading, sels.HIDDEN_CLS);
					return this;
				}
				protected hideOptions(): this {
					var sels = this.Static.SELECTORS;
					Helpers.AddClass(this.elms.options, sels.HIDDEN_CLS);
					return this;
				}
				//#endregion
			}
			const STYLESHEET = `CSS_CODE_REPLACEMENT`;
			//#endregion
			return TabidooAutocompleteComponent.CreateInstance(config);
		}
	};
});