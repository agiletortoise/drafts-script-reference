/// <reference types='underscore' />
/// <reference path='../Application.ts' />

namespace typedoc
{
    /**
     * A global service that monitors the window size and scroll position.
     */
    export class Viewport extends Events
    {
        /**
         * The current scroll position.
         */
        scrollTop:number = 0;

        /**
         * The width of the window.
         */
        width:number = 0;

        /**
         * The height of the window.
         */
        height:number = 0;


        /**
         * Create new Viewport instance.
         */
        constructor() {
            super();
            $window.on('scroll', _.throttle(() => this.onScroll(), 10))
            $window.on('resize', _.throttle(() => this.onResize(), 10));

            this.onResize();
            this.onScroll();
        }


        /**
         * Trigger a resize event.
         */
        triggerResize() {
            this.trigger('resize', this.width, this.height);
        }


        /**
         * Triggered when the size of the window has changed.
         */
        onResize() {
            this.width = $window.width() || 0;
            this.height = $window.height() || 0;
            this.trigger('resize', this.width, this.height);
        }


        /**
         * Triggered when the user scrolled the viewport.
         */
        onScroll() {
            this.scrollTop = $window.scrollTop() || 0;
            this.trigger('scroll', this.scrollTop);
        }
    }


    /**
     * Register service.
     */
    export var viewport:Viewport;
    registerService(Viewport, 'viewport');
}
