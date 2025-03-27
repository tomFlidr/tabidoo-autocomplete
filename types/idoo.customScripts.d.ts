export {}

declare global {
	
	interface IDoo {
		domHelpers: IDomHelpers;
		tableAutoComplete: ITableAutoCompleteFactory;
		model: any;
	} 
	
	const doo: IDoo;

}