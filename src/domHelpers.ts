/**
 * Order:           1
 * Property name:   domHelpers
 * Name:            DOM Helpers, Filtering Types
 * Interface:       IDomHelpers
 */
var domHelpersFactory = (async (doo: IDoo): Promise<IDomHelpers> => {
	//#region DOM helpers
    var _uniqueStrs: Set<string> = new Set<string>();
    const WHITESPACE_CHARS = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    const WHITESPACE_REGEXP = /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g;
    return <IDomHelpers>{
        GetUtcDate (): Date {
            var date = new Date();
            return new Date(Date.UTC(
                date.getUTCFullYear(), 
                date.getUTCMonth(), 
                date.getUTCDate(), 
                date.getUTCHours(), 
                date.getUTCMinutes(), 
                date.getUTCSeconds()
            ));
        },
        GetById <TElement extends HTMLElement>(elementId: string, doc: Document = null): TElement {
            return (doc ?? document).getElementById(elementId) as TElement;
        },
        QuerySelector <TElement extends HTMLElement>(selectors: string, cont: HTMLElement = null): TElement {
            return (cont ?? document).querySelector(selectors);
        },
        QuerySelectorAll <TElement extends HTMLElement>(selectors: string, cont: HTMLElement = null): TElement[] {
            return Array.from(
                (cont ?? document).querySelectorAll(selectors)
            );
        },
        HasClass (elm: HTMLElement, cssClass: string): boolean {
            return String(
                ' ' + elm.className.replace(/\s{2,}/g, ' ').trim() + ' '
            ).indexOf(' ' + cssClass + ' ') != -1;
        },
        RemoveClass (elm: HTMLElement, cssClass: string): HTMLElement {
            var rg = new RegExp(' ' + cssClass + ' ', 'gi');
            elm.className = String(
                    ' ' + 
                    elm.className.replace(/\s{2,}/g, ' ').trim() + 
                    ' '
                )
                .replace(rg, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();
            return elm;
        },
        AddClass (elm: HTMLElement, cssClass: string): HTMLElement {
            var className = elm.className.replace(/\s{2,}/g, ' ').trim();
            var classes = className.split(' ');
            var classCatched = false;
            for (var c = 0, d = classes.length; c < d; c += 1) {
                if (classes[c] == cssClass) {
                    classCatched = true;
                    break;
                }
            };
            if (!classCatched) 
                elm.className = className + ' ' + cssClass;
            return elm;
        },
        SetAttrs (elm: HTMLElement, attrs: object): HTMLElement {
            for (var name in attrs)
                elm.setAttribute(name, attrs[name]);
            return elm;
        },
        SetStyles (elm: HTMLElement, styles: object): HTMLElement {
            var style = elm.style;
            for (var name in styles)
                style[name] = styles[name];
            return elm;
        },
        GetStyle (elm: HTMLElement, cssPropName: string, asNumber: boolean = false): string | null {
            return elm.ownerDocument.defaultView.getComputedStyle(elm, '').getPropertyValue(cssPropName);
        },
        GetStyleAlt<TResult extends (string | number)>(elm: HTMLElement, cssPropName: string, asNumber: boolean = true): TResult | null {
            var result = this.GetStyle(elm, cssPropName, asNumber);
            if (result != null && asNumber) 
                return parseInt(result, 10) as any;
            return result as any;
        },
        /** @summary Get unique or nonunique random string. */
        GetRandomString (length: number, unique: boolean = false): string {
            var result = '',
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                charsLength = chars.length;
            while (true) {
                for (var i = 0; i < length; i++)
                    result += chars.charAt(Math.floor(Math.random() * charsLength));
                if (unique) {
                    if (!_uniqueStrs.has(result)) {
                        _uniqueStrs.add(result);
                        break;
                    }
                } else {
                    break;
                }
            }
            return result;
        },
        GetPageSizes (currentElm: HTMLElement): {PageXStart: number, PageYStart: number, PageXEnd: number, PageYEnd: number} {
            var current = currentElm,
                left = 0,
                top = 0,
                lefts = [currentElm.offsetLeft],
                tops = [currentElm.offsetTop];
            while (true) {
                if (current.offsetParent == null) break;
                current = current.offsetParent as HTMLElement;
                lefts.push(current.offsetLeft);
                tops.push(current.offsetTop);
            }
            lefts = lefts.reverse();
            tops = tops.reverse();
            lefts.map(n => {
                left += n;
            });
            tops.map(n => {
                top += n;
            });
            return {
                PageXStart: left,
                PageYStart: top,
                PageXEnd: left + currentElm.offsetWidth,
                PageYEnd: top + currentElm.offsetHeight
            }
        },
        Round (n: number, digits?: number): number {
            var negative: boolean = false,
                multiplicator: number;
            if (digits == null)
                digits = 0;
            multiplicator = Math.pow(10, digits);
            if (n < 0) {
                negative = true;
                n = n * -1;
            }
            n = parseFloat((n * multiplicator).toFixed(11));
            n = parseFloat((Math.round(n) / multiplicator).toFixed(digits));
            if (negative) {
                n = parseFloat((n * -1).toFixed(digits));
            }
            return n;
        },
        ParseFloatSafe (strVal: string | null): number | null {
            var safeStr = strVal != null ? String(strVal).trim() : '';
            if (safeStr.length == 0) return null;
            var floatVal = parseFloat(safeStr);
            if (Number.isNaN(floatVal) || !Number.isFinite(floatVal)) return null;
            return floatVal;
        },
        ParseIntSafe (strVal: string | null, radix: number = 10): number | null {
            var safeStr = strVal != null ? String(strVal).trim() : '';
            if (safeStr.length == 0) return null;
            var intVal = parseInt(safeStr, radix);
            if (Number.isNaN(intVal)) return null;
            return intVal;
        },
        Trim (str: string, charlist?: string): string {
            var whitespace = '',
                l = 0,
                i = 0;
            if (!charlist) {
                // default list
                whitespace = WHITESPACE_CHARS;
            } else {
                // preg_quote custom list
                charlist += '';
                whitespace = charlist.replace(WHITESPACE_REGEXP, '$1');
            }
            // from left
            for (i = 0, l = str.length; i < l; i++)
                if (whitespace.indexOf(str.charAt(i)) === -1)
                    break;
            if (i > 0)
                str = str.substring(i);
            // from right
            for (l = str.length, i = l - 1; i >= 0; i--)
                if (whitespace.indexOf(str.charAt(i)) === -1)
                    break;
            if (i < l - 1)
                str = str.substring(0, i + 1);
            return str;
        },
        SerializeModel (model: IDooModel): string {
            var modelKeys = Object.keys(doo.model),
                modelForbiddenKeys = new Set<string>([
                    '_$$warnAboutMarketRecords',
                    '_$$editProhibitedByMarket',
                    'loadedFromServer',
                    'readOnlyProperties',
                    '_$$gridValues',
                    '$$treeMetadata',
                    'afterChangeSubscriber',
                    'getAfterChangeSubscriber',
                    'afterInlineSaveSubscriber',
                    'getAfterInlineSaveSubscriber',
                    '_$$setWasCalled',
                    '_$$supressProcessAfterChange',
                    '_$$jsRunTimestamp',
                ]),
                modelSerializedItem: string,
                modelSerializedItems: string[] = [];
            for (var modelKey of modelKeys) {
                if (modelForbiddenKeys.has(modelKey)) continue;
                try {
                    modelSerializedItem = `"${modelKey}": ${JSON.stringify(doo.model[modelKey], null, "\t")}`;
                } catch (e) {
                    modelSerializedItem = `"${modelKey}": "${e.message}"`;
                }
                modelSerializedItem = modelSerializedItem.split("\n").map(s => "\t" + s).join("\n");
                modelSerializedItems.push(modelSerializedItem);
            }
            return `doo.model = {\n${modelSerializedItems.join(",\n")}\n};`;
        }
    }
    //#endregion
}); // do not change this line