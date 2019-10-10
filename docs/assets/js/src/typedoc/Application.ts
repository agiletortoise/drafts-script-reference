/// <reference types='backbone' />
/// <reference types='underscore' />
/// <reference types='jquery' />

declare namespace typedoc
{
    export interface Events extends Backbone.Events {
        new (): Events
    }
    export var Events: Backbone.Events & { new (): Backbone.Events };
}

namespace typedoc
{
    export var $html = $('html');


    /**
     * Service definition.
     */
    export interface IService
    {
        constructor:any;
        name:string;
        instance:any;
        priority:number;
    }


    /**
     * Component definition.
     */
    export interface IComponent
    {
        constructor:any;
        selector:string;
        priority:number;
        namespace:string;
    }


    /**
     * List of all known services.
     */
    var services:IService[] = [];

    /**
     * List of all known components.
     */
    var components:IComponent[] = [];

    /**
     * jQuery instance of the document.
     */
    export var $document = $(document);

    /**
     * jQuery instance of the window.
     */
    export var $window = $(window);

    /**
     * jQuery instance of the window.
     */
    export var $body = $('body');


    /**
     * Register a new component.
     */
    export function registerService(constructor:any, name:string, priority:number = 0) {
        services.push({
            constructor: constructor,
            name:        name,
            priority:    priority,
            instance:    null
        });

        services.sort((a:IService, b:IService) => a.priority - b.priority);
    }


    /**
     * Register a new component.
     */
    export function registerComponent(constructor:any, selector:string, priority:number = 0, namespace:string = '*')
    {
        components.push({
            selector:    selector,
            constructor: constructor,
            priority:    priority,
            namespace:   namespace
        });

        components.sort((a:IComponent, b:IComponent) => a.priority - b.priority);
    }


    /**
     * Copy Backbone.Events to TypeScript class.
     */
    if (typeof Backbone != 'undefined') {
        typedoc.Events = function () {} as any;
        _.extend(typedoc.Events.prototype, Backbone.Events);
    }


    /**
     * TypeDoc application class.
     */
    export class Application extends Events
    {
        /**
         * Create a new Application instance.
         */
        constructor() {
            super();

            this.createServices();
            this.createComponents($body);
        }


        /**
         * Create all services.
         */
        private createServices() {
            _(services).forEach((c) => {
                c.instance = new c.constructor();
                (typedoc as any)[c.name] = c.instance;
            });
        }


        /**
         * Create all components beneath the given jQuery element.
         */
        public createComponents($context:JQuery, namespace:string = 'default'):Backbone.View<any>[] {
            var result: any[] = [];
            _(components).forEach((c) => {
                if (c.namespace != namespace && c.namespace != '*') {
                    return;
                }

                $context.find(c.selector).each((m:number, el: Element) => {
                    var $el = $(el), instance;
                    if (instance = $el.data('component')) {
                        if (_(result).indexOf(instance) == -1) {
                            result.push(instance);
                        }
                    } else {
                        instance = new c.constructor({el:el});
                        $el.data('component', instance);
                        result.push(instance);
                    }
                });
            });

            return result;
        }
    }
}
