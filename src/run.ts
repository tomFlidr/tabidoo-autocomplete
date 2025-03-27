(async() => {
	await __tabidooInit();

	// init values
	var value: string = '',
		text: string = '';
	if (doo.model.company != null) {
		value = doo.model.company.value.companyName;
		text = `${doo.model.company.value.companyName} (${doo.model.company.value.vatId})`;
	}
	

	var autoComplete = doo.tableAutoComplete.Create<IDooApiTableCompany>({
		selector: '#dev-autocomplete',
		minLen: 0,
        //tableName: 'company',
		value: value,
		text: text,
		valueField: 'companyName',
		textField: 'companyName',
		columns: [{
			name: 'companyName',
		},{
			name: 'vatId',
		}],
		enabled: true,
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
		doo.model.company.setValue(e.GetOptionAfter().value);
		console.log(e.GetOptionAfter(), autoComplete.GetId());
	});
	
})();