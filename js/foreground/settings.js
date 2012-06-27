//TODO: This isn't really implemented yet. Don't worry about it.
function settings() {
    var _exploreCheckBox = $('#ExploreCheckBox');
    var _settingsDialogSelector = $('#SettingsDialog');

    var _save = function () {
        Player.setExploreEnabled(_exploreCheckBox.prop('checked'));
    }

    var _buildDialog = function (selector) {
        var dialog = _settingsDialogSelector.dialog({
            autoOpen: false,
            buttons: [
                {
                    text: "Ok",
                    click: function () {
                        _save();
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Cancel",
                    click: function () { $(this).dialog("close"); }
                }],
            open: function (event, ui) {
                _exploreCheckBox.prop('checked', Player.getExploreEnabled());
            },
        });

        return dialog;
    }

    var settingsDialog = _buildDialog(_settingsDialogSelector);

    $('#Settings').on('click', function () { settingsDialog.dialog('open'); });
}