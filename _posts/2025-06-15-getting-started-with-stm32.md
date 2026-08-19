---
id: getting-started-with-stm32
title: "Getting Started with STM32 for BLE Applications"
category: "EMBEDDED"
image: "assets/project_images/BLE_Mioty.png"
read_time: "5 min read"
summary: "A walkthrough of setting up an STM32 development environment for BLE applications — from toolchain installation to first firmware flash."
tags: ["STM32", "BLE", "Embedded C", "Tutorial"]
---
## Why STM32?

When it comes to embedded BLE applications, the STM32 family offers an excellent balance of power efficiency, peripheral richness, and tooling support. In this post, I'll walk through my setup for the BLE + mioty localization tag project.

## Development Environment

I use STM32CubeIDE for project configuration and code generation, combined with VS Code for actual editing. The STM32CubeMX tool handles peripheral initialization, clock configuration, and middleware setup. For flashing and debugging, I use an ST-Link V2 programmer with OpenOCD.

## Key Takeaways

Start with the HAL libraries for prototyping, then optimize critical paths with direct register access. Always configure your clock tree for the lowest power consumption that meets your timing requirements. Use the power consumption calculator in CubeMX to estimate battery life early.
