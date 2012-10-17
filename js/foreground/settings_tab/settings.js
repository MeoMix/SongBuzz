define(function(){
    'use strict';
    var enableRadioModeCheckBox = $('#EnableRadioModeCheckBox');

    var isRadioModeEnabled = JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false;
    enableRadioModeCheckBox.prop('checked', isRadioModeEnabled);

    enableRadioModeCheckBox.change(function(){
    	localStorage.setItem('isRadioModeEnabled', this.checked);
    });
});