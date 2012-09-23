describe("Player", function() {
  var Player = null;

  beforeEach(function() {    
    Player = YoutubePlayer;
  });

  it("should exist", function(){
    expect(Player).not.toEqual(null);
  });

  it("should have a playlist loaded", function(){
    expect(Player.playlistTitle).toBeDefined();
    expect(Player.playlistTitle).not.toEqual('');
  });

  
});