interface IDooApiTableCompany {
	/**
	*Vat ID
	*/
	vatId?: string;
	/**
	*Company Name
	*/
	companyName?: string;
}
interface IDooApiTableCompanySummary {
}
interface IDooLinkToOneCompany extends IDooLinkTypeToOneBase {
	/**
	*Vat ID
	*/
	vatId?: string;
	/**
	*Company Name
	*/
	companyName?: string;
}
interface IDooApiTypeLinkToManyCompany {
	/**
	*Vat ID
	*/
	vatId?: IDooApiLinkToManyFieldsGeneric;
	/**
	*Company Name
	*/
	companyName?: IDooApiLinkToManyFieldsGeneric;
}