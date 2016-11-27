# Nis Transit

Transit app for the city of Nis (created with Meteor).

## Description

This app tracks and displays realtime position of city buses on the map.  
It includes **regular** and **admin** user roles.

### Regular user

Regular user access the app over 2 routes:  

**Home page** `/`  
From where you can select the line that you want to check and you can see basic in app stats (total number of lines, stations and buses).  

![Home page](/docs/screenshots/page-home.png)



**Line page** `/{lineNumber}` (for example: `/1`, `/9`, `/34`)  
Here you can track in realtime, on the map, positions of all buses that are driving on that line, see ETA for each bus, get more info about the stations on that line and track your own position with geolocation API.  

![Line page](/docs/screenshots/page-line.png)



### Admin user
Admin user is responsible for adding (deleting & updating) stations and lines to the system.
Currently app uses internal simulator for buses and whenever new line is created random number of buses (4-11) are created and attached to that line.

Admin access the app over `/admin` route.

#### Admin panel instructions

![Admin Panel](/docs/screenshots/page-admin-1.png)



**Adding new station**  
*Double click* anywhere on the map will bring popup where new station details can be entered.
![Adding new station](/docs/screenshots/page-admin-2.png)

Station will be added on coordinates where double click happened.
![New station](/docs/screenshots/page-admin-3.png)

Station can be dragged and repositioned (unless it is already attached to some of the lines). It name can be updated any time in the *selected station panel* in top left corner, where you can alse see other station details and actions.

Station markers:
 - **Green** - station is selected
 - **Blue** - station isn't attached to any line and it position can be changed
 - **Yellow** - station is attached to some of the lines and it position can not be changed
 - **Red** - station is part of new line that is being created


**Creating new line**  
When station is selected (single click on station) it can be added to the new line by clicking *plus icon* in *selected station panel* or by pressing `A` key on your keybord. *New line panel* will be shown then, from where you can create new line (only if there are 3 or more selected stations in new line).
![New line](/docs/screenshots/page-admin-4.png)

Clicking *check icon* in *new line panel* or  pressing `C` key on your keybord will bring popup where you can enter details for the new line, *line number* & *line-direction*
![New line](/docs/screenshots/page-admin-5.png)


##### Admin panel keybord shortcuts

- `D` - delete selected station
- `A` - add selected station to the new line
- `R` - remove selected station from the new line
- `C` - create new line from the list of all selected station



## Setup

You need to have [Meteor](https://www.meteor.com/) installed localy in order run this app.

After that just run the following steps in terminal (from the app folder):
1. `meteor npm install` - install all required npm dependencies
2. `meteor` - install meteor dependencies and packages and start the app

App will start at: `localhost:3000`
