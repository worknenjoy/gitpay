# gitpay
The marketplace for on demmand changes

## Initializing project

To start project initial created [package.json] with command [npm5 init -y]

## Installation

> **To install and save in your [package.json]**

> - Was install the react@15.6.1, react-dom@15.6.1 and react-router@3.0.2
> - After install webpack@3.0.0, webpack-dev-server@2.5.0 and extract-text-webpack-plugin@2.1.2
> - To http request using axios@0.16.2
> - To theme and component it is using the Material-UI is available as an [npm package] - A React component library implementing Google's Material Design
>  material-ui@0.18.6, material-ui-icons@1.0.0-alpha.19, react-tap-event-plugin@2.0.1
> - For end all dependecies to configuration of `webpack.config.js`:
>  babel-core@6.25.0, babel-loader@7.1.0, babel-plugin-react-html-attrs@2.0.0,
>  babel-plugin-transform-object-rest-spread@6.23.0, babel-preset-es2015@6.24.1,
>  babel-preset-react@6.24.1, css-loader@0.28.4, file-loader@0.11.2,
>  lodash@4.17.4, style-loader@0.18.2

## Configuring the [package.json] to run

Alter the [scripts] to execute dev and production as below:
  "scripts": {
    "dev": "webpack-dev-server --progress --colors --inline --hot",
    "production": "webpack --progress -p"
  }
### Execute Server Client

[npm5 run dev] or [npm5 run production]

## Create structure of folder

- Was create folder [public] and [src]
- Inside the [public] folder the file [index.html] where it will be [<! DOCTYPE html>] and pointing the [id] of our react app
- In the [src] folder you will create the name of the [main] folder where the [src/main/app.js] and [src/main/app.css] file were created. The [src/main/app.js] is the main component that will be imported into [src/index.js]
