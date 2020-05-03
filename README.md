# INFSCI 2560 - Web Technologies and Standards - Project Report

# Infinite Library System

## Submitted by:

1. Aishwarya Jakka (aij12@pitt.edu)
2. Shubhrika Sehgal (shs253@pitt.edu)
3. Tejasvi Medi (tem73@pitt.edu)
4. Vipul Agarwal (via22@pitt.edu)

## Introduction

 <br/>
 This project was a collaboration between Aishwarya Jakka, Shubrika Senghal , Vipul Agarwal & Tejasvi Medi .Specific contributions are described in the 
contributions section. 
 
<strong> For this Project, </strong> we wanted to build a generic Library Management System that would handle the primary housekeeping functions of a library.
Libraries rely on library management systems to manage asset collections as well as relationships with their members.
Our Library management system would help libraries keep track of their books, checkout system, as well as members’ subscriptions and profiles.<br/>
It would also maintain a database for an admin user entering new books or Journals and recording those
that have been borrowed with their respective due dates.

## Objective

### Project Objectives

 <br/>
 For this project, we wanted to accomplish the following: 
 <br/>
 
-  Develop a website with user and admin capabilities that accessed a MongoDB database
-  Develop an application that would allow a reader(user)to search for the Books by their title on the provided search 
-  Also, develop an application that would handle the dynamic CRUD operations
-  Have the entities in the persistant databased that are identifiable uniquely i.e, Users, Books & Journals .
-  Develop a Library system that would allow the Admin to create,edit,delete- Books, Users , Journals and oversee all operations in the system
-  Build a cart and checkout system that would allow the users to issue a book
-  Dyanmically retrieve information like who took a particular book or what are the books checked-out by a specific user.
-  Also, a user would be see what books are checkout by him/user and when it is due to return.

### Learning Objectives

- Mostly have fun and our creative hats on for building an end-to-end MEEN application.

## Features and Functionality

- The application has functionality for two types of users namely Reader & Admin <br/>

### Reader

- One can create an account over the online portal by using a google account(discussed in challenges) or by using email id and password of their choice <br/>
- On using the application a member can borrow one or more books and journals through the online portal <br/>
- Edit only name and password on their own profile <br/>
- Readers can also check the details of the book or journal over the portal <br/>
- One click borrow for any book or journal of their choice (available in stock) <br/>
- Readers can use the cart functionality to borrow multiple books in one transaction <br/>
- Readers can view all the cart items and can checkout to issue the books.
- Reader will be able to view his/her issued books.

### Admin

- Admin users have all the privileges similar to that of a reader <br/>
- Admins have the access to discontinue or add any book, journal or user
- Admins can edit the all the details of any user (including username and email address) in the system

### Special Features

- Implemented Hashing for passwords by using <b>CryptDB</b> for storing the passwords in the database so that the password is encrypted
- We used complex non-CRUD APIs like findOneAndUpdate, DeleteMany over the application.
- Also implemented additional functionality not limited to validating various end points. We have implemented search feature,
  specific condition like display only available books that are more than 2 and searching the collection using REGEX operations.
- Configured Google API for user authentication and fetching the profile details.
- Passport - Local: We created our own local authorization using passport-local to authenticate user login and signup
- Used Javascript functions to manipulate the Timestamp.

## Contributions

### Aishwarya Jakka

- Designed the home screen page
- Role based autentication in APIs
- Error Handling on the back-end
- Debugging Glitch and Application issues in APIs and EJS files.
- Task List using Local Storage
- Developed books & some users pages including their APIs , validation and the front end. <br/>

### Shubhrika Sehgal

- Sessions management, Log-in and sign-up functions (using OAuth)
- Implemented Password Hashing
- Over all Styling of the Application
- Developed the Cart and Checkout and Issue APIs including the front-end
  styling and validations.
- Local Storage Implementation for user and role
- Debugging Glitch and Application issues<br/>

### Tejasvi Medi

- Designed the journals page, including their APIs and the front end
- Developed the Mongoose Model & Schema
- Created and deployed Navbar for all pages
- Assisting with error handling on the front end and back end
- Over all Styling of the Application
- Functionality, Usability and Compatibility testing<br/>

### Vipul Agarwal

- Designed the users details page, including the APIs and the front end
- Responsible for Data management so that we don't show you an empty screen
- Also, Designed the schema for MongoDb
- Over all Styling of the Application
- Report Documentation
- Project Presentation<br/>

## Technical Architecture

For our data model, we used Mongoose and MongoDB Atlas to house and access our data.
For our view, we used EJS to render our webpages. For our controller, we used Node.js and Express to develop endpoints
and create our application programming interface (API) to send HTTP requests to the database. Our system structure is as follows:

### Database

MongoDB
Package : Mongoose Schemas/models

- Books
- Journals
- Cart
- Users
- Issuance

### Technology stack

We used the following key technologies (see also, 'package.json' for a full list of dependencies):

- Passport - Local: We created our own local authorization using passport-local to authenticate user login and signup.
- Bcrypt: We used this to encrypt passwords that users created.
- Express-Session and Sessions: Used to maintain session management by storing user information.

### Backend:

