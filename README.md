# Curo🌿
## BSci Computer Science individual project
This is the repository for my level 4 individual project, of the topic 'Sustainability tool for Software Development teams'.
- GUID: 2566489b
- Name: Niamh Boyle
- Advisor: Peggy Gregory

## How to run/install
This is a react project made with next.js. To install and run the app, fork the repository and clone it to your personal workspace. Then, cd into the 'curo' directory:

```
cd curo
```

After you're in the curo directory, install all the apps dependencies, and then run the app! If it is running successfully, you should be able to access the app through your browser (I would recommend chrome) on port 3000.

```
npm install
npm run dev
```

To use the Cloud Carbon Footprint API, go back to root (out of curo) and then cd into the cloud-carbon-footprint directory. Your path should look like IndProject/cloud-carbon-footprint. Then run the following command:

```
cd cloud-carbon-footprint
yarn start-api
```

If successful, your terminal should look like this:
![image](https://github.com/niamhb0yle/IndProject/assets/98156653/62d9ac28-f961-4f43-ba18-64721d26b920)

If the two lines with green 'info' on them do not appear, the apps will not communicate with one another. Try restarting your CCF app, or simply hitting enter/refreshing the terminal its running on.


