const projectsData = [
  {
    "id": "ble-mioty-tag",
    "number": "01",
    "categories": ["IoT", "RF Hardware", "Localization"],
    "title": "Joint Bluetooth and Mioty Localization Tag",
    "summary": "A coin-cell BLE + mioty localization tag combining precise short-range tracking with long-range fallback — one 2.4 GHz transceiver, motion-gated power, and a 9-axis IMU on a custom circular PCB.",
    "image": "assets/project_images/BLE_Mioty.png",
    "tech": ["STM32F103CB", "SX1280", "ICM-20948", "KiCad", "BLE", "mioty", "C/C++", "Leaflet.js"],
    "metrics": ["8+ months battery life", "Sub-2m accuracy", "~38 μA avg current"],
    "featured": true,
    "links": {
      "github": "https://github.com/Chandubreddy819"
    },
    "projectInfo": {
      "INSTITUTE": "LIKE, FAU Erlangen-Nürnberg",
      "ROLE": "M.Sc Student",
      "TIMELINE": "Aug 2025 – Ongoing",
      "HARDWARE": "STM32F103, SX1280, ICM-20948, CR2032"
    },
    "sections": [
      {
        "title": "The Coverage Gap",
        "content": "Most asset-tracking tags are built around a single trade-off. BLE tags are cheap and accurate when a receiver is nearby — but the moment the tag drifts out of range, it goes dark. Long-range IoT radios solve coverage, but at the cost of energy and precision. This project asks a different question: what if one tag could do both on a single radio? The result is a joint BLE + mioty module that transmits frequent BLE advertisements for precise tracking near infrastructure, and occasional mioty telegrams for long-range fallback everywhere else — both from the same 2.4 GHz front end.",
        "image": "assets/project_images/placeholder_coverage_gap.png",
        "caption": "Fig 1 — BLE delivers precise position within gateway range; mioty maintains coarse coverage almost everywhere. A dual-mode tag combines both vs tracking degrades gracefully rather than dropping out at the coverage edge."
      },
      {
        "title": "Two Modes, One Radio",
        "content": "Mioty is built on Telegram Splitting (ETSI TS-UNB): instead of one continuous packet, it chops messages into small sub-packets scattered across time and frequency. A receiver needs only a fraction of them to reconstruct the message — giving mioty its robust long-range edge. The novelty here is bringing that approach onto the same 2.4 GHz front end as BLE. BLE handles the common case with ~4 Hz three-channel hops for fine-grained tracking. mioty handles the fallback with infrequent split telegrams that stay robust even when BLE coverage is absent. The two are complementary, not redundant — and both share a single SX1280 transceiver and antenna.",
        "image": "assets/project_images/placeholder_two_modes.png",
        "caption": "Fig 2 — The SX1280 generates both radio modes. BLE hops the three advertising channels at ~4 Hz for fine-grained tracking. mioty scatters sub-packets across a time-frequency grid for robust long-range fallback."
      },
      {
        "title": "Module Architecture",
        "content": "The whole design bends toward one constraint: run from a CR2032 coin cell. The Semtech SX1280 handles both radio roles from a single 2.4 GHz front end. The STM32F103CB orchestrates everything — building BLE advertising packets, driving the mioty telegram sequence, reading the IMU, and managing sleep. A 9-axis IMU (TDK ICM-42688 / ST ISM330DLC) does double duty: its hardware wake-on-motion interrupt keeps the STM32 in deep sleep when the tag is stationary, and its motion data feeds the localization layer for dead-reckoning between radio fixes.",
        "image": "assets/project_images/placeholder_architecture.png",
        "caption": "Fig 3 — Component topology. STM32F103CB at the centre drives the SX1280 over SPI and the 9-axis IMU over I2C. The IMU's wake-on-motion interrupt keeps the MCU in deep sleep when stationary, dramatically extending coin-cell life."
      },
      {
        "title": "The Board",
        "content": "A custom four-layer PCB designed in KiCad — a compact round board sized to sit over a coin cell. The stackup gives the 2.4 GHz signals a clean reference plane and keeps the antenna matching network tight. The design is complete and fabricated; the bill of materials is deliberately small.",
        "image": "assets/project_images/placeholder_board.png",
        "caption": "Fig 4 — Round four-layer PCB. Meander-line inverted F antenna (IFA) at the top edge; SX1280 RF module nearest the antenna; STM32 in the center; CR2032 battery holder on the bottom. Top right shows the U.FL connector for bench testing alongside the etched antenna."
      },
      {
        "title": "Bringing Up the Radio",
        "content": "The firmware is written in C against the STM32 HAL. The BLE path is working and verified; the tag is discoverable on standard scanners, confirmed in nRF Connect and Bluetooth LE Explorer. The SX1280 is configured for BLE at 1 Mbps with Gaussian shaping at +13 dBm, transmitting in Apple iBeacon format across all three advertising channels at ~4 Hz. Each iBeacon payload encodes a zone (Major field), an identity (Minor field), and a calibrated TX power byte for distance estimation. The mioty transmit path, generating the split-telegram sub-packet sequence on the same transceiver, is the current active focus. Power optimization is in place: the IMU's hardware wake-on-motion interrupt keeps the STM32 in deep sleep when the tag is stationary; ramps advertising back up the instant movement is detected; and provides dead-reckoning hints to the localization layer.",
        "image": "assets/project_images/placeholder_bring_up.png",
        "caption": "Fig 5 — The MCU sleeps until the IMU's wake-on-motion interrupt fires. A stationary tag drops dormant on a slow heartbeat. When moving, the radio transmits four iBeacon (BLE) advertising channels at ~4 Hz, with a mioty split-telegram on a longer interval, before returning to deep sleep."
      },
      {
        "title": "From Signals to a Map",
        "content": "Hardware that transmits is only half a localization system. The BLE advertisements already carry the hooks: iBeacon Major and Minor fields name a tag's zone and identity, and the calibrated TX power byte lets receivers estimate distance from RSSI. The companion software layer will fuse fine-grained BLE measurements where available and coarse mioty presence where not, with the IMU's dead-reckoning bridging the gaps. The final output is a Leaflet-based web interface that places each tag on a live map; BLE fixes shown as tight rings, mioty fixes as wider uncertainty circles, so an operator immediately sees which tags are pinned down and which are in coverage-fallback mode.",
        "image": "assets/project_images/placeholder_signals_map.png",
        "caption": "Fig 6 — BLE and mioty receivers feed a fusion layer that produces position estimates at two confidence levels. The frontend Leaflet map visualizes these on live tag positions - BLE fixes as tight rings, mioty-only fallback as wider uncertainty circles."
      },
      {
        "title": "Why It Matters",
        "content": "The appeal of this design is its economy. A single transceiver, a small microcontroller, a 9-axis IMU, and a coin cell; and from that minimal hardware comes a tag that is precise when it can be and reliable when it can't. There is no second radio to power, no gateway density assumption baked into the deployment, no hard coverage edge where tracking simply stops. A tiny module that transmits frequent BLE advertisements for precise tracking where possible, and occasional mioty telegrams for long-range fallback everywhere else. The build is actively running in stages: the board is complete and verified, the BLE firmware chain is working, and the mioty transmit path, localization layer, and Leaflet visualization are next.\n\nThis work is being carried out at the Institute for Information Technology (LIKE), FAU Erlangen-Nürnberg."
      },
      {
        "title": "The Board, In the Flesh",
        "content": "The design verified in silicon — KiCad ray-trace render and the full 3D copper and silkscreen layout as produced.",
        "image": "assets/project_images/placeholder_board_flesh.png",
        "caption": "Top-left: KiCad ray-trace render. Top-right: PCB layout - 3D copper + silkscreen export. Bottom-left: Soldered board - top view (without IMU). Bottom-right: BLE Spectrum - TX active at Channels 37, 38, 39."
      }
    ]
  },
  {
    "id": "bosch-sensor-automation",
    "number": "02",
    "categories": ["Automotive", "Automation", "Testing"],
    "title": "Sensor Testing Automation",
    "summary": "Full automation of sensor validation systems at Robert Bosch — custom hardware, Python/MATLAB analysis scripts, and automated reporting that cut test time by 40% and cost by 50%.",
    "image": "assets/project_images/Bosch_automation.png",
    "tech": ["Python", "MATLAB", "Raspberry Pi", "CAN/SENT", "PyQt5", "Simulink"],
    "metrics": ["40% test time reduction", "50% cost reduction", "Employee of the Month"],
    "featured": true,
    "links": {},
    "projectInfo": {
      "COMPANY": "Robert Bosch India",
      "ROLE": "Graduate Apprentice",
      "TIMELINE": "Aug 2022 – Aug 2023",
      "DIVISION": "Powertrain Solutions"
    },
    "sections": [
      {
        "title": "The Problem",
        "content": "The manual validation process for automotive powertrain sensors was a significant bottleneck — slow, costly, and susceptible to inconsistencies."
      },
      {
        "title": "Automated Test System",
        "content": "Designed and validated custom sensor test control units using Raspberry Pi and various microcontrollers. Developed automated measurement and analysis scripts managing the entire test cycle: from acquiring raw CAN/SENT signals to processing data and generating reports."
      },
      {
        "title": "Root-Cause Analysis",
        "content": "Led investigations into signal integrity issues (clipping, drift, noise) using spectral analysis and reproducible test scripts to systematically identify root causes of hardware and wiring faults."
      },
      {
        "title": "Impact",
        "content": "Automated test routines reduced manual test time by 40%. Low-cost hardware (Raspberry Pi) cut equipment costs by 50%. Awarded Employee of the Month for contributions."
      }
    ]
  },
  {
    "id": "audio-signal-processing",
    "number": "03",
    "categories": ["Signal Processing", "Research"],
    "title": "Audio Signal Processing & Binaural Synthesis",
    "summary": "Implemented foundational DSP algorithms from scratch, including STFT, convolution operations, and Pitch Class Profiles. Researched and presented state-of-the-art neural audio codecs.",
    "image": "assets/project_images/Audio_signal_processing.png",
    "tech": ["Python", "Jupyter", "Librosa", "SciPy/NumPy", "Matplotlib", "LaTeX"],
    "metrics": ["Scientific paper presented", "Automated report pipeline"],
    "featured": false,
    "links": {},
    "projectInfo": {
      "INSTITUTE": "AudioLabs (LIKE Chair), FAU",
      "ROLE": "M.Sc Student",
      "TIMELINE": "Apr 2025 – Jul 2025",
      "FOCUS": "Binaural Speech Synthesis"
    },
    "sections": [
      {
        "title": "Research Focus",
        "content": "Implemented foundational DSP algorithms from scratch, including STFT, convolution operations, and Pitch Class Profiles for speech and spectral analysis."
      },
      {
        "title": "Automation",
        "content": "Built automated figure and report generation pipelines using MATLAB and Python, significantly accelerating the research publication workflow."
      },
      {
        "title": "Publication",
        "content": "Researched and presented state-of-the-art neural audio codecs, delivering a comprehensive seminar on End-to-End Binaural Speech Synthesis and adversarial training architectures."
      }
    ]
  },
  {
    "id": "solar-wheelchair",
    "number": "04",
    "categories": ["Clean Energy", "IoT", "Robotics"],
    "title": "Solar Powered Wheelchair with Line Follower",
    "summary": "Autonomous navigation wheelchair powered by solar energy with RFID-based route authentication, line-following, and obstacle avoidance with live video streaming. Published in IJERT.",
    "image": "assets/project_images/solar_wheelchair_final.png",
    "tech": ["Arduino Uno", "RC-522 RFID", "IR Sensors", "ESP32-Cam", "Solar Panels", "L298N"],
    "metrics": ["Published in IJERT", "KSCST funding received"],
    "featured": false,
    "links": {
      "publication": "https://www.ijert.org"
    },
    "projectInfo": {
      "INSTITUTE": "Reva University",
      "ROLE": "Project Lead / B.Tech",
      "TIMELINE": "Nov 2021 – Apr 2022",
      "ARTICLE": "IJERTCONV10IS11104"
    },
    "sections": [
      {
        "title": "Overview",
        "content": "Developed an autonomous navigation wheelchair powered by solar energy with RFID-based route authentication. Integrated line-following and obstacle avoidance systems."
      },
      {
        "title": "Technical Details",
        "content": "Used IR sensor array for line following, RC-522 for RFID authentication, motor driver L298N for motor control, and ESP32-Cam for live video streaming. Solar panels provided sustainable power."
      },
      {
        "title": "Publication",
        "content": "Published scientific paper in International Journal of Engineering Research & Technology (IJERT). Also received project funding from Karnataka State Council for Science and Technology (KSCST) for related clean energy work."
      }
    ]
  },
  {
    "id": "hand-gesture-robot",
    "number": "05",
    "categories": ["Robotics", "Embedded"],
    "title": "Hand Gesture Controlled Robot Car",
    "summary": "Motion-based robot control via MPU6050 gyroscope/accelerometer sensors with live-streaming ESP32-Cam for remote monitoring.",
    "image": "assets/project_images/hand_gesture_robot_final.jpg",
    "tech": ["Arduino Nano", "LilyPad", "MPU6050", "ESP32-Cam", "Motor Drivers", "Wi-Fi"],
    "metrics": ["Gesture-based control", "Live video stream"],
    "featured": false,
    "links": {},
    "projectInfo": {
      "INSTITUTE": "Reva University",
      "ROLE": "Student / B.Tech",
      "TIMELINE": "Apr 2020 – Aug 2020",
      "HARDWARE": "Arduino Nano, MPU6050, ESP32-Cam"
    },
    "sections": [
      {
        "title": "Overview",
        "content": "Built a robot car controlled by hand gestures using the MPU6050 accelerometer/gyroscope sensor worn on the user's hand."
      },
      {
        "title": "Control System",
        "content": "Implemented motion-based control via MPU6050 sensors mounted on a LilyPad Arduino, enabling intuitive navigation through wrist movements. Data transmitted wirelessly to the robot's Arduino Nano controller."
      },
      {
        "title": "Live Streaming",
        "content": "Integrated an ESP32-Cam module for live video streaming, allowing remote control and monitoring of the robot's environment through a web interface."
      }
    ]
  }
]

