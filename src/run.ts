(async() => {
	doo['tableAutocomplete'] = await autoCompleteFactory(doo);
	
	///@ts-ignore
	//var value = doo.model.company.value != null ? doo.model.company.value.companyName : '';
	var value = 'Can 21 s.r.o.';
	var text = 'Can 21 s.r.o. (26123428)';


	var autoComplete = doo.tableAutocomplete.CreateInstance<IDooApiTableCompany>({
		selector: 'input.tabidoo-autocomplete',
		tableName: 'company',
		minLen: 0,
		value: value,
		text: text,
		valueField: 'companyName',
		textField: 'companyName',
		columns: [{
			name: 'companyName',
		},{
			name: 'vatId',
		}],
		optionRenderer: option => `
			<div><button value="${option.value}">${option.fields.companyName} (${option.fields.vatId})</button></div>
		`,
		textRenderer: option => {
			if (option.fields != null) {
				return `${option.fields.companyName} (${option.fields.vatId})`;
			} else {
				return option.text;
			}
		}
	});
	autoComplete.AddEventListener('change', e => {
		//doo.model.firma.setValue(e.GetOptionAfter().value);
		console.log(e.GetOptionAfter(), autoComplete.GetId());
	});
	
})();