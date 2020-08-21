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

const BackgroundCovers = () => {
  return (
    <div id="t1" className="tela" >
      <div className="conteudo">
        <div className="splash sth">
        </div>
        </div>
      </div>
      )
}

export default class SignedOut extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			tab: 'signIn',
			stateSession: null,
			username: '',
			password: '',
			repeat_password: '',
			name: '',
			email: '',
			logInStep: 'username',
			errorTxt:null,
			accounts: null
		}
		let w = getCurrentWindow();
		// w.setMaximumSize(465, 650);
		w.setMaximumSize(4000, 4000);
		w.setMinimumSize(465, 650);
		w.maximize();
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

	setError = (txt) => {
		this.setState({
			errorTxt: txt
		})
	}

	continueLogin = async(username) => {
	    let c = null;
	    if(username.includes('@')){


	        if(username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){

	          return this.setError('Invalid mail format');
	        } else {
	          c = await Remote.Auth().checkRemoteEmail(username.toLowerCase()).catch(e => e);
	          console.log("check remote mail!", c)
	          if(c.length == 0){
	            this.setError('This e-mail is not linked to any account.\n You must sign up first.')
	          } else if(c.length == 1){
	          	this.setState({
	          		username: c[0].name,
	          		logInStep: 'password',
	          		accounts:null
	          	})
	          } else if(c.length > 1){
	          	return this.setState({
	          		logInStep: 'choose',
	          		accounts: c
	          	})
	          }
	        }
	      } else {
	        c = await Remote.Auth().getRemoteUsername(username).catch(e => e);
	        console.log("usre not!",c)
	        if(c.hasOwnProperty('error')){
	        	return this.setError("Username not registered.");
	        }



	        this.setState({
	          		logInStep: 'password'
	          	})

	        if(c.avatar){

	        }
	        //setStep('password')
	      }
	      return;
	      console.log("NEXT STEP!!", c)

	  }

	  continueRegister = async() => {
	    let c = null;

	    let email = this.state.email, username = this.state.username;

	    if(email == '' || username == ''){
	    	 return this.setError('Type in your username and email');
	    }
	    console.log("eeeeeeee regg!!!", username.match(/^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/))
	    if(username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/) == null){
	    	return this.setError('Your username must contain at least three characters, no special characters allowed.');
	    }
	    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){

	          return this.setError('Invalid mail format');
	        } else {
	          c = await Remote.Auth().checkRemoteEmail(email.toLowerCase()).catch(e => e);
	          console.log("check remote mail!!", c)
	          if(c && c.length > 0){

	          }
	        }

	    if(username == ''){
	    	 return this.setError('Type in your username');
	    } else {
	    	c = await Remote.Auth().getRemoteUsername(username.toLowerCase()).catch(e => e);
	    	console.log("continue register check", c)
	        if(!c.hasOwnProperty('error')){
	        	return this.setError("Username already taken.");
	        }
	    }
	    

	     



	        this.setState({
	          		registerStep: 'password'
	          	})

	        //setStep('password')
	      
	      return;
	      console.log("NEXT STEP!!", c)

	  }

	  performSign = async() => {

	  	this.setState({
			stateSession: 'loading',
			errorTxt:null
		},async() => {
			let u = this.state.username, p = this.state.password, rp = this.state.repeat_password, n = this.state.name, e = this.state.email;

		  	if(this.state.tab == 'signIn'){
		  		if(u == ''){
					toast("Type username/email and try again.", { autoClose:1000 })
					this.setState({
						stateSession: null
					})
					return;
				}
		  		if(this.state.logInStep == 'password'){
					return this.performGo()
		  		} else {
		  			let co = await this.continueLogin(this.state.username.toLowerCase());
		  		}

		  	}
		  	if(this.state.tab == 'signUp'){
		  		if(this.state.registerStep == 'password'){

		  			if(n == '' || n == null){
		  				this.setState({
							stateSession: null
						})
		  				return toast("Your name is required.", { autoClose:1000 })
		  			}
		  			if(rp == '' || rp == null){
		  				this.setState({
							stateSession: null
						})
		  				return toast("Repeat your password to confirm.", { autoClose:1000 })
		  			}
		  			if(rp != p){
		  				this.setState({
							stateSession: null
						})
		  				return toast("Your passwords do not match.", { autoClose:1000 })
		  			}
					return this.performGo()
		  		} else {
		  			let co = await this.continueRegister(this.state.username);
		  		}
		  	}

	  	this.setState({
					stateSession: null
				})
		})
		
	  	//this.performGo()
	  }
	performGo = async() => {

		let u = this.state.username.toLowerCase(), p = this.state.password,rp = this.state.repeat_password, n = this.state.name, e = this.state.email;
		if(this.state.tab == 'signIn'){
			if(u == ''){
				toast("Type username/email and try again.", { autoClose: 1000 })
				this.setState({
					stateSession: null
				})
				return;
			}




			if(p == ''){
				toast("Type in your password.", { autoClose: 3000 })
				this.setState({
					stateSession: null
				})
				return;
			}
			let l = await Remote.Auth().signIn(u, p).catch(e => e);
			
			if(l.hasOwnProperty('error')){
				toast("Unauthorized. Try again.", { autoClose: 3000 })
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

			toast("Welcome to Newt.", { autoClose: 2000 })

			console.log("login!", l, s, grm, sM, saveKey)

				this.props.history.go('/signedIn')
			
			}
			
			
					
		}
		if(this.state.tab == 'signUp'){
			if(u == '' || p == '' || rp == '' || n == '' || e == ''){
				toast("Blank fields. Try again.", { autoClose: 3000 })
				this.setState({
					stateSession: null
				})
				return;
			}


			if(p != rp){
				toast("Passwords don't match", { autoClose: 3000 })
				this.setState({
					stateSession: null
				})
				return;
			}

			console.log("passwordsss!!!",u,p,rp)


			let up = await Remote.Auth().signUp(n, e, u, p).catch(err => err);
			console.log("up!!", up)
			if(up.hasOwnProperty('error')){
				console.log("error!", up.error);
				this.setError("Unauthorized register. Try again.")
				return;
			}

			
			if(up.hasOwnProperty('ok') && up.ok == true){
				let l = await Remote.Auth().signIn(u, p).catch(err => err);

				console.log('login pp!',l)
				if(l.hasOwnProperty('error')){
					console.log("error!", l.error);
					this.setError("Unauthorized login. Try again.")
					return;
				}
				let s = await Remote.Auth().getSession().catch(err => err);

				let grm = await Remote.Auth().getRemoteUser(u).catch(err => err);

				let sM = await Remote.Auth().saveMe(grm).catch(err => err);

				let saveKey = await Remote.Auth().setKey(sM.name).catch(err => err);


				console.log("login!", l, s, grm, sM, saveKey)
			
				toast("Welcome to Newt.", { autoClose: 2000 })


			this.props.history.go('/signedIn')
			}
			//console.log("up signn in!", up)
			
					
		}

		this.setState({
			stateSession: null
		})


	}
	selectAccount = (a) => {
		this.setState({
			username: a.name,
			logInStep: 'password',
			accounts: null
		})
	}
	_renderAccounts = () => {
		return (
			<div className={['inlineCenterFlex', 'accountSelector'].join(" ")}>
			{
                        this.state.accounts && this.state.accounts.map((a,i) => {
                            return (
                              <div key={i} className="text-center truncate" onClick={() => this.selectAccount(a)}>
                                {a.avatar && <div className="icon__mask icon_mask_bg"><img src={a.avatar} /></div>}

                                  {a.name}
                              </div>
                              )
                          })
                      }
              </div>
			)
	}
	_handleKeyDown = (e) => {
	 	//console.log("handle keydown!", this.state.searchTyping)
	    if (e.key === 'Enter') {
	     // let s = await(Remote.OpenFiles().save(key));
	     this.performSign()
	    }
	  }

	render(){

		return (
			<div>
			<div className={'signedOutRenderContainer'}>
				<BackgroundCovers />


				<div className={[signedOutStyles['wrap'], this.state.tab == 'signUp' && signedOutStyles['--new'], this.state.tab == 'signIn' && signedOutStyles['--rtn'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')}>

					  <div className={signedOutStyles['flex-form']}>
					  	<div style={{height: 50, textAlign: 'center'}}>
					  		<object type="image/svg+xml" data={svglogo} style={{height: 50}}>
			                    Your browser does not support SVG
			                  </object>

					  	</div>
					  	<div className={signedOutStyles.titleApp}>
					  		<span>Newt</span>
					  	</div>
					  	<p style={{textAlign: 'center', paddingBottom:30}}>Keep your story going.<br /></p>
					    <ul className={signedOutStyles['select__list']}>
					      <li id="js-usr-new" className={[signedOutStyles['select__label'], this.state.tab == 'signUp' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('signUp')}>Sign up</li>
					      <li id="js-usr-rtn" className={[signedOutStyles['select__label'], this.state.tab == 'signIn' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('signIn')}>Sign in</li>
					      <li id="js-usr-rst" className={[signedOutStyles['select__label'], this.state.tab == 'resetPassword' && signedOutStyles['select__label--active']].join(' ')} onClick={() => this.switchTab('resetPassword')}>Forgot?</li>
					    </ul>
					    <span className={[signedOutStyles['pointer'], this.state.tab == 'signUp' && signedOutStyles['--new'], this.state.tab == 'signIn' && signedOutStyles['--rtn'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')}></span>
					    <input maxLength={20} value={this.state.username} onChange={(e) => this.setState({ username: e.target.value})} type="text" onKeyDown={(e) => this._handleKeyDown(e)} placeholder={ this.state.tab == 'signUp' ? "Username" : "Username or email"} className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-email']].join(' ')} />
					    <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value})} type="email" placeholder="Email" onKeyDown={(e) => this._handleKeyDown(e)}  className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-rpass'], this.state.tab != 'signUp' && signedOutStyles['--rtn']].join(' ')}/>
					    

					    {
					    	(this.state.logInStep == 'password' || this.state.registerStep == 'password') && 
					    	<input maxLength={30} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value})} type="text" placeholder="Name" onKeyDown={(e) => this._handleKeyDown(e)}  className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-rpass'], this.state.tab != 'signUp' && signedOutStyles['--rtn']].join(' ')}/>
					    }

					    {
					    	(this.state.tab == 'signIn' && this.state.logInStep == 'choose') && this._renderAccounts()
					    }

					    {
					    	(this.state.logInStep == 'password' || this.state.registerStep == 'password') && 
					    	<input maxLength={30} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value})} type="password" onKeyDown={(e) => this._handleKeyDown(e)}  placeholder="Password" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-pass'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')} />
					    }
					     {
					    	(this.state.tab == 'signUp' && this.state.registerStep == 'password') && 
					    	<input maxLength={30} value={this.state.repeat_password} onChange={(e) => this.setState({ repeat_password: e.target.value})} type="password" onKeyDown={(e) => this._handleKeyDown(e)}  placeholder="Repeat Password" className={[signedOutStyles['ui-elem'], signedOutStyles['ui-elem-pass'], this.state.tab == 'resetPassword' && signedOutStyles['--rst']].join(' ')} />
					    }
					    
					    

					    <button className={['buttonProgress', this.state.stateSession == 'loading' && 'loading'].join(' ')} onClick={() => this.performSign()}>
					    	{
					    		this.state.tab == 'signUp' && (this.state.logInStep == 'password' ? 'Create account' : 'Continue')
					    	}
					    	{
					    		this.state.tab == 'signIn' && (this.state.logInStep == 'password' ? 'Sign In' : 'Continue')
					    	}
					    	{
					    		this.state.tab == 'resetPassword' && 'Reset Password'
					    	}
					    </button>

					    {
					    	this.state.errorTxt != null && <div className={'errorTxt'}>{this.state.errorTxt}</div>
					    }

					    {/*<button id="js-btn" className={signedOutStyles['ui-button']}>Sign In</button>*/}
					  </div>
					</div>


			</div>
			<footer className="footerSignedOut">
					<ul>
						<li><a href="https://newt.to/download" target="_blank"> Mobile</a></li>
						<li><a href="https://newt.to/help" target="_blank">Help</a></li>
						<li><a href="https://newt.to/support" target="_blank">Read</a></li>
					</ul>
				</footer>
				</div>
			);
	}
}
