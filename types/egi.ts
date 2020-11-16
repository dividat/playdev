// External Game Interface

declare var PlayEGI : EGI;

interface EGI {
    onSignal(handler: (signal: Signal) => void): void;
    ready(): void;
    pong(): void;
    finish(metrics: Metrics, memory: any): void;
    motor(preset: "positive" | "negative"): void;
}


// Signals


type Signal
    = { "type": "Hello", settings: Settings, memory: any }
    | { "type": "Ping" }
    | { "type": "Suspend" }
    | { "type": "Resume" }
    | { "type": "Step", direction: Direction }
    | { "type": "Release", direction: Direction }
    | { "type": "SensoState", state: SensoState }
    ;

type Direction
    = "Center" | "Up" | "Right" | "Down" | "Left";

interface SensoState {
    center: Activation;
    up: Activation;
    right: Activation;
    down: Activation;
    left: Activation;
}

interface Activation {
    x: number;
    y: number;
    f: number;
}


// Commands


type Command
    = { "type": "Ready" }
    | { "type": "Ready" }
    | { "type": "Pong" }
    | { "type": "Finish", metrics: Metrics }
    | { "type": "Error", error: any }
    | { "type": "Motor", preset: "positive" | "negative" }
    ;


// Settings


type Settings = {
    [label: string]: Setting;
};

type Setting
    = Time
    | DirectionDistribution
    | Float
    | Int
    | Percentage
    | String
    | Bool
    ;

// a time value, unit: ms
interface Time {
    "type": "Time";
    value: number;
}

// a probability distribution for the four plate directions
interface DirectionDistribution {
    "type": "DirectionDistribution";
    value: { element: "Up" | "Right" | "Down" | "Left", p: number }[];
}

// a unitless float value
interface Float {
    "type": "Float";
    value: number;
}

// a unitless integer value
interface Int {
    "type": "Int";
    value: number;
}

// a percentage value (0.5 is 50 %)
interface Percentage {
    "type": "Percentage";
    value: number;
}

// a string value
interface String {
    "type": "String";
    value: string;
}

// boolean flag
interface Bool {
    "type": "Bool";
    value: boolean;
}


// Metrics


type Metrics = {
    [label: string]: MetricValue;
};

type MetricValue
    = RawFloat
    | RawInt
    | Distance
    | ReactionTime
    | Duration
    | Text
    | Flag
    ;

// a float without special semantics
interface RawFloat {
    "type": "RawFloat";
    value: number;
}

// an int without special semantics
interface RawInt {
    "type": "RawInt";
    value: number;
}

// distance, unit: mm
interface Distance {
    "type": "Distance";
    value: number;
}

// (average) time for some reaction, unit: ms
interface ReactionTime {
    "type": "ReactionTime";
    value: number;
}

// duration (usually of game), unit: ms
interface Duration {
    "type": "Duration";
    value: number;
}

// free text value
interface Text {
    "type": "Text";
    value: string;
}

// boolean flag
interface Flag {
    "type": "Flag";
    value: boolean;
}

