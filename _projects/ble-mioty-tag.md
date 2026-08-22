---
id: ble-mioty-tag
number: "01"
categories: ["IoT", "RF Hardware", "Localization"]
title: "Joint Bluetooth and Mioty Localization Tag"
summary: "A coin-cell BLE + mioty localization tag combining precise short-range tracking with long-range fallback — one 2.4 GHz transceiver, magnetometer-driven motion-gated power, on a custom circular PCB."
image: "assets/project_images/BLE_Mioty.png"
tech: ["STM32F103CB", "SX1280", "IIS2MDC", "KiCad", "BLE", "mioty", "C/C++", "Leaflet.js"]
metrics: ["~7.5 months battery life (dual-mode)", "~10m accuracy (with denser FMDN coverage)", "~41 μA avg current"]
featured: true
links:
  github: "https://github.com/Chandubreddy819/Bluetooth-and-Mioty-Localization-Hardware"
projectInfo:
  INSTITUTE: "LIKE, FAU Erlangen-Nürnberg"
  ROLE: "M.Sc Student"
  TIMELINE: "Jul 2025 – Aug 2026"
  HARDWARE: "STM32F103, SX1280, IIS2MDC, CR2032"
  FORM_FACTOR: "40mm round PCB, 4-layer"
sections:
  - title: "The Coverage Gap"
    content: |
      Most asset-tracking tags are built around a single trade-off. BLE tags are cheap and accurate when a receiver is nearby — typically to within a metre or two using RSSI-based proximity — but the moment the tag drifts out of range, it goes dark. Long-range IoT radios solve coverage, but at the cost of energy and precision. This project asks a different question: what if one tag could do both on a single radio? The result is a joint BLE + mioty module that transmits frequent BLE/FMDN advertisements for close-range precision near a receiver, and occasional mioty telegrams for long-range fallback everywhere else — both from the same 2.4 GHz front end. mioty/FMDN accuracy here scales with observer density: Google's crowd-sourced network triangulates from every nearby Android phone that reports seeing the tag, so more contributing phones means a tighter fix — typically down to around 10 m with three or more observers. This project's own real, validated fix (see "From Signals to a Map") came from just one or two observing phones and resolved to a coarser 100 m, consistent with that trend.
    image: "assets/project_images/coverage_gap.svg"
    image_width: 1195
    image_height: 370
    caption: "Fig 1 — BLE delivers close-range precision when a receiver is nearby; the mioty/FMDN fallback trades that precision for coverage, typically resolving to within ~10 m as more nearby phones observe the tag. This project's own validated fix (one to two observing phones) resolved to a coarser 100 m — see the dashboard result below."
  - title: "Two Modes, One Radio"
    content: |
      Mioty is built on Telegram Splitting (ETSI TS-UNB): instead of one continuous packet, a telegram is split into 24 sub-bursts and scattered across time and frequency over roughly 5.5 seconds. A gateway needs only a fraction of them to reconstruct the message — giving mioty its robust long-range edge. The novelty here is bringing that approach onto the same 2.4 GHz front end as BLE. BLE handles the common case: three fixed advertising channels (37, 38, 39 at 2402, 2426, and 2480 MHz) fired as a single ~15 ms burst, confirmed on air exactly where the spec puts them. mioty handles the fallback, its sub-bursts visibly scattered in time and frequency on a spectrum analyzer, exactly as TS-UNB predicts. The firmware interleaves the two on a simple counter — five BLE/FMDN cycles for every one mioty cycle — so the tag defaults to frequent, cheap BLE updates and only pays mioty's higher energy cost periodically. Both share a single SX1280 transceiver and antenna; nothing is duplicated in hardware.
    image: "assets/project_images/two_modes.svg"
    image_width: 1195
    image_height: 460
    caption: "Fig 2 — Real channel/frequency data for both modes. BLE fires all three fixed advertising channels in one short burst; mioty hops pseudo-randomly across the band over its 24-sub-burst, ~5.5 s telegram."
  - title: "Module Architecture"
    content: |
      The whole design bends toward one constraint: run from a CR2032 coin cell. The Semtech SX1280 handles both radio roles from a single 2.4 GHz front end. The STM32F103CB orchestrates everything — building BLE advertising packets, driving the mioty telegram sequence, reading the magnetometer, and managing sleep. A 9-axis IMU footprint was designed in, but only the IIS2MDC magnetometer is populated; the ICM-45686 accelerometer couldn't be sourced in time and is left for future work. The magnetometer alone drives motion-gated wake-ups via a hardware interrupt and feeds a compass heading into the mioty uplink — though without the accelerometer, that heading isn't tilt-compensated.
    image: "assets/project_images/module_architecture.svg"
    image_width: 1200
    image_height: 500
    caption: "Fig 3 — Component topology. STM32F103CB at the centre drives the SX1280 over SPI and the magnetometer over I2C. Its wake-on-motion interrupt keeps the MCU in deep sleep when stationary. The accelerometer footprint exists on the board but isn't populated yet."
  - title: "The Board"
    content: |
      A custom four-layer PCB designed in KiCad — a 40mm round board sized to sit directly over a CR2032 coin cell. The stackup gives the 2.4 GHz signals a clean reference plane and keeps the antenna matching network tight. The design is complete and fabricated; the bill of materials is deliberately small.
    image: "assets/project_images/placeholder_board.png"
    image_width: 721
    image_height: 687
    caption: "Fig 4 — Round four-layer PCB. Meander-line inverted F antenna (IFA) at the top edge; SX1280 RF module nearest the antenna; STM32 in the center; CR2032 battery holder on the bottom. Top right shows the U.FL connector for bench testing alongside the etched antenna."
  - title: "Bringing Up the Radio"
    content: |
      The firmware is written in C against the STM32 HAL. The BLE path is working and verified; the tag is discoverable on standard scanners, confirmed in nRF Connect and Bluetooth LE Explorer. The SX1280 is configured for BLE at 1 Mbps with Gaussian shaping, transmitting Google's Find My Device Network (FMDN) format across all three advertising channels at ~4 Hz. The mioty transmit path is confirmed working on air too — the telegram-splitting sub-burst pattern is clearly visible on a spectrum analyzer, scattered across time and frequency exactly as the TS-UNB standard predicts. Power optimization is in place: the magnetometer's hardware wake-on-motion interrupt keeps the STM32 in deep sleep when the tag is stationary, and ramps advertising back up the instant movement is detected.
    image: "assets/project_images/mioty_rf_spectrum.png"
    image_width: 1280
    image_height: 652
    caption: "Fig 5 — Real-time spectrum capture of a mioty uplink: sub-bursts scattered across time and frequency, the telegram-splitting signature that lets a gateway reconstruct the message even if some sub-bursts are lost to interference."
  - title: "The Fixes That Made It Work"
    content: |
      Traced an intermittent mioty decode failure to sub-microsecond symbol-timing drift accumulating across a 5.5-second, 24-sub-burst telegram — invisible on a spectrum analyzer, since every individual sub-burst still looked correctly formed and on schedule. Recalculating the 8 MHz crystal's load capacitors from its actual specified load corrected the drift at the hardware level, no firmware compensation needed.

      Also caught and fixed a magnetometer heading bug before it ever reached a real transmission: a standalone bench rig built to validate the heading math showed the computed angle confined to a narrow arc instead of sweeping the full 360°, a classic hard-iron distortion symptom in the raw sensor readings. Fixed with a one-time boot-time calibration — rotate through a full turn for 15 seconds, track the min/max reading per axis, use the midpoint as an offset.
  - title: "From Signals to a Map"
    content: |
      Hardware that transmits is only half a localization system — something has to turn a broadcast into a resolved position. On the BLE side, the tag advertises Google's Find My Device Network (FMDN) format rather than a custom payload, so any nearby Android phone with Find My Device enabled can anonymously report having seen it, no dedicated receiver infrastructure required. A companion service requests those reports from Google's API, decrypts them with the tag's own key, and serves the resolved position to a Leaflet-based dashboard. This path is validated end to end, not just designed: a real Android phone in the field observed the tag, and the dashboard below resolved a genuine, geographically correct position for it. That particular fix came from just one or two observing phones, which is why it resolved to a 100 m radius rather than the ~10 m FMDN typically achieves once three or more phones triangulate the same tag — more observers is a density problem, not a hardware one, and nothing about the tag itself would need to change to see it tighten. The equivalent path on the mioty side — a gateway that turns received uplinks into a position of its own — is the clear next step; the uplink itself reaches the gateway correctly today, but nothing downstream yet turns it into a plotted position the way the BLE/FMDN path does.
    image: "assets/project_images/fmdn_dashboard_real.png"
    image_width: 1920
    image_height: 947
    caption: "Fig 6 — The dashboard resolving a real, decrypted position for the tracker from a genuine third-party observation: ≈49.598°N, 11.002°E in Erlangen, 100m accuracy, status AGGREGATED."
  - title: "Why It Matters"
    content: |
      The appeal of this design is its economy. A single transceiver, a small microcontroller, a magnetometer, and a coin cell; and from that minimal hardware comes a tag that is precise when it can be and reliable when it can't. There is no second radio to power, no gateway density assumption baked into the deployment, no hard coverage edge where tracking simply stops. A tiny module that transmits frequent BLE advertisements for precise tracking where possible, and occasional mioty telegrams for long-range fallback everywhere else. The board is complete and verified, both radios are confirmed working on air, and the BLE/FMDN path is validated end to end with a real, resolved position — the mioty-side gateway localization software is the clear next step.

      This work is being carried out at the Institute for Information Technology (LIKE), FAU Erlangen-Nürnberg.
    image: "assets/project_images/system_concept.svg"
    image_width: 1200
    image_height: 420
    caption: "System concept: the BLE/FMDN path is implemented and validated end to end; the mioty path (greyed) reaches a gateway with no localization software behind it yet."
  - title: "The Board, In the Flesh"
    content: |
      The design verified in silicon — KiCad ray-trace render, the full 3D copper and silkscreen layout, and the board as soldered, front and back.
    gallery:
      - image: "assets/project_images/board_3d_raytrace.png"
        image_width: 1477
        image_height: 1293
        caption: "KiCad ray-trace render"
      - image: "assets/project_images/board_pcb_layout.png"
        image_width: 1629
        image_height: 1260
        caption: "PCB layout — copper routing + silkscreen"
      - image: "assets/project_images/board_soldered_front.png"
        image_width: 1085
        image_height: 1100
        caption: "Soldered board — top view (accelerometer unpopulated)"
      - image: "assets/project_images/board_soldered_back.png"
        image_width: 1005
        image_height: 1100
        caption: "Soldered board — bottom view, CR2032 holder"
    image: "assets/project_images/ble_mioty_rf_capture.png"
    image_width: 1280
    image_height: 652
    caption: "Spectrum waterfall — TX active on channels 37, 38, 39"
---
