import React, {Component, createRef} from 'react';
import Home from '../components/Home';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import sidebarWorksStyles from '../styles/sidebarWorks.css';
import SidebarChapters from './sidebarChapters'

import Icon, { Feather } from 'react-web-vector-icons';

import _ from 'lodash';

import ContextMenuArea from "./contextMenuArea";

const Remote = new API({ url: process.env.API_URL })

import Popover, { ArrowContainer } from 'react-tiny-popover'

import { Flipper, Flipped } from "react-flip-toolkit";


import FlatList from 'flatlist-react';

import svg1 from '../assets/illus/illustration_9.svg';

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


			items: 80,
      		loadingState: false
		}

		
		

	}
	componentDidMount(){
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

	_renderOptions = (key) => {
		const itemsSettings = [
						{
					      label: "Settings",
					      click: () => this.props.openBookSettings(key)
					    },
					    {
					      label: "Select",
					      click: () => this.props.onSelectBook(key)
					    }
					  ];
		return(
		<ContextMenuArea menuItems={itemsSettings}>
						  	<div className={['sidebarWorkListRowActions', 'sidebarWorkActionsChapters'].join(" ")}>
						  			<Icon
											  name='dots-two-vertical'
											  font='Entypo'
											  color='#fff'
											  size={25}
											/>
							</div>
					    </ContextMenuArea>
			);
	}
	_renderWorkRow = (key) => {

		//key = this.state.works[key.index];

		//console.log("KEY OF WORK ROW", this.props.syncedDocs, key._id, this.props.syncedDocs.includes(key._id))
		
		return (
			<li key={key._id} className={'sidebarWorkList'}>
			     <div className={'sidebarWorkListRow'}>
			     <div  onClick={() => this.props.openWork(key)} style={{ display: 'inline-grid', float: 'inherit',minWidth: 146}}>
			     	<Flipped flipId={key._id} translate>
				     	<div style={{'--img': key.cover && 'url(\''+key.cover.replace(/ /g, "%20")+'\')'}} className={['coverAvatarSidebar', 'sqr'].join(" ")}></div>
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
				     	this._renderOptions(key)
				     }
				     
				     {(this.props.selectedWorks != null) && 
				     	<div className={['sidebarWorkListRowActions', 'sidebarWorkActionsChapters'].join(" ")} style={{paddingRight: 10}}>
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
			<div style={{display: 'inline-flex', width: 700}}>
			<div className={['sidebarWorkList', 'sidebarWorkListChapters'].join(" ")} style={key._deleted && {display: 'none'}}>
			     <div className={'sidebarWorkListRow'}>
			     <div style={{display: 'table-caption'}}>
			     	<Flipped flipId={key._id} translate>
				     	<div style={{'--img': key.cover && 'url(\''+key.cover.replace(/ /g, "%20")+'\')'}} className={['coverAvatarSidebar', 'sqr'].join(" ")}></div>
				     </Flipped>
				     <div className={sidebarWorksStyles['sidebarWorkListRowStatus']} style={{margin: 10, display: 'initial'}}>
				     		{key.status ? key.status : 'Private'}
				     		{ (key._deleted == true) && ' (deleted)' }
				     	</div>
				     	<ul className={'popoverNewt'} style={{marginLeft: 0}}>
							            		<li onClick={() => this.props.onCreateChapter()}>
								            		<Icon
													  name='plus'
													  font='MaterialCommunityIcons'
													  color='#dadada'
													  size={18}
													  // style={{}}
													/>
								            		<span>Add chapter</span>
								            	</li>
								            	<li onClick={() => this.props.openBookSettings(key)}>
								            		<Icon
													  name='death-star'
													  font='MaterialCommunityIcons'
													  color='#dadada'
													  size={18}
													  // style={{}}
													/>
								            		<span>Settings</span>
								            	</li>
								            </ul>
				     </div>
				    
							
			     	
				</div>
			</div>
				<div style={{ display: 'inline-block', width: '100%', padding: 10}}>
				<div className={sidebarWorksStyles['sidebarWorkListRowInfo']}>
				     	<div className={['truncate', sidebarWorksStyles['sidebarWorkListRowTitle'],sidebarWorksStyles['specificWorkSize']].join(' ')}>{key.title}</div>
				     	
				     </div>
				 
					<SidebarChapters onUpdatedOrInsertedChapter={this.props.onUpdatedOrInsertedChapter.bind(this)} onMoveChapters={(chapters) => this.props.onMoveChapters(chapters)} toggleSettingsChapters={(key) => this.props.toggleSettingsChapters(key)} onCreateChapter={() => this.props.onCreateChapter()} chapters={this.props.chapters} openChapter={this.props.openChapter.bind(this)} currentWork={key} rootUser={this.props.rootUser}/>
				</div>
			</div>

			)
	}

	sliceMoreWork = async() => {
		//console.log("slice more work!",this.state.items, this.state.items+50)
		let it = parseFloat(this.state.items+80);
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
	  	<div ref={div => (this.workScroll = div)} onScroll={() => this.handleScroll}  style={{ width: 'fit-content', margin: '0 auto', padding: 0}}>



	  		<Flipper  flipKey={this.props.currentSection} spring='noWobble' className="staggered-list-content" style={{paddingBottom: 0, display: 'grid'}}>
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
					  renderWhenEmpty={() => <div className={'noOpensFiles'} style={{display: 'inline-flex', minWidth: 400, maxWidth: 500, padding: 15}}>

				  		<div style={{width: '100%', textAlign: 'center'}}>


				  			<h3>Start on Newt</h3>
				  			<p>Add/import books, write interactive chapters and articles with a powerful editor.<br /></p>

				  			<a className={'bdashed'} onClick={() => this.props.onCreateWork()}>Create your first book</a><br/>
				  			<object type="image/svg+xml" data={svg1} style={{marginTop:50,height: 200}}>
			                    Your browser does not support SVG
			                  </object>
				  			


				  		</div>
				  	</div>}
					  ref={this.listRef}
					  
					  />


	  		}
	  		{(this.props.currentSection == 'works' && typeof this.props.works !== 'undefined' && this.props.works.length > this.state.items) &&
	  		<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.sliceMoreWork()} style={{alignItems: 'center', justifyContent: 'center', width: '90%', marginLeft:'5%', marginBottom: 15, padding: '5px 10px 7px 10px'}}>
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
