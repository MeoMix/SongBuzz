//TODO: This isn't really implemented yet. Don't worry about it.
function Settings() {
    "use strict";
    var exploreCheckBox = $('#ExploreCheckBox');
    var settingsDialogSelector = $('#SettingsDialog');

    var save = function () {
        Player.setExploreEnabled(exploreCheckBox.prop('checked'));
    };

    var buildDialog = function () {
        var dialog = settingsDialogSelector.dialog({
            autoOpen: false,
            buttons: [
                {
                    text: "Ok",
                    click: function () {
                        save();
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Cancel",
                    click: function () { $(this).dialog("close"); }
                }],
            open: function () {
                exploreCheckBox.prop('checked', Player.getExploreEnabled());
            }
        });

        return dialog;
    }

    var settingsDialog = buildDialog(settingsDialogSelector);
    $('#Settings').on('click', function () { settingsDialog.dialog('open'); });
}