Slider = {
    //A generic creator for slider elements.
    buildSlider:  function (selector, callback) {
        var element = $(selector);

        var onChange = function (event, ui) {
            callback(event, ui.value);
        }

        element.slider({
            orientation: 'vertical',
            max: 100,
            min: 0,
            slide: onChange,
            change: onChange
        });
   
        return element;
    }
}

