1. Login & Register
   I tried to make the layout of those two as clean and concise as possible via css.
   When the user types incorrect password or incorrect data like ID less than 6 characters when registering or when logging in,
   the user will be alerted with corresponding error message.
   E.g. When registering if password and confirm password does not match, user will be alerted that the Passwords do not match.
   Passwords do not match!

2. Main Page
   Once the user login/registered, the user will be directed to the main page. This page will show the users the list of feeds.
   For the usability I added number of buttons such as buttons for

   1. adding feeds
   2. Go to the user profile page
   3. Watch the other user by email
   4. Logout

3. Feeds
   Once the user login or register, the user will be directed to the main page which shows the job feeds created by the users the currently logged in user is watching.
   The feeds contain various informations the project spec mentioned.

4. Likes and comments on the job feed
   For the usability, I added the buttons representing the number of likes the feed has. Once it clicked, it will show the user who likes that feed.
   Furthermore, as heart emojis normally represent the likes, I added button with heart emoji that can user click. Once it clicked, the frontend will call
   user/watch to watch or unwatch the user.
   If user likes the feed, the emoji will be filled in red, if not, it will show blank heart emojis.

5. Feed Pagination (Infinite Scroll)
   Feedslist will contain 5 feeds only (If number of feeds are more than 5). If user watches all that feed, (meaning the user reaches at the end of the feedlist),
   the frontend will call the backend to load 5 more feeds and it will append those feeds to the feedslist which is infinite scroll.

6. User Profile Page
   User profile page will contain all the informations the user/get retrieve. The user profile page will have `Go Back to the Main Page` Button which direct the users
   to the main page where all the feeds are listed. Also, user can watch the user of the profile page by clicking watch button.
   Also, this page will show who's watching this user.

7. Own Profile
   This is really similar to the user profile page. However, it will show the user the forms that the user can update their attributes.

8. Watch / Unwatch
   I added two ways of watch/unwatch the user. One is the button called `Watch by Email` opening the popup that user can type the email and choose to watch or unwatch the user.
   Other method I used is that once the user is at the user profile page, there will be button called watch to watch the current user of the profile page.

9. Adding a job
   Adding a job will be the crucial part of the program and I believe it can be done anywhere in the web. So, I added `Add Feed!` button on the everywhere excpet the login and register page.

10. Update / Delete job feed
    If the user is the owner of the feed, inside the feedslist in the main page, the feeds will have two additional buttons to either update or delte the job feeds.
    This can also be done via button inside the feedslist in the user profile page which shows the feeds created by the user.

11. Leaving comment
    User can simply type what they wanna comment inside the feed byu typing what they wanna comment and click button next to it. As I didn't waana see any blank comments, I validated the comments by not accepiting the comment with only white spaces.
