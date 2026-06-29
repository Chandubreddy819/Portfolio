const postsData = [
  {
    "id": "getting-started-with-stm32",
    "title": "Getting Started with STM32 for BLE Applications",
    "date": "2025-06-15",
    "category": "EMBEDDED",
    "image": "assets/project_images/BLE_Mioty.png",
    "readTime": "5 min read",
    "summary": "A walkthrough of setting up an STM32 development environment for BLE applications — from toolchain installation to first firmware flash.",
    "tags": ["STM32", "BLE", "Embedded C", "Tutorial"],
    "content": [
      {
        "heading": "Why STM32?",
        "text": "When it comes to embedded BLE applications, the STM32 family offers an excellent balance of power efficiency, peripheral richness, and tooling support. In this post, I'll walk through my setup for the BLE + mioty localization tag project."
      },
      {
        "heading": "Development Environment",
        "text": "I use STM32CubeIDE for project configuration and code generation, combined with VS Code for actual editing. The STM32CubeMX tool handles peripheral initialization, clock configuration, and middleware setup. For flashing and debugging, I use an ST-Link V2 programmer with OpenOCD."
      },
      {
        "heading": "Key Takeaways",
        "text": "Start with the HAL libraries for prototyping, then optimize critical paths with direct register access. Always configure your clock tree for the lowest power consumption that meets your timing requirements. Use the power consumption calculator in CubeMX to estimate battery life early."
      }
    ]
  },
  {
    "id": "ble-mesh-network-architecture",
    "title": "Architecting a BLE Mesh Network for IoT",
    "date": "2025-05-02",
    "category": "WIRELESS",
    "image": "assets/post_images/ble_network.png",
    "readTime": "8 min read",
    "summary": "Designing a robust BLE mesh network involves careful planning of node provisioning, routing, and power profiles. Here's a deep dive into the architecture.",
    "tags": ["BLE Mesh", "IoT", "Networking", "Architecture"],
    "content": [
      {
        "heading": "Introduction to BLE Mesh",
        "text": "Unlike traditional Bluetooth which is strictly point-to-point or star topology, BLE Mesh enables many-to-many communications. This is critical for large-scale IoT deployments like smart buildings or industrial automation."
      },
      {
        "heading": "Node Types",
        "text": "Understanding the different node types is key: Relay nodes extend the range, Proxy nodes allow smartphones to connect to the mesh, and Low Power nodes sleep most of the time while their Friend nodes cache messages for them."
      },
      {
        "heading": "Security and Provisioning",
        "text": "Security is mandatory in BLE Mesh. Devices must be securely provisioned into the network using a 256-bit elliptic curve Diffie-Hellman key exchange. Network keys and application keys provide separation of concerns."
      }
    ]
  }
]

