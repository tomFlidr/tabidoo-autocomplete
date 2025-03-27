var doo = {
	model: {
		"orderId": {
			"fieldName": "orderId",
			"fieldDataType": {
				"name": "string"
			},
			"innerValue": "20250327 0001",
			"allowProcessAfterChange": true,
			"callProcessAfterChangeSetTimeoutIdInternal": null,
			"prevInnerValueInternal": {},
			"currentlyChanged": false,
			"value": "20250327 0001",
			"innerVisible": true,
			"isVisible": true,
			"innerEnabled": true,
			"isEnabled": true,
			"innerRequired": true,
			"isRequired": true,
			"innerFilterForDropdown": null,
			"innerFilterForDropdownJson": null,
			"filterForDropdown": null,
			"innerLabel": "Order ID",
			"label": "Order ID",
			"modelId": "2f6de805-4d21-4d09-9431-e4cf0d1079ec",
			"isReadOnly": false,
			"originalValue": "20250327 0001",
			"previousValue": "20250327 0001"
		},
		"priceTotal": {
			"fieldName": "priceTotal",
			"fieldDataType": {
				"name": "decimal"
			},
			"innerValue": 1000,
			"allowProcessAfterChange": true,
			"callProcessAfterChangeSetTimeoutIdInternal": null,
			"prevInnerValueInternal": {},
			"currentlyChanged": false,
			"value": 1000,
			"innerVisible": true,
			"isVisible": true,
			"innerEnabled": true,
			"isEnabled": true,
			"innerRequired": true,
			"isRequired": true,
			"innerFilterForDropdown": null,
			"innerFilterForDropdownJson": null,
			"filterForDropdown": null,
			"innerLabel": "Price Total",
			"label": "Price Total",
			"modelId": "2f6de805-4d21-4d09-9431-e4cf0d1079ec",
			"isReadOnly": false,
			"originalValue": 1000,
			"previousValue": 1000
		},
		"company": {
			"fieldName": "company",
			"fieldDataType": {
				"name": "schemaLink"
			},
			"innerValue": {
				"id": "33f52843-dcec-4605-82bb-0eb4d84c8a5e",
				"vatId": "US0231351067",
				"companyName": "Amazon.com, Inc."
			},
			"allowProcessAfterChange": true,
			"callProcessAfterChangeSetTimeoutIdInternal": null,
			"prevInnerValueInternal": {},
			"currentlyChanged": false,
			"value": {
				"id": "33f52843-dcec-4605-82bb-0eb4d84c8a5e",
				"vatId": "US0231351067",
				"companyName": "Amazon.com, Inc."
			},
			"innerVisible": true,
			"isVisible": true,
			"innerEnabled": true,
			"isEnabled": true,
			"innerRequired": true,
			"isRequired": true,
			"innerFilterForDropdown": null,
			"innerFilterForDropdownJson": null,
			"filterForDropdown": null,
			"innerLabel": "Company",
			"label": "Company",
			"modelId": "2f6de805-4d21-4d09-9431-e4cf0d1079ec",
			"isLookup": true,
			"linkType": "LN21",
			"isReadOnly": false,
			"originalValue": {
				"id": "33f52843-dcec-4605-82bb-0eb4d84c8a5e",
				"vatId": "US0231351067",
				"companyName": "Amazon.com, Inc."
			},
			"previousValue": {
				"id": "33f52843-dcec-4605-82bb-0eb4d84c8a5e",
				"vatId": "US0231351067",
				"companyName": "Amazon.com, Inc."
			}
		},
		"id": "2f6de805-4d21-4d09-9431-e4cf0d1079ec",
		"ver": 0,
		"verHash": "xsffddbul5-pfj1",
		"modelMetadata": {
			"currentForm": {
				"level": 1,
				"tableId": "26724490-f724-4fbc-8b83-b6ff5112891f",
				"tableInternalName": "order",
				"tableName": "Order",
				"isWidget": false
			},
			"parentModel": null
		},
		"isValid": true,
		"hideCategory": function () {},
		"selectCategory": function () {},
		"showCategory": function () {},
		"companyAutoComplete": {
			"fieldName": "companyAutoComplete",
			"fieldDataType": {
				"name": "freeHtmlInput"
			},
			"allowProcessAfterChange": true,
			"callProcessAfterChangeSetTimeoutIdInternal": null,
			"prevInnerValueInternal": {},
			"currentlyChanged": false,
			"innerVisible": true,
			"isVisible": true,
			"innerEnabled": true,
			"isEnabled": true,
			"innerFilterForDropdown": null,
			"innerFilterForDropdownJson": null,
			"filterForDropdown": null,
			"innerLabel": "Company",
			"label": "Company",
			"modelId": "2f6de805-4d21-4d09-9431-e4cf0d1079ec",
			"isReadOnly": false
		}
	},
	table: {
		getData: function (tableName, options) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					var filters = options.filter;
					console.log(JSON.stringify(filters, null, "\t"));
					if (filters.length === 1) {
						var filter = filters[0],
							columnName = filter.field,
							operator = filter.operator,
							value = filter.value,
							valueLower = String(value).toLocaleLowerCase();
						if (columnName === 'companyName' && operator === 'startswith' && valueLower === 'a') {
							console.log(1);
							return resolve(data1);
						} else if (columnName === 'vatId' && operator === 'startswith' && valueLower === 'us') {
							console.log(2);
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
							value2 = filter2.value,
							value1Lower = String(value1).toLocaleLowerCase(),
							value2Lower = String(value2).toLocaleLowerCase()
						if (
							columnName1 === 'companyName' && operator1 === 'startswith' && 
							value1Lower === 'a'
						) {
							console.log(3);
							return resolve(data3);
						} else if (
							columnName2 === 'vatId' && operator2 === 'startswith' &&
							value2Lower === 'us'
						) {
							console.log(4);
							return resolve(data4);
						} else if (
							columnName1 === 'companyName' && operator1 === 'startswith' && 
							value1Lower === 'corp'
						) {
							console.log(3);
							return resolve(data3);
						} else if (
							columnName2 === 'vatId' && operator2 === 'startswith' &&
							value2Lower === '00'
						) {
							console.log(4);
							return resolve(data4);
						}
					}
					console.log(5);
					return resolve(data5);
					//return resolve({ data: [] });
				}, 1000);
			});
		}
	}
};

for (var propName in doo.model) {
	if (typeof doo.model[propName] === 'object') {
		doo.model[propName].setValue = function (value) {
			doo.model[propName].value = value;
		};
		doo.model[propName].getValue = function (value) {
			return doo.model[propName].value;
		};
	};
}