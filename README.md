# PiFleet

### Overview
A web app to track the processes and specs of several RaspberryPis running in tandem in a home-labbed server. The app should query data (CPU temperature, RAM usage, current operation, etc.) from each RaspberryPi at regular intervals and display it in an online dashboard.

### Target User
The app targets home-labbing enthusiasts, roboticists, and other IoT developers who frequently use RaspberryPis and similar microcomputers. It aids in the management of multiple smart devices and streamlines the process of accessing and utilizing data from them. 

### Purpose and Problem Statement
Managing multiple edge computing devices (like Raspberry Pis) typically requires SSH-ing into each device individually to check its health, network status, or hardware constraints. This becomes highly inefficient and difficult to scale when operating a fleet of robots or an IoT network. PiFleet centralizes telemetry and device management into a single, easily accessible dashboard. It saves time, helps prevent hardware failures through proactive monitoring (like catching an overheating CPU), and provides a high-level view of the entire network's health.

### Core Features
- Centralized Fleet Dashboard: A main view that instantly displays the online/offline status and high-level health metrics of all registered devices.

- Real-Time Telemetry Tracking: Detailed, per-device monitoring of vital hardware stats, such as CPU temperature, RAM usage, and available storage capacity.

- Device Lifecycle Management: The ability to register new devices to the network, update their operational status (e.g., Active, Offline, Maintenance), and decommission them.

- Hardware Data Visualization: Simple charts or visual indicators to track telemetry trends over time (e.g., a temperature graph).

### Technical Overview
**React** frontend will provide a robust, interactive UI that sends requests through **GraphQL**. **Node.JS**/**Express** will host the **GraphQL** API, receiving and writing telemetry to the **MongoDB** database.

