if ('undefined' !== typeof module) {

    module.exports = function initDemo(){
        $('[data-toggle="collapse-hover"]').each(function () {
            var thisdiv = $(this).attr("data-target");
            $(thisdiv).addClass("collapse-hover");
        });

        $('[data-toggle="collapse-hover"]').hover(function(){
            var thisdiv = $(this).attr("data-target");
            if(!$(this).hasClass('state-open')){
                $(this).addClass('state-hover');
                $(thisdiv).css({
                    'height':'30px'
                });
            }

        },
        function(){
            var thisdiv = $(this).attr("data-target");
            $(this).removeClass('state-hover');

            if(!$(this).hasClass('state-open')){
                $(thisdiv).css({
                    'height':'0px'
                });
            }
        }).click(function(event){
            event.preventDefault();

            var thisdiv = $(this).attr("data-target");
            var height = $(thisdiv).children('.panel-body').height();

            if($(this).hasClass('state-open')){
                $(thisdiv).css({
                    'height':'0px',
                });
                $(this).removeClass('state-open');
            } else {
                $(thisdiv).css({
                    'height':height + 30,
                });
                $(this).addClass('state-open');
            }
        });
    }
}
