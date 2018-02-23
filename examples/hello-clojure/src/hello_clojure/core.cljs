(ns hello-clojure.core)

(enable-console-print!)

(defn on-js-reload []
  (println "Reloaded!")
  )

(defn handle-step [direction]
  (case direction
    "Up" (js/PlayEGI.pong)
    "Down" (js/PlayEGI.finish (js-obj))
    ()
  ))

(defn handle-egi-message [signal]
  (case (.-type signal)
    "Hello" (js/PlayEGI.ready)
    "Ping" (js/PlayEGI.pong)
    "Step" (handle-step (.-direction signal))
    (println (.-type signal))
  ))

(js/PlayEGI.onSignal handle-egi-message)

