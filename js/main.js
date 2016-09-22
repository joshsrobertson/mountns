// hide on phones
if (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
    document.getElementById('mybox').style.display = 'none';
};

$(document).ready(function() {
    // grab audio track
    mainTrack = document.getElementById('heylove');

    // add event listeners
    $('#start').on('click', startAutoplay);
    $(window).on('scroll resize', checkScroll);
});

var audioChanges = [0, 22, 43, 55, 76, 95, 109, 122, 142, 155, 170, 185, 200, 215];
var changesLength = audioChanges.length;
var autoPlay = true;
var lastMarker = 0;
var time = 0;
var trackListener, mainTrack;

function startAutoplay() {
    mainTrack.play();

    trackListener = setInterval(function() {
        time += 0.1;
        var currentMarker;
        audioChanges.forEach(function(change, i) {
            if (time > audioChanges[i] && (i <= changesLength || time < audioChanges[i + 1])) {
                currentMarker = i;
            }
        });
        console.log('you are currently at position ' + currentMarker);
        if (currentMarker !== lastMarker) {
            lastMarker = currentMarker;
            scrollToSlide(currentMarker);
        }
    }, 100);
}

var currentlyScrolling = false;

function scrollToSlide(n) {
    console.log('scrolling to ' + n);
    currentlyScrolling = true;
    $("body, html").animate({ 
      scrollTop: $('#Slide' + n).offset().top 
    }, 600, function() { // complete
        
        setTimeout(function() {    
            currentlyScrolling = false;
        },400);
    });
}

function seekAudio(i) {
    // set the current time
    time = audioChanges[i];

    // seek if not auto scrolling
    if (!currentlyScrolling) {
        console.log('did set audio currentTime', time);
        mainTrack.currentTime = audioChanges[i];
    } else {
        console.log('did not set audio because currently auto scrolling');
    }
}


// Video Scroll 
var videos = document.getElementsByTagName("video");

function checkScroll() {
    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
 
        var top = video.offsetTop;
        var height = video.offsetHeight;
        var bottom = top + height;

        var scrollTop = window.pageYOffset;
        var windowHeight = window.innerHeight;
        var windowBottom = scrollTop + windowHeight;

        var isVisible = windowBottom >= top && bottom >= scrollTop;

        // play or pause video
        if (isVisible && video.paused) {
            video.play();
            seekAudio(i);
        }

        if (!isVisible && !video.paused) {
            video.pause();
        }
    }
}
