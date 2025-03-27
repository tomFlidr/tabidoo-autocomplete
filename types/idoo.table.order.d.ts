interface IDooApiTableOrder {

	/**
	*Company
	*/
	company?: IDooApiLinkToOne<IDooApiTableCompany>;
	/**
	*Order ID
	*/
	orderID?: string;
	/**
	*Price Total
	*/
	priceTotal?: number;
	/**
	*Company
	*/
	companyAutoComplete?: any;
}
interface IDooApiTableOrderSummary {
	/**
	*Price Total
	*/
	priceTotal?: 'min' | 'max' | 'sum' | 'avg';
}
interface IDooLinkToOneOrder extends IDooLinkTypeToOneBase {
	/**
	*Company
	*/
	company?: IDooApiLinkToOne<IDooApiTableCompany>;
	/**
	*Order ID
	*/
	orderID?: string;
	/**
	*Price Total
	*/
	priceTotal?: number;
	/**
	*Company
	*/
	companyAutoComplete?: any;

}
interface IDooApiTypeLinkToManyOrder {
	/**
	*Company
	*/
	company?: IDooApiLinkToManyFieldsGeneric;
	/**
	*Order ID
	*/
	orderID?: IDooApiLinkToManyFieldsGeneric;
	/**
	*Price Total
	*/
	priceTotal?: IDooApiLinkToManyFieldsGeneric;
}