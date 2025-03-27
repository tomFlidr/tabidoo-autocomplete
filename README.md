# Tabidoo Autocomplete

[![Latest Stable Version](https://img.shields.io/badge/Stable-v0.1.0-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/tabidoo-autocomplete/releases)
![TS Version](https://img.shields.io/badge/TS->=5.0.4-brightgreen.svg?style=plastic)


Autocomplete component for Tabidoo TypeScript environent.

## Main goals
- usable via `Scripting Extension` plug-in and `Free HTML` form field,
- autocompleting values from any Tabidoo table,
- possible to use for any custom autocompleting without Tabidoo tables,
- values could be loaded automaticly or by custom handler,
- custom rendering for autocompleted options and text,
- many other configurations,
- plain TS without any framework.

## How to use it

### 1. Create Extended Scripts
- Add `Scripting Extensions` plug-in into your Tabidoo application edit
- Add new extended script
  - Name: `DOM Helpers`
  - Property name: `domHelpers`
  - Interface: `IDomHelpers`
  - Order: 1
  - d.ts: [copy/paste content from file: `./src/IDomHelpers.ts`]
  - Script: [copy/pase region from file: `./src/domHelpers.ts`]
  - Click to `Save` button
- Add new extended script
  - Name: `Table AutoComplete`
  - Property name: `tableAutoComplete`
  - Interface: `ITableAutoComplete`
  - Order: 2
  - d.ts: [copy/paste content from file: `./src/ITableAutocomplete.ts`]
  - Script: [copy/pase generated content from url: `https://localhost/tabidoo-autocomplete/js/build/tableAutocomplete.php`]
  - Click to `Save` button

### 2. Create Tables With Data
- Create primary data table `company` with two columns:
  - field `vatId`
    - internal name for scripting: `vatId`
    - type: text
    - label: Vat ID
    - visible in form, visible in datagrid
  - field `companyName`
    - internal name for scripting: `companyName`
    - type: text
    - label: Company
    - visible in form, visible in datagrid
- Fill first table with some data
- Create any other table (eg. `order`) with two more fields connected into primary table:
  - field `orderId`
    - internal name for scripting: `orderId`
    - type: text
    - label: Order ID
    - visible in form, visible in datagrid
  - field `priceTotal`
    - internal name for scripting: `priceTotal`
    - type: float
    - label: Total Price
    - visible in form, visible in datagrid

### 3. a) Create Autocomplete As Table Field
- Edit `order` table structure and add fields:
  - field `company`
    - internal name for scripting: `company`
    - type: `Link to table`
      - to table `company` with columns `vatId` and `companyName`
      - link type Many Orders to single Company
    - label: `Company`
    - not visible in form, visible in datagrid
  - field `companyAutoComplete`
    - internal name for scripting: `companyAutoComplete`
    - type: `Free HTML`
    - label: `Company`
    - visible in form, not visible in datagrid)
    - HTML definition: `<input id="{{TBD-RANDOM-ID}}-company-autocomplete" type="text" class="form-control" />`
    - Typescript initialization:
      ```ts
      (async (doo: IDoo) => { // do not change this line
          // place your code here
          
          var value = '', 
              text = '';
          if (doo.model.company.value != null) {
              value = doo.model.company.value.companyName;
              text = `${doo.model.company.value.companyName} (${doo.model.company.value.vatId})`;
          }

          var autocomplete = doo.tableAutoComplete.Create<IDooApiTableCompany>({
              selector: '#TBD-RANDOM-ID-company-autocomplete',
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

          autocomplete.AddEventListener('change', e => {
              // set company name into real company select, not visible in form
              doo.model.company.setValue(e.GetOptionAfter().value);
          });
          
      }) // do not change this line
      ```
    - click `Save` and try to add some records with autocompleted companies:-)

### 3. b) Create Autocomplete In Dashboard And Free HTML Widget
- Create empty dashbaord
- Add Free HTML widget to new empty dashbaord
- Fill widget definition with:
  - HTML code
    - `<div style="position:relative;"><input id="{{TBD-RANDOM-ID}}-company-autocomplete" type="text" class="form-control" /></div>`
  - TypeScript:
    ```ts
    (async (doo: IDoo) => { // do not change this line
        // place your code here
        
        var value = '', 
            text = '';
        if (doo.model.company.value != null) {
            value = doo.model.company.value.companyName;
            text = `${doo.model.company.value.companyName} (${doo.model.company.value.vatId})`;
        }

        var autocomplete = doo.tableAutoComplete.Create<IDooApiTableCompany>({
            selector: '#TBD-RANDOM-ID-company-autocomplete',
            tableName: 'company',
            customValue: true,
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
            requester: async (value: string, startsWith: boolean): Promise<ITableAutoCompleteOption<IDooApiTableCompany>[]> => {
              var options = new Map<string, ITableAutoCompleteOption<IDooApiTableCompany>>();
              var vatId: string;
              var response = await doo.table.getData<IDooApiTableCompany>('Company', <IDooGetDataOptionCompany>{
                filter: [{
                  field: 'companyName',
                  operator: startsWith ? 'startswith' : 'contains',
                  value: value
                }],
                limit: 20,
                sort: 'companyName(asc)'
              });
                    console.log([value, startsWith, response.data]);
              for (var item of response.data) {
                if (item.fields.vatId == null) continue;
                vatId = String(item.fields.vatId).trim();
                if (options.has(vatId) || vatId.length === 0) continue;
                item.fields.vatId = vatId;
                options.set(vatId, {
                  text: `${item.fields.companyName} (${item.fields.vatId})`,
                  value: vatId,
                  fields: item.fields
                });
              }
              return Array.from(options.values());
            },
            textRenderer: option => {
                if (option.fields != null) {
                    return `${option.fields.companyName} (${option.fields.vatId})`;
                } else {
                    return option.text;
                }
            }
        });

        autocomplete.AddEventListener('change', e => {
            // set company name into real company select, not visible in form
            doo.model.company.setValue(e.GetOptionAfter().value);
        });
        
    }) // do not change this line
    ```
  - click `Save` and try to add some records with autocompleted companies:-)

## How to develop:
- `npm update`
- call `tsc -w`
- view result on url: `https://localhost/tabidoo-autocomplete/`
- develop file `./src/tableAutoComplete.ts` or alternatively `./src/run.ts`
- get result TypeScript code for Tabidoo from:
  - path `./src/IDomHelpers.ts`
  - and from url `https://localhost/tabidoo-autocomplete/js/build/tableAutoComplete.php`
- get TypeScript interfaces for Tabidoo from:
  - file `./src/IDomHelpers.ts`
  - file `./types/ITableAutocomplete.d.ts`
