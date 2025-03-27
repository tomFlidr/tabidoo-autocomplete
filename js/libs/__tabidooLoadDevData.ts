(async (doo: IDoo) => { // do not change this line
	// place your code here
	
	// console.log(doo.domHelpers.SerializeModel(doo.model));

	var data1 = await doo.table.getData<IDooApiTableCompany>('company', <IDooGetDataOptionCompany>{
		filter: [{
			field: 'companyName',
			operator: 'startswith',
			value: 'a'
		}],
		sort: 'companyName(asc)'
	});
	console.log(`var data1 = ${JSON.stringify(data1, null, "\t")}`);

	var data2 = await doo.table.getData<IDooApiTableCompany>('company', <IDooGetDataOptionCompany>{
		filter: [{
			field: 'vatId',
			operator: 'startswith',
			value: 'us'
		}],
		sort: 'vatId(asc)'
	});
	console.log(`var data2 = ${JSON.stringify(data2, null, "\t")}`);

	var data3 = await doo.table.getData<IDooApiTableCompany>('company', <IDooGetDataOptionCompany>{
		filter: [{
			field: 'companyName',
			operator: 'contains',
			value: 'corp'
		}],
		sort: 'companyName(asc)'
	});
	console.log(`var data3 = ${JSON.stringify(data3, null, "\t")}`);

	var data4 = await doo.table.getData<IDooApiTableCompany>('company', <IDooGetDataOptionCompany>{
		filter: [{
			field: 'vatId',
			operator: 'contains',
			value: '00'
		}],
		sort: 'vatId(asc)'
	});
	console.log(`var data4 = ${JSON.stringify(data4, null, "\t")}`);

	var data5 = await doo.table.getData<IDooApiTableCompany>('company', <IDooGetDataOptionCompany>{
		sort: 'companyName(asc)'
	});
	console.log(`var data5 = ${JSON.stringify(data5, null, "\t")}`);
	
}) // do not change this line