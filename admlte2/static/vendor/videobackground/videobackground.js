(function ($) {
    //add the videBackground function to the jQuery library
    $.fn.videoBackground = function(video, options) {
        var that = this;
        if(typeof options === 'undefined') options = {};

        //check and see if options were passed
        var settings = {};
        settings.autoplay = typeof options.autoplay !== 'undefined' ? options.autoplay : 'autoplay';
        settings.muted = typeof options.muted !== 'undefined' ? options.muted : true;
        settings.loop = typeof options.loop !== 'undefined' ? options.loop : 'loop';
        settings.fit = typeof options.fit !== 'undefined' ? options.fit : 'fill';
        settings.src = typeof options.src !== 'undefined' ? options.src : video;

        //append a video tag to the target element
        that.append($('<video>')
            .prop({'autoplay': settings.autoplay, 'muted': settings.muted, 'loop': settings.loop, 'src': settings.src})
            .css({'height': '100%', 'width': '100%', 'object-fit': settings.fit, 'overflow': 'hidden', 'position': 'absolute'}));

        //sets the initial video size
        resizeVideo(that);

        //updates the sizing as the window size changes
        $(window).on('resize', function(e) {
            that.css({'width': '100%', 'height': '100%'});
            resizeVideo(that);
        });

        //function to adjust the video size as needed
        function resizeVideo(vidElement) {
            vidElement.height(vidElement.height());
            vidElement.width(vidElement.width())
        }
    }
}(jQuery));