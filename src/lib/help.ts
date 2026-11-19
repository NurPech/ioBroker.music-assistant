/**
 * The answer of the message "help": what the instance answers and which states an agent uses, written for an AI
 * agent (e.g. ioBroker.pi-agent, or the MCP server with `send_to`) and for script authors. Keep it in sync with
 * `onMessage` and `onStateChange` in main.ts and with objects.ts.
 */

/** The commands the instance answers. write: true if the command has an effect (none has: players are states) */
export const COMMANDS: { command: string; write: boolean }[] = [
    { command: 'help', write: false },
    { command: 'getPlayers', write: false },
    { command: 'getMedia', write: false },
];

export const HELP = `ioBroker.music-assistant: connects ioBroker to a Music Assistant server (a remote one, or one the adapter runs in
Docker) and shows its players and queues as states. An agent can tell what plays where, find music in the library
(favorites, artists, albums, tracks, playlists, radio stations, podcasts, audiobooks), play it on a player and
control a player (play, pause, next, volume, mute, power, source, shuffle, repeat) by writing its states.
Players: music-assistant.0.players.<player>; <player> = the player_id of Music Assistant with every character other
than a-z, A-Z, 0-9, _ and - replaced by _ (a hash is appended if two would be equal). getPlayers gives the names.

Commands (sendTo music-assistant.0):
- getPlayers {lang?}: the players: [{value, label}] sorted by label; value = <player>, label = the name of the
  player in Music Assistant. Reads the objects only, so it works while Music Assistant is offline.
- getMedia {list, search?, limit?, offset?}: entries of the library to play: {items: [{uri, name, subtitle, image,
  type}]}, or {error} (e.g. unknown list, not connected). list = favorites, artists, albums, tracks, playlists, radios,
  podcasts or audiobooks. search: only entries whose name contains it. limit 1-500 (default 100); offset (default 0)
  for the next page. Sorted by name; favorites = the favorites of the Music Assistant user the adapter signs in
  with, of all types (playlists, radios, albums, artists, tracks, podcasts, audiobooks, in this order).
  type = track, album, artist, playlist, radio, podcast or audiobook; subtitle = the artists (and the album of a
  track), the owner of a playlist or the publisher or authors of a podcast or audiobook; image = a thumbnail URL.
  To play an entry write its uri into players.<player>.playMedia: an album, artist or playlist plays as a whole.

States (music-assistant.0.*), write them with ack false. The adapter confirms a value with what Music Assistant
reports afterwards (a volume the player cannot take shows its real value); nothing works while info.connection is
false. Writable states of players.<player>:
- playMedia: a URI (from getMedia or Music Assistant, e.g. "library://playlist/3", or the URL of a stream) plays
  directly. Any other text is searched in all music sources: an item whose name is exactly the text wins (an
  artist before a playlist, album or track), else the best track. A prefix narrows the search: artist:, album:,
  track:, playlist:, radio:, podcast:, audiobook:, genre: (e.g. "radio:SWR3"). It replaces what the player plays
  now. Nothing found: nothing changes (only an error in the log).
- playing (true plays, false pauses); play, pause, playPause, stop, next, previous (buttons, write true).
- volume (0-100), muted, powered (true / false), shuffle (true / false), repeat (0 off, 1 all, 2 one), seek
  (position in seconds).
- source: the ID of a source to switch to (Spotify Connect, AirPlay, line in ...; the IDs and names are in
  common.states of the object); "" or the player_id = back to its own queue of Music Assistant.
Read-only states of players.<player>: name, available, state (0 pause, 1 play, 2 stop), playbackState (idle, paused,
playing), mediaTitle, mediaArtist, mediaAlbum, mediaImage (cover URL), elapsedTime and duration (seconds),
activeSource, playerId, queueId.
queues.<queue>: one per queue of Music Assistant (the queue of a player has the ID of the player): state,
displayName, available, currentItemName, elapsedTime; writable: shuffleEnabled, repeatMode (0 off, 1 all, 2 one),
control.play / pause / playPause / stop / next / previous (write true).

How to talk to the user:
- Which player: the one the user names (the label of getPlayers). If there are several and the user names none,
  ask; do not guess.
- To play something specific, find it with getMedia (favorites first, then the list of its type) and write its uri;
  a plain search text plays the best hit, which may be something else. Then read mediaTitle and mediaArtist and
  tell the user what plays.
- playMedia, playing, the buttons, volume, powered, source and seek change what the residents hear: only on the
  user's request. playMedia replaces what plays now. Change the volume in small steps unless the user names a value.
- Name players by their names and music by title and artist, not by IDs or URIs.`;
