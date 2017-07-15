(ns hello-clojure.core
  (:require [reagent.core :as r]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:text "Hello world!"}))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)

(defn view []
  [:div "hello world"
   [:input {:type "button" :value "Ready"
            :on-click #(.ready js/egi)}]

   [:input {:type "button" :value "Suspend"
            :on-click #(.suspend js/egi)}]

   [:input {:type "button" :value "Abort"
            :on-click #(.abort js/egi)}]])

(defn ^:export on-egi-signal [signal]
  ;; This function handles signals comming from EGI and is exposed to JS
  (case (.-type signal)
    "Ping" (.pong js/egi)
    (println (.-type signal))))
(r/render [view] (.getElementById js/document "app"))
