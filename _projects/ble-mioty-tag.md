---
id: ble-mioty-tag
number: "01"
categories: ["IoT", "RF Hardware", "Localization"]
title: "Joint Bluetooth and Mioty Localization Tag"
summary: "A coin-cell BLE + mioty localization tag combining precise short-range tracking with long-range fallback — one 2.4 GHz transceiver, motion-gated power, and a 9-axis IMU on a custom circular PCB."
image: "assets/project_images/BLE_Mioty.png"
tech: ["STM32F103CB", "SX1280", "ICM-20948", "KiCad", "BLE", "mioty", "C/C++", "Leaflet.js"]
metrics: ["8+ months battery life", "100m accuracy (real-world FMDN validation)", "~36 μA avg current"]
featured: true
links:
  github: "https://github.com/Chandubreddy819"
projectInfo:
  INSTITUTE: "LIKE, FAU Erlangen-Nürnberg"
  ROLE: "M.Sc Student"
  TIMELINE: "Jul 2025 – Aug 2026"
  HARDWARE: "STM32F103, SX1280, ICM-20948, CR2032"
sections:
  - title: "The Coverage Gap"
    content: |
      Most asset-tracking tags are built around a single trade-off. BLE tags are cheap and accurate when a receiver is nearby — but the moment the tag drifts out of range, it goes dark. Long-range IoT radios solve coverage, but at the cost of energy and precision. This project asks a different question: what if one tag could do both on a single radio? The result is a joint BLE + mioty module that transmits frequent BLE advertisements for precise tracking near infrastructure, and occasional mioty telegrams for long-range fallback everywhere else — both from the same 2.4 GHz front end.
    image: "assets/project_images/placeholder_coverage_gap.png"
    image_width: 1195
    image_height: 370
    caption: "Fig 1 — BLE delivers precise position within gateway range; mioty maintains coarse coverage almost everywhere. A dual-mode tag combines both vs tracking degrades gracefully rather than dropping out at the coverage edge."
  - title: "Two Modes, One Radio"
    content: |
      Mioty is built on Telegram Splitting (ETSI TS-UNB): instead of one continuous packet, it chops messages into small sub-packets scattered across time and frequency. A receiver needs only a fraction of them to reconstruct the message — giving mioty its robust long-range edge. The novelty here is bringing that approach onto the same 2.4 GHz front end as BLE. BLE handles the common case with ~4 Hz three-channel hops for fine-grained tracking. mioty handles the fallback with infrequent split telegrams that stay robust even when BLE coverage is absent. The two are complementary, not redundant — and both share a single SX1280 transceiver and antenna.
    image: "assets/project_images/placeholder_two_modes.png"
    image_width: 1195
    image_height: 442
    caption: "Fig 2 — The SX1280 generates both radio modes. BLE hops the three advertising channels at ~4 Hz for fine-grained tracking. mioty scatters sub-packets across a time-frequency grid for robust long-range fallback."
  - title: "Module Architecture"
    content: |
      The whole design bends toward one constraint: run from a CR2032 coin cell. The Semtech SX1280 handles both radio roles from a single 2.4 GHz front end. The STM32F103CB orchestrates everything — building BLE advertising packets, driving the mioty telegram sequence, reading the IMU, and managing sleep. A 9-axis IMU (TDK ICM-42688 / ST ISM330DLC) does double duty: its hardware wake-on-motion interrupt keeps the STM32 in deep sleep when the tag is stationary, and its motion data feeds the localization layer for dead-reckoning between radio fixes.
    image: "assets/project_images/placeholder_architecture.png"
    image_width: 1194
    image_height: 490
    caption: "Fig 3 — Component topology. STM32F103CB at the centre drives the SX1280 over SPI and the 9-axis IMU over I2C. The IMU's wake-on-motion interrupt keeps the MCU in deep sleep when stationary, dramatically extending coin-cell life."
  - title: "The Board"
    content: |
      A custom four-layer PCB designed in KiCad — a compact round board sized to sit over a coin cell. The stackup gives the 2.4 GHz signals a clean reference plane and keeps the antenna matching network tight. The design is complete and fabricated; the bill of materials is deliberately small.
    image: "assets/project_images/placeholder_board.png"
    image_width: 721
    image_height: 687
    caption: "Fig 4 — Round four-layer PCB. Meander-line inverted F antenna (IFA) at the top edge; SX1280 RF module nearest the antenna; STM32 in the center; CR2032 battery holder on the bottom. Top right shows the U.FL connector for bench testing alongside the etched antenna."
  - title: "Bringing Up the Radio"
    content: |
      The firmware is written in C against the STM32 HAL. The BLE path is working and verified; the tag is discoverable on standard scanners, confirmed in nRF Connect and Bluetooth LE Explorer. The SX1280 is configured for BLE at 1 Mbps with Gaussian shaping, transmitting Google's Find My Device Network (FMDN) format across all three advertising channels at ~4 Hz. The mioty transmit path is confirmed working on air too — the telegram-splitting sub-burst pattern is clearly visible on a spectrum analyzer, scattered across time and frequency exactly as the TS-UNB standard predicts. Power optimization is in place: the IMU's hardware wake-on-motion interrupt keeps the STM32 in deep sleep when the tag is stationary; ramps advertising back up the instant movement is detected; and provides dead-reckoning hints to the localization layer.
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
      Hardware that transmits is only half a localization system — something has to turn a broadcast into a resolved position. On the BLE side, the tag advertises Google's Find My Device Network (FMDN) format rather than a custom payload, so any nearby Android phone with Find My Device enabled can anonymously report having seen it, no dedicated receiver infrastructure required. A companion service requests those reports from Google's API, decrypts them with the tag's own key, and serves the resolved position to a Leaflet-based dashboard. This path is validated end to end, not just designed: a real Android phone in the field observed the tag, and the dashboard below resolved a genuine, geographically correct position for it. The equivalent path on the mioty side — a gateway that turns received uplinks into a position of its own — is the clear next step; the uplink itself reaches the gateway correctly today, but nothing downstream yet turns it into a plotted position the way the BLE/FMDN path does.
    image: "assets/project_images/fmdn_dashboard_real.png"
    image_width: 1920
    image_height: 947
    caption: "Fig 6 — The dashboard resolving a real, decrypted position for the tracker from a genuine third-party observation: ≈49.598°N, 11.002°E in Erlangen, 100m accuracy, status AGGREGATED."
  - title: "Why It Matters"
    content: |
      The appeal of this design is its economy. A single transceiver, a small microcontroller, a 9-axis IMU, and a coin cell; and from that minimal hardware comes a tag that is precise when it can be and reliable when it can't. There is no second radio to power, no gateway density assumption baked into the deployment, no hard coverage edge where tracking simply stops. A tiny module that transmits frequent BLE advertisements for precise tracking where possible, and occasional mioty telegrams for long-range fallback everywhere else. The board is complete and verified, both radios are confirmed working on air, and the BLE/FMDN path is validated end to end with a real, resolved position — the mioty-side gateway localization software is the clear next step.

      This work is being carried out at the Institute for Information Technology (LIKE), FAU Erlangen-Nürnberg.
  - title: "The Board, In the Flesh"
    content: |
      The design verified in silicon — KiCad ray-trace render and the full 3D copper and silkscreen layout as produced.
    image: "assets/project_images/placeholder_board_flesh.png"
    image_width: 895
    image_height: 711
    caption: "Top-left: KiCad ray-trace render. Top-right: PCB layout - 3D copper + silkscreen export. Bottom-left: Soldered board - top view (without IMU). Bottom-right: BLE Spectrum - TX active at Channels 37, 38, 39."
---
