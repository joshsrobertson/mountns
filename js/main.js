// hide on phones
if (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
    document.getElementById('SlideIntro').style.display = 'none';
};

$(document).ready(function() {
    // grab audio track
    mainTrack = document.getElementById('heylove');

    // add event listeners
    $('#start').on('click', playAndStart);
    $('#heylove').on('play', startAutoplay).on('pause', stopAutoplay);
    $(window).on('scroll resize', checkScroll);
});

var audioChanges = [0, 22, 43, 55, 76, 95, 109, 122, 142, 155, 170, 185, 200, 215];
var changesLength = audioChanges.length;
var autoPlay = true;
var lastMarker = 0;
var time = 0;
var trackListener, mainTrack;

function stopAutoplay() {
    mainTrack.pause();
    mainTrack.currentTime = 0;
    time = 0;
    lastMarker = 0;
    scrollToSlide('Intro');
}

function playAndStart() {
    mainTrack.play();
    startAutoplay();
}

function startAutoplay() {
    console.log('got here');

    scrollToSlide(0);

    clearInterval(trackListener);

    trackListener = setInterval(function() {
        time += 0.1;
        var currentMarker;
        audioChanges.forEach(function(change, i) {
            if (time > audioChanges[i] && (i <= changesLength || time < audioChanges[i + 1])) {
                currentMarker = i;
            }
        });

        // reset at the end
        if (time > 246) {
            currentMarker = 0;
            time = 0;
        }

        console.log('you are currently at position ' + currentMarker);
        if (currentMarker !== lastMarker) {
            lastMarker = currentMarker;
            if (!currentlyAutoScrolling) {
                scrollToSlide(currentMarker);
            }
        }
    }, 100);
}

var currentlyAutoScrolling = false;

function scrollToSlide(n) {
    //console.log('scrolling to ' + n);
    currentlyAutoScrolling = true;
    $("body, html").stop().animate({ 
      scrollTop: $('#Slide' + n).offset().top 
    }, 600, function() {
        setTimeout(function() {    
            currentlyAutoScrolling = false;
        }, 200);
    });
}

function seekAudio(i) {
    // set the current time
    time = audioChanges[i];

    // seek if not auto scrolling
    if (!currentlyAutoScrolling) {
        //console.log('did set audio currentTime', time);
        mainTrack.currentTime = audioChanges[i];
    } else {
        //console.log('did not set audio because currently auto scrolling');
    }
}

// Video Scroll 
var videos = document.getElementsByTagName("video");
var lastScrollTop = window.pageYOffset;
var isScrollingUp = false;

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
        isScrollingUp = lastScrollTop > scrollTop;

        lastScrollTop = scrollTop;

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

