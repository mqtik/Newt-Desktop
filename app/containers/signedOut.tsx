import React, {Component} from 'react';
import Home from '../components/Home';
import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import signedOutStyles from '../styles/signedOut.css';

import svglogo from '../assets/logo.svg'
// type Props = { navigation: Function } for Component<Props>
import { ToastContainer, toast } from 'react-toastify';

const {getCurrentWindow, globalShortcut} = require('electron').remote;

const Remote = new API({ url: process.env.API_URL })


export default class SignedOut extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			tab: 'signIn',
			stateSession: null,
			username: '',
			password: '',
			name: '',
			email: ''
		}
		let w = getCurrentWindow();
		w.setMaximumSize(465, 650);
		w.setMinimumSize(465, 650);

		w.center();
	}
	componentDidMount(){
		//this.$signOut()

	    var elem = document.querySelector('.loadingWrapper');
	    if(elem){
	    	setTimeout(function(){
		      window.scrollTo(0, 0);
		      elem.style.opacity = '0';
		      setTimeout(function(){
		        elem.parentNode.removeChild(elem);
		      },1000)
		    },1000)
	    }
	    
	}

	$signOut = async() => {
		let k = await(Remote.Auth().signOut());
	}
	switchTab = (to) => {
		console.log("set state switch", to)
		if(to == 'signIn'){
			this.setState({
				tab: 'signIn'
			})
		} 
		if(to == 'signUp'){
			this.setState({
				tab: 'signUp'
			})
		}
		if(to == 'resetPassword'){
			this.setState({
				tab: 'resetPassword'
			})
		}
	}

	performGo = async() => {
		this.setState({
			stateSession: 'loading'
		})

		let u = this.state.username, p = this.state.password, n = this.state.name, e = this.state.email;
		if(this.state.tab == 'signIn'){
			if(u == '' || p == ''){
				toast("Blank fields. Try again.", { autoClose: 1000 })
				this.setState({
					stateSession: null
				})
				return;
			}

			let l = await Remote.Auth().signIn(u.toLowerCase(), p).catch(e => e);
			
			if(l.hasOwnProperty('error')){
				toast("Unauthorized. Try again.", { autoClose: 1000 })
				this.setState({
					stateSession: null
				})
				return;
			}
			//console.log("result signn!", l)

			if(l.hasOwnProperty('ok') && l.ok == true){

			  let s = await Remote.Auth().getSession(),
				grm = await Remote.Auth().getRemoteUser(u);

				console.log("get remote", grm)
				grm.p_t = p;
				let sM = await Remote.Auth().saveMe(grm),
				saveKey = await Remote.Auth().setKey(sM.name);

			toast("Welcome to Newt.", { autoClose: 1000 })

			console.log("login!", l, s, grm, sM, saveKey)

				this.props.history.go('/signedIn')
			
			}
			
			
					
		}
		if(this.state.tab == 'signUp'){
			if(u == '' || p == '' || n == '' || e == ''){
				toast("Blank fields. Try again.", { autoClose: 1000 })
				this.setState({
					stateSession: null
				})
				return;
			}

			let up = await Remote.Auth().signUp(n, e, u.toLowerCase(), p).catch(err => err);

			if(up.hasOwnProperty('error')){
				console.log("error!", up.error);
				toast("Unauthorized. Try again.", { autoClose: 1000 })
				return;
			}

			if(up.hasOwnProperty('ok') && up.ok == true){
				let l = await Remote.Auth().signIn(u.toLowerCase(), p),
				s = await Remote.Auth().getSession(),
				grm = await Remote.Auth().getRemoteUser(u),
				sM = await Remote.Auth().saveMe(grm),
				saveKey = await Remote.Auth().setKey(sM.name);

			
				toast("Welcome to Newt.", { autoClose: 1000 })

				console.log("login!", l, s, grm, sM, saveKey)

				this.props.history.go('/signedIn')
			}
			//console.log("up signn in!", up)
			
					
		}

		this.setState({
			stateSession: null
		})


	}
	render(){

		return (
			<div className={globalStyles.white}>
				


				<div className={[signedOutStyles['wrap'], this.state.tab == 'signUp' && signedOutStyles['--new'], this.state.tab == 'signIn' && signedOutStyles['--rtn'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')}>

					  <div className={signedOutStyles['flex-form']}>
					  	<div style={{height: 50, textAlign: 'center'}}>
					  		<object type="image/svg+xml" data={svglogo} style={{height: 50}}>
			                    Your browser does not support SVG
			                  </object>

					  	</div>
					  	<div className={signedOutStyles.titleApp}>
					  		<span>Get started<br/>on Newt</span>

					  	</div>
					    <ul className={signedOutStyles['select__list']}>
					      <li id="js-usr-new" className={[signedOutStyles['select__label'], this.state.tab == 'signUp' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('signUp')}>Sign up</li>
					      <li id="js-usr-rtn" className={[signedOutStyles['select__label'], this.state.tab == 'signIn' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('signIn')}>Sign in</li>
					      <li id="js-usr-rst" className={[signedOutStyles['select__label'], this.state.tab == 'resetPassword' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('resetPassword')}>Forgot?</li>
					    </ul>
					    <span className={[signedOutStyles['pointer'], this.state.tab == 'signUp' && signedOutStyles['--new'], this.state.tab == 'signIn' && signedOutStyles['--rtn'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')}></span>
					    <input value={this.state.username} onChange={(e) => this.setState({ username: e.target.value})} type="text" placeholder="Username" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-email']].join(' ')} />
					    <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value})} type="email" placeholder="Email" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-rpass'], this.state.tab != 'signUp' && signedOutStyles['--rtn']].join(' ')}/>
					    <input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value})} type="text" placeholder="Name" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-rpass'], this.state.tab != 'signUp' && signedOutStyles['--rtn']].join(' ')}/>
					    <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value})} type="password" placeholder="Password" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-pass'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')} />
					    

					    <button className={['buttonProgress', this.state.stateSession == 'loading' && 'loading'].join(' ')} onClick={() => this.performGo()}>
					    	{
					    		this.state.tab == 'signUp' && 'Create account'
					    	}
					    	{
					    		this.state.tab == 'signIn' && 'Sign In'
					    	}
					    	{
					    		this.state.tab == 'resetPassword' && 'Reset Password'
					    	}
					    </button>

					    {/*<button id="js-btn" className={signedOutStyles['ui-button']}>Sign In</button>*/}
					  </div>
					</div>

			</div>
			);
	}
}
