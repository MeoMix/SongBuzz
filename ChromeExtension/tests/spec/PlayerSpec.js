define(['player'], function(player){
  describe(
    "The player", function(){

      it("should exist", function(){
        expect(YoutubePlayer).not.toEqual(null);
      });

      it("should have a playlist loaded", function(){
        expect(YoutubePlayer.playlistTitle).toBeDefined();
        expect(YoutubePlayer.playlistTitle).not.toEqual('');
      });

    });
});