// Dividat Play EGI

function PlayEGI (onSignal) {
  var play = null

  // Helper to send commands
  function sendCommand (cmd) {
    if (play) {
      play.postMessage(cmd, '*')
    }
  }

  // Setup listener for messages from Play
  window.addEventListener('message', function (event) {
    var signal = event.data
    play = event.source

    switch (signal.type) {
      case 'SetupEGI':
        // This signal is only to setup the interface it is not forwarded to consumers
        break

      default:
        onSignal(signal)
        break
    }
  })

  // Add an error handler
  window.onerror = function (event, source, lineno, colno, error) {
    sendCommand({
      type: 'Error',
      error: {
        event: event,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error
      }
    })
  }

  return {
    ready: () => {
      sendCommand({type: 'Ready'})
    },
    pong: () => {
      sendCommand({type: 'Pong'})
    },
    suspend: () => {
      sendCommand({type: 'Suspend'})
    },
    abort: () => {
      sendCommand({type: 'Abort'})
    },
    finish: (metrics) => {
      metrics = metrics || {}
      sendCommand({type: 'Finish', metrics: metrics})
    }
  }
}
