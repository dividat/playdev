# PlayEGI API

This section contains type declarations for Play's External Game Interface (EGI). The TypeScript language is used for declaring the types, but is merely meant as a convenient way of describing the existing JavaScript library. Any language that can make calls to JavaScript functions may be used to interface with the EGI.

## Examples

### Settings

```ts
let settings: Settings = {
    "duration": { "type": "Time", value: 60000 },
    "bringemon": { "type": "Bool", value: true }
};
```

### Metrics

```ts
// Example
let metrics: Metrics = {
    "duration": { "type": "Duration", value: 50000 },
    "points": { "type": "RawInt", value: 2000 }
};
```
