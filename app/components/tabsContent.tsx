import React, {Component, PureComponent} from 'react';
import Home from '../components/Home';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import sidebarChaptersStyle from '../styles/sidebarChapters.css';

import Icon, { Feather } from 'react-web-vector-icons';

const Remote = new API({ url: process.env.API_URL })

import Popover, { ArrowContainer } from 'react-tiny-popover'

import arrayMove from 'array-move';

import signedInStyles from '../styles/signedIn.css';

import ContentLoader from "react-content-loader" 

import NewtEditor from '../lib/editor/wrapper/editor';

import BookRow from './bookRow';

import ContextMenuArea from "./contextMenuArea";

import { ProgressButton } from "./progressButton";

import SidebarWorks from './sidebarWorks';

import SearchInput, {createFilter} from 'react-search-input'

import Dropzone from 'react-dropzone';

const KEYS_TO_FILTERS = ['title', 'author', 'description', 'tags', 'status']

var remote = require('electron').remote;
var fs = remote.require('fs');

export default class TabsContent extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			isPopoverOpen: false,
			isPopoverUserOpen: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {


	    //return false;


	    if(this.props.openedFiles && this.props.openedFiles && this.props.openedFiles.length == 0){
	    	return true;
	    }

	    if(this.props.openedFiles && this.props.openedFiles && this.props.openedFiles.length == 1 && this.props.openedFiles[0] && this.props.openedFiles[0].type == 'welcome'){
	    	return true;
	    }

	    if(nextProps.openedFiles && nextProps.openedFiles && nextProps.openedFiles.length == 0){
	    	return true;
	    }

	    if(nextProps.openedFiles && nextProps.openedFiles && nextProps.openedFiles.length == 1 && nextProps.openedFiles[0].type == 'welcome'){
	    	return true;
	    }

	    if(this.props.selectedTab !== nextProps.selectedTab){
	    	return true;
	    }

	    if(!this.props.selectedTab || this.props.openedFiles && this.props.openedFiles && this.props.openedFiles.length > 0 && !this.props.openedFiles[this.props.selectedTab]){
	    	return true;
	    }

		if(this.props.selectedBooks !== nextProps.selectedBooks){
			return true;
		}

	    if(this.props.openedFiles[this.props.selectedTab] && this.props.openedFiles[this.props.selectedTab]){
	    	if(this.props.openedFiles[this.props.selectedTab].chapter){
	    		if(nextProps.openedFiles[this.props.selectedTab] && nextProps.openedFiles[this.props.selectedTab].chapter && this.props.openedFiles[this.props.selectedTab].chapter.native_content !== nextProps.openedFiles[this.props.selectedTab].chapter.native_content){
			    	return true
			    }
			    if(nextProps.openedFiles[this.props.selectedTab] && nextProps.openedFiles[this.props.selectedTab].chapter && this.props.openedFiles[this.props.selectedTab].chapter.header !== nextProps.openedFiles[this.props.selectedTab].chapter.header){
			    	return true
			    }
			    if(nextProps.openedFiles[this.props.selectedTab] && nextProps.openedFiles[this.props.selectedTab].chapter && this.props.openedFiles[this.props.selectedTab].chapter.title !== nextProps.openedFiles[this.props.selectedTab].chapter.title){
			    	return true
			    }
	    	}
	    }
	    


	    
	    if((this.props.openedFiles && this.props.selectedTab && this.props.openedFiles[this.props.selectedTab]) && 
	    	(typeof this.props.openedFiles[this.props.selectedTab].chapter !== 'undefined' && this.props.openedFiles[this.props.selectedTab].changed != nextProps.openedFiles[this.props.selectedTab].changed && this.props.openedFiles[this.props.selectedTab].changed == true)  ||
	    	(this.props.chapters !== nextProps.chapters) || 
			(this.props.currentWork !== nextProps.currentWork) ||
			(this.props.currentSection !== nextProps.currentSection) ||
			(this.props.works !== nextProps.works) ||
			(this.props.rootUser !== nextProps.rootUser) || 
			(this.props.isSearching !== nextProps.isSearching) ||
			(this.props.searchTerm !== nextProps.searchTerm) ||
			(this.state.isPopoverOpen !== nextState.isPopoverOpen) ||
			(this.state.isPopoverUserOpen !== nextState.isPopoverUserOpen)){
	    	return true;
	    } else {
	    	return false;
	    }

	    return true;
	  }

	componentDidUpdate(){

	}

	handleChange =  (text, key) => {

		if(this.props.openedFiles[this.props.selectedTab].chapter._id == key._id){
			this.props.handleChange(text, key);
		}

	}

	onSave = () => {
		this.props.saveDoc(this.props.openedFiles[this.props.selectedTab])
	}

	onAddHeader = (object) => {
		this.props.onChangeChapterHeader(object, this.props.openedFiles[this.props.selectedTab])
	}

	selectImage = async(filepaths, bookmarks) => {

		     var _img = fs.readFileSync(filepaths[0]).toString('base64');
		     //example for .png

		     //render/display
		     //var _target = document.getElementById('image_container');
		     //_target.insertAdjacentHTML('beforeend', _out);
		     

		     var bitmap = await fs.readFileSync(filepaths[0]).toString('base64');
		     let nam = filepaths[0].replace(/^.*[\\\/]/, '');
		     let ext = nam.split('.').pop();
		     let extb = (ext == 'jpg' || ext == 'jpg') ? 'jpeg' : 'png'


            let data = {
              type: 'image/'+extb,
              name: nam,
              size: 0,
              data: bitmap,
              path: filepaths[0]
            };


        

            // convert binary data to base64 encoded string
           // return new Buffer(bitmap).toString('base64');
            // your own uploading logic here
            let u = await Remote.Work().drafts().chapters().addImgContent(data)

            let iUrl = {
            	type: 'img',
            	url: 'https://static.newt.keetup.com/contents/'+u.objects.filename,
            }


            this.onAddHeader(iUrl);

		     return;
	}

	removeCover = () => {
		this.props.onDeleteCover(this.props.openedFiles[this.props.selectedTab])
	}

	selectHeader = async() => {
		if(this.props.openedFiles[this.props.selectedTab].chapter.header){
			return this.removeCover()
		}
		const up = await remote.dialog.showOpenDialog(remote.getCurrentWindow(),
		   {
		    filters: [
		      {name: 'Images', extensions: ['png', 'jpg', 'jpeg']}
		    ]
		   });

		this.selectImage(up.filePaths)
	}

	renderHeader = () => {
		let header = this.props.openedFiles[this.props.selectedTab].chapter.header;
		if(header && header.url){
			if(header.type == 'img'){
				return (
					<div style={{width: '100%', height: 450, backgroundSize: 'cover', backgroundImage: 'url('+header.url+')', backgroundPosition: '35% 20%'}}>
					</div>
					)
			}
		} else {
			return (<div></div>)
		}
	}
		 _renderCoreSearchSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}}>
	 					<div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.triggerSearch('hide')} style={{marginTop: 2, backgroundColor: 'transparent'}}>

				  			<Icon
							  name='closecircle'
							  font='AntDesign'
							  color='rgba(206, 206, 206, 0.78)'
							  size={20}
							  // style={{}}
							/>
							
				  		</div>


				  				<div className="search">
  
								    <div className="field">

								      <input type="text" autoFocus onChange={(e) => this.props.onTypeSearch(e)} placeholder="Search" className="input-search" id="input-search" onKeyDown={this._handleKeyDown} name="input-search" required />
								      <label htmlFor="input-search"></label>
								      <span>Cancel</span>

								    </div>
								  </div>
				 


				  		</div>
				  		);
	 }
	 _renderCoreSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}}>
				  		
				  			
						<Popover
							    isOpen={this.state.isPopoverOpen}
							    position={'bottom'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.setState({ isPopoverOpen: false })}
							    content={({ position, targetRect, popoverRect }) => (
							        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
							            position={'bottom'}
							            targetRect={targetRect}
							            popoverRect={popoverRect}
							            arrowColor={'#fff'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                className={'popoverContainerNewt'}
							                onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.props.onCreateWork()}>
								            		<Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#737373'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>New</span>
								            	</li>
								            <Dropzone className={'dimensionsEpubImportDrop'} onDrop={(files) => this.props.onDropEpubs(files)}>
								            	<li>
								            		<Icon
																			  name='book'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/><br/>
													<span>Drop epubs<br />or press to select</span>
													{this.props.isImporting == true && <div className={'dimensionsEpubImportDropLoading'}>Processing.<br />Wait a few seconds.</div>}

												</li>
											</Dropzone>
								            	
								            </ul>
							            </div>
							        </ArrowContainer>    
							       )}
							>
								

							    <div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}>

							        <Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#000'
																			  size={20}
																			  // style={{}}
																			/>

							    </div>
							</Popover>


						

						<Popover
							    isOpen={this.state.isPopoverUserOpen}
							    position={'bottom'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.setState({ isPopoverUserOpen: false })}
							    content={({ position, targetRect, popoverRect }) => (
							        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
							            position={'bottom'}
							            targetRect={targetRect}
							            popoverRect={popoverRect}
							            arrowColor={'#fff'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                className={'popoverContainerNewt'}
							                onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.props.onSignOut()}>
								            		<Icon
																			  name='account-off'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
													<span>Sign out</span>
												</li>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							    <div 
							    	style={{backgroundImage: 'url('+this.props.rootUser.avatar+')'}} 
							    	onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })} 
							    	className={signedInStyles['sidebarButtonCircleAvatar']}
							    	>
							    </div>

							</Popover>




				  		<div className={signedInStyles['sidebarUsername']}>
				  			@{this.props.rootUser.name}
				  				
				 

				  		</div>
				  		</div>
				  		);
	 }

	_renderSelectedBar = () => {
		return (
			<div style={{display: 'inline-flex'}}>
				<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.props.onCancelSelect()} style={{padding: '5px 10px 7px 10px', marginRight: 5}}>
													<span>Cancel</span>
										</button>

				<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.props.openBulk(this.props.selectedBooks)} style={{padding: '5px 10px 7px 10px', marginRight: 5}}>
													<Icon
														 name='select-all'
														 font='MaterialIcons'
														 style={{verticalAlign: 'bottom', marginTop: 2}}
														 color='#fff'
														 size={13}
													/> 
													<span>Edit {this.props.selectedBooks.length} selected</span>
										</button>
										
			</div>
			)
	}
	_renderGoBackSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}} onClick={() => this.props.onGoBack()}>
	 		<div className={signedInStyles['sidebarButtonCircle']}>

				  			<Icon
							  name='ios-arrow-back'
							  font='Ionicons'
							  color='rgba(206, 206, 206, 0.78)'
							  size={20}
							  // style={{}}
							/>
							
				  		</div>
				  		


				  		<div className={signedInStyles['sidebarUsername']}>
				  			Back
				  		</div>
				  		</div>
				  		);
	 }

	_renderNewTab = () => {
		  const rows = 4
		  const columns = 8
		  const coverHeight = 145
		  const coverWidth = 160
		  const padding = 5
		  const speed = 1

		  const coverHeightWithPadding = coverHeight + padding
		  const coverWidthWithPadding = coverWidth + padding
		  const initial = 75;
		  const covers = Array(columns * rows).fill(1)
		return (
	  			<div className={'noselect'}>
	  				<div className={signedInStyles['newTabNavbar']}>
				  		{(this.props.selectedBooks == null && (this.props.currentSection == 'works') &&  this.props.isSearching != true) && this._renderCoreSidebar()}
				  		{(this.props.currentSection == 'chapters' && this.props.isSearching != true) && this._renderGoBackSidebar()}
				  		{(this.props.selectedBooks == null && this.props.isSearching == true) && this._renderCoreSearchSidebar()}
				  		{(this.props.selectedBooks != null && this.props.currentSection == 'works') && this._renderSelectedBar()}
				  		{(this.props.selectedBooks == null && (this.props.currentSection == 'sync') &&  this.props.isSearching != true) && this._renderGoBackSidebar()}
				  	</div>
				  {this.props.currentSection == 'works' && this.props.works != null && 

				  	<div style={{display: 'inline-flex', width: '100%',justifyContent: 'center',alignItems: 'center', marginTop: '5%'}}>
				  				<div className={["search", "shadowInput"].join(" ")}>
  
								    <div className="field">

								      <input type="text" autoFocus onChange={(e) => this.props.onTypeSearch(e)} value={this.props.searchTerm} placeholder="Search" className="input-search" id="input-search" onKeyDown={this.props.handleKeyDown} name="input-search" required />
								      <label htmlFor="input-search"></label>
								      {(this.props.searchTerm != null && this.props.searchTerm != '') && <span onClick={() => this.props.cleanSearch()} style={{ position: 'absolute', top: 3,right: 10,fontSize:15}}>Cancel</span>}
								    </div>
								  </div>
				 


				  		</div>
				  	}

	  				{
				  			(this.props.currentSection == 'works' || this.props.currentSection == 'chapters') && this.props.works == null && 

				  					<div style={{display: 'flex', justifyContent: 'center', padding: 10,paddingTop: 75,height: 58}} key={Math.random()}>
				  						<ContentLoader
										      speed={speed}
										      width={columns * coverWidthWithPadding}
										      height={rows * coverHeightWithPadding + 100}
										      backgroundColor="#333"
											  foregroundColor="#444"
										    >
										      <rect
										        x="300"
										        y="0"
										        rx="20"
										        ry="20"
										        width={700}
										        height="50"
										      />

										      {covers.map((g, i) => {
										        let vy = Math.floor(i / columns) * coverHeightWithPadding + initial
										        let vx = (i * coverWidthWithPadding) % (columns * coverWidthWithPadding)
										        return (
										          <rect
										          	key={Math.random()}
										            x={vx}
										            y={vy}
										            rx="0"
										            ry="0"
										            width={coverWidth}
										            height={coverHeight}
										          />
										        )
										      })}
										    </ContentLoader>

															  </div>

				  		}
				  		{
				  			(this.props.currentSection == 'works' || this.props.currentSection == 'chapters') && this.props.works != null && <SidebarWorks 
				  											onMoveChapters={(chapters) => this.props.onChaptersMove(chapters)}
				  											onCreateChapter={() => this.props.onCreateChapter()}
				  											onCreateWork={() => this.props.onCreateWork()}
				  											chapters={this.props.chapters} 
				  											currentWork={this.props.currentWork} 
				  											currentSection={this.props.currentSection} 
				  											openWork={(k) => this.props.openWork(k)} 
				  											closeWork={(k) => this.props.closeWork(k)} 
				  											openBookSettings={(book) => this.props.openBookSettings(book)} 
				  											onSelectBook={(book) => this.props.onSelectBook(book)} 
				  											openChapter={(chapter, book) => this.props.openChapter(chapter, book)} 
				  											works={this.props.works} 
				  											selectedWorks={this.props.selectedBooks} 
				  											rootUser={this.props.rootUser} 
				  											isSearching={this.props.isSearching}
				  											searchTerm={this.props.searchTerm}
				  											toggleSettingsChapters={(key) => this.props.toggleSettingsChapters(key)}
				  											onUpdatedOrInserted={this.props.onUpdatedOrInserted.bind(this)}
				  											onUpdatedOrInsertedChapter={this.props.onUpdatedOrInsertedChapter.bind(this)}
				  											onSyncChapters={(id) => this.props.onSyncChapters(id)}
				  										/>

				  		}
	  			</div>
	  			)
	}

	saveBulk = async(bulk) => {
		return this.props.onSaveBulkChanges(bulk);
	}
	render(){

		

	 if(this.props.openedFiles && typeof this.props.openedFiles === 'object' && this.props.selectedTab != null && this.props.openedFiles[this.props.selectedTab]){

	 	if(this.props.openedFiles[this.props.selectedTab].type == 'bulk'){
	 		const bulkBooks = this.props.openedFiles[this.props.selectedTab];
	 		return (

	 			<div style={{paddingTop: 15}} className={'bulkSection'}>
	 			<div className={'bulkTitleEditor'}>
	 				<h3 style={{margin:10}}>
	 					{
	 						bulkBooks.books.length > 1 ? bulkBooks.books.length+' books' : (bulkBooks.books.length == 1 ? bulkBooks.books[0].title : 'Selected')
	 					}
	 				</h3>
	 				<ProgressButton onClick={() => this.saveBulk(bulkBooks)}>
				         Save
				    </ProgressButton>
	 			</div>
				{
					bulkBooks.books.map((key, index) => {
						return (
								<BookRow key={key._id} keyBulked={bulkBooks} bookRow={key} onChange={(bulk, book) => this.props.onChangeBulk(bulk, book)} onSaveBulkChanges={(bulk) => this.props.onSaveBulkChanges(bulk)}/>
							);
					})
				}
				</div>

	 			)
	 	}

	 	if(this.props.openedFiles[this.props.selectedTab].type == 'wysiwyg'){
	 		let coverHeader = (this.props.openedFiles[this.props.selectedTab].chapter.header && this.props.openedFiles[this.props.selectedTab].chapter.header.url) ? this.props.openedFiles[this.props.selectedTab].chapter.header : null;


			let itemsAdd = [
					    {
					      label: "Add or remove chapter cover",
					      click: () => this.selectHeader()
					      /*submenu: [
					        { label: "Submenu item", click: () => alert("I was clicked!") },
					        {
					          label: "Submenu item #2",
					          click: () => alert("I was also clicked!")
					        }
					      ]*/
					    }
					  ];
			let itemsSettings = [
						{
					      label: "Close",
					      click: () => this.props.closeDoc(this.props.openedFiles[this.props.selectedTab])
					    },
					    {
					      label: "Delete chapter",
					      click: () => this.props.deleteDoc(this.props.openedFiles[this.props.selectedTab])
					    }
					  ];
	 	return (
	  	<div style={{width: '100%', height: '100%'}}>

	  	<div style={{display: 'inline-flex', height: 100, width: '100%'}}>
	  	<ContextMenuArea menuItems={itemsAdd}>
		  	<div key={'context'+this.props.openedFiles[this.props.selectedTab]._id} className={'toolbarButtonTitleEditorAdd'} style={{ backgroundSize: 'cover', backgroundImage: (coverHeader != null && coverHeader.url) && 'url('+coverHeader.url+')'}}>
		  			<Icon
								  name='plus'
								  font='Feather'
								  color='#777'
								  size={25}
								  style={{marginTop: -1}}
								/>
		  		</div>
	    </ContextMenuArea>
	  		
	    <div style={{ display: 'inline-flex',    justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute', right: 10}}>
	  		<ProgressButton onClick={() => this.onSave()}>
				         Save
			</ProgressButton>

	  		<div key={'save'+this.props.openedFiles[this.props.selectedTab]._id} className={['toolbarButtonTitleEditor'].join(" ")}>
	  			<ContextMenuArea menuItems={itemsSettings}>
				  	<div className={'settings'} style={{border: (this.props.openedFiles[this.props.selectedTab].changed == true) && '1px solid #2b982f'}}>
	  			<Icon
							  name='more-vertical'
							  font='Feather'
							  color='#777'
							  size={24}
							  style={{marginTop: -1}}
							/>

				</div>
			    </ContextMenuArea>
	  			
	  		</div>
	  	</div>
	  		<input type="text" onChange={(e) => this.props.changeTitle(e, this.props.openedFiles[this.props.selectedTab])} placeholder={"Title"} className={"inputTitleEditor"} key={'input'+this.props.openedFiles[this.props.selectedTab]._id} defaultValue={this.props.openedFiles[this.props.selectedTab].chapter.title || ''} />
	  	</div>

	  		<NewtEditor
			          tag="div"
			          className={["editableInput"+this.props.openedFiles[this.props.selectedTab]._id, "tabWysiwyg"].join(" ")}
			          text={this.props.openedFiles[this.props.selectedTab].chapter.native_content || ''}
			          enableReInitialize={this.props.enableReInitialize}
			          onChange={(text, medium) => this.handleChange(text, this.props.openedFiles[this.props.selectedTab])}

			        />
			</div>
			);
	  	}

	  	if(this.props.openedFiles[this.props.selectedTab].type == 'welcome'){
	  		return this._renderNewTab()
	  	}
	  	/*
				<div style={{paddingTop: 15}}>
				{
					keyBulk.books.map((key, index) => {
						return (
								<BookRow key={key._id} keyBulked={keyBulk} bookRow={key} onChange={(bulk, book) => this.onChangeBulk(bulk, book)} onSaveBulkChanges={(bulk) => this.onSaveBulkChangesToBooks(bulk)}/>
							);
					})
				}
				</div>

			*/


	 } else {

	  	return this._renderNewTab()
	 }
	  
	}
}
