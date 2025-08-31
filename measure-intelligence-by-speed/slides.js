// More info about initialization & config:
// - https://revealjs.com/initialization/
// - https://revealjs.com/config/
Reveal.initialize({
    hash: true,

    // Set presentation resolution
    width: 1920,
    height: 1080,

    // Display presentation control arrows
    controls: false,

    // Display slide number to false
    // Add my own element under <slides>
    slideNumber: false,

    // Display a presentation progress bar
    progress: false,

    // Transition style
    transition: 'slide', // none/fade/slide/convex/concave/zoom

    // Transition speed
    transitionSpeed: 'default', // default/fast/slow

    // Learn about plugins: https://revealjs.com/plugins/
    plugins: [RevealHighlight, RevealNotes, RevealMath.KaTeX]
});

var current_slide = 0;

Reveal.on('slidechanged', event => {
    // Changing slide number.
    current_slide = event.currentSlide;
    var element = document.getElementsByClassName('my-slide-number')[0];
    element.innerHTML = Reveal.getIndices(event.currentSlide).h + 1;
});

var progress_indices = {
    "tensorflow": 0,
    "chrome": 0,
    "android": 0,
    "python-percentage": 0,
};
var progress_values = [26.91, 48.41, 92.61];

Reveal.on('fragmentshown', event => {
    progress_index = ++progress_indices[current_slide.id];
    if (current_slide.id == "chrome" && progress_index == 2) {
        setTimeout(Reveal.next, 300);
        setTimeout(Reveal.next, 300);
    }
    if (current_slide.id == "android" && progress_index == 1) {
        setTimeout(Reveal.next, 300);
        setTimeout(Reveal.next, 300);
    }
    if (current_slide.id == "python-percentage") {
        value = progress_values[progress_index]
        document.getElementById("progress-bar").style.width = value + "%";
        document.getElementById("counter").style.setProperty("--percent", value);
    }
});

Reveal.on('fragmenthidden', event => {
    progress_index = --progress_indices[current_slide.id];
    if (progress_index < 0) {
        progress_index = progress_indices[current_slide.id] = 0;
    }

    if (current_slide.id == "chrome" && progress_index == 0) {
        setTimeout(Reveal.prev, 300);
        setTimeout(Reveal.prev, 300);
    }
    if (current_slide.id == "tensorflow" && progress_index == 0) {
        setTimeout(Reveal.prev, 300);
        setTimeout(Reveal.prev, 300);
    }
    if (current_slide.id == "python-percentage") {
        value = progress_values[progress_index]
        document.getElementById("progress-bar").style.width = value + "%";
        document.getElementById("counter").style.setProperty("--percent", value);
    }
});
