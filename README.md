# 📺 viewedge-display
A small app to display system information on a [Cary Works x KBDFANS ViewEdge display](https://kbdfans.com/products/cary-works-x-kbdfans-viewedge). This project is a work in progress, and there's still a lot to be done. This project has only been verified to run properly on Windows, other platforms may vary.

## Developing
You'll need [Node.js](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/lang/en/) installed.

1. Clone this repository.
2. Run `yarn` to install dependencies.
3. Run `yarn start` to kickstart the React UI and then run `yarn electron-start` in another window to open the app. You cannot use this app in a browser.

## Production packages
To build for production, run `yarn electron-pack`. An executable installer will be generated inside the `dist` directory.
