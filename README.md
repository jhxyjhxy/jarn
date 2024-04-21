# NatureQuest

## Welcome!
We made NatureQuest with the goal of helping people get outside more. Every day, a notification is sent out to users with a new challenge to take pictures with certain items outdoors. 

After taking your picture, see your what your friends did that day too!

## Inspiration
One of the most popular forms of social media involves snapshotting one’s life, whether the event is a milestone in an individual’s life or a small moment the user may look back on and cherish. However, due to the rising addiction of technology and after-effects of the coronavirus, many individuals today lead a rather sedentary lifestyle in contrast to the active lifestyle our relatives and ancestors experienced for many generations. As a result, our team aimed to create a software that would rekindle our connection to nature but also retain a level of comfort and exploration using smartphones. With NatureQuest, we wanted to use the phone and their ability to capture photos and social media as a means to encourage interaction between friends and the environment.

## How we built it
We started our design by figuring out the features we needed in Figma. After designing what features and ideas we wanted to implement, we coded the frontend with Expo and React Native in order to develop a simple mobile app on Android/IOS. Using Expo allowed us to also test the app on our smartphones.The backend was implemented using MongoDB and was used to store the user’s username, password, and the current location the user signs in with.  The server in the backend was also responsible for sending API requests to Google’s Gemini 1.5 Pro Model in order to generate picture-taking prompts based on the day and the user’s location.

## Challenges we ran into
There were a lot of undefined roles and ideas, leading to team members doing multiple things at once without much order. Without a well defined pipeline or fully fleshed out idea, there were many things that we wanted to implement or explore that were thought to be feasible, but they ended up being out of scope. For example, we wanted to use RAG to help Gemini source and use search information when deciding what prompt to generate for the user using their location, the day, and the history of the location the user is in, but trying to pipeline the information effectively to generate a reasonable prompt was way out of my scope

## Accomplishments that we're proud of
Even if our team was not able to completely implement all of the ideas we were envisioning for the project, the amount of work we were able to accomplish during the hackathon was nothing short of impressive. We were able to have most of the frontend completed in comparison to the design files. Considering that this was the first time everybody on the team used React-Native, it was pretty impressive to have been able to translate most of our designs effortlessly. For the backend, it was the first time our backend programmers set up and worked with the server. Learning how to use prompt engineering with Gemini 1.5 to generate a challenge based on the day and the user’s location was also something that was pretty cool to see. 

## What we learned
For most of the members on the team, many of the tasks each member was in charge of involved technologies that each member was not familiar with. So for most of the hackathon, a lot of the things we learned were how to efficiently use documentation to get what we needed, even if we weren’t fully familiarized with the technology we were using. For most of our team, we all learned a lot about react-native, the development pipeline for mobile apps using Expo, and designing a mobile app using Figma.

## What's next for NatureQuest: Capture Your Moments in the Wild!
There are still many features that we want to implement in our original vision for the project. One of the first things we would want to implement after the hackathon is the ability for users to view their past snapshots. Having this feature would be one of the core functionalities for our app as it promotes one of our original visions of retaining the ability to capture moments vital to a user’s life or small moments they would cherish. On top of that, strengthening our available functionalities are also goals we would like to reach in the near future. This includes implementing stronger security measures and fine tuning our prompts to generate more unique and doable challenges. 

## How to use
1. Download Expo Go on your mobile device
2. In your terminal:
```
   cd app
   yarn start expo --tunnel
```
3. A QR code should appear! If you have an Android, scan the QR code in Expo Go. If you have an iPhone, scan the QR code using the default camera app.
4. Sign up, log in, and you're good to go!

## Contributors
Nicholas Ho, Andrew Nguyen, Raymond Sun, Jennifer Yu