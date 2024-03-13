<p align="center">
  <img src="https://github.com/UlrichCODJIA/package_tracker/blob/master/repository_icon.png?raw=true" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">PACKAGE_TRACKER</h1>
</p>
<p align="center">
    <em>Package Tracker is a web application suite designed for package tracking and delivery management.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/UlrichCODJIA/package_tracker?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/UlrichCODJIA/package_tracker?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/UlrichCODJIA/package_tracker?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/UlrichCODJIA/package_tracker?style=default&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Tests](#-tests)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
</details>
<hr>

##  Features

| Feature         | Description                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------|
| Architecture   | A Node.js backend application with Express.js for handling API requests, MongoDB for data persistence, and Socket.IO    |
|                | for real-time updates. Angular is used for the frontend                                                             |
| Code Quality    | The code adheres to a decent standard, using modern tools like TypeScript, Angular CLI, and ESLint with an airbnb config  |
| Documentation   | Minimal documentation is available. Mainly focuses on ReadMe.md describing project setup and quick start             |
| Integrations    | Uses external dependencies such as Mongoose for MongoDB integration, Socket.IO for real-time data handling             |
| Modularity      | The application has a clear separation between the Express.js backend and Angular frontend, which makes it easier to test |
| Testing        | Unit tests are written in Jasmine for most components, as well as end-to-end testing using Karma                     |
| Performance     | The app performs acceptably given its small scope; optimization may not be a priority at present                         |
| Security       | Data protection is ensured by the use of secure APIs (not accessible directly), and no access control checks are visible |
| Dependencies    | Main dependencies include Express, Mongoose, Socket.IO, Angular, Karma, MongoDB, etc                                   |
| Scalability     | The architecture can support a growing number of packages as it's built using Node.js and an underlying scalable       |

---

##  Repository Structure

```sh
└── package_tracker/
    ├── app.js
    ├── client
    │   └── package-tracker
    ├── models
    │   ├── Delivery.js
    │   └── Package.js
    ├── package-lock.json
    ├── package.json
    └── routes
        ├── deliveries.js
        ├── packages.js
        └── utils.js
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [package-lock.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/package-lock.json) | The `package-lock.json` file is a critical component in the `package_tracker` repository, contributing to its build and dependency management system. Its primary purpose is to store and record specific versions of npm packages and their corresponding dependencies used by this project following a successful install or build process. By maintaining an up-to-date `package-lock.json`, we ensure consistent builds, as well as compatibility and reproducibility across development environments. |
| [package.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/package.json)           | Navigate through the repository structure. The package.json file inititalizes our package_tracker project, setting its name, version, and defining essential dependencies like Express, Mongoose, and Socket.IO. This configuration is crucial for our application to run effectively.                                                                                                                                                                                                                     |
| [app.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/app.js)                       | Initiates Express server and handles Socket.IO connections, managing real-time delivery updates in this Node.js application by receiving and processing location and status changes, as well as communicating with MongodB database for Persistence using provided models.                                                                                                                                                                                                                                 |

</details>

<details closed><summary>routes</summary>

| File                                                                                              | Summary                                                                                                                                                                                                                                                                                                    |
| ---                                                                                               | ---                                                                                                                                                                                                                                                                                                        |
| [packages.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/routes/packages.js)     | Route handler for managing packages in the package tracking system. Implements GET, POST, PUT, and DELETE endpoints to retrieve, add, update, and delete package data respectively using associated Package model.                                                                                         |
| [utils.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/routes/utils.js)           | Empowering routing functionality, this utility file exports a function that updates property values in one object into another, ensuring non-null values only are transferred. Reinforcing modularity within the package tracker application.                                                              |
| [deliveries.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/routes/deliveries.js) | Navigate through express routes in the delivery module. Retrieve all deliveries and access specific ones by ID. Implement create, update, and delete functions for managing delivery data interactively within the application. Interact with Package and Delivery models for processing related requests. |

</details>

<details closed><summary>client.package-tracker</summary>

| File                                                                                                                        | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                         | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [package-lock.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/package-lock.json)   | The `client/package-tracker/package-lock.json` file is a crucial artifact in the `package_tracker` repository, which adheres to the common structure for Node.js projects. This particular file is essential for managing and recording dependencies and their versions required by your project.When developers install packages using `npm install`, package-lock.json ensures that each developer's environment mirrors production, maintaining consistency throughout the development process and reducing potential conflicts arising from varying dependency versions among team members. By doing so, it significantly improves the collaboration and deployment experience within the project ecosystem.The main purpose of the `package-lock.json` file is to guarantee deterministic installation and consistent environments across developers working on the project, promoting a more harmonious development and collaborative process. |
| [package.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/package.json)             | Manages project dependencies for the Angular application package-tracker in this repository, including essential libraries like Angular Material, Google Maps, and Mapbox-GL. Provides scripts for development, testing, and production builds.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [tsconfig.spec.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/tsconfig.spec.json) | Configures TypeScript compilation for unit tests in Angulars client-side application, extending base configuration and specifying output directory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [tsconfig.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/tsconfig.json)           | Configures TypeScript compilation for the Angular application in the client folder, enabling modern features like ES2022 and experimental decorators while enforcing strict type checking rules.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [angular.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/angular.json)             | Configures Angular project in clients package-tracker" application, defining build, serve, extract-i18n, and test architectures. Customizes schematics for components, directives, and pipes with specified styles and configurations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [tsconfig.app.json](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/tsconfig.app.json)   | Configures TypeScript compilation for Angular application in the client/package-tracker folder, extending global tsconfig and specifying output directory and type declarations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

</details>

<details closed><summary>client.package-tracker.src</summary>

| File                                                                                                              | Summary                                                                                                                                                                                                                                                     |
| ---                                                                                                               | ---                                                                                                                                                                                                                                                         |
| [index.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/index.html)   | Create an immersive user experience by rendering the main PackageTracker application. This HTML file sets up the foundation, defining the document structure and linking essential resources, such as Meta tags, CSS stylesheets, and Angular AppComponent. |
| [main.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/main.ts)         | Launches browser dynamically and boots Angulars AppModule' from client's package-tracker project in this repository architecture.                                                                                                                           |
| [styles.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/styles.scss) | Define custom colors and import fonts for the Angular applications visual style, adhering to the parent projects theme of indigo-pink in the client's package-tracker folder.                                                                               |

</details>

<details closed><summary>client.package-tracker.src.app</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                                                                                                                                  |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                                                                                                                                      |
| [app.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app.component.scss)       | This `app.component.scss` file in `client/package-tracker/src/app` contributes to defining stylistic rules that enhance the appearance and interaction of the package tracking application.                                                                                                                                                                              |
| [app.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app.component.spec.ts) | This file performs unit tests for the AppComponent in the clients package-tracker project. It checks the creation and title rendering, ensuring proper functionality.                                                                                                                                                                                                    |
| [app.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app.component.ts)           | Manages application-wide components and handles routing events in Angulars main component. Adjusts the background color of the body based on current route URLs.                                                                                                                                                                                                         |
| [app.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app.component.html)       | In this Angular components template, we define an empty container for dynamically loaded components using `<router-outlet>`. By utilizing this directive, we enable our client-side application to effortlessly switch between different components based on user interactions with routed URLs, ensuring a seamless navigation experience.                              |
| [app.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app.module.ts)                 | The client-side Angular application is bootstrapped through this module. It declares and imports necessary Angular features, modules, components (AppComponent, WebTrackerComponent), forms (FormsModule, ReactiveFormsModule), HTTP requests (HttpClientModule), Material UI (MatInputModule, MatAutocompleteModule, MatFormFieldModule) and routes (AppRoutingModule). |
| [app-routing.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/app-routing.module.ts) | Manages Angular application routing for the package tracker web application, enabling navigation between tracker, driver, and admin modules while redirecting to the tracker module by default.                                                                                                                                                                          |

</details>

<details closed><summary>client.package-tracker.src.app.web-tracker</summary>

| File                                                                                                                                                                  | Summary                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                                                   | ---                                                                                                                                                                                                                                                                                                                                  |
| [web-tracker-routing.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker-routing.module.ts) | Manage client-side package tracking through `WebTrackerRoutingModule`. Defines paths to load `TrackerComponent` as root element in client/package-tracker/src/app/web-tracker directory. Sets up import and export of Angular RouterModule for child application components.                                                         |
| [web-tracker.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker.component.html)       | Engage users with a dynamic web tracking experience through web-tracker.component.html in the client's Angular application. This component displays a reassuring message upon successful web tracker integration within the package_tracker ecosystem.                                                                               |
| [web-tracker.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker.component.spec.ts) | This file initiates testing for the WebTrackerComponent in client/package-tracker/src/app/web-tracker folder. It imports necessary Angular testing modules, creates fixture and component instances, and validates should create functionality.                                                                                      |
| [web-tracker.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker.component.ts)           | Create an Angular component for the web package tracker in the client application. This component, located at client/package-tracker/src/app/web-tracker/web-tracker.component.ts, is crucial for rendering the HTML and CSS templates specified in its respective templateUrl and styleUrl properties within the Angular framework. |
| [web-tracker.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker.module.ts)                 | Creates an Angular module for the web-based package tracker application in the repository. Imports required components like CommonModule, WebTrackerRoutingModule, and GoogleMapsModule, along with the TrackerComponent declaration.                                                                                                |
| [web-tracker.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/web-tracker.component.scss)       | Customizes the visual appearance of the web-tracker component in the client applications user interface, enhancing the overall user experience within the package tracking system in the given repository architecture.                                                                                                              |

</details>

<details closed><summary>client.package-tracker.src.app.web-tracker.tracker</summary>

| File                                                                                                                                                                  | Summary                                                                                                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                                                   | ---                                                                                                                                                                                                                                                                                                                                                                                                |
| [tracker.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/tracker/tracker.component.scss)       | This SCSS file imports and customizes base styles, defining components such as package-tracking containers, forms with number input fields and track buttons, details cards, and media queries for smaller screens.                                                                                                                                                                                |
| [tracker.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/tracker/tracker.component.ts)           | Set new delivery location. Fetch and draw route geometry. Animate marker along the route. Remove old layers if previous delivery completed.                                                                                                                                                                                                                                                        |
| [tracker.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/tracker/tracker.component.html)       | Navigate the user interface of a package tracking application. Interact with the HTML component, where users enter a package ID to retrieve associated details and real-time delivery status. Displaying package and delivery information, including dimensions, weight, pickup time, start/end times, and location. Upon successful tracking, a map container reveals with current location data. |
| [tracker.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-tracker/tracker/tracker.component.spec.ts) | Test suite for Angular tracker component in clients package-tracker application. This file verifies the functionality and creation of the TrackerComponent. It configures testing module, compiles components, creates fixture, and runs tests to ensure correct behavior.                                                                                                                         |

</details>

<details closed><summary>client.package-tracker.src.app.web-admin</summary>

| File                                                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                |
| [web-admin-routing.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin-routing.module.ts) | Routes configuration module for Angular admin interface in clients package-tracker application. Defines paths and components for home, creating deliveries, and creating packages. Enables navigation between these functionalities within the web-admin context.                                                                  |
| [web-admin.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin.component.spec.ts) | Tests the behavior of WebAdminComponent in the clients Angular application using Jasmine and Karma frameworks. Ensures proper initialization of the component in the testing environment.                                                                                                                                          |
| [web-admin.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin.component.ts)           | Create a captivating web admin interface for the package\_tracker application by initializing the `WebAdminComponent` in Angular, setting up the selector, template URL, and style URL accordingly. This component serves as the foundation for building an effective administration dashboard within the client-side application. |
| [web-admin.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin.module.ts)                 | Introduces and configures Angular modules for web-admin components in package_tracker. Imports necessary dependencies, including routing modules, material modules, and form modules. Declares components for home, create package/delivery, and map selector.                                                                     |
| [web-admin.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin.component.html)       | In the `client/package-tracker` folder lies `web-admin.component.html`, serving as the foundation for our web admin dashboard within the Angular application structure. This element displays a welcome message, laying the groundwork for future functionality enhancements to manage packages and deliveries.                    |
| [web-admin.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/web-admin.component.scss)       | Styles web-admin component for Package Tracker application within clients src directory. Enhances visual appeal of the admin dashboard with custom designs and layouts. Interacts with app.js through scss files to dynamically alter application appearance.                                                                      |

</details>

<details closed><summary>client.package-tracker.src.app.web-admin.home</summary>

| File                                                                                                                                                       | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                                                                        | ---                                                                                                                                                                                                                                                                         |
| [home.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/home/home.component.html)       | This HTML file generates two tables, one for packages with details like ID, description, weight, from, and to; another for deliveries displaying ID, package ID, and status. Additionally, it includes Create Package and Create Delivery buttons.                          |
| [home.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/home/home.component.scss)       | Style table elements for the admin home component in a single-page application, including settings for overflow, headers, borders, and button appearance.                                                                                                                   |
| [home.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/home/home.component.spec.ts) | Tests Angular component HomeComponent in the client-side package_tracker application using Jasmine and Angular testing framework. The components creation is verified through assertions.                                                                                   |
| [home.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/home/home.component.ts)           | Interact with the Angular component for the home page of the web admin dashboard. Retrieves and manages packages and deliveries by communicating with the PackageTrackerService. Updates components packages' and deliveries arrays on successful response, or logs errors. |

</details>

<details closed><summary>client.package-tracker.src.app.web-admin.create-package</summary>

| File                                                                                                                                                                                     | Summary                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                                                                      | ---                                                                                                                                                                                                                                                                                                                     |
| [create-package.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-package/create-package.component.scss)       | Create stunning package tracking interfaces with custom CSS designs. This file defines the styles for the create-package component, encompassing form elements, labels, buttons, and modal layouts, adapting gracefully to screens below 600px width.                                                                   |
| [create-package.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-package/create-package.component.spec.ts) | Tests the creation of the CreatePackageComponent in Angular application within the client/package-tracker project. Ensures proper initialization and verifies component existence.                                                                                                                                      |
| [create-package.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-package/create-package.component.ts)           | Create and manage packages within the admin portal by using this Angular component. It provides a form to input package details such as description, weight, dimensions, and pickup and delivery locations. Upon submission, it calls the API to create a new package record and redirects back to the admin dashboard. |
| [create-package.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-package/create-package.component.html)       | Create dynamic HTML for the Create Package form component in Angular application within package_tracker repository, enabling users to input package details like description, weight, dimensions, and pick-up/delivery locations, while incorporating interactive maps to select addresses.                             |

</details>

<details closed><summary>client.package-tracker.src.app.web-admin.create-delivery</summary>

| File                                                                                                                                                                                        | Summary                                                                                                                                                                                                                               |
| ---                                                                                                                                                                                         | ---                                                                                                                                                                                                                                   |
| [create-delivery.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-delivery/create-delivery.component.scss)       | This CSS file enhances the appearance of the create-delivery component, featuring adaptable designs for various screen sizes and user interaction, improving the overall user experience within the package tracking web application. |
| [create-delivery.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-delivery/create-delivery.component.spec.ts) | Test unit for Angulars CreateDeliveryComponent. Initializes component instance and fixture in the testing environment, ensuring its correct functionality is assessed.                                                                |
| [create-delivery.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-delivery/create-delivery.component.ts)           | Create component for admin interface to generate new delivery. Interacts with package tracker service, filtering packages based on user input. Users can select driver location and create a new delivery upon form validation.       |
| [create-delivery.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/create-delivery/create-delivery.component.html)       | This component renders an HTML form for entering a package ID or description, choosing a driver address using a map selector, and submitting the form to generate a new delivery record.                                              |

</details>

<details closed><summary>client.package-tracker.src.app.web-admin.map-selector</summary>

| File                                                                                                                                                                               | Summary                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                                                                | ---                                                                                                                                                                                                                                                                                                                             |
| [map-selector.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/map-selector/map-selector.component.ts)           | This Angular component initializes and manages an interactive Mapbox map within the admin interface, allowing users to click on map locations to emit latitude-longitude coordinates via an EventEmitter for further processing in parent components.                                                                           |
| [map-selector.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/map-selector/map-selector.component.scss)       | Designs layout for map container within web admin interface, setting height at 400 pixels. (client/package-tracker/src/app/web-admin/map-selector/map-selector.component.scss)                                                                                                                                                  |
| [map-selector.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/map-selector/map-selector.component.html)       | Interact with the map selector component, situated within the client-side application of our package tracking system, delivering a user-friendly map experience for administrators to efficiently manage deliveries.                                                                                                            |
| [map-selector.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-admin/map-selector/map-selector.component.spec.ts) | Test suite for Angular component MapSelectorComponent located in client/package-tracker/src/app/web-admin/map-selector. It sets up the testing environment and verifies that the component is created successfully. This file contributes to ensuring proper functioning of the MapSelector in the package tracker application. |

</details>

<details closed><summary>client.package-tracker.src.app.web-driver</summary>

| File                                                                                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                                                | ---                                                                                                                                                                                                                                                                                                                                             |
| [web-driver.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver.module.ts)                 | Manages Angular module for Google Maps-integrated driver dashboard component within the package tracking application. Imports necessary modules and declares associated components.                                                                                                                                                             |
| [web-driver.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver.component.ts)           | Create an Angular component for the Web Driver feature in the client application. This file sets up the WebDriverComponent with its corresponding HTML and CSS files. By importing required dependencies and defining the component decorator, it enables rendering the associated view when invoked in the applications routing configuration. |
| [web-driver.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver.component.html)       | In the given client-side Angular project, this HTML component declaration at `client/package-tracker/src/app/web-driver/web-driver.component.html` showcases a message confirming web driver functionality. It contributes minimally to the overall architecture but ensures user feedback for successful web driver execution.                 |
| [web-driver.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver.component.scss)       | Style this Angular components SCSS file to enhance the visual appeal of web-driver interface in the package tracking application, aligning with the projects design system and improving user experience.                                                                                                                                       |
| [web-driver-routing.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver-routing.module.ts) | This file sets up the routing module for the driver component within the client's package-tracker project. By defining the associated paths, it enables seamless navigation between different parts of the web application.                                                                                                                     |
| [web-driver.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/web-driver.component.spec.ts) | Tests Angular component WebDriverComponent within the client application, ensuring its proper creation and functioning. Located at client/package-tracker/src/app/web-driver/web-driver.component.spec.ts.                                                                                                                                      |

</details>

<details closed><summary>client.package-tracker.src.app.web-driver.driver</summary>

| File                                                                                                                                                              | Summary                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                                               | ---                                                                                                                                                                                                                                                                                                                     |
| [driver.component.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/driver/driver.component.spec.ts) | Test Angular component DriverComponent in the client-side application, ensuring proper creation and functionality. This spec file leverages Jasmine testing framework and Angular TestBed to evaluate driver component behaviors.                                                                                       |
| [driver.component.html](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/driver/driver.component.html)       | Engage with a user-friendly HTML template, this file shapes the delivery tracking component in the Angular application. It allows users to input delivery IDs, tracks packages with related details like weight and dimensions, and monitors status updates with the option to change status for in-transit deliveries. |
| [driver.component.scss](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/driver/driver.component.scss)       | Create visually appealing delivery tracking interfaces. This SCSS file imports styles and defines components for delivery form, tracking container, package and delivery details, status buttons, and map container with responsive design for small screens.                                                           |
| [driver.component.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/web-driver/driver/driver.component.ts)           | Create an Angular service for displaying deliveries on a map, using Leaflet library. Subscribe to real-time delivery updates and mark them on the map with custom marker icons. Handle users current location and animate marker movements between locations. Watch out for permission prompts.                         |

</details>

<details closed><summary>client.package-tracker.src.app.shared</summary>

| File                                                                                                                                                                     | Summary                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                                                                      | ---                                                                                                                                                                                                                                                                                                                   |
| [mapbox-routing.service.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/mapbox-routing.service.spec.ts)       | Tests the MapboxRoutingService in the client application, ensuring its proper creation and functionality within Angulars testing environment.                                                                                                                                                                         |
| [shared.module.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/shared.module.ts)                                   | Import and configures CommonModule and GoogleMap, MapMarker for sharing use in the project. Enables usage of Google Maps across different components.                                                                                                                                                                 |
| [real-time-updates.service.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/real-time-updates.service.spec.ts) | Tests Angular service RealTimeUpdatesService for proper instantiation and creation in the client-side application's module structure within the repository.                                                                                                                                                           |
| [mapbox-routing.service.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/mapbox-routing.service.ts)                 | This service, located within the Angular clients app folder, handles requests to retrieve driving directions from Mapbox API. It returns the route geometry for further use in the application.                                                                                                                       |
| [package-tracker.service.spec.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/package-tracker.service.spec.ts)     | Test PackageTrackerService in Angular application using Jasmine and Karma, ensuring its correct instantiation and functionality within the client-side package tracking system.                                                                                                                                       |
| [real-time-updates.service.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/real-time-updates.service.ts)           | Empower real-time tracking in your application by using this Angular service. It establishes a connection with the server via Socket.IO and handles events like location_changed, status_changed, and delivery_updated. Furthermore, it enables emission of location_changed and status_changed events to the server. |
| [package-tracker.service.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/app/shared/package-tracker.service.ts)               | Service for interacting with package tracking API. Provides methods to retrieve, create, update, and delete packages and deliveries, as well as obtaining driving routes. Communicates with API via HTTP requests. Angular injection with HttpClient.                                                                 |

</details>

<details closed><summary>client.package-tracker.src.environments</summary>

| File                                                                                                                                                         | Summary                                                                                                                                                                                                                                       |
| ---                                                                                                                                                          | ---                                                                                                                                                                                                                                           |
| [environment.development.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/environments/environment.development.ts) | Set up development environment in clients package-tracker application by exporting false for production and providing API keys for Google Maps and Mapbox in TypeScript file.                                                                 |
| [environment.ts](https://github.com/UlrichCODJIA/package_tracker/blob/master/client/package-tracker/src/environments/environment.ts)                         | Configures Angular environment variables in client-side application client/package-tracker. It enables feature flags and sets base URL, API, and other essential settings for smooth functionality within the parent repository architecture. |

</details>

<details closed><summary>models</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                                                                            |
| ---                                                                                           | ---                                                                                                                                                                                                                                                                                |
| [Delivery.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/models/Delivery.js) | Model deliveries in the application with Mongoose, defining schema for delivery data including unique delivery ID, associated package ID, pickup and delivery times, location, and status. Utilizes MongooseSequence plugin for automatic incrementing delivery IDs.               |
| [Package.js](https://github.com/UlrichCODJIA/package_tracker/blob/master/models/Package.js)   | Model Package schema in models/Package.js initializes MongooseSchema for managing package data. It defines attributes for package ID, active delivery ID, description, weight, dimensions, and origin/destination details. Uses MongooseSequence plugin for auto-incrementing IDs. |

</details>

---

##  Getting Started

**System Requirements:**

* Install **Node.js** and **npm (Node Package Manager)** if they're not already installed. You can download them from [Node.js official website](https://nodejs.org/).
* Install **MongoDB**. Follow the instructions on the [MongoDB official website](https://www.mongodb.com/) for your operating system.
* Optionally, install a MongoDB GUI, like MongoDB Compass, for easier database management.

###  Installation

<h4>From <code>source</code></h4>

> 1. Clone the package_tracker repository:
>
> ```console
> $ git clone https://github.com/UlrichCODJIA/package_tracker
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd package_tracker
> ```
>
> 3. Install the dependencies:
> ```console
> $ npm install
> ```
> 4. Ensure MongoDB is running. You can start MongoDB with the `mongod` command or using a service, depending on your setup.
> 5. Configure your database connection in the `app.js` file.
> 6. Start the Node.js application with `node app.js` command.
> 7. Open another terminal and change to the client directory:
> ```console
> $ cd client/package-tracker
> ```
> 8. Install the dependencies:
> ```console
> $ npm install
> ```
> 9. Start the Angular application with `ng serve` command.
> 10. Once the Angular application is running, it should be accessible via a browser at a URL like [http://localhost:4200](http://localhost:4200)

###  Usage

<h4>From <code>source</code></h4>

> Run package_tracker using the command below:
> ```console
> $ npm run build && node app.js
> ```

###  Tests

> Run the test suite using the command below:
> ```console
> $ npm test
> ```

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/UlrichCODJIA/package_tracker/issues)**: Submit bugs found or log feature requests for the `package_tracker` project.
- **[Submit Pull Requests](https://github.com/UlrichCODJIA/package_tracker/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/UlrichCODJIA/package_tracker
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com{/UlrichCODJIA/package_tracker/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=UlrichCODJIA/package_tracker">
   </a>
</p>
</details>

---

##  License

This project is protected under the [MIT Licence](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

[**Return**](#-features)

---
