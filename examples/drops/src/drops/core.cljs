(ns drops.core
  (:require [quil.core :as q]
            [quil.core :as q :include-macros true]
            [quil.middleware :as m]
            [cljs-bach.synthesis :as bch]
            ))

;sound stuff

(defonce context (bch/audio-context))

(defn ping [freq decay]
  (bch/connect->
    (bch/sine freq)        ; Try a sawtooth wave.
    (bch/adsr 2 decay 0.0075 0.0025) ; Try varying the attack, decay, sustain and release.
    (bch/gain 0.05)
    ))          ; Try a bigger gain.

;pentatonics. c d e g a
(def tones
  [130.81 146.66 164.81 196.00 220.00])

(defn harmonize [base-tone]
  (bch/add (ping base-tone 0.6) (ping (* 2 base-tone) 1)
      (ping (* 3 base-tone) 0.4) (ping (* 4.1 base-tone) 0.2)
      (ping (* 5.2 base-tone) 0.15)
    ))

;sizing things up

(def viewport-width
  (.-availWidth (.-screen js/window)))


(def viewport-height
  (.-availHeight (.-screen js/window)))

;drawing stuff

(def min-r 10)
(def max-r 420)
(defn opacity
  [r] (* 255 (- 1 (/ r max-r))))

(def palette
  [[172 57 49]
   [229 211 82]
   [217 231 108]
   [83 125 141]
   [206 231 230]
   ])

(defrecord Circle [x y r colour])

(def a-state
  ; initial state
  (atom {:circles []
         :senso-state
           {:center {:x 0 :y 0 :f 0}
            :up {:x 0 :y 0 :f 0}
            :right {:x 0 :y 0 :f 0}
            :down {:x 0 :y 0 :f 0}
            :left {:x 0 :y 0 :f 0}}}))


  ;with senso-update, instead of mouse-moved use EGI signal and use xy

(defn grow-circle [circle]
  (update-in circle [:r] inc))

(defn small-enough? [circle]
  (<= (:r circle) max-r))

(defn update [a-state]
    ; increase radius of the circle by 1 on each frame
  (do
    (swap!
        a-state
        (fn [state]
          (update-in state [:circles] (fn [cs] (filterv small-enough? (map grow-circle cs))))))
    a-state))

(defn draw [state]
  (q/background 255)
  (q/no-stroke)
  (doseq [c (:circles state)]
    (do
      (apply q/fill (conj (:colour c) (opacity (:r c))))
      (q/ellipse (:x c) (:y c) (:r c) (:r c)))))


; decrease radius by 1 but keeping it not less than min-r
(defn shrink [r]
  (max min-r (dec r)))

(defn add-circle [circles x y]
  (cons (Circle. x y min-r (rand-nth palette)) circles))

(defn place-circle [a-state x y]
  (do
    (swap!
      a-state
      (fn [state]
        (update-in state  [:circles] #(add-circle %1 x y))))
    (bch/run-with
      (bch/connect-> (harmonize (rand-nth tones)) bch/destination)
      context
      (bch/current-time context)
      20)
      a-state))

(defn scale-x [val]
  (* (/ val 3) viewport-width))

(defn scale-y [val]
  (* (/ val 3) viewport-height))

(defn circle-for-plate [senso-state plate a-state]
  (println senso-state)
  (place-circle
    a-state
    (scale-x (or (aget senso-state plate "x") 1.5))
    (scale-y (or (aget senso-state plate "y") 1.5))))

(defn on-egi-signal [signal]
  ;; This function handles signals comming from EGI and is exposed to JS
  (case (.-type signal)
      "Hello" (.ready egi)
      "Ping" (.pong egi)
      "SensoState" (swap! a-state #(assoc %1 :senso-state (.-state signal)))
      "Step" (circle-for-plate
               (:senso-state @a-state)
               (clojure.string/lower-case (.-direction signal))
               a-state)
      (println (.-type signal))
      ))

(def egi
  (js/PlayEGI on-egi-signal))

(q/defsketch example
  :host "canvas-id"
  :size [viewport-width viewport-height]
  :setup (constantly a-state)
  :draw (fn [a-state] (draw @a-state))
  :update update
  :mouse-clicked (fn [a-state event] (place-circle a-state (:x event) (:y event)))
  :middleware [m/fun-mode])
