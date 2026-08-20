---
id: debugging-mixed-hw-fw-systems
title: "A Debugging Framework for Mixed Hardware/Firmware Systems"
category: "DEBUGGING"
image: "assets/post_images/three-layer-debug.svg"
read_time: "7 min read"
summary: "On embedded RF hardware, 'it works' and 'it's correct' are answered by completely different instruments. A three-layer way to isolate which one actually failed."
tags: ["Debugging", "Embedded Systems", "RF", "Methodology"]
---
Debugging a piece of embedded hardware that talks over RF is unusually easy to get wrong-footed on, because the obvious question — "is it working?" — has no single instrument that answers it. A radio can be transmitting a well-formed packet, on the correct frequency, at the correct time, and the device can still fail its actual job because of something a spectrum analyzer will never show. The standard embedded-debugging literature converges on a systematic reproduce → isolate → identify → fix → verify loop over random probing ([layered debugging strategy for embedded firmware](https://eajournals.org/ejcsit/wp-content/uploads/sites/21/2025/06/Best-Practices-2.pdf)); the layer that's easy to skip in *isolate* is picking the right instrument for the right kind of failure. Over a few RF-hardware bring-ups now, three layers and three instruments have covered nearly every failure I've hit.

## Layer 1: is the signal correct?

This is the layer most people check first, because it's the most visible: right frequency, right time, right modulation. A spectrum analyzer or SDR answers this directly. If a device is silent, transmitting garbage, or hopping frequencies incorrectly, that's a Layer 1 problem, and dedicated wireless-debugging tooling — protocol analyzers, spectrum analyzers, RF performance testers — is built specifically to answer it quickly ([RF/wireless debugging tool overview](https://cranesvarsity.com/how-to-debug-embedded-systems-tools-and-techniques-for-firmware-developers/)).

The trap is stopping here. A clean, correctly-shaped signal proves the physical layer works. It says nothing about whether the system built on top of it actually works.

## Layer 2: is the timing correct?

The next layer needs a different instrument — a logic analyzer, or a cycle-accurate timer on the MCU itself. On ARM Cortex-M3/M4 parts, the Data Watchpoint and Trace (DWT) unit's free-running `DWT_CYCCNT` register increments once per core clock cycle, and reading it gives sub-microsecond timing resolution with almost no overhead — precise enough to catch drift that a wider time-scale view would miss entirely ([DWT cycle counting on Cortex-M](https://mcuoneclipse.com/2017/01/30/cycle-counting-on-arm-cortex-m-with-dwt/), [ARM Cortex-M3 Technical Reference Manual](https://developer.arm.com/documentation/ddi0337/e/ch11s05s01)).

This matters most for protocols with tight timing budgets — frequency-hopping schemes, anything relying on precise symbol timing, multi-device synchronization. A small, accumulating clock drift across a long transmission can leave every individual burst looking correctly formed on a spectrum analyzer while the receiving end still can't reconstruct the full message, because the failure lives in the relationship *between* bursts, not within any single one of them.

## Layer 3: is the system's behavior correct?

The last layer has nothing to do with RF — it's whether the device does the right thing over time: sleeps when it should, wakes when it should, doesn't leak current somewhere the datasheet didn't warn about, doesn't deadlock waiting on a peripheral that's still asleep. This layer is diagnosed with a multimeter, a current profiler, or patient observation across many cycles rather than a single transmission — power-management conflicts and protocol state-machine errors are explicitly called out as a distinct failure category from the RF issues Layer 1 catches ([common wireless-system failure categories](https://cranesvarsity.com/how-to-debug-embedded-systems-tools-and-techniques-for-firmware-developers/)). It's the layer most likely to be silently wrong, because nothing about it shows up if the only thing being checked is whether the packet went out correctly.

## Why the order matters

Working top-down matters because a failure at a lower layer can look, on the surface, exactly like a failure at a higher one. A device that "doesn't work" might have a perfect Layer 1 signal and a broken Layer 3 sleep state — chasing RF settings to fix a power bug wastes time a five-minute current-profiling check would have caught immediately. Conversely, an intermittent decode failure that looks like a system-level flake can be a Layer 2 timing drift invisible to anything except a cycle-accurate trace.

The instinct to reach for the most familiar tool first — usually a spectrum analyzer, because RF failures feel like the "interesting" ones — is exactly what this framework is meant to counter. Before assuming a bug lives in the layer that's most comfortable to debug, it's worth explicitly asking which of the three questions actually failed, and picking the instrument that answers *that* question rather than the one already on the bench.

### Further reading
- [Best Practices for Debugging Embedded Software (EAJournals)](https://eajournals.org/ejcsit/wp-content/uploads/sites/21/2025/06/Best-Practices-2.pdf)
- [How to Debug Embedded Systems: Tools and Techniques for Firmware Developers](https://cranesvarsity.com/how-to-debug-embedded-systems-tools-and-techniques-for-firmware-developers/)
- [Cycle Counting on ARM Cortex-M with DWT](https://mcuoneclipse.com/2017/01/30/cycle-counting-on-arm-cortex-m-with-dwt/)
- [ARM Cortex-M3 Technical Reference Manual — DWT](https://developer.arm.com/documentation/ddi0337/e/ch11s05s01)
