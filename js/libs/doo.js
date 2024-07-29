var doo = {
	table: {
		getData: function (tableName, options) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					var filters = options.filter;
					if (filters.length === 1) {
						var filter = filters[0],
							columnName = filter.field,
							operator = filter.operator,
							value = filter.value;
						if (columnName === 'NAZEVPARTNERA' && operator === 'startswith' && value === 'abc') {
							return resolve(data1);
						} else if (columnName === 'ICO' && operator === 'startswith' && value === '123') {
							return resolve(data2);
						}
					} else if (filters.length === 2) {
						var filter1 = filters[0],
							filter2 = filters[1],
							columnName1 = filter1.field,
							columnName2 = filter2.field,
							operator1 = filter1.operator,
							operator2 = filter2.operator,
							value1 = filter1.value,
							value2 = filter2.value;
						if (
							columnName1 === 'NAZEVPARTNERA' && operator1 === 'startswith' && 
							columnName2 === 'ICO' && operator2 === 'startswith' && 
							(value1 === 'abc' || value1 === '123')
						) {
							return resolve(data3);
						} else if (
							columnName1 === 'NAZEVPARTNERA' && operator1 === 'contains' && 
							columnName2 === 'ICO' && operator2 === 'contains' &&
							(value1 === 'omega' || value1 === '1234')
						) {
							return resolve(data4);
						}
					}
					return resolve(data4);
					//return resolve({ data: [] });
				}, 1000);
			});
		}
	}
};