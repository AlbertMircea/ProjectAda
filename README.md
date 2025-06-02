# Prescription Delivery Bot

## Project Summary

This project is a full-stack web application designed to streamline and digitalize medication requests within a hospital environment. It enables doctors to organize patients, nurses to request medications, and pharmacists to approve or deny them, while also simulating medication transport visually. An AI-powered chatbot is also integrated using Azure AI services to support patient inquiries or assist hospital staff with quick medical Q&A.

---

## Team Members

- Aleznauer Albert-Mircea
- Berzava [Dabica] Raluca

---


## Technologies Used

- **Frontend**: Angular  
- **Backend**: ASP.NET Core Web API (C#)
- **Mobile**: Flutter 
- **Database**: SQL Server, using stored procedures  
- **Authentication**: Token-based (JWT)  
- **AI Integration**: Azure AI Inference (DeepSeek-R1)  
- **Hosting**: Azure App Services
- REST API Calls to communicate between servers
- SignalR .NET library for real-time notifications
- Server-Sent Events(SSE) for live chatbot responses


---

## Installation Instructions

To run the application, you first need to install Node.js

Don't forget to update the path to npm and Node.js in the environment variables if your system doesn't recognize the 'npm' command.

To run the mobile application, you need to install Android Studio and follow the instructions steps here https://docs.flutter.dev/get-started/install/windows/mobile


1. **Clone the repository**
   ```bash
   git clone https://github.com/AlbertMircea/ProjectAda.git
   cd ProjectAda
   
2. **Frontend**

   
Navigate to /frontend
   ```bash
   cd /Frontend
   ```
Install dependencies:
   ```bash
   npm install
   ```
Start the application:
  ```base
   npm start
  ```


3. **Mobile**
   
Ensure Virtualization is Enabled: go into your BIOS/UEFI and enable:SVM Mode (for AMD) or VT-x (for Intel)/IOMMU if available (for AMD)

Locate or Install cmdline-tools
   If it's missing, here's how to install it manually:
   Option A: Using Android Studio
   Open Android Studio.
   Go to Settings > Appearance & Behavior > System Settings > Android SDK.
   In the SDK Tools tab:
   Make sure "Android SDK Command-line Tools (latest)" is checked.
   Click Apply and wait for it to finish.
   
5. **BackEnd**


Servers are UP and Running on Azure:
   
https://aleznauerdtc2.azurewebsites.net

https://aleznauer-ward-emergency2.azurewebsites.net

https://aleznauer-ward-general2.azurewebsites.net



## Contact
For access to APIs or any questions, contact aaleznauer@gmail.com or open an issue in the repository.

To access the APIs, your IPv4 needs to be added in the Azure Portal by us!


   
