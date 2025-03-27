
export {}

declare global {

	interface IDooModelBase {
		/**
		 * Internal record identifier.
		 */
		id?: string;
		/**
		 * Internal record version.
		 * -1 means this is a new record.
		 */
		ver?: number;
		isValid: boolean;
		isReadOnly: boolean;
		infotext: string;
		hideCategory(categoryName: string): void;
		showCategory(categoryName: string): void;
		selectCategory(categoryName: string): void;
		/**
		 * Metadata of the currently open form and its all hierarchically opened parent forms.
		 */
		modelMetadata: IDooModelMetadata;
	}
	
	interface IDooModelParent extends IDooModelBase {
		/**
		 * Metadata of the parent form and its all hierarchically opened parent forms.
		 */
		modelMetadata: IDooModelMetadata;
	}
	
	interface IDooModelMetadata {
		/**
		 * Metadata of the opened form (table ID and name, level of nesting).
		 */
		currentForm: IDooCurrentForm;
		/**
		 * Metadata of all hierarchically opened parent forms.
		 */
		parentModel: IDooModelParent;
	}
	
	interface IDooCurrentForm {
		/**
		 * Level of nesting in the hierarchy of open forms - the form at the first level has level = 1.
		 */
		level: number;
		/**
		 * ID of the table to which the open form belongs.
		 */
		tableId: string;
		/**
		 * Internal name of the table to which the open form belongs.
		 */
		tableInternalName: string;
		/**
		 * Header of the table to which the open form belongs.
		 */
		tableName: string;
		/**
		 * Whether the script was called from a form detail as a widget.
		 */
		isWidget?: boolean;
	}
	
	interface IDooModelPropValue <T> {
		value?: T;
		originalValue?: T,
		isVisible?: boolean;
		isEnabled?: boolean;
		isRequired?: boolean;
		currentlyChanged?: boolean;
		filterForDropdown?: string;
		label?: string;
		setValue(value: any): void;
		/**
		 * set field style using Tabidoo prepared styles
		 */
		setStyle(style: DooFieldStyle): void;
		/**
		 * set custom field style
		 */
		setStyle(customStyle: IDooFieldStyle): void;
	}
	
	/**
	 * rewrite the ANY part for the specific table. e. g. IDooApiTableMyCompanies
	 */
	interface IDooApiTableANY {
		replace_IDooApiTableANY_for_specific_interface: any;
	}
	
	interface IDooApiFileResponse {
		fileId: string;
		fileName: string;
		fileSize: string;
		fileUrl: string;
		mimetype: string;
	}
	
	// basic type for link to one types, extends geterated type - method getInterfaceNameForLinkToOne
	interface IDooLinkTypeToOneBase {
		id: string;
	}
	
	interface IDooApiMoneyWithCurrency {
		amount: number;
		currency: string;
		date?: string;
	}
	
	interface IDooMoneyWithCurrency {
		amount: number;
		currency: string;
		date?: string;
		values?: IDooMoneyWithCurrencyValue[]
	}
	
	interface IDooMoneyWithCurrencyValue {
		currency: string;
		exchangeRateId?: string;
		value: number;
	}
	
	interface IDooUrlMailto {
		href: string;
		description?: string;
		isMailto?: boolean;
	}
	
	interface IDooApiUrlMailto {
		href: string;
		description?: string;
	}
	
	// basic type for link to many types
	interface IDooLinkTypeToManyGeneric {
		includedItems: any[];
		excludedItems: any[];
	}
	
	interface IDooApiLinkToOne<T> {
		id: string;
		created: string;
		modified: string;
		ver: string;
		fields: T;
	}
	
	interface IDooApiLinkToMany<T> {
		count: number;
		ver: string;
		fields?: T;
	}
	
	interface IDooApiLinkToManyFieldsGeneric {
		_$$list?: string;
		_$$sum?: number;
		_$$min?: number;
		_$$max?: number;
		_$$avg?: number;
	}
	
	interface IDooCurrentUser {
		roles: string[];
		
		/**
		*Login
		*/
		login?: string;
	
		/**
		*Roles
		*/
		role?: any;
	}
	
	interface IDooFieldStyle {
		/**
		 * field wrapper style - use standard css styles (eg. { background: 'red' })
		 */
		wrapperStyle?: any;
		/**
		 * field label style - use standard css styles (eg. { color: 'red' })
		 */
		labelStyle?: any;
	}
	
	enum SchemaColumnDataType {
		String = 'string',
		Decimal = 'decimal',
		Money = 'money',
		Checkbox = 'checkbox',
		Int = 'int',
		Picture = 'picture',
		File = 'file',
		Date = 'date',
		Datetime = 'datetime',
		Radio = 'radio',
		Dropdown = 'dropdown',
		Multichoice = 'dropdownMulti',
		CheckboxDynamicList = 'checkboxDynamicList',
		Chat = 'chat',
		Memo = 'memo',
		Link = 'schemaLink',
		//CustomDirective = 'customDirective',
		//SystemType = 'systemType',
		UrlLink = 'urlLink',
		StringMonthWeek = 'stringMonthWeek',
		Chips = 'chips',
		//CalculatedField = 'calculatedField',
		Markdown = 'markdown',
		//MoneyWithCurrency = 'moneyWithCurrency',
		Percentage = 'percentage',
		//ButtonForm = 'buttonForm',
		//List = 'list',
		//FreeHtmlInput = 'freeHtmlInput'
	}
	
	enum DataSchemaLinkTypeEnum {
		None = 'none',
		L121 = 'L121',
		//L12N = 'L12N',
		LN21 = 'LN21',
		//LN2M = 'LN2M'
	}
	
	enum DooFieldStyle {
		Primary = 'Primary',
		Danger = 'Danger',
		Warning = 'Warning'
	}

	/*********************************************************************************************************/

	interface IDooApiTableCustomScripts {
    
		/**
		*Name
		*/
		name?: string;
	
		/**
		*Property name
		*/
		namespace?: string;
	
		/**
		*Interface
		*/
		interface?: string;
	
		/**
		*d.ts
		*/
		dts?: any;
	
		/**
		*Script
		*/
		script?: any;
	
		/**
		*Order
		*/
		scriptOrder?: number;
	
	}
	
	interface IDooApiTableCustomScriptsSummary {
	
		/**
	*    Order
		*/
		scriptOrder?: 'min' | 'max' | 'sum' | 'avg';
	}
	
	interface IDooLinkToOneCustomScripts extends IDooLinkTypeToOneBase {
	
		/**
		*Name
		*/
		name?: string;
	
		/**
		*Property name
		*/
		namespace?: string;
	
		/**
		*Interface
		*/
		interface?: string;
	
		/**
		*d.ts
		*/
		dts?: any;
	
		/**
		*Script
		*/
		script?: any;
	
		/**
		*Order
		*/
		scriptOrder?: number;
	
	}
	
	interface IDooApiTypeLinkToManyCustomScripts {
	
		/**
		*Name
		*/
		name?: IDooApiLinkToManyFieldsGeneric;
	
		/**
		*Property name
		*/
		namespace?: IDooApiLinkToManyFieldsGeneric;
	
		/**
		*Interface
		*/
		interface?: IDooApiLinkToManyFieldsGeneric;
	
		/**
		*Order
		*/
		scriptOrder?: IDooApiLinkToManyFieldsGeneric;
	
	}
	
	interface IDooModel extends IDooModelBase { }

	interface IDooReportData { }
	
	interface ICurrentApplicationParameters { 
	
		systemLogParameters: IDooApiTableSystemLogParameters;
	}

	interface IDooApiTableSystemLogParameters {
    
		/**
		*Max rows
		*/
		maxRows?: number;
	
		/**
		*Always insert
		*/
		alwaysInsert?: boolean;
	
		/**
		*Log level
		*/
		logLevel?: any;
	
	}
	
	interface IDooApiTableSystemLogParametersSummary {
	
		/**
	*    Max rows
		*/
		maxRows?: 'min' | 'max' | 'sum' | 'avg';
	}
	
	interface IDooLinkToOneSystemLogParameters extends IDooLinkTypeToOneBase {
	
		/**
		*Max rows
		*/
		maxRows?: number;
	
		/**
		*Always insert
		*/
		alwaysInsert?: boolean;
	
		/**
		*Log level
		*/
		logLevel?: any;
	
	}
	
	interface IDooApiTypeLinkToManySystemLogParameters {
	
		/**
		*Max rows
		*/
		maxRows?: IDooApiLinkToManyFieldsGeneric;
	
		/**
		*Always insert
		*/
		alwaysInsert?: IDooApiLinkToManyFieldsGeneric;
	
		/**
		*Log level
		*/
		logLevel?: IDooApiLinkToManyFieldsGeneric;
	
	}
	
	interface IDoo {
		/**
		 * Current language environment.
		 */
		textProvider?: IDooTexts;
		/**
		 * Simplifies wotking with requests, dates etc.
		 */
		functions?: IDooFunctions;
		/**
		 * To work with data in the application.
		 */
		table?: IDooTable;
		/**
		 * Functionality from extensions.
		 */
		extensions?: IDooExtensions;
		/**
		 * Enables to open a form.
		 */
		form?: IDooFormFunctions;
		/**
		 * The current record model.
		 */
		//model?: IDooModel;
		/**
		 * Functions to display the message/question dialog (message box).
		 */
		alert?: IDooAlert;
		/**
		 * Functions to display an information 'toast' message (message in the bottom left corner, can hide automatically).
		 */
		toast?: IDooToast;
	
		/**
		 * Information about the currently logged-in user.
		 */
		currentUser?: IDooCurrentUser;
	
		/**
		 * @deprecated The property should not be used. Use model.<my-prop>.currentlyChanged instead.
		 */
		changedItem?: any;
	
		/**
		 * Current environment variables.
		 */
		environment?: IDooEnvironment;
	
		/**
		 * To work with reports in the application.
		 */
		report?: IDooReport;
	
		/**
		 * Namespace for Workflow scripts functionality
		 */
		
	}
	
	interface IDooWorkflow {
		/**
		 * Immediately interrupts Workflow.
		 */
		stop(): void;
		/**
		 * Object for storing data during Workflow execution.
		 */
		runningData?: any;
		/**
		 * Object for storing imported data
		 */
		importedData?: IDooImportedData;
		/**
		 * Namespace for working with dynamic attachments (e.g. for sending them in an email)
		 */
		attachment?: IDooAttachment;
	}
	
	interface IDooAttachment {
		/**
		 * add a dynamic attachment to currently running workflow (doo.workflow.runningData) - e.g. for sending them in an email step - WARNING - pay attention to the foreach loop step - make sure all previous attachments have been removed before sending the next email.
		 */
		addDynamicAttachment?(options: IDooAddAttachmentOptions): Promise<string>;
		/**
		 * add a dynamic attachment to currently running workflow (doo.workflow.runningData) - e.g. for sending them in an email step - the attachmentId parameter is the name of the property in the runningData where the attachment is added, it can be any of your choice, eg. 'myInvoice', according to this name you can remove/replace the attachment from/in the runningData - use the attachmentId parameter only if you want to have the attachment stored in the runningData in a property with a specific name (e.g. because you can remove it from the runningData using the removeDynamicAttachment function) - WARNING - pay attention to the foreach loop step - make sure all previous attachments have been removed before sending the next email.
		 */
		addDynamicAttachment?(attachmentId: string, options: IDooAddAttachmentOptions): Promise<string>;
		/**
		 * remove a dynamic attachment by attachmentId from the currently running workflow (doo.workflow.runningData; attachmentId was passed to or created (random ID) in the addDynamicAttachment function) - WARNING - pay attention to the foreach loop step - make sure all previous attachments have been removed before sending the next email.
		 */
		removeDynamicAttachment?(attachmentId: string);
		/**
		 * remove all dynamic attachments from the currently running workflow (doo.workflow.runningData) - WARNING - pay attention to the foreach loop step - make sure all previous attachments have been removed before sending the next email.
		 */
		clearAllDynamicAttachments?();
	}
	
	interface IDooAddAttachmentOptions {
		/**
		 * the contents of the file in Base64-string encoding - don't forget to fill in the fileName and mimeType as well (otherwise attachmentId is used as the file name and 'application/octet-stream' as the mime-type), takes precedence over fileId
		 */
		base64Content?: string;
		/**
		 * name of the file - takes precedence (if not empty) over the file name taken from the saved attachment (if fileId is used to download the saved attachment from the application)
		 */
		fileName?: string;
		/**
		 * the mime-type of the file - the mime-type taken from the saved attachment (if fileId is used to download the saved attachment from the application) takes precedence (if not empty) over this parameter
		 */
		mimeType?: string;
		/**
		 * fileId of the attachment stored in the application - don't forget to fill in the tableNameOrId of the table in which the attachment is stored as well, you can also fill in the applicationNameOrId if the file is stored in an application other than the current one (you need access to this application)
		 */
		fileId?: string;
		/**
		 * name or ID of the table in which the attachment is stored - required for fileId
		 */
		tableNameOrId?: string;
		/**
		 * name or ID of the application in which the attachment is stored (you need access to this application) - optional for fileId - if empty, then current app is used
		 */
		applicationNameOrId?: string;
	}
	
	interface IDooGetFileBase64 {
		/**
		 * the contents of the file in Base64-string encoding
		 */
		content?: string;
		/**
		 * name of the file
		 */
		fileName?: string;
		/**
		 * the mime-type of the file
		 */
		mimeType?: string;
		/**
		 * the file size of the file
		 */
		fileSize?: number;
	}
	
	interface IDooImportedData {
		insertedRecordsCount: number;
		insertedIds: string[];
		updatedRecordsCount: number;
		updatedIds: string[];
	}
	
	interface IDooReport {
		/**
		 * Data of the currently processed report (loaded data for the report, report name, etc.)
		 */
		current: IDooReportCurrent;
	}
	
	interface IDooReportCurrent {
		/**
		 * In case the script is called from "After load report data", here are the loaded data to be processed in the report.
		 */
		data?: IDooReportData;
		/**
		 * In the "After load report data" script, you can set the report name here (you can use the loaded data for the report) - the value will also be used as the file name when the report is downloaded.
		 */
		name?: string;
	}
	
	interface IDooTexts {
		languageCode: string;
	}
	
	interface IDooEnvironment {
		/**
		 * Whether the script was called from a public form.
		 */
		isPublicForm?: boolean;
	
		/**
		 * Whether the script was called in a public dashboard (application).
		 */
		isPublicDashboard?: boolean;
	
		/**
		 * Query params from a public form.
		 */
		queryParam: any;
	
		/**
		 * Whether the code is running on server side.
		 */
		isServer?: boolean;
	
		/**
		 * The base URL of the platform domain.
		 */
		domainUrl: string;
	
		/**
		 * Here is the current selected application object.
		 */
		currentApplication?: IEnvironmentApplication;
	}
	
	interface IEnvironmentApplication {
		id: string;
		header: string;
		name: string;
		currentTable: IEnvironmentTable;
	
		/**
		 * Here is the current selected application parameters.
		 */
		params?: ICurrentApplicationParameters;
	}
	
	interface IEnvironmentTable {
		id: string;
		header: string;
		name: string;
		selectedRecords?: IDooModel[];
		/**
		 * data conditions used to load current table data
		 */
		dataConditions?: IPublicApiFilter;
	}
	
	interface IPublicApiFilter extends IPublicApiFilterGroup {
		fullText?: string;
	}
	
	interface IPublicApiFilterGroup {
		filter?: IPublicApiFilterGroup[];
		filterOperator?: string;
		field?: string;
		operator?: string;
		value?: string;
		values?: any[];
	}
	
	interface IDooGetDataFromCustomDataSourceOption {
		filter?: string | IPublicApiFilterGroup[];
		limit?: number;
	}
	
	
	interface IDooGetDataOption {
		filter?: string | IPublicApiFilterGroup[] ;
		sort?: string;
		limit?: number;
		skip?: number;
		loadFields?: string[];
	}
	
	interface IDooGetDataSummaryOption<T> {
		fields: { [K in keyof T]: { aggregations: T[K][] }; };
		filter?: string | IPublicApiFilter | IPublicApiFilterGroup[];
	}
	
	interface IDooGetDataSummaryResponse<T> {
		data?: {
			count?: number;
			fields?: { [K in keyof T]: T[K] extends 'min' | 'max' ? { min: number | string, max: number | string } : { min: number | string, max: number | string, sum: number, avg: number }; };
		}
	}
	
	interface IDooGetDataResponse<T> {
		data?: IDooGetDataResponseDataItem<T>[];
	}
	
	interface IDooGetDataFromCustomDataSourceResponse {
		data: any;
	}
	
	interface IDooGetRecordResponse<T> {
		data?: IDooGetDataResponseDataItem<T>;
	}
	
	interface IDooGetDataResponseDataItem<T> {
		id: string;
		created: string;
		modified: string;
		ver: string;
		fields: T;
	}
	
	interface IDooGetCountResponse {
		data?: IDooGetCountResponseDataItem;
	}
	
	interface IDooGetCountResponseDataItem {
		count: number;
	}
	
	interface IDooGeneralBulkResponse<T> {
		bulk: IDooGeneralBulkResponseBulkPart;
		data: IDooGetDataResponseDataItem<T>[];
		errors: IDooGeneralBulkResponseError[];
	}
	
	interface IDooGeneralBulkResponseBulkPart {
		successCount: number;
	}
	
	interface IDooGeneralBulkResponseError {
		type: string;
		id: string;
		message: string;
	}
	
	interface IDooBulkArrayItem<T> {
		id: string;
		fields: T;
	}
	
	interface IDooGetTableStructureResponse {
		data: IDooGetTableStructureDataResponse;
	}
	
	interface IDooGetTableStructureDataResponse {
		id: string;
		shortid: string;
		header: string;
		items: IDooGetTableStructureItemResponse[];
		settings: any;
		scripts: IDooGetTableStructureScriptResponse[]
	}
	
	interface IDooGetTableStructureItemResponse {
		name: string;
		header: string;
		type: string
	}
	
	interface IDooGetTableStructureScriptResponse {
		name: string;
		script: string;
	}
	
	interface IDooTable {
		/**
		 * Load a list of data from the specified table according to filter, paging, sort, ...
		 */
		getData?<T>(tableNameOrId: string, options?: IDooGetDataOption, applicationId?: string): Promise<IDooGetDataResponse<T>>;
		/**
		 * Load summary data (aggregated values, eg. min/max/avg/sum for numbers, min/max for dates, ...) from the specified table according to list of required fields and filter...
		 */
		getDataSummary?<T>(tableNameOrId: string, options?: IDooGetDataSummaryOption<T>, applicationId?: string): Promise<IDooGetDataSummaryResponse<T>>;
		/**
		 * Get the number of data in the specified table according to the filter.
		 */
		getCount?(tableNameOrId: string, options?: IDooGetDataOption, applicationId?: string): Promise<IDooGetCountResponse>;
		/**
		 * Get the value from the first row in the table. Return the property from one field.
		 */
		getParameter?<T>(tableNameOrId: string, fieldName: string, applicationId?: string): Promise<T>;
		/**
		 * Load one record by its ID from the specified table.
		 */
		getRecord?<T>(tableNameOrId: string, recordId: string, applicationId?: string): Promise<IDooGetRecordResponse<T>>;
		/**
		 * Get all records from the linked table.
		 * @deprecated The getLinkedRecordsV2 method has a simpler signature ;).
		 */
		getLinkedRecords?<T>(tableNameOrId: string, recordId, linktableNameOrId: string, linkFieldName, applicationId?: string): Promise<IDooGetDataResponse<T>>;
		/**
		 * Get all records from the linked table.
		 * @param tableNameOrId From table (source table)
		 * @param recordId Id of the record in the source table
		 * @param fieldName Source table field (column) name
		 * @param applicationId
		 * @param options
		 */
		getLinkedRecordsV2?<T>(tableNameOrId: string, recordId, fieldName, options?: IDooGetDataOption): Promise<IDooGetDataResponse<T>>;
		/**
		 * Creates a new record in a specific table.
		 */
		createRecord?<T>(tableNameOrId: string, fields, options?: IDooCrudOptions): Promise<IDooGetRecordResponse<T>>;
		/**
		 * Updates only passed-in fields in existing record (specified by the recordId parameter) in a specific table. This is a partial update - it only updates the fields that are sent.
		 */
		updateFields?<T>(tableNameOrId: string, record_id: string, fields, options?: IDooCrudOptions): Promise<IDooGetRecordResponse<T>>;
		/**
		 * Updates an existing full record (specified by the recordId parameter) in a specific table. This is a full update - it replaces the whole record with sent fields, thus unsent fields are deleted
		 */
		updateRecord?<T>(tableNameOrId: string, record_id: string, fields, options?: IDooCrudOptions): Promise<IDooGetRecordResponse<T>>;
		/**
		 * Deletes a single record (specified by the recordId parameter) in a specific table.
		 */
		deleteRecord?(tableNameOrId: string, record_id: string, options?: IDooCrudOptions): Promise<void>;
		/**
		 * Creates/Inserts multiple records in a specific table.
		 */
		createRecordsBulk?<T>(tableNameOrId: string, fieldsArray: any[], options?: IDooCrudOptions): Promise<IDooGeneralBulkResponse<T>>;
		/**
		 * Updates only passed-in fields in records in a specific table. This is a partial update - it only updates the fields that are sent.
		 */
		updateRecordsBulk?<T>(tableNameOrId: string, bulkArray: IDooBulkArrayItem<any>[], options?: IDooCrudOptions): Promise<IDooGeneralBulkResponse<T>>;
		/**
		 * Updates full records in a specific table. This is a full update - it replaces the whole records with sent fields, thus unsent fields are deleted.
		 */
		updateFullRecordsBulk?<T>(tableNameOrId: string, bulkArray: IDooBulkArrayItem<any>[], options?: IDooCrudOptions): Promise<IDooGeneralBulkResponse<T>>;
		/**
		 * Deletes records in a specific table. Requires the limit parameter and the filter parameter.
		 */
		deleteRecordsBulk?<T>(tableNameOrId: string, limit: number, filter: string, options?: IDooCrudOptions): Promise<IDooGeneralBulkResponse<T>>;
		/**
		 * Load one attachment file by its ID from the specified table - returns text, so this works only for txt, json, xml, ... files in UTF8 encoding.
		 */
		getFile?(tableNameOrId: string, fileId: string, applicationId?: string): Promise<string>;
		/**
		 * Load one attachment file by its ID from the specified table - returns an object with the properties content (base64), fileName, and mimeType.
		 */
		getFileBase64?(tableNameOrId: string, fileId: string, applicationId?: string): Promise<IDooGetFileBase64>;
		/**
		 * Load one attachment file by its ID from the specified table - returns ArrayBuffer.
		 */
		getFileArrayBuffer?(tableNameOrId: string, fileId: string, applicationId?: string): Promise<ArrayBuffer>;
		/**
		 * Load a thumbnail of one attachment file by its ID from the specified table - returns ArrayBuffer.
		 */
		getThumbnail?(tableNameOrId: string, fileId: string, applicationId?: string): Promise<ArrayBuffer>;
		/**
		 * Load a thumbnail of one attachment file by its ID from the specified table - returns an object with the properties content (base64), fileName, and mimeType.
		 */
		getThumbnailBase64?(tableNameOrId: string, fileId: string, applicationId?: string): Promise<IDooGetFileBase64>;
		/**
		 * Reload user data in all data views (grid/cards/calendar/...) that are currently displayed to the user.
		 */
		reloadUserData?(tableNamesOrIds: string): void;
		/**
		 * Get one table of the application
		 */
		getTableStructure?(tableNameOrId: string, applicationId?: string): Promise<IDooGetTableStructureResponse>;
	}
	
	interface IDooExtensions {
		customDataSource?: IDooExtensionCustomDataSource
	}
	
	interface IDooExtensionCustomDataSource {
		/**
		 * Load a list of data from the specified data source definition according to filter, limit ...
		 */
		getData?(customDataSourceNameOrId: string, options?: IDooGetDataFromCustomDataSourceOption, applicationId?: string): Promise<IDooGetDataFromCustomDataSourceResponse>;
	}
	
	interface IDooCrudOptions {
		applicationId?: string;
		reloadUserDataAfterAction?: boolean;
		useUpsert?: boolean;
		dataResponseType?: string;
		/**
		 * For internal usage.
		 */
		allowAddNotExistingRecords?: boolean;
		/**
		 * For internal usage.
		 */
		allowUpdateExistingRecords?: boolean;
		skipAudit?: boolean;
	}
	
	interface IDooFunctionsInternal {
		email?: IDooFunctionsEmail;
		slack?: IDooFunctionsSlack;
		webhook?: IDooFunctionsWebhook;
		report?: IDooFunctionsReport;
		customScheduler?: IDooFunctionsCustomScheduler;
		externalData?: IDooFunctionsExternalData;
	}
	
	interface IDooFunctions {
		/**
		 * Functions for working with a text.
		 */
		text?: IDooFunctionsString;
	
		/**
		 * Mathematical functions (rounding).
		 */
		math?: IDooFunctionsMath;
	
		/**
		 * Functions for working with a date (adding interval, formatting, ...).
		 */
		date?: IDooFunctionsDate;
	
		/**
		 * Functions for working with a HTTP/S request.
		 */
		request?: IDooFunctionsRequest;
	
		/**
		 * Functions for working with (external) java scripts.
		 */
		scripts?: IDooFunctionsScript;
	
		/**
		 * Wrapper for some browser functions.
		 */
		browser?: IDooFunctionsBrowser;
	}
	
	interface IDooFunctionsBrowser {
		/**
		 * Call save file in browser.
		 * @param content String, base64 string, ArrayBuffer, Blob
		 * @param fileName
		 * @param mime Default text/plain
		 * @param charset Default charset=utf-8
		 */
		saveFile(content: any, fileName: string, mime?: string, charset?: string): void;
	}
	
	interface IDooFunctionsScript {
		/**
		 * Downloads script from url.
		 * In case it runs in browser, it returns window[property] after loading the script.
		 * Otherwise it returns require(script)
		 */
		downloadScript(url: string, property?: string): Promise<any>;
	}
	
	interface IDooFunctionsString {
		/**
		 * Returns an array of text values from any specified range.
		 * @example arrayToText(['Tom', 'Jerry'], 'and') => 'Tom and Jerry'
		 */
		arrayToText(input: string[], separator?: string): string;
	
		/**
		 * Joins several text items into one text item.
		 * @example concatenate('Tom', ' and ', 'Jerry') => 'Tom and Jerry'
		 */
		concatenate(...input: string[]): string;
	
		/**
		 * Returns the characters from a text value.
		 * @example left('Tommy', 3) => 'Tom'
		 */
		left(input: string, len: number): string;
	
		/**
		 * Returns the characters from a text value.
		 * @example right('Tommy', 2) => 'my'
		 */
		right(input: string, len: number): string;
	
		/**
		 * Returns the number of characters in a text string.
		 * @example len('My text') => 7
		 */
		len(input: string): number;
	
		/**
		 * Converts text to lowercase.
		 * @example lower('Some text') => 'some text'
		 */
		lower(input: string): string;
	
		/**
		 * Converts text to uppercase.
		 * @example upper('Some text') => 'SOME TEXT'
		 */
		upper(input: string): string;
	
		/**
		 * Capitalizes the first letter in each word of a text value.
		 * @example proper('Some text') => 'Some Text'
		 */
		proper(input: string): string;
	
		/**
		 * Replaces characters within text.
		 * @example replace('Some text', 'text', 'number') => 'Some number'
		 */
		replace(input: string, searchValue: string, replaceValue: string): string;
	
		/**
		 * Converts a text argument to a number.
		 * @example value('12') => 12
		 */
		value(input: string): number;
	}
	
	interface IDooFunctionsDate {
		/**
		 * Add a number of days to the input value (Date/string -> returns the same datatype Date/string). The number of days can be either positive or negative.
		 * @example addDays('2024-01-20', -5) => '2024-01-15'
		 */
		addDays(input: Date | string, value: number): Date | string;
	
		/**
		 * Use to add or subtract months from a date.
		 * @example addMonths('2024-01-20', 1) => '2024-02-20'
		 */
		addMonths(input: Date | string, value: number): Date | string;
	
		/**
		 * Use to add or subtract years from a date.
		 * @example addYears('2024-01-20', -1) => '2023-01-20'
		 */
		addYears(input: Date | string, value: number): Date | string;
	
		/**
		 * Add specified interval to the input value (Date/string -> returns the same datatype Date/string). The value can be either positive or negative. Supported intervals: milliseconds, seconds, minutes, hours, days, months, years.
		 * @example addInterval('2024-01-20T14:55:00', 'minutes', 2) => '2024-01-20T14:57:00'
		 */
		addInterval(input: Date | string, interval: string, value: number): Date | string;
	
		/**
		 * unit - seconds, minutes, hours, days. months and years not supported. Returns number - float. Not integer (whole number)
		 * @example diff('2024-01-25', '2024-01-27', 'days') => 2
		 */
		diff(startDate: Date | string, endDate: Date | string, unit: string): number;
	
		/**
		 * Returns the lowest date.
		 * @example min('2021-01-01', '2022-01-01') => '2021-01-01'
		 */
		min(...values: Date[] | string[]): Date | string;
	
		/**
		 * Returns the largest date.
		 * @example max('2021-01-01', '2022-01-01') => '2022-01-01'
		 */
		max(...values: Date[] | string[]): Date | string;
	
		/**
		 * Returns part of the date. Year as a number. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example year('2023-12-31T23:00:00Z') returns 2024 for time zone Europe/Paris (GMT+1), but returns 2023 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		year(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. Month as a number. Ranging from 1 (January) to 12 (December). You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example month('2023-12-31T23:00:00Z') returns 1 for time zone Europe/Paris (GMT+1), but returns 12 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		month(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. ISO week of the year as a number. Ranging from 1 (Sunday) to 7 (Saturday). You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example weekISO('2023-12-31T23:00:00Z') returns 1 for time zone Europe/Paris (GMT+1), but returns 52 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		weekISO(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. Day 1-31 as a number. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example day('2023-12-31T23:00:00Z') returns 1 for time zone Europe/Paris (GMT+1), but returns 31 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		day(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. Hour 0-23 as a number. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example hour('2023-12-31T23:00:00Z') returns 0 for time zone Europe/Paris (GMT+1), but returns 23 for time zone Europe/London (UTC/GMT+0) and returns 18 for time zone America/New_York (GMT-5)
		 */
		hour(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. Minutes 0-59 as a number. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example minute('2023-12-31T23:00:00Z') returns 0 for time zone Europe/Paris (GMT+1), but returns 30 for time zone Canada/Newfoundland (GMT-2:30) and returns 45 for time zone Australia/Eucla (GMT+8:45)
		 */
		minute(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. Weekday as a number. Ranging from 1 (Sunday) to 7 (Saturday). You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example weekday('2023-12-31T23:00:00Z') returns 2 for time zone Europe/Paris (GMT+1), but returns 1 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		weekday(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns part of the date. ISO day of the week as a number. Ranging from 1 (Monday) to 7 (Sunday). You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example weekdayISO('2023-12-31T23:00:00Z') returns 1 for time zone Europe/Paris (GMT+1), but returns 7 for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		weekdayISO(input: Date | string, timeZone?: string): number;
	
		/**
		 * Returns date-part only string in ISO format yyyy-MM-dd. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example toDateStringISO('2023-12-31T23:00:00Z') returns '2024-01-01' for time zone Europe/Paris (GMT+1), but returns '2023-12-31' for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		toDateStringISO(input: Date | string, timeZone?: string): string;
	
		/**
		 * Returns date-part only string in format specified in the current application. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example toDateStringApp('2023-12-31T23:00:00Z') (app. format 'dd.MM.yyyy') returns '01.01.2024' for time zone Europe/Paris (GMT+1), but returns '31.12.2023' for time zone Europe/London (UTC/GMT+0) or America/New_York (GMT-5)
		 */
		toDateStringApp(input: Date | string, timeZone?: string): string;
	
		/**
		 * Returns date-time string in format specified in the current application. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example toDateTimeStringApp('2023-12-31T23:00:00Z') (app. format 'dd.MM.yyyy' and 24h time) returns '01.01.2024 00:00' for time zone Europe/Paris (GMT+1), but returns '31.12.2023 19:30' for time zone Canada/Newfoundland (GMT-2:30) and returns '01.01.2024 07:45' for time zone Australia/Eucla (GMT+8:45)
		 */
		toDateTimeStringApp(input: Date | string, timeZone?: string): string;
	
		/**
		 * Returns a Date instance parsed from the input parameter or a Date instance with current date-time if the input parameter is not passed. You can specify the time zone (e.g. Europe/Paris or UTC, respects DST, timeZone parameter is not supported in calculated fields). The default time zone is taken from the current application.
		 * @example newdate('2023-12-31T23:00:00Z') returns Date with UTC time 2023-12-31 23:00:00; newdate('2024-01-01T00:00:00') (note there is no time zone specified in the date-time string) returns Date with UTC time 2023-12-31 23:00:00 for time zone Europe/Paris (GMT+1), but returns 2024-01-01 00:00:00 for time zone Europe/London (UTC/GMT+0)
		 */
		newdate(input?: Date | string, timeZone?: string): Date;
	}
	
	interface IDooFunctionsMath {
		/**
		 * Mathematically round a decimal number to specified number of decimal places (solves Javascript rounding inaccuracy). E.g. round(2.494, 2) = 2.49, round(2.495, 2) = 2.5, round(1.006, 2) = 1.01, round(1.015, 2) = 1.02, round(1.045, 2) = 1.05
		 * @example round(2.494, 2) => 2.49
		 */
		round(value: number, precision: number): number;
	
		/**
		 * Returns the lowest number.
		 * @example min(-50, 0, 20) => -50
		 */
		min(...values: number[]): number;
	
		/**
		 * Returns the largest number.
		 * @example max(-50, 0, 20) => 20
		 */
		max(...values: number[]): number;
	
		/**
		 * Returns the average.
		 * @example avg(-50, 0, 20) => -10
		 */
		avg(...values: number[]): number;
	
		/**
		 * Return the absolute value.
		 * @example abs(-52) => 52
		 */
		abs(value: number): number;
	
		/**
		 * Returns number rounded up.
		 * @example roundUp(2.44, 1) => 2.5
		 */
		roundUp(value: number, precision: number): number;
	
		/**
		 * Returns number rounded down.
		 * @example roundDown(2.44, 1) => 2.4
		 */
		roundDown(value: number, precision: number): number;
	
		/**
		 * Numerator/Denominator * 100, Parameters 10, 50 gives 20 (percents)
		 * @example percentage(10, 50) => 20
		 */
		percentage(numerator: number, denominator: number): number;
	}
	
	interface IDooFunctionsExternalData {
		/**
		 * Load external data
		 * @param params
		 */
		loadFile?(params): Promise<IGetExternalDataResult>;
		/**
		 * Load columns names from external data
		 * @param params
		 */
		loadFileColumns?(params): Promise<string[]>;
		/**
		 * Load external data by samba
		 * @param params
		 * @param readArrayBuffer
		 */
		loadFileFromSamba?(params, readArrayBuffer): Promise<any>;
		/**
		 * Creates/Inserts multiple records in a specific table.
		 * @param tableNameOrId
		 * @param fieldsArray
		 * @param params
		 */
		saveData?(tableNameOrId: string, fieldsArray: any[], params: any);
		/**
		 * Load data from SQL server
		 * @param params
		 */
		loadSqlTable?(params): Promise<any>
	}
	
	interface IDooFunctionsCustomScheduler {
		runCustomScheduler?(params): any;
	}
	
	interface IDooFormFunctions {
		openForm(tableNameOrId: string, options: IOpenFormOptions, applicationId?: string): Promise<void>;
	
	
		/**
		 * Reload data in form. Tries to recalculate the server calculations and fill them back to the form.
		 * Beta functionality. It is not guarateed to work!
		 */
		updateCalculatedFields(): Promise<void>;
	
		/**
		 * Save the current form and leave it open.
		 * Beta functionality. The function can be moved or renamed!
		 */
		saveAndStay(): Promise<void>;
	}
	
	
	interface IDooAlert {
		showInfo(title: string, text?: string, html?: string): Promise<void>;
		showWarning(title: string, text?: string, html?: string): Promise<void>;
		showError(title: string, text?: string, html?: string): Promise<void>;
		showSuccess(title: string, text?: string, html?: string): Promise<void>;
		showQuestion(text, title?: string): Promise<boolean>;
	}
	
	interface IDooToast {
		info(message?: string, title?: string): void;
		warning(message?: string, title?: string): void;
		error(message?: string, title?: string): void;
		success(message?: string, title?: string): void;
	}
	
	interface IOpenFormOptions {
		header?: string;
		model?: any;
		fields?: IField[];
		saveButtonCallback?: (params: IOpenFormSaveParam) => Promise<boolean>;
		afterSaveButtonCallback?: (params: IOpenFormSaveParam) => void;
		onModelChangeScript?: string;
	}
	
	interface IField {
		name: string;
		dataTypeString?: string;
		order: number;
		linkedSchemaId?: string;
		schemaLinkType?: any;
	}
	
	interface IOpenFormSaveParam {
		model?: any;
	}
	
	interface IDooFunctionsRequest {
		/**
		 * HTTP/S GET request
		 */
		get?(url: string, options?: IDooFunctionsRequestOptions): any;
		/**
		 * HTTP/S POST request, second parameter (body) is required, third parameter (options) is optional
		 */
		post?(url: string, body, options?: IDooFunctionsRequestOptions): any;
		/**
		 * HTTP/S custom request - can specify HTTP method (PUT, PATCH, ...) and body in the options parameter. Default 'GET'
		 */
		custom?(url: string, options?: IDooFunctionsRequestOptions): any;
	}
	
	interface IDooFunctionsRequestOptions {
		/**
		 * The request method, e.g. GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD/... It is used in CUSTOM function only. Default 'GET'
		 */
		method?: string,
		/**
		 * Any headers you want to add to your request - key-value dictionary.
		 */
		headers?: any,
		/**
		 * Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, USVString, or ReadableStream object.
		 */
		body?: any,
		/**
		 * The redirect mode to use: follow (automatically follow redirects), error (abort with an error if a redirect occurs), or manual (handle redirects manually). Default 'follow'.
		 */
		redirect?: string,
		signal?: any,
	
		/**
		 * Query parameters for URL query string. key-value dictionary (object)
		 */
		params?: any,
		/**
		 * Username and password for basic authorization header (object).
		 */
		basicAuth?: any,
		/**
		 * Bearer token for authorization header.
		 */
		bearer?: string,
		/**
		 * Proxy address.
		 */
		proxy?: string,
		/**
		 * The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
		 */
		mode?: string,
		allowInvalidSSLCert?: boolean
	}
	
	
	interface IDooFunctionsEmail {
		sendEmail?(params): any;
	}
	
	interface IDooFunctionsSlack {
		sendSlack?(params): any;
	}
	
	interface IDooFunctionsWebhook {
		callWebhook?(params): any;
	}
	
	interface IDooFunctionsReport {
		createReport?(params): any;
	}
	
	interface IGetExternalDataResult {
		items: any[];
	}
	

}