---
id: low-power-patterns-coin-cell-iot
title: "Low-Power Design Patterns for Coin-Cell IoT Devices"
category: "EMBEDDED"
image: "assets/post_images/sleep_current_budget.svg"
read_time: "7 min read"
summary: "A CR2032 gives you roughly 220-240 mAh and no room for error. A few recurring, well-documented failure modes separate a design that lasts months from one that lasts hours."
tags: ["Low Power", "STM32", "Power Management", "IoT"]
---
A CR2032 coin cell holds roughly 220–240 mAh depending on manufacturer and discharge rate — Energizer rates its cell at 235 mAh to a 2.0 V end-point under a 15 kΩ load, Maxell specifies 220 mAh ([Energizer datasheet](https://data.energizer.com/pdfs/cr2032.pdf), [Maxell datasheet](https://cdn-shop.adafruit.com/datasheets/maxell_cr2032_datasheet.pdf)). That sounds generous until you do the arithmetic: pull even 1 mA continuously and the cell is dead in under two weeks. Any coin-cell device meant to last months rather than days lives or dies by its *sleep* current, not its peak current — and a handful of specific, well-documented failure modes keep showing up in low-power STM32 designs. Below are the four that matter most, each with the underlying mechanism.

## Sleep current is a budget, not a target

The instinct is to optimize the expensive stuff — radio transmit power, clock speed, active-mode current. But if a device sleeps 99%+ of the time, idle current dominates the average almost entirely. A radio pulling several mA for a 15 ms burst every 10 seconds contributes only a tiny duty-cycled sliver to the average; a sleep state leaking an extra 50 µA runs continuously and can dwarf it. Budget backwards from the target lifetime, convert it into an average-current ceiling, and treat that ceiling as the real spec — not a datasheet's headline "deep sleep" figure, which rarely accounts for what the rest of the board is doing.

## Peripherals don't stop existing when they sleep

The least obvious leak isn't in the microcontroller itself — it's in how the MCU's own GPIOs interact with a peripheral that's still electrically alive. Many radios and sensors keep a status or interrupt line actively driven even in their own low-power state. If the corresponding MCU pin is still configured as a digital input during sleep, that constant external drive burns current through the input buffer for as long as both sides hold their state — silently, continuously, and invisible to anything short of directly measuring supply current.

ST's own AN4899 application note on GPIO configuration for low-power STM32 designs addresses exactly this: unused or externally-driven pins should be moved to Analog mode before entering a low-power state, since that electrically disconnects the digital input buffer that would otherwise leak ([AN4899](https://www.st.com/resource/en/application_note/an4899-stm32-microcontroller-gpio-configuration-for-hardware-settings-and-lowpower-consumption-stmicroelectronics.pdf)). It's worth noting a subtlety the note calls out directly: setting a pin to Analog mode doesn't by itself close the analog switch — the switch is controlled by whether an analog peripheral is enabled on that pin — but it does disconnect the Schmitt-trigger input buffer that's the actual source of the leakage current in this scenario. On a board where a radio's `BUSY`/interrupt line stays driven through sleep, that reconfiguration is frequently the single biggest lever left once the obvious optimizations are exhausted.

## Don't trust a wake source until you've watched it wake twice

Real-time clock alarms are a common wake source for periodic duty-cycling, and they have a specific, documented failure mode on STM32F1 parts: if the alarm flag isn't cleared correctly, the RTC re-triggers immediately and the device never actually sleeps for the configured interval. This isn't a hypothetical — ST's own community forum has multiple threads describing exactly this on the F1 family, including cases where the alarm flag isn't preserved correctly across reset, and where the standard HAL clear macro needs to be paired with an explicit NVIC pending-interrupt clear to actually take effect ([STM32F103 ALRF flag discussion](https://community.st.com/t5/stm32-mcus-embedded-software/stm32f103-multiple-wakeup-sources-detection-unable-to-read-rtc/td-p/593098)). The practical takeaway: don't assume a wake source is configured correctly because the device woke up once. Trigger a wake cycle, confirm current drops back to baseline and *stays* there until the next scheduled wake, and if it doesn't, be prepared to bypass the HAL abstraction and clear the flag with a direct register write.

## Waking a sleeping peripheral takes a real handshake, not a delay

Radios and sensors with their own sleep states typically need an explicit wake sequence — a chip-select pulse held for a minimum duration, a dummy SPI transaction, a status pin polled until it settles — before they're ready to accept commands again. It's tempting to paper over this with a fixed delay, but a delay that's occasionally too short leaves the MCU talking to a peripheral that isn't listening yet, which tends to surface as an intermittent hang rather than a clean, reproducible failure. Wait on the actual readiness signal the datasheet defines, not a guessed number of milliseconds.

## Measuring instead of assuming

Every failure mode above is invisible from a purely functional test — the radio still transmits correctly, the sensor still reads correctly, the logic is still correct. They only become visible once current is measured directly instead of behavior alone being observed. For anything meant to run for months on a coin cell, current measurement isn't a final verification step — it needs to be part of the same debug loop as functional testing, from the first time the device goes to sleep.

### Further reading
- [AN4899 — STM32 GPIO configuration for hardware settings and low-power consumption (ST)](https://www.st.com/resource/en/application_note/an4899-stm32-microcontroller-gpio-configuration-for-hardware-settings-and-lowpower-consumption-stmicroelectronics.pdf)
- [Energizer CR2032 datasheet](https://data.energizer.com/pdfs/cr2032.pdf)
- [STM32F103 RTC ALRF flag / wake-source discussion (ST Community)](https://community.st.com/t5/stm32-mcus-embedded-software/stm32f103-multiple-wakeup-sources-detection-unable-to-read-rtc/td-p/593098)
