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

To run the application, you first need to install JFrog.

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
  ```
   npm start
  ```

3. **BackEnd**


Servers are UP and Running on Azure:
   
https://aleznauerdtc2.azurewebsites.net

https://aleznauer-ward-emergency2.azurewebsites.net

https://aleznauer-ward-general2.azurewebsites.net



## Contact
For acces to APIs or any questions, contact aaleznauer@gmail.com or open an issue in the repository.


   
