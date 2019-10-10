namespace typedoc {
    function getVendorInfo(tuples: {[key: string]: string}) {
        for (var name in tuples) {
            if (!tuples.hasOwnProperty(name))
                continue;
            if (typeof ((document.body.style as any)[name]) !== 'undefined') {
                return { name: name, endEvent: tuples[name] };
            }
        }
        return null;
    }


    export var transition = getVendorInfo({
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'msTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    });


    export function noTransition($el: JQuery, callback: () => void) {
        $el.addClass('no-transition');
        callback();
        $el.offset();
        $el.removeClass('no-transition');
    }


    export function animateHeight($el: JQuery, callback:Function, success?:Function) {
        let from = $el.height() || 0;
        let to = from;
        noTransition($el, function () {
            callback();

            $el.css('height', '');
            to = $el.height() || 0;
            if (from != to && transition) $el.css('height', from);
        });

        if (from != to && transition) {
            $el.css('height', to);
            $el.on(transition.endEvent, function () {
                noTransition($el, function () {
                    $el.off(transition!.endEvent).css('height', '');
                    if (success) success();
                });
            });
        } else {
            if (success) success();
        }
    }
}
