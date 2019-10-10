/// <reference types='jquery' />
/// <reference types='backbone' />
/// <reference path='../Application.ts' />
/// <reference path='../utils/pointer.ts' />

namespace typedoc
{
    abstract class FilterItem<T>
    {
        protected key:string;

        protected value:T;

        protected defaultValue:T;


        constructor(key:string, value:T) {
            this.key = key;
            this.value = value;
            this.defaultValue = value;

            this.initialize();

            if (window.localStorage[this.key]) {
                this.setValue(this.fromLocalStorage(window.localStorage[this.key]));
            }
        }


        protected initialize() {}


        protected abstract handleValueChange(oldValue:T, newValue:T): void;

        protected abstract fromLocalStorage(value: string): T;

        protected abstract toLocalStorage(value: T): string;


        protected setValue(value:T) {
            if (this.value == value) return;

            var oldValue = this.value;
            this.value = value;
            window.localStorage[this.key] = this.toLocalStorage(value);

            this.handleValueChange(oldValue, value);
        }
    }


    class FilterItemCheckbox extends FilterItem<boolean>
    {
        private $checkbox!:JQuery;


        protected initialize() {
            this.$checkbox = $('#tsd-filter-' + this.key);
            this.$checkbox.on('change', () => {
                this.setValue(this.$checkbox.prop('checked'));
            });
        }


        protected handleValueChange(oldValue:boolean, newValue:boolean) {
            this.$checkbox.prop('checked', this.value);
            $html.toggleClass('toggle-' + this.key, this.value != this.defaultValue);
        }


        protected fromLocalStorage(value:string):boolean {
            return value == 'true';
        }


        protected toLocalStorage(value:boolean):string {
            return value ? 'true' : 'false';
        }
    }


    class FilterItemSelect extends FilterItem<string>
    {
        private $select!:JQuery;


        protected initialize() {
            $html.addClass('toggle-' + this.key + this.value);

            this.$select = $('#tsd-filter-' + this.key);
            this.$select.on(pointerDown + ' mouseover', () => {
                this.$select.addClass('active');
            }).on('mouseleave', () => {
                this.$select.removeClass('active');
            }).on(pointerUp, 'li', (e) => {
                this.$select.removeClass('active');
                this.setValue(($(e.target).attr('data-value') || '').toString());
            });

            $document.on(pointerDown, (e) => {
                var $path = $(e.target).parents().addBack();
                if ($path.is(this.$select)) return;

                this.$select.removeClass('active');
            });
        }


        protected handleValueChange(oldValue:string, newValue:string) {
            this.$select.find('li.selected').removeClass('selected');
            this.$select.find('.tsd-select-label').text(
                this.$select.find('li[data-value="' + newValue + '"]').addClass('selected').text());

            $html.removeClass('toggle-' + oldValue);
            $html.addClass('toggle-' + newValue);
        }

        protected fromLocalStorage(value: string): string {
            return value;
        }

        protected toLocalStorage(value: string): string {
            return value;
        }
    }


    class Filter extends Backbone.View<any>
    {
        private optionVisibility:FilterItemSelect;

        private optionInherited:FilterItemCheckbox;

        private optionOnlyExported:FilterItemCheckbox;

        private optionExternals:FilterItemCheckbox;


        constructor(options?:Backbone.ViewOptions<any>) {
            super(options);

            this.optionVisibility   = new FilterItemSelect('visibility',      'private');
            this.optionInherited    = new FilterItemCheckbox('inherited',     true);
            this.optionExternals    = new FilterItemCheckbox('externals',     true);
            this.optionOnlyExported = new FilterItemCheckbox('only-exported', false);
        }


        static isSupported():boolean {
            try {
                return typeof window.localStorage != 'undefined';
            } catch (e) {
                return false;
            }
        }
    }


    if (Filter.isSupported()) {
        registerComponent(Filter, '#tsd-filter');
    } else {
        $html.addClass('no-filter');
    }
}
