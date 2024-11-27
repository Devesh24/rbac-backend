# This is the repository for the backend part of the project.

The backend for this project was designed using `NodeJS` and `ExpressJS`.
The database used is `MongoDB`.

## Important Links and Credentials

### `Deployment` : [https://rbac-interface.vercel.app](https://rbac-interface.vercel.app)

### `Frontend Repo` : [https://github.com/Devesh24/rbac-frontend](https://github.com/Devesh24/rbac-frontend)

### `Frontend Repo` : [https://github.com/Devesh24/rbac-backend](https://github.com/Devesh24/rbac-backend)

### `Admin credentials`:
username: `admin` 
pass: `admin`

### `Faculty credentials`:
username: `amit` 
pass: `amit`

### `Student credentials`:
admNo: `1` 
dob: `24-03-2001`


## Description

The Interface basically has three types of users - `Students`, `Faculties` and `Admin`.

A `Student` can login in the interface and can view his/her profile.

An `Admin` can login and can access all the special functionalities such as Add/Delete/Update/View Users, Faculties and Students
Also, the admin has the power to provide `permissions` to a specific user(faculty), so that he can access some of the functionalities that the admin has, such as Update/View Students, faculties.
The permissions can be given by admin using the `update user` option in `get all users` section.

A `Faculty` can only login if he/she has `permissions` given by the admin and also can only login using the credentials created and provided by admin.

