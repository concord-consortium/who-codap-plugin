# WHO CODAP Plugin

## Development

### Initial steps

1. Clone this repo and `cd` into it
2. Run `npm install` to pull dependencies
3. Run `npm start` to run `webpack-dev-server` in development mode with hot module replacement

## Testing the plugin in CODAP

Currently there is no trivial way to load a plugin running on a local server with `http` into the online CODAP, which forces `https`. One simple solution is to download the latest `build_[...].zip` file from https://codap.concord.org/releases/zips/, extract it to a folder and run it locally. If CODAP is running on port 8080, and this project is running by default on 3000, you can go to

http://127.0.0.1:8080/static/dg/en/cert/index.html?di=http://localhost:3000

to see the plugin running in CODAP.

Another option is to install `ngrok` (https://ngrok.com/) and run `ngrok http 8080` and use the generated https url in CODAP.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Updating Data Values

There are two npm scripts used to update the data values based on the WHO API and the csv files stored in a folder on [Google Drive](https://drive.google.com/drive/folders/1VswLD13ErY6iseuz5pJ_dGo1kvaqzaHf).  The csv files should be downloaded into the `src/scripts/input` folder (which may need to be created first as it is in `..gitignore`). AFTER YOU DOWNLOAD THE CSVS YOU'LL NEED TO CLEAN UP THE HEADERS IN THE FILES TO REMOVE ALL THE HEADERS ABOVE THE `,,,,,,,,,` LINE AT THE TOP OF THE FILE.

`npm run scripts:pull-all-indicators` will use the WHO API and pull down all the indicator json files and write them out as CSVs in the `src/scripts/output` folder (which is in `.gitignore`).  If your `src/scripts/output` folder is empty or the contents are old this script should be run once.

`npm run scripts:process-csvs` should be run after the csvs are downloaded from the [Google Drive folder](https://drive.google.com/drive/folders/1VswLD13ErY6iseuz5pJ_dGo1kvaqzaHf) and the `pull-all-indicators` script is run to get the API values.  This script runs over both sets of csvs and then updates the `src/public/values.json` file.  You'll see "Unable to find ..." output from that script that should be reviewed to ensure it is ok.  You can ignore years outside of the years that are required and countries that are really territories of other countries (like Puerto Rico or French Guiana).