- We have used the NodeJS and Unique API routes for handling the requests. Also used non-CRUD operations DeleteMany, Operation over Regex, FineOneAndUpdate over the application.
- Role based validation for Admin vs Reader various routes.
- The handler routes are present in the routes folder.
- We have used passport and local statergy for authentication and bycrypt js for implementing secure password
- Error Handling to display messages on the screen

### Frontend: HTML, EJS, JavaScript, CSS, Bootstrap

- We have the Sign Up & Login page for the initial view of the application.
- We used EJS for templating , bootstrap features like navbar, buttons, collapse etc for styling and CSS and FontAwesome icons for the beautification of the pages.
- DateNow method is used for using the date field in the application.
- We aimed to maintain consistent design across all the pages of users and admin.
- We have used nodeJS to fetch data from REST API end points in administrator dashboard
- Used jQuery for implementing the search bar for books and cart items
- User javascript and localstorage to show the recently viewed books
- Implemented webforms for register user and log in with proper validations for missing fields, unique email address, password length and passport match. <br/>
- We added JavaScript interactivity in the Home Screen under Events called <b>Text Over Image</b>

We employed Model-View-Controller(MVC) conceptual model using Mongoose (for model), EJS and Bootstrap (for view), and NodeJS & JavaScript (for controller).
We also made use of HTML5's local storage API to implement the last viewed book feature.

## API End Points

### Books

- get("/"): fetches all the books for the admin user
- get("/addbook"), post("/addbook"): picks the book from the form and adds new book to the database for admin
- get("/:id/editbook"), post("/:id/editbook"): updates a new book based on a specific book code
- get("/:id/deletebook"), findOneAndDelete("/:id/deletebook"): deletes a book based on a specific book code
- get("/availablebooks"): lists the available books in the database
- get("/search/:name"): searches the book based on their name

### Journals

- get("/availablejournals"): lists all the available journals
- get("/addjournal"), post("/addjournal"): adds a new journal to the database
- get("/:id/editjournal"), post("/editjournal"), findOneAndUpdate(""): edits the journal and update based on the journal id
- get("/:id/deletejournal"): deletes the journal based on the journal code
- get("/:id/addtocart"): adds a journal to the cart
- get("/search/:name"): search journal ased on the name

### Users

- get("/allusers"): gets all the users for the admin view
- get("/:id/editprofile"): it retrieves users personal information and allow them to edit or update it
- get("/adduser"), post("/adduser"): adds a new user to the database
- get("/:id/edituser"), post("/edituser"): edit a user based on their user name
- get("/:id/deleteuser"), findOneAndDelete("/:id/deleteuser"): delete a user based on user name

### Cart

- get("/clear"): removes items from the cart
- get("/clearissue"), deleteMany(""): empties the cart for the specific user on checking out the books or journal
- get("/:id/delete"), deleteMany(""): deletes items from the cart based on id

### Issued books

- get("/checkout"): checks out the issued copies for the user
- get("/:id/delete"), findByIdAndRemove(""): this admin rle API checks the issued copy by id and deletes them
- get("/"): it is an admin level API giving the details of the issued inventories to the admin

### Error handling

We used _message.ejs_ to display the messages and are rendered on the current page to notify the user for the error handling.

### Testing

To test the application, any user can register and create their own profile and begin using any of the features on the website.

To test the admin side of the application please use the admin username: tem74@pitt.edu and password: Pitt123.

### Challenges Faced

- We tried to implement Google API for the application. We were succuessful in logging-in successfully but were unable to fetch the user profile.
  Google API code is still present but commented out to have a seamless experience of the Application.This task consumed the maximium bandwidth for our team. <br/>
- Also tried using Facebook Login SDK for the fetching the user profile. Although, we were able to resolve the above issue of having a accessToken and userID associated with the user login
  but due to glitch issues while syncing with the Facebook API and time constriants ,we were not able to move forward with this.
- Our application crashed many times! The number is atleast 5-10 times a day! It would remove all the dependencies, the page would dance around and simply hang. Also,we have noticed with glitch there is also a Socket error hich is really out of our contro.
- These are difficult times and it was challenging to collaborate together at the same time.
  With 4 developers working at the same time glitch was unresponsive at times. We temporarily resolved this by remixing it to do our incremental changes and
  debug but it is difficult to make sure that all changes made in the remixed copy is reflected in the main project

### Future implementations

#### React JS or Angular JS

We would have really liked to have used React JS or Angular JS for a more refined User Interface

#### Features

- We would have liked to add a return a book feature .
- Introduce a recommendation system which can suggest books to our users based on their past orders.<br/>
- We would have liked to have a rating system or a 'Reviews' section for the books
- The application only deals with books as of now. Our future plans to include magazines and academic textbooks into system.<br/>

### Conclusion

Together, we feel that the course really helped us get our hands dirty with some of the most popular technologies in Web Development.
Also , made us a lot more comfortable with Web Development. In this course , we learnt both the backend and front end and through this project we experienced how
all the technologies come together and build a beautiful website. We were curious how SQLLite Implementation would have worked with us but with the challenges we faced,
we take this as a learning experience and we throughly enjoyed it.
