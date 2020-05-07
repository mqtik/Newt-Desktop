import React, {Component, createRef} from 'react';
import Home from '../components/Home';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import sidebarWorksStyles from '../styles/sidebarWorks.css';
import SidebarChapters from './sidebarChapters'

import Icon, { Feather } from 'react-web-vector-icons';

import _ from 'lodash';

const Remote = new API({ url: process.env.API_URL })

import Popover, { ArrowContainer } from 'react-tiny-popover'

import { Flipper, Flipped } from "react-flip-toolkit";

import memoize from 'memoize-one';

import { FixedSizeList as List, areEqual } from 'react-window';

import FlatList from 'flatlist-react';

import svg1 from '../assets/illus/illustration_100.svg';

import update from 'immutability-helper'

export default class SidebarWorks extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			rootUser: props.rootUser,
			works: props.works,
			isLoading: true,
			chapters: null,
			isPopoverOpen: false,


			items: 50,
      		loadingState: false
		}

		
		

	}
	componentDidMount(){
		console.log("this props synced docs!", this.props)
		//this.workScroll.addEventListener("scroll", this.handleScroll);
		 Remote.ApplicationDrafts.changes({live: true, since: 'now', include_docs: true})
	                .on('change', (change) => {
	                //console.log("[SIDEBARWORKS] ON CHANNGE!", change)
	                this.props.onUpdatedOrInserted(change.doc)
	              }).on('error', console.log.bind(console))
		
	}



	binarySearch = (arr, bookId)  => {
		      var low = 0, high = arr.length, mid;
		      while (low < high) {
		        mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
		        arr[mid]._id < bookId ? low = mid + 1 : high = mid
		      }
		      return low;
		    }

		   

	componentDidUpdate() {
		//console.log("UPDATE WORKS",this.props)
	}
	displayItems() {
	    var items = [];
	    for (var i = 0; i < this.state.items; i++) {
	      items.push(<li key={i}>Item {i}</li>);
	    }
	    return items;
	  }



	loadMoreItems() {
	    this.setState({ loadingState: true });
	    // you may call ajax instead of setTimeout
	    setTimeout(() => {
	        this.setState({ items: this.state.items + 10, loadingState: false });
	    }, 500);
	}

	openWork = (key) => {

		if(key.openSettings == true){
			this.toggleSettings(key);
		}
		

		this.setState({
			currentWork: key,
			currentSection: 'chapters'
		})

		this.$openChapters(key);
	}

	closeWork = (key) => {
		this.setState({
			currentWork: key,
			currentSection: 'works'
		})
	}

	selectBook = (e, book) => {
		console.log("select book!", e.target.value, book)

		this.props.onSelectBook(book);
	}
	_renderWorkRow = (key) => {

		//key = this.state.works[key.index];

		//console.log("KEY OF WORK ROW", this.props.syncedDocs, key._id, this.props.syncedDocs.includes(key._id))
		return (
			<li key={key._id} className={'sidebarWorkList'}>
			     <div className={'sidebarWorkListRow'}>
			     <div  onClick={() => this.props.openWork(key)} style={{ display: 'inline-flex', float: 'inherit',minWidth: 200}}>
			     	<Flipped flipId={key._id} stagger>
				     	<div style={{backgroundImage: 'url('+key.cover+')'}} className={'coverAvatarSidebar'}></div>
				     </Flipped>
				     <div className={sidebarWorksStyles['sidebarWorkListRowInfo']}>
				     	<div className={['truncate', sidebarWorksStyles['sidebarWorkListRowTitle']].join(' ')}>{key.title}</div>
				     	<div className={sidebarWorksStyles['sidebarWorkListRowStatus']}>
				     		{key.status ? key.status : 'Private'}
				     		{ (key._deleted == true) && ' (deleted)' }
				     	</div>
				     </div>
				     </div>
				     {
				     	(this.props.selectedWorks == null) && 
				     	<Popover
							    isOpen={key.openSettings}
							    position={'left'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.toggleSettings(key)}
							    content={({ position, targetRect, popoverRect }) => (
							        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
							            position={'left'}
							            targetRect={targetRect}
							            popoverRect={popoverRect}
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 100, height: 30, display: 'table-cell' }}
							                onClick={() => key.openSettings = true}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.props.openBookSettings(key)}>
								            		<Icon
																			  name='death-star'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>Settings</span>
								            	</li>
								            	<li onClick={() => this.props.onSelectBook(key)}>
								            		<Icon
																			  name='circle-slice-8'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
													<span>Select</span>
												</li>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							<div className={'sidebarWorkListRowActions'}  onClick={() => this.toggleSettings(key)}><Icon
							  name='dots-two-vertical'
							  font='Entypo'
							  color='#111'
							  size={25}
							  // style={{}}
							/></div>
							</Popover>
				     }
				     
				     {(this.props.selectedWorks != null) && 
				     	<div className={'sidebarWorkListRowActions'} style={{paddingRight: 10}}>
				     	{/*<div className="custom-checkbox">
						  <input className="custom-checkbox-input" type="checkbox" id={"custom-checkbox-discovery"+key._id}/>
						  <label className="custom-checkbox-label" for={"custom-checkbox-discovery"+key._id}>
						    <label className="custom-checkbox-label-aux" for={"custom-checkbox-discovery"+key._id} />
						  </label>
						</div>*/}
						<label className="checkbox-label">
					            <input type="checkbox" checked={key.selected ? true : false} onChange={(e) => this.selectBook(e, key)}/>
					            <span className="checkbox-custom circular"></span>
					        </label>
						</div>
				     }

			     	
				</div>
			</li>
			)
	}

	handleScroll = e => {

	    console.log(this.workScroll.scrollTop / 100);
	    console.log("scroll!! scrolltop", this.workScroll.scrollTop)
		 console.log("scroll!! innerheight", this.workScroll.clientHeight)
		 console.log("scroll!! sidebar", this.workScroll.offsetHeight)
	  };

	toggleSettings = (key) => {
		let openedFiles = this.props.works;
		
		let openIndex = _.findIndex(openedFiles, ['_id', key._id]);

		if(!openedFiles[openIndex].openSettings || openedFiles[openIndex].openSettings == false){
			openedFiles[openIndex].openSettings = true;
		} else {
			openedFiles[openIndex].openSettings = false;
		}


		console.log("key toggle", openedFiles[openIndex])

		this.setState({
			openedFiles: openedFiles
		})
	}

	$openChapters = async(key) => {
		let chapters = [];
	    let getChapters = await(Remote.Work().drafts().chapters().all(key._id));
	    



	    if(getChapters && getChapters.chapters && getChapters.chapters.length == 0){

	      let chaptersRemote = await(Remote.Work().drafts().chapters().allRemote(key._id));
	      chapters = chaptersRemote;

	    /*  if(chaptersRemote && chaptersRemote.length == 0){
	        console.log("chapters remote!", chaptersRemote)
	        Snackbar.show({ title: 'Syncing from cloud', duration: Snackbar.LENGTH_LONG })
	        let g = await(Remote.Work().drafts().chapters().replicateByDocId(this.state.titleOfWork._id));
	        console.log("replicate from chapters id", g)
	        chapters = await(Remote.Work().drafts().chapters().all(this.props.navigation.state.params._key._id));
	      }
	      */
	      

	    }
	    if(getChapters.chapters.length > 0){
	      chapters = getChapters.chapters;
	    }
	    
	    this.setState({ 
	          chapters: chapters || [],
	          countChapters: chapters.length || 0, 
	          isReady: true 
	        });

	    console.log("open chapters sync!", this.props)

	}
	_renderSpecificWork = () => {
		let key = this.props.currentWork;
		return (
			<div>
			<div className={'sidebarWorkList'} style={key._deleted && {display: 'none'}}>
			     <div className={'sidebarWorkListRow'}>
			     <div onClick={() => this.props.closeWork(key)}>
			     	<Flipped flipId={key._id} stagger>
				     	<div style={{backgroundImage: 'url('+key.cover+')'}} className={'coverAvatarSidebar'}></div>
				     </Flipped>
				     <div className={sidebarWorksStyles['sidebarWorkListRowInfo']}>
				     	<div className={['truncate', sidebarWorksStyles['sidebarWorkListRowTitle']].join(' ')}>{key.title}</div>
				     </div>
				     </div>
				     <Popover
							    isOpen={key.openSettings}
							    position={'left'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.toggleSettings(key)}
							    content={({ position, targetRect, popoverRect }) => (
							        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
							            position={'left'}
							            targetRect={targetRect}
							            popoverRect={popoverRect}
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 100, height: 30, display: 'table-cell' }}
							                onClick={() => key.openSettings = true}
							            >
							            	<ul className={'popoverNewt'}>
							            		<li onClick={() => this.props.onCreateChapter()}>
								            		<Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>Add</span>
								            	</li>
								            	<li onClick={() => this.props.openBookSettings(key)}>
								            		<Icon
																			  name='death-star'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>Settings</span>
								            	</li>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							<div className={'sidebarWorkListRowActions'}  onClick={() => this.toggleSettings(key)}><Icon
							  name='dots-two-vertical'
							  font='Entypo'
							  color='#111'
							  size={25}
							  // style={{}}
							/></div>
							</Popover>
							
			     	
				</div>
			</div>
				<SidebarChapters onUpdatedOrInsertedChapter={this.props.onUpdatedOrInsertedChapter.bind(this)} onMoveChapters={(chapters) => this.props.onMoveChapters(chapters)} toggleSettingsChapters={(key) => this.props.toggleSettingsChapters(key)} onCreateChapter={() => this.props.onCreateChapter()} chapters={this.props.chapters} openChapter={this.props.openChapter.bind(this)} currentWork={key} rootUser={this.props.rootUser}/>
			</div>

			)
	}

	sliceMoreWork = async() => {
		//console.log("slice more work!",this.state.items, this.state.items+50)
		let it = parseFloat(this.state.items+50);
		this.setState({
			items: it
		})

		//console.log("slice more work  222!",this.state.items)
	}

	scrollOnFL = () => {
		 // console.log("scroll!! scrolltop", this.workScroll.scrollTop)
		 // console.log("scroll!! innerheight", this.workScroll.innerHeight)
		 // console.log("scroll!! sidebar", this.workScroll.offsetHeight)
	}

	handleFilter = (work, index) => {

		if(this.props.searchTerm != null && this.props.searchTerm != '' && typeof this.props.searchTerm === 'string'){
			if(typeof work.title !== 'undefined' && work.title.toLowerCase().includes(this.props.searchTerm.toLowerCase()) || typeof work.author !== 'undefined' && work.author.toLowerCase().includes(this.props.searchTerm.toLowerCase()) || typeof work.tags !== 'undefined' && work.tags.includes(this.props.searchTerm.toLowerCase())){
				return work;
			}
		} else {
			return work;
		}
		
	}
	render(){

	

	 if(this.state.rootUser != null){
	 	const flatRef = createRef();
	 	return (
	  	<div ref={div => (this.workScroll = div)} onScroll={() => this.handleScroll}  style={{backgroundColor: '#e2e4e6', width: '100%', padding: 0, position: 'absolute'}}>



	  		<Flipper  flipKey={this.props.currentSection} spring='square' className="staggered-list-content" style={{paddingBottom: 0, display: 'grid'}}>
	  		{	this.props.currentSection == 'chapters' &&
	  			this.props.currentWork != null && 
	  			this._renderSpecificWork()
	  		}

	  		{	(this.props.currentSection == 'works' && typeof this.props.works !== 'undefined') &&
	  			/*
	  				<List
					    height={800}
					    itemCount={this.props.works.length}
					    itemSize={3}

					  >
					    {this._renderWorkRow}
					  </List>*/
					  <FlatList 
					  list={this.props.works.slice(0,this.state.items)} 
					  renderItem={this._renderWorkRow}
					  className="flatlist-works" 
					  filterBy={this.handleFilter}
					  wrapperHtmlTag="ul"
					  hasMoreItems={true}
					  renderWhenEmpty={() => <div className={'noOpensFiles'} style={{display: 'initial', minWidth: 400, maxWidth: 500, padding: 15}}>

				  		<div style={{width: '60%', textAlign: 'left'}}>
				  			<h3>1. Add books and articles</h3>
				  			<p>Add/import books, write chapters and articles.<br /></p>
				  			<a className={'bdashed'} onClick={() => this.props.onCreateWork()}>Create my first book</a>
				  		</div>
				  		<div style={{width: '60%', textAlign: 'left'}}>
				  			<h3>2. Sychronization</h3>
				  			<p>When you're done writing, save it and it will be backed up on the cloud. Your phone will be aware of the changes, so all your devices will eventually be in sync.
				  				Everything is offline first, with the option to use the cloud to store versions.<br /></p>
				  		</div>
				  		<div style={{width: '60%', textAlign: 'left'}}>
				  			<h3>3. Write your story</h3>
				  			<p>Private by default, published by choice. Your story has a place here.</p>
				  		</div>
				  	</div>}
					  ref={this.listRef}
					  
					  />


	  		}
	  		{(this.props.currentSection == 'works' && typeof this.props.works !== 'undefined' && this.props.works.length > this.state.items) &&
	  		<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.sliceMoreWork()} style={{margin:'0 auto', marginBottom: 15, padding: '5px 10px 7px 10px'}}>
													<Icon
														 name='download-cloud'
														 font='Feather'
														 style={{verticalAlign: 'bottom', margin: '3px 3px 0 0'}}
														 color='#fff'
														 size={13}
													/> 
													<span>More</span>
										</button>
	  		}
	  		
	  		
	  		</Flipper>
	  		
		</div>
	  	);
	 } else {
	 	return (
	  	<div style={{backgroundColor: 'transparent', width: '100%', height: '100%'}}>
	  		Loading

		</div>
	  	);
	 }
	  
	}
}
