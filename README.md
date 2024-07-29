# Tabidoo Autocomplete

[![Latest Stable Version](https://img.shields.io/badge/Stable-v0.0.1-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/tabidoo-autocomplete/releases)
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
- Add `Scripting Extensions` plug-in into your Tabidoo application edit
- Add new extended script
  - Name: `Tabidoo Autocomplete`
  - Property name: `tabidooAutocomplete`
  - Interface: `ITabidooAutocomplete`
  - d.ts: [copy/paste content from file: `./types/ITableAutocomplete.d.ts`]
  - Script: [copy/pase generated content from url: `https://localhost/tabidoo-autocomplete/js/build/tableAutocomplete.php`]
  - Click to `Save` button
- Create primary data table `company` with two columns:
  - field `vatId`
    - internal name for scripting: `vatId`
    - type: text
    - label: Vat ID
    - visible in form, visible in datagrid
  - field `companyName`
    - internal name for scripting: `companyName`
    - type: FreeHTML
    - label: Company
    - visible in form, visible in datagrid
- Fill first table with some data
- Create any other table (eg. `orders`) with two more fields connected into primary table:
  - field `company`
    - internal name for scripting: `company`
    - type: `Link to table` - to table `company` with columns `vatId` and `companyName`
    - label: `Company`
    - not visible in form, visible in datagrid
  - field `companyAutocomplete`
    - internal name for scripting: `companyAutocomplete`
    - type: `Free HTML`
    - label: `Company`
    - visible in form, not visible in datagrid)
    - HTML definition: `<input type="text" class="tabidoo-autocomplete-company form-control" />`
    - Typescript initialization:
      ```ts
      (async (doo: IDoo) => { // do not change this line
      
          var value = '', 
              text = '';
          if (doo.model.firma.value != null) {
              value = doo.model.company.value.companyName;
              text = `${doo.model.company.value.companyName} (${doo.model.firma.value.vatId})`;
          }
      
          var autocomplete = doo.tabidooAutocomplete.CreateInstance<IDooApiTableCompany>({
              selector: 'input.tabidoo-autocomplete-company',
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

## How to develop:
- `npm update`
- call `tsc -w`
- view result on url: `https://localhost/tabidoo-autocomplete/`
- develop file `./src/tableAutocomplete.ts` or alternatively `./src/run.ts`
