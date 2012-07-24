//This is the list of playlists on the playlists tab.
function PlaylistList(playlistHeader){
    "use strict";
    var playlistList = $('#PlaylistList ul');
    var addInput = $('#PlaylistDisplay .addInput').attr('placeholder', 'Enter a playlist name');
    var addButton = $('.addButton');
    var addCancelIcon = $('.addCancelIcon');

    //Whenever the user submits a name for a new playlist create a new playlist with that name.
    addInput.keyup(function (e) {
        var code = e.which;
        //ENTER: 13
        if (code === 13){
            addPlaylist();
        }
    }).bind('paste drop', function () { return addPlaylist(); });

    var addPlaylist = function(){
        var playlistName = addInput.val();
        //Only add the playlist if a name was provided.
        if( playlistName.trim() !== ''){
            Player.addPlaylist(playlistName);
            playlistHeader.flashMessage('Thanks!', 2000);
        }
    };

    var removePlaylist = function(){
        Player.removePlaylistById($(this).attr('playlistid'));
        //Don't want the click event to bubble up after removing a playlist row.
        return false;
    };

    //Paint all the rows back to unselected state and then select the clicked row.
    //Don't allow the currently selected playlist to be removed.
    var selectRow = function(id){
        var listItems = playlistList.find('li').removeClass('current');
        var removeIcons = listItems.find('.remove').css('cursor', 'pointer').off('click').click(removePlaylist);
        removeIcons.find('svg path').attr('fill', '#000');

        var selectedListItem = $('#' + id).addClass('current');
        var selectedRemoveIcon = selectedListItem.find('.remove').css('cursor', 'default');
        selectedRemoveIcon.find('svg path').attr('fill', '#808080').off('click');

        Player.selectPlaylist(id);
    };

	return {
        //Refreshes the playlist display with the current playlist information.
        reload: function(){
            playlistList.empty();

            var playlists = Player.getPlaylists();

            //Build up each row.
            $(playlists).each(function(){
                var listItem = $('<li/>', {
                    id: this.id
                }).appendTo(playlistList);

                var link = $('<a/>', {
                    href: '#' + this.id,
                    text: this.title
                }).appendTo(listItem);

                var removeIcon = $('<div/>', {
                    'class': "remove",
                    playlistid: this.id
                }).appendTo(listItem);

                //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
                removeIcon.append('<svg><path d="M0,2 L2,0 L12,10 L10,12z"/> <path d="M12,2 L10,0 L0,10 L2,12z"/></svg>');

                if(this.selected){
                    selectRow(this.id); 
                }
            });

            //Add 'delete' to the 'X'
            playlistList.find('li .remove').click(removePlaylist);

            //Clicking on a playlist will select that playlist.
            playlistList.children().click(function(){
                selectRow(this.id);
                return false;
            });
        }
    };
}