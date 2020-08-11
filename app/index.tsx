import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

import Icon, {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	SimpleLineIcons,
	Octicons,
	Zocial,
} from 'react-web-vector-icons';
import 'react-web-vector-icons/fonts';

/*const { crashReporter } = require('electron')

crashReporter.start({
  productName: 'Newt',
  companyName: 'Keetup',
  submitURL: 'http://localhost:9090/crash/desktop',
  uploadToServer: true
})*/

const store = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
