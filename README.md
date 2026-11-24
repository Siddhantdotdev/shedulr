# Shedulr

Minimal interactive CPU scheduling algorithm visualizer for computer science students.

## Supported Algorithms

- FCFS
- SJF (non-preemptive)
- SRTF (preemptive)
- Priority Non-preemptive
- Priority Preemptive
- Round Robin

Tie-breaking: lowest PID. Priority direction is configurable.

## Setup

```bash
npm install
npm run dev
```

## Usage

1. Add/edit processes (PID, Arrival, Burst, Priority).
2. Select algorithm (set quantum for RR).
3. Run and use playback controls.
4. View metrics and comparison mode.

All calculations come from a pure TypeScript engine.

## License

MIT
