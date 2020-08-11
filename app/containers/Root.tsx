import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../reducers/types';
import Routes from '../Routes';
import { Switch, Route } from 'react-router';
import routes from '../constants/routes.json';
import App from './App';
import { toast } from 'react-toastify';
 // Call it once in your app. At the root of your app is the best place
toast.configure()

import SignedIn from './signedIn';
import SignedOut from './signedOut';

import API from '../services/api.tsx';

const Remote = new API({ url: process.env.API_URL })

type Props = {
  store: Store;
  history: History;
};

//const Root = ({ store, history }: Props) => (
class Root extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			logged: false,
			rootUser: null,
			rootKey: null
		}

		Remote.Auth().getKey().then(key => {
	        if(key != null){
	          this.setState({ logged: true });
	        } 
	      })
		
	}
	componentDidMount(){

	}
	$init  = async() => {
		


	}
	render(){
		if(this.state.logged == true){
			return (
				<Provider store={this.props.store}>
				    <ConnectedRouter history={this.props.history}>
				    	<App>
					      <Switch>
					        	<Route path={'/'} component={SignedIn} />
					      </Switch>
					    </App>
				    </ConnectedRouter>
				  </Provider>
			);
		} else {
			return (
				<Provider store={this.props.store}>
				    <ConnectedRouter history={this.props.history}>
				    	<App>
					      <Switch>
					      		<Route path={routes.SIGNEDOUT} component={SignedOut} />
					        	<Route path={routes.SIGNEDIN} component={SignedIn} />
					      </Switch>
					    </App>
				    </ConnectedRouter>
				  </Provider>
			);
		}
		
	}
  
};

export default hot(Root);
