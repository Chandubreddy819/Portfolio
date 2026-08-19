---
id: ble-mesh-network-architecture
title: "Architecting a BLE Mesh Network for IoT"
category: "WIRELESS"
image: "assets/post_images/ble_network.png"
read_time: "8 min read"
summary: "Designing a robust BLE mesh network involves careful planning of node provisioning, routing, and power profiles. Here's a deep dive into the architecture."
tags: ["BLE Mesh", "IoT", "Networking", "Architecture"]
---
## Introduction to BLE Mesh

Unlike traditional Bluetooth which is strictly point-to-point or star topology, BLE Mesh enables many-to-many communications. This is critical for large-scale IoT deployments like smart buildings or industrial automation.

## Node Types

Understanding the different node types is key: Relay nodes extend the range, Proxy nodes allow smartphones to connect to the mesh, and Low Power nodes sleep most of the time while their Friend nodes cache messages for them.

## Security and Provisioning

Security is mandatory in BLE Mesh. Devices must be securely provisioned into the network using a 256-bit elliptic curve Diffie-Hellman key exchange. Network keys and application keys provide separation of concerns.
