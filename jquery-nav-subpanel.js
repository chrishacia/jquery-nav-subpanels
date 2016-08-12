(function(){
    'use strict'

    // @nav-parent element used to matching the sub-panels width with the main navigation
    // as well as used for aligning the top of the subpanel container with the bottom of the
    // navigation
    let $el = $('.nav-parent');

    // @nav-point element used for triggering mouse-out/over event
    let $np = $('.nav-point');

    // @sub-panel element that will load the content for the nav-point based on its data-subpanel value
    let $sp = $('.sub-panel');

    // @sub-panel-content is the element containg the html to be loaded into sub-panel
    // in conjunction with spc-*, where * is the value used in the nav-point data-subpanel
    let subpanel = 'sub-panel-content';
    let panelPrefix = 'spc-';

    // getting nav-parent position and dimensions relevant to making sure it is loaded
    // where we want it to be when seen (right below the nav)
    let navLeft = $el.position().left;
    let navRight = ($(window).width() - ($el.offset().left + $el.outerWidth()));
    let navBottom = $el.position().top + $el.outerHeight(true);
    let lastPanel = null;

    // trying to keep the HTML contained post DOM load
    let spcContainer = [];
    $('.' + subpanel).each(function(){
        spcContainer.push({
            classStr: $(this).attr('class').replace(/\s|sub-panel-content/ig, ''),
            theHTML: $(this).html()
        });
    })

    // timer used to allow a momentary lapse between mouseover events
    // of the two elements to keep the subpanel open if its open.
    let closeTimer = null;
    function startCloseOutCountDown () {
        closeTimer = setTimeout(function() {
            $sp.hide();
            lastPanel = null;
        }, 500);
    }

    function killCloseOutCountDown() {
        clearTimeout(closeTimer);
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // sp
    $sp.css({
        top: navBottom + 'px',
        left: navLeft + 'px',
        right: navRight + 'px'
    });

    // np
    $np.on('mouseover', function(e) {
        // prevents subpanel from displaying since there isn't one.
        if(!$(this).attr('data-subpanel')) { return; }
        killCloseOutCountDown();

        let panel = panelPrefix + $(this).attr('data-subpanel');
        lastPanel = panel;
        $.each(spcContainer, function(k, obj) {
            if(obj.classStr === panel) {
                $sp.html(
                    obj.theHTML
                ).show();
            }
        })
    })

    $np.on('mouseout', function(e) {
        if($sp.is(':visible')) {
            startCloseOutCountDown();
        }
    });

    // sp
    $sp.on('mouseover', function(e) {
        if($sp.is(':visible')) {
            killCloseOutCountDown();
        }
    });

    $sp.on('mouseout', function(e) {
        if($sp.is(':visible')) {
            startCloseOutCountDown();
        }
    });

    // go back to parent panel
    $(document).on('click', '.sub-panel-back', function(e) {
        e.preventDefault();
        $.each(spcContainer, function(k, obj) {
            if(obj.classStr === lastPanel) {
                $sp.html(obj.theHTML).show();
            }
        })
    });



    // this element if it contains the class ignore-href will not treat the link
    // like a link, it will assume there is a secondary panel to flow into
    $(document).on('click', '.sub-panel-group-item-segment', function(e) {
        // if the overriding class doesn't exist, the the link flow organically
        console.log($(this).hasClass('ignore-href'));
        if(!$(this).hasClass('ignore-href')){return;}
        e.preventDefault();

        // find slider segment id

        // matches all but the number of the .segment-slider-* class to replace with empty string
        // leaving only the number. (or whatever isn't matched otherwise.)
        let segRegexPatt = /sub-panel-group-item-segment|segment-slider-|ignore-href|\s/gi;
        // what was left behind is not a numeric value end.

        let segId = $(this).attr('class').replace(segRegexPatt, '');

        if(!isNumeric(segId)){return;}

        let newHTML = '<a href="#back" class="sub-panel-back"> Back </a><br  />';
        if($('.slider-'+segId).size() <= 0) {
            newHTML += 'Empty or Missing Slider Panel'
        } else {
            newHTML += $('.slider-'+segId).html();
        }

        $sp.html(newHTML);

        // trigger your sliders initializer here..
        // $('.myslide').slider()
        // if you have them numbered you can use segId to
        // sync that up
        // $('.myslide'+segId).slider()

    });

})();
