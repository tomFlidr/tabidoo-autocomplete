// Modules initialization in Tabidoo way:
var __tabidooInit = async () => {
	var modules = new Map<string, (doo: IDoo) => Promise<any>>([
		['domHelpers', domHelpersFactory],
		['tableAutoComplete', tableAutoCompleteFactory],
	]);
	var module: any;
	for (var [moduleKey, moduleFactory] of modules) {
		// Tabidoo initialization to reduce modules instances object prototype (WTF why?):
		doo[moduleKey] = {};
		module = await moduleFactory(doo);
		doo[moduleKey] = Object.assign(doo[moduleKey], module);
	}
};