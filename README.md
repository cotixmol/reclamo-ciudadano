# Reclamo Ciudadano 📢

**Reclamo Ciudadano** is a citizen report application designed to simplify the process of reporting and managing local community issues. This application aims to empower citizens to easily register reports via their mobile devices 📱 while providing authorities with an efficient tool for managing and addressing these reports. The main objective is to optimize municipal responses, improve transparency, and communication with citizens.

---

## Index 📑

- [Running the Application (In progress)](#running-the-application-in-progress) 🏃‍♂️
- [Repository Main Components](#repository-main-components-)
- [Functionality](#functionality-)
- [Types of reports](#types-of-reports-)
- [Planned Features](#planned-features-)
- [Expected Benefits](#expected-benefits-)
- [Conclusion](#conclusion-)

---

## Running the Application (In progress) 🏃‍♂️

This section will provide detailed instructions on how to set up and run the "Reclamo Ciudadano" application. It will include information on:

- **Prerequisites:** TODO
- **Installation:** TODO
- **Backend:** TODO
- **Frontend:** TODO

**Stay tuned for updates!** 🚀

---

## Repository Main Components 📂

- **Backend**: A RESTful API with a PostGIS database securely stores geographical information and related data, while also implementing measures to prevent user abuse. An S3 bucket is utilized for storing multimedia files 📷 associated with reports.
- **Mobile Application**: Designed as a free and open access PWA, it enables quick report registration with geolocation 🗺️ and multimedia support.
- **Web Interface for Administrators**: Facilitates the management and analysis of reports, including reporting 📊 and geographical visualization.

---

## Functionality ⚙️

### RESTful API Capabilities

- **Report Management**: Enables users to register and update reports, while allowing managers to consult and export data.
- **Multimedia and Geospatial Integration**: Supports associating reports with multimedia files and geolocation data.
- **Security**: Implements comprehensive security measures, including data encryption, spam validation, and attack prevention. 🛡️

### Database 🗄️

- The system utilizes a PostGIS database to efficiently store and manage geospatial data associated with reports.

### Multimedia Management 🖼️

- Multimedia files associated with reports are securely stored and maintained using AWS S3 buckets, ensuring data integrity and availability.

### Progressive Web Application (PWA) ✨

- The application provides a user-friendly interface for citizens to register reports with the following details:
  - **Geolocation**: Automatically captures the user's current location.
  - **Postal Code**: Allows manual entry of the postal code if needed.
  - **Multimedia**: Enables attaching photos or videos as evidence.
  - **Category**: Provides predefined categories for efficient classification.
- In addition, the application offers these functionalities:
  - **Notifications**: Keeps citizens informed about the status of their reports. 🔔
  - **Report History**: Allows citizens to view a history of their previously submitted reports. 📜

### Web Interface for Administrators 👨‍💻

- **Interactive Map Visualization**: View reports on an interactive map.
- **Report Filtering**: Filter reports based on status, type, or geographical location.
- **Report Management**: Change the type and validate reports.
- **Automated Reporting**: Generate automatic reports and export them to CSV/PDF formats.
- **Real-time Analytics**: Analyze data in real-time for data-driven decision-making.
- **Multimedia Map**: Access a multimedia map to check reports with a pop-up interface displaying details and multimedia files.

---

## Types of reports 📑

"Reclamo Ciudadano" is designed to handle a wide range of reports commonly encountered in Latin American municipalities. These are categorized by the following areas:

- **Lighting**: 💡 Burned-out streetlights, insufficient lighting, damaged light poles.
- **Signage**: 🪧 Damaged or missing street signs.
- **Sewage**: 🚰 Broken pipes, unpleasant odors, flooding.
- **Streets**: 🛣️ Potholes, damaged or missing speed bumps, inadequate signage at intersections.
- **Sanitation**: 🗑️ Debris, garbage, fallen trees, illegal dumping.
- **Public Safety**: 👮‍♂️ Theft, damage to public property, vandalism.
- **Public Health**: 🦟 Presence of disease vectors, pests, stray animals, standing water that could promote mosquito breeding.
- **Public Spaces**: 🏞️ Lack of maintenance of plazas, green areas, playgrounds and public fountains.

---

## Planned Features 🗓️

- **AI Integration**: 🤖 Automate report classification based on text or image analysis. Detects patterns and generates alerts for emerging issues.
- **Multichannel Support**: Expand report registration options to include WhatsApp, social media, and phone calls.
- **Citizen Panel**: Increase transparency through a public portal with aggregated data and interactive maps.
- **Enhanced Communication**: Provide automated messages to keep citizens informed about report progress.
- **Traceability**: Enable complete tracking of reports from registration to resolution.
- **Automated User Training**: Develop virtual training modules for new users. 👨‍🏫
- **Priority System**: Assign priorities to reports based on urgency or impact.
- **Integration with External Systems**: Ensure compatibility with existing urban monitoring platforms and emergency systems.

---

## Expected Benefits 👍

- Reduced response times. ⏱️
- Optimization of municipal resource utilization.
- Improved transparency and citizen satisfaction. 😊
- Generation of statistics for planning improvements.
- Automation that reduces human error.
- Increased citizen participation through accessible tools.
- Greater capacity to react to local emergencies through a unified platform.

---

## Conclusion 🎯

The implementation of "Reclamo Ciudadano" will enable municipalities to modernize their management, adapting to current citizen needs through efficient and accessible technology. This contributes to a more agile, transparent, and participatory governance model. Furthermore, the system provides tools for sustainable management, reducing the use of physical resources such as paper and promoting the efficient use of technology to enhance the quality of life for citizens.

---

## [Go to top](#reclamo-ciudadano-) ⬆️
