"use strict";

class Translator {
    constructor(options = {}) {
        this._options = Object.assign({}, this.defaultConfig, options);
        this._cache = new Map();

        if (
            this._options.defaultLanguage &&
            typeof this._options.defaultLanguage == "string"
        ) {
            //this._getResource(this._options.defaultLanguage);
        }
    }

    _detectLanguage() {
        if (!this._options.detectLanguage) {
            return this._options.defaultLanguage;
        }

        let stored = localStorage.getItem("language");

        if (this._options.persist && stored) {
            return stored;
        }

        let lang = navigator.languages
            ? navigator.languages[0]
            : navigator.language;

        return lang.substr(0, 2);
    }

    _fetch(path) {
        return fetch(path)
            .then((response) => response.json())
            .catch(() => {
                console.error(
                    `Could not load ${path}. Please make sure that the file exists.`
                );
            });
    }

    async _getResource(lang) {
        if (this._cache.has(lang)) {
            return JSON.parse(this._cache.get(lang));
        }
        var t = (new Date()).getTime();//TODO remove
        var translation = await this._fetch(
            `${this._options.filesLocation}/${lang}.json?t=${t}` 
        );

        if (!this._cache.has(lang)) {
            applicationDictionary = translation;
            this._cache.set(lang, JSON.stringify(translation));
        }

        return translation;
    }

    async loadLogin() {
        await this._getResourceLogin()
    }

    async _getResourceLogin() {
        var t = (new Date()).getTime();
        var translation = await this._fetch(
            `${this._options.filesLocation}/LoginForm.json?t=${t}`
        );

        loginDictionary = translation;

        return translation;
    }

    async load(lang) {
        if (!this._options.languages.includes(lang)) {
            return;
        }

        this._translate(await this._getResource(lang), document.querySelectorAll("[data-i18n]"));

        document.documentElement.lang = lang;

        if (this._options.persist) {
            localStorage.setItem("language", lang);
        }
    }

    async translateElement(element) {
        let layout = element.getAttribute("data-i18n-layout");
        let key = element.getAttribute("data-i18n-key");
        element.innerHTML = this._parseLayout(layout, key);   

        this._translate(await this._getResource(this._options.defaultLanguage), element.querySelectorAll("[data-i18n]"));
    }

    async translateElements(elements) {
        this._replaceLayout(elements);

        this._translate(await this._getResource(this._options.defaultLanguage), elements.querySelectorAll("[data-i18n]"));
    }

    async translateById(id) {
        this._replaceLayout(document.getElementById(id));

        this._translate(await this._getResource(this._options.defaultLanguage), document.getElementById(id).querySelectorAll("[data-i18n]"));
    }

    async translateAll() {     
        let _this = this;
        this._replaceLayout(document);

        this._translate(await this._getResource(this._options.defaultLanguage), document.querySelectorAll("[data-i18n]"));

        $("#maindesktop .main-desktop").each(function () {
            let id = this.id.replace("desk_", "");
            let screenInfo = $('#desk_' + id).data('screen-info');

            if (screenInfo) {
                screenInfo = JSON.parse(screenInfo);
                var title = screenInfo.Title;
                var titleE = screenInfo.Title_E;
                if (!title && !titleE) return;
            }

            let mainTitle = new Array();
            mainTitle.push(title);

            let subTitle = new Array();
            subTitle.push(titleE);

            let elements = $('#desk_' + id + ' .form-title .billingual-wrapper');
            elements.each(function (_,element) {
                if (element.getAttribute("translate-args")) {
                    let args = JSON.parse($(element).attr("translate-args"));
                    _this.translateWithKey(element, args[0], args[1], args[2]);
                } else {
                    let key = element.getAttribute("data-i18n-key");
                    _this.translateWithKey(element, key, mainTitle, subTitle);

                    element = $('#tab_' + id + ' .billingual-wrapper')[0];
                    key = element.getAttribute("data-i18n-key");
                    _this.translateWithKey(element, key, mainTitle, subTitle); 
                }                
            });                                
        });
    }

    async translateWithKey(element, key, argument, argumentE) {
        let layout = element.getAttribute("data-i18n-layout");
        element.setAttribute("data-i18n-key", key);
        element.innerHTML = this._parseLayout(layout, key);      

        this._translate(await this._getResource(this._options.defaultLanguage), element.querySelectorAll("[data-i18n]"), argument, argumentE);
    }

    async getTranslationByKey(lang, key) {
        if (!key) throw new Error("Expected a key to translate, got nothing.");

        if (typeof key != "string")
            throw new Error(
                `Expected a string for the key parameter, got ${typeof key} instead.`
            );

        let translation = await this._getResource(lang);

        return this._getValueFromJSON(key, translation, true);
    }

    _getValueFromJSON(key, json, fallback) {
        let text = key.split(".").reduce((obj, i) => obj[i], json);

        if (!text && this._options.defaultLanguage && fallback) {
            let fallbackTranslation = JSON.parse(
                this._cache.get(this._options.defaultLanguage)
            );

            text = this._getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
            if(text != "")
            text = key;
            //console.warn(`Could not find text for attribute "${key}".`);
        }

        return text;
    }

    _translate(translation, elements, _argument, _argumentE) {
        let replace = (element) => {
            var key = element.getAttribute("data-i18n");
            var property = element.getAttribute("data-i18n-attr") || "innerHTML";
            var text = this._getValueFromJSON(key, translation, true);

            if (text) {
                if (_argument && _argumentE) {
                    if (key.endsWith(".main")) {
                        for (var i = 0; i < _argument.length; i++) {
                            text = text.replace('{' + i + '}', _argument[i]);
                        }
                    } else if (key.endsWith(".sub")) {
                        for (var i = 0; i < _argumentE.length; i++) {
                            text = text.replace('{' + i + '}', _argumentE[i]);
                        }
                    }
                }
                element[property] = text;
            } else {
                //console.error(`Could not find text for attribute "${key}".`);
            }
        };

        elements.forEach(replace);        
    }

    _parseLayout(layout, key) {
        let result = ""
        switch (layout) {
            case "layout0":
                result = i18nLayout0(key);
                break;
            case "layout1":
                result = i18nLayout1(key);
                break;
            case "layout2":
                result = i18nLayout2(key);
                break;
            case "layout3":
                result = i18nLayout3(key);
                break;
            case "layout4":
                result = i18nLayout4(key);
                break;
            case "layout5":
                result = i18nLayout5(key);
                break;
            case "layout7":
                result = i18nLayout7(key);
                break;
            case "layout8":
                result = i18nLayout8(key);
                break;
            case "layout9":
                result = i18nLayout9(key);
                break;
            case "layout10":
                result = i18nLayout10(key);
                break;
            case "layout11":
                result = i18nLayout11(key);
                break;
            default:
                break;
        }
        return result;
    }

    _replaceLayout(elements) {
        let layouts = elements.querySelectorAll("[data-i18n-layout]");
        let replace = (element) => {
            let layout = element.getAttribute("data-i18n-layout");
            let key = element.getAttribute("data-i18n-key");
            element.innerHTML = this._parseLayout(layout, key);
        };

        layouts.forEach(replace);
    }

    get defaultConfig() {
        return {
            persist: false,
            languages: [defaultLang],
            defaultLanguage: defaultLang,
            detectLanguage: true,
            filesLocation: "/i18n",
        };
    }
}

//export default Translator;
