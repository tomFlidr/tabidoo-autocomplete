/**
 * Order:           1
 * Property name:   domHelpers
 * Name:            DOM Helpers, Filtering Types
 * Interface:       IDomHelpers
 */


/**
 * Filtering Interfaces
 */

// Order
type IDooApiTableOrderMoreKeys = (
	'id' | 
	`company.${keyof IDooApiTableCompany}` | 'company.id'
);
type IDooApiTableOrderAllKeys = IDooApiTableOrder & {
    [key in IDooApiTableOrderMoreKeys]: string;
}
interface IFilterOrder extends IPublicApiFilterGroup {
	field: keyof IDooApiTableOrderAllKeys & (string | number | symbol);
	filter?: IFilterOrder[];
	filterOperator?: 'and' | 'or';
}
interface IDooGetDataOptionOrder extends IDooGetDataOption {
	filter: IFilterOrder[];
	sort: `${keyof IDooApiTableOrder}(${'asc' | 'desc'})` & string;
	filterOperator?: 'and' | 'or';
}

// Company
type IDooApiTableCompanyMoreKeys = (
	'id'
);
type IDooApiTableCompanyAllKeys = IDooApiTableCompany & {
    [key in IDooApiTableCompanyMoreKeys]: string;
}
interface IFilterCompany extends IPublicApiFilterGroup {
	field: keyof IDooApiTableCompanyAllKeys & (string | number | symbol);
	filter?: IFilterCompany[];
	filterOperator?: 'and' | 'or';
}
interface IDooGetDataOptionCompany extends IDooGetDataOption {
	filter: IFilterCompany[];
	sort: `${keyof IDooApiTableCompany}(${'asc' | 'desc'})` & string;
	filterOperator?: 'and' | 'or';
}


/**
 * DOM Helpers
 */
interface IDomHelpers {
    GetUtcDate (): Date;
	GetById: <TElement extends HTMLElement>(elementId: string, doc?: Document) => TElement;
	QuerySelector: <TElement extends HTMLElement>(selectors: string, cont?: HTMLElement) => TElement;
	QuerySelectorAll: <TElement extends HTMLElement>(selectors: string, cont?: HTMLElement) => TElement[];
	HasClass: (elm: HTMLElement, cssClass: string) => boolean;
	RemoveClass: (elm: HTMLElement, cssClass: string) => HTMLElement;
	AddClass: (elm: HTMLElement, cssClass: string) => HTMLElement;
	SetAttrs: (elm: HTMLElement, attrs: object) => HTMLElement;
	SetStyles: (elm: HTMLElement, styles: object) => HTMLElement;
	GetStyle: (elm: HTMLElement, cssPropName: string, asNumber?: boolean) => string | null;
	GetStyleAlt: <TResult extends (string | number)>(elm: HTMLElement, cssPropName: string, asNumber?: boolean) => TResult | null;
	/** @summary Get unique or nonunique random string. */
	GetRandomString: (length: number, unique?: boolean) => string;
	GetPageSizes: (currentElm: HTMLElement) => {PageXStart: number, PageYStart: number, PageXEnd: number, PageYEnd: number};
	Round: (n: number, digits?: number) => number;
    ParseFloatSafe (strVal: string | null): number | null;
    ParseIntSafe (strVal: string | null, radix?: number): number | null;
	Trim (str: string, charlist?: string): string;
	SerializeModel (model: IDooModel): string;
}