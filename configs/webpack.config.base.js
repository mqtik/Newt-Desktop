/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from '../app/package.json';
import Dotenv from 'dotenv-webpack';



export default {
  externals: [...Object.keys(externals || {}),],

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '..', 'app'), 'node_modules']
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      API_URL: 'https://newt.keetup.com',
      API_STATIC: 'https://static.newt.keetup.com',
      API_STATIC1: 'https://static.newt.keetup.com',
      API_STORAGE_CONTENTS: 'https://static.newt.keetup.com/contents',
      PORT_API_DIRECT: 5984,
      PORT_API: 9090,
      DB_BOOKS: 'books',
      LOCAL_DB_NAME: 'books',
      SETTINGS_LOCAL_DB_NAME: 'UserSettings',
      DB_DRAFTS: 'drafts',
      LOCAL_DB_DRAFTS: 'drafts',
      LOCAL_DB_NOTIFICATIONS: 'notifications',
      LOCAL_DB_PUBLIC: 'public',
      LOCAL_DB_USERS: 'users',
      LOCAL_DB_CHAPTERS: 'chapters',
      INDEX_NAME: 'BooksIndex',
      OFFLINE_DB_NAME: 'offline',
      GOOGLE_API_KEY: 'AIzaSyD9NGW5Zruc3V5uxZdDsAa8u8biQKkHQnY',
      CLIENT_SECRET: 'xGbAhWL960HycCoboFNvKdhpWJxnLdxIs55Gjn95',
      CLIENT_ID: 2,
      APPLEID:'development@keetup.com',
      APPLEIDPASS: 'axrn-zmbs-gczp-yars',
      APPLEPROVIDER: '9ZJF7GJ4KP'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
