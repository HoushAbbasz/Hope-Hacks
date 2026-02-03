# Civic Clarity
<p align="center">
  <img src="public/Assets/images/nav/logo.png" alt="Civic Clarity Logo" width="180">
</p>

Civic Clarity is a community centered web application designed to support individuals—especially immigrants and mixed status families by providing access to trusted information, legal resources, and local support in the Charlotte, NC area.

The application prioritizes accessibility, clarity, and safety, offering users a welcoming space to learn about their rights, locate legal help, and connect with verified organizations without fear or misinformation.



## 🌍 Our Mission

You deserve to feel safe, supported, and empowered in your community.

Whether you're seeking guidance on your rights, looking for local services, or simply need to know where to turn, Civic Clarity is here for you. Our commitment is to provide accessible and timely information in a space where you are valued and your needs matter.

Charlotte is stronger when all our communities thrive. We stand with you and are dedicated to helping you access the support available in our community.



## ✨ Features


#### 📄 Resources
- Educational **Know Your Rights** resource page
- Custom designed posters (English & Spanish)
- Downloadable poster assets
- Clear disclaimers to avoid providing legal advice
- **Locate a Detainee** button linking to the official U.S. government ICE locator website
- Four main cards linking to trusted legal and community resources

#### 🗺️ Search / Legal Help Locator
- Interactive, map based resource locator
- Search by Charlotte area address
- **Use My Location** (browser geolocation)
- **Find Nearest** resources
- **View All** legal assistance locations
- Results list synced with map markers
- Action buttons:
  - **Show Route**
  - **Open in Google Maps**

#### 📰 Articles / Newsletter
- Newsletter signup with real email delivery
- Uses an external email API (not mock data)
- Optional name and email stored in a database
- Confirmation email sent upon subscription



## 🌐 Accessibility & UX
- Spanish toggle / language support
- Responsive design (mobile, tablet, desktop)
- Back to Top button for long pages
- Clear step by step UI guidance
- Consistent CTA animations and styling



## 🏠 Home Page
- Mission statement
- Team images
- Navigation to all major features



## 🛠️ Tech Stack
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Node.js
- Express.js
- MySQL (database for newsletter subscriptions)
- Google: Maps, Directions, Geocoder
- AWS: Simple Email Service


## 🔌 APIs & External Services

### APIs Used
- Google: Maps, Directions, Geocoder
- AWS: Simple Email Service

### External Trusted Links
- ICE Detainee Locator (official U.S. government website)
- Local nonprofit and immigration legal organizations
- Reputable public legal information sources

All external links open in new tabs and direct users to official or trusted websites.



## ⚠️ Disclaimer (Important)

Civic Clarity does **not** provide legal advice.

All content is provided for educational and informational purposes only and may not apply to every individual situation. Results and resources may vary.

Users seeking legal advice should contact a qualified immigration attorney or accredited legal organization directly.



## 🖥️ Pages
- Home
- Resources
- Search
- Articles

🗄️ Database

MySQL database

Stores optional name and email from newsletter signup

Database connection managed via Node.js + Express

### 👥 Team Contributions

### Brittany Ramirez — Team Lead & Front End Developer


- Served as team lead, coordinating project timelines, setting meeting deadlines, submitting daily forms, and communicating with the project manager

- Designed and implemented all UI/UX for the Know Your Rights (Resources) page

- Designed and built the Map / Legal Help Locator page UI, including layout, responsiveness, and user flow

- Ensured consistent styling, accessibility, and responsiveness across mobile, tablet, and desktop views

- Collaborated closely with backend development to integrate APIs smoothly into the UI

### Housh Abbaszadeh — Back End Developer


- Implemented backend architecture for the application

- Set up and integrated the Google Maps and Google Places APIs for the Legal Help Locator

- Developed backend logic for the Map page, including search functionality and location handling

- Implemented the Newsletter subscription API

- Built backend functionality for the Back to Top feature

### Jessica Cruz — Front End Developer


- Designed and developed the Home page UI

- Built the navigation bar and footer used across the application

- Ensured full responsive design across mobile, tablet, and desktop breakpoints

- Focused on consistent layout structure, visual hierarchy, and accessibility

### Marilyn Castro Alonso — Full Stack Developer


- Implemented error handling and validation for the newsletter subscription form

- Added validation for map searches when users input locations outside the supported area

- Designed and developed the Newsletter / Articles page

- Improved user feedback and form behavior to enhance usability



## 🚀 Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/HoushAbbasz/Hope-Hacks.git
cd Hope-Hacks

2. Install dependencies

3. Environment Variables

Create a .env file in the root directory with the following variable names:

GOOGLE_MAPS_API_KEY=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
EMAIL_API_KEY=

⚠️ Do not commit the .env file.

4. Start the server
node server.js

5. Open in browser
http://localhost:3000

