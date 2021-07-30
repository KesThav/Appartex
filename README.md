# Appartex #

Appartex is a web application developped using ReactJS, KoaJS and MongoDB. The main idea was to create a strong alternative to real estate management and to help independent owners in the management process of their appartments. The web app was developed in the context of my Bachelor Thesis at University of Fribourg.

My bachelor thesis can be found here : https://www.unifr.ch/inf/softeng/en/assets/public/files/research/students_projects/bachelor/Bachelor_Thavarajasingam_Kesigan.pdf

# Getting started #
The web app can be used online : https://appartex.firebaseapp.com/  
The documentation is available here : https://appartex-server.herokuapp.com/doc

If you want to use it offline : 
1. Clone the repository
```
$ git clone https://github.com/KesThav/Appartex.git
```
2. go in server folder and rename `.env.sample` to `.env`  
note : MongoDB should be installed locally. Otherwise, replace `DB` variables from `.env` file by your online MongoDB link. 

3. Start client and server. Client will be available on `https://localhost:3000` and server on `https://localhost:5000`
```
cd client
npm start
```
```
cd server
npm run server.js
```
or
```
cd server
npm run dev
```
Which will start client and server.
