/**
 * Automatically tries to op joining people listed in a oper-list.
 */
module.exports = function(bot) {
  var opers = require('./opers.json')

  bot.irc.on('join', function(user, chan) {
    var nick = user.split('!')[0]
      , chan = chan.split(' ')[0].slice(1)

    if (opers[chan] && ~opers[chan].indexOf(nick)) {
      op(nick, chan)
    }
  })


  bot.on('channel mode', function(p, mode, to, chan, from) {
    if (!opers[chan]) return

    if (p == '+' && mode == 'o' && to == bot.nick) {
      bot.irc.names([chan], function(names) {
        if (!names[chan].length) return

        names[chan].filter(function(n) { return ~opers[chan].indexOf(n) })
                   .forEach(function(n) { op(n, chan) })
      })
    }
  })

  function op(nick, chan) {
    bot.irc.write('MODE '+ chan +' +o '+ nick)
  }
}
