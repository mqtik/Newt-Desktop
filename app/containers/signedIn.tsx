import React, {Component} from 'react';
import SidebarChapters from '../components/sidebarChapters';

import BookRow from '../components/bookRow';

import SidebarWorks from '../components/sidebarWorks';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import signedInStyles from '../styles/signedIn.css';

import blue1 from '../assets/mocks/blue1.png';
import blue2 from '../assets/mocks/blue2.png';
import blue3 from '../assets/mocks/blue3.png';
import green1 from '../assets/mocks/greenn.png';
import purple1 from '../assets/mocks/purple.png';
import purple2 from '../assets/mocks/purple2.png';



import immTh from '../assets/illus/illustration_77.svg';
import firt from '../assets/illus/illustration_9.svg';
import conts from '../assets/illus/illustration_140.svg';
import modsv from '../assets/illus/illustration_112.svg';
import pubs	from '../assets/illus/illustration_58.svg';
import svg7	from '../assets/illus/illustration_48.svg';
import svg8	from '../assets/illus/illustration_32.svg';

import { Switch, Route, BrowserRouter } from 'react-router';

import Icon, { Feather } from 'react-web-vector-icons';

import SplitterLayout from 'react-splitter-layout';

import Overdrive from 'react-overdrive'

import _ from 'lodash'

import ContentLoader from "react-content-loader" 

import Popover, { ArrowContainer } from 'react-tiny-popover'

import { Defer, Img } from 'react-progressive-loader'

const {dialog} = require('electron').remote;

const Remote = new API({ url: process.env.API_URL })

import { FixedSizeList as List } from 'react-window';

import SearchInput, {createFilter} from 'react-search-input'

const {getCurrentWindow, globalShortcut} = require('electron').remote;

const KEYS_TO_FILTERS = ['title', 'author', 'description', 'tags', 'status']
const KEYS_TO_FILTERS_SYNC = ['toSync']

import { Redirect } from 'react-router';

import Loading from '../components/loading'




import Dropzone from 'react-dropzone';

/*
<Tab key={'tab0'} title={'unclosable tab'} unclosable={true} {...this.makeListeners('tab0')}>
	makeListeners = (key) => {
    return {
      onClick: (e) => { console.log('onClick', key, e);}, // never called
      onContextMenu: (e) => { console.log('onContextMenu', key, e); this.handleTabContextMenu(key, e)},
      onDoubleClick: (e) => { console.log('onDoubleClick', key, e); this.handleTabDoubleClick(key, e)},
    }
  }
  */

// ES module
import Editor from '../lib/editor/wrapper/editor.tsx';

import update from 'immutability-helper'

export default class SignedIn extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			rootUser: null,
			works: null,
			isLoading: true,
			openedFiles: null,
			selectedTab: 0,
			openPop: false,
			isPopoverOpen: false,
			selectedBooks: null,

			chapters: null,
			currentSection: 'works',
			currentWork: null,

			isSearching: false,
			searchTyping: '',
			searchTerm: '',

			syncedDocs: null,
			stateSync: null,
			statusPush: null,
			statusPull: null,

			currentSync: 'drafts',

			isImporting: false
		}

		this._handleTabChange = this._handleTabChange.bind(this);
		

		let w = getCurrentWindow();
		w.setMaximumSize(4000, 4000);
		w.setMinimumSize(465, 650);
		w.maximize();

		this.replicatorChapters = null;
		this.replicatorDrafts = null;
		
		//this.syncDrafts = null;
		//this.syncChapters = null;
      
		/*var scrollable = document.querySelector('.sidebarTop');

		scrollable.addEventListener('wheel', function(event) {
		    var deltaY = event.deltaY;
		    var contentHeight = scrollable.scrollHeight;
		    var visibleHeight = scrollable.offsetHeight;
		    var scrollTop = scrollable.scrollTop;

		if (scrollTop === 0 && deltaY < 0)
		    event.preventDefault();
		else if (visibleHeight + scrollTop === contentHeight && deltaY > 0)
		    event.preventDefault();
		});*/
	}
	componentDidMount(){

		 this.$init();


	}

	onUpdatedOrInsertedChapter = (newDoc) => {


		    	if(typeof this.state.chapters === 'undefined' || this.state.chapters == null){
		    		return;
		    	}
		      var index = _.findIndex(this.state.chapters, ['_id', newDoc._id]);

		      var chapter = this.state.chapters[index];
		      if(newDoc && newDoc._id.includes("_design")){
			    	return;
			    }
		      
		      if (chapter && chapter._id === newDoc._id) { // update
		      	if(newDoc._deleted){
			    	this.setState((prevState) => update(prevState, { 
			              	chapters: { 
			              		$splice: [[index, 1]]
			                   }
			                 }));
			    	return;
			    } else {
			    	this.setState((prevState) => update(prevState, { 
		                chapters: { 
		                    [index]: { 
		                        $set: newDoc
		                       } 
		                     }
		                   }));
			    }
		        

		      } else { // insert

		      	if(index == -1 && !newDoc._deleted){
		        this.setState((prevState) => update(prevState, { 
		                chapters: { 
		                   $push: [newDoc]
		                   }
		             }));
		    	}
		      }
		    }

	binarySearch = (arr, docId)  => {
	    var low = 0, high = arr.length, mid;
	    while (low < high) {
	      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
	      arr[mid]._id < docId ? low = mid + 1 : high = mid
	    }
	    return low;
	  }

	  onUpdatedOrInserted = (newDoc) => {
	  	if(typeof this.state.works === 'undefined' || this.state.works == null){
	  		return;
	  	}
	    var index = _.findIndex(this.state.works.rows, ['_id', newDoc._id]);

	    if(newDoc && newDoc._id.includes("_design")){
	    	return;
	    }
	    var doc = this.state.works.rows[index];

	   

	    if(doc && doc._id === newDoc._id){

	    	 if(newDoc._deleted){
		    	this.setState((prevState) => update(prevState, { 
		              works: {
		              	rows: { 
		              		$splice: [[index, 1]]
		                   }
		                  }
		                 }));
		    	return;
		    } else {
		     this.setState((prevState) => update(prevState, { 
		              works: {
		              	rows: { 
		                  [index]: { 
		                      $set: newDoc
		                     } 
		                   }
		                  }
		                 }));
		    }


	    } else { // insert
	    	console.log("INSERT DOC!", index, newDoc)
	    	if(index == -1 && !newDoc._deleted){
	    		 this.setState((prevState) => update(prevState, { 
	              works: { 
	              	rows:{
	              		$push: [newDoc]
	              	}
	               }
	           }));

	    		 console.log("doc inserted!", this.state.works)
	    	}
	     
	    }
	  }
	

	$init = async() => {


		let k = await(Remote.Auth().getLoggedUser());


		this.setState({
			rootUser: k
		})

		let drafts = await(Remote.Work().drafts().all());
		let openedFiles = await(Remote.OpenFiles().all());


      if(drafts && drafts.rows.length == 0){
      		let setUpDrafts = await(Remote.Work().drafts().replicateFrom());
          	drafts = await(Remote.Work().drafts().all());

        }



        this.setState({works: drafts, openedFiles: openedFiles})
        //this.refsEditor.current.focus();



	    var elem = document.querySelector('.loadingWrapper');

	    if(elem && elem){
	    	setTimeout(function(){
		      window.scrollTo(0, 0);
		      elem.style.opacity = '0';
		      setTimeout(function(){
		        elem.parentNode.removeChild(elem);
		      },1000)
		    },1000)
	    }
	    

		//let s = await(Remote.Work().setUp());
		//console.log("setup!", s, Remote)

		this.syncNewt();
            
           /* this.props.RemoteCloud.ApplicationDrafts.changes({live: true, since: 'now', include_docs: true})
              .on('change', (change) => {
              console.log("[sync] ON CHANNGE!", change)
            }).on('error', console.log.bind(console))*/
      
    	//return;


	}

	cancelAndRestartSync = () => {
		if(this.syncDrafts){
			let c = this.syncDrafts.cancel();
			//console.log("CANCCEL AND RESTART! DRAFTS!", c)
		}
		if(this.syncChapters.cancel){
			let c = this.syncChapters.cancel();
			//console.log("CANCCEL AND RESTART! CCHAPTERS!", c)//
		}

		this.syncNewt();
	}

	syncNewt = async() => {

		console.log("this state rootuser!", this.state.rootuser)
		if(this.state.rootUser  && typeof this.state.rootUser.draftsCheckpoint === 'undefined'){
	        let inf = await Remote.ApplicationDrafts.info();

	        console.log("user does not have a checkpoint!", inf)
	        await this.setDraftsCheckpoint(inf.update_seq, 'checkpoint')

	        console.log("user now has a checkpoint", this.state.rootUser)


	      }

	      let since = this.state.rootUser && typeof this.state.rootUser.draftsCheckpoint !== 'undefined' ? this.state.rootUser.draftsCheckpoint : 'now';

            let optDrafts = {
                     live: true,
                     retry: true,
                     filter: '_selector',
                     //since: since,
                     selector: {
	                    "$and": [
                         {
                            "_id": {
                               "$gte": this.state.rootUser.name+"-"
                            }
                         },
                         {
                            "_id": {
                               "$lt": this.state.rootUser.name+"-￰\ufff0"
                            }
                         }
                      ]
	                 },
	                 back_off_function: function (delay) {
					    if (delay === 0) {
					      return 1000;
					    }
					    return delay * 3;
					  },
					 style: "main-only",
                     batch_size: 200,
                     batches_limit: 5,
                     checkpoint: 'source'
                     //push: {checkpoint: false}, pull: {checkpoint: false},
                    // query_params: { "userId": this.state.rootUser.name }
                  };


              let oneWayDrafts = _.clone(optDrafts, true);
              oneWayDrafts.continuous = false;
              oneWayDrafts.batch_size = 500;
              oneWayDrafts.live = false;
              //oneWayDrafts.since = 'now';
              oneWayDrafts.checkpoint = 'source';
	      
	      console.log("START REPLICATION", optDrafts)
	      Remote.ApplicationDrafts.replicate.from(Remote.RemoteDrafts, oneWayDrafts).on('complete', (info) => {
	      	//console.log("one way drafts!", info, optDrafts	)
            this.syncDrafts = Remote.ApplicationDrafts.sync(Remote.RemoteDrafts, optDrafts)
              .on('change', (info) => {
   				this.setDraftsCheckpoint(info.last_seq);
              console.log('Replication Progress', info);
            }).on('error', (err) => {
                console.log("[sync] on error!", err)
                this.syncDrafts.cancel();

            }).on('active', (ac) => {
                console.log("[sync] on active!", ac)

            }).on('paused', (pa) => {
                console.log("[sync] on paused!", pa)

            }).catch(err => console.log("error!!!!", err))
	     })

	      
            
	}

	onSyncChapters = async(id) => {


           // if(this.state.syncedDocsId && this.state.syncedDocsId.length > 0){

            	/*
            	{
   "selector": {
      "$and": [
         {
            "_id": {
               "$gte": "bookman-1581446666866"
            }
         },
         {
            "_id": {
               "$lt": "bookman-1581446666866￰"
            }
         }
      ]
   }
}*/
            	let optChapters = {
                 live: true,
                 retry: true,
                 filter: '_selector',
                 //push: {checkpoint: true}, 
                 //pull: {checkpoint: true},
                 batch_size: 100,
                 batches_limit: 5,
                 "continuous":true,
                 checkpoint: 'source',
                 //push: {checkpoint: false}, pull: {checkpoint: false},
                 back_off_function: function (delay) {
				    if (delay === 0) {
				      return 1000;
				    }	
				    return delay * 3;
				  },
				 selector: {
                  "bookId": {
                    "$eq": id
                  }
                 }
              };

              let oneWayChapters = _.clone(optChapters, true);
              	  oneWayChapters.live = false;

              console.log("REPLICATION GO CHAPTERSR!", optChapters, oneWayChapters)

            // Remote.ApplicationChapters.replicate.from(Remote.RemoteChapters, oneWayChapters).on('complete', (info) => {

             	//	console.log("on info!", info)
		            this.replicatorChapters = Remote.ApplicationChapters.sync(Remote.RemoteChapters, optChapters)
		              .on('change', (info) => {
		                //console.log("[sync] on change!", info, info.change.last_seq.split("-")[0], infoDrafts.update_seq, startingpoint);

		              console.log('Replication Progress Chapters', info);
		              }).on('error', (err) => {
		                  console.log("[syncchapters] on error!", err)
		                  this.replicatorChapters.cancel();
		              }).on('active', (ac) => {
		                  console.log("[syncchapters] on active!", ac)

		              }).on('paused', (pa) => {
		                  console.log("[syncchapters] on paused!", pa)

		              });
          //   })


           // }
	}

	onCancelChaptersSync = () => {
		if(this.replicatorChapters){
			setTimeout(() => {
				this.replicatorChapters.cancel();
			}, 2000)

		}

	}
	onSignOut = async() => {
		let k = await(Remote.Auth().signOut());


		let w = getCurrentWindow();
		w.setMaximumSize(465, 650);
		w.maximize();
		w.center();


		this.props.history.go('/')
	}

	toggleSettings = (key) => {
		let openedFiles = this.state.works.rows;
		
		let openIndex = _.findIndex(openedFiles, ['_id', key._id]);

		if(!openedFiles[openIndex].openSettings || openedFiles[openIndex].openSettings == false){
			openedFiles[openIndex].openSettings = true;
		} else {
			openedFiles[openIndex].openSettings = false;
		}


		this.setState({
			openedFiles: openedFiles
		})
	}

	toggleSettingsChapters = (key) => {

		let chapters = this.state.chapters;
		
		let chapterIndex = _.findIndex(chapters, ['_id', key._id]);

		console.log("chapter index!", chapterIndex)
		if(!chapters[chapterIndex].openSettings || chapters[chapterIndex].openSettings == false){
			chapters[chapterIndex].openSettings = true;
		} else {
			chapters[chapterIndex].openSettings = false;
		}

		this.setState({
			chapters: chapters
		})
	}

	$onChaptersMove = async(chapters) => {
		this.setState({
			chapters: chapters
		})

		let onMove = await(Remote.Work().drafts().chapters().onMove(chapters));
		return;
	}

	$openChapters = async(key) => {

		let chapters = [];
	    let getChapters = await(Remote.Work().drafts().chapters().all(key._id));
	    
	    console.log("GET CHAPTERS OF!", getChapters)


	    if(getChapters && getChapters.chapters && getChapters.chapters.length == 0){

	      let chaptersRemote = await(Remote.Work().drafts().chapters().allRemote(key._id));

	      console.log("chaptersrep", chaptersRemote, key)
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

	    this.onSyncChapters(key._id);

	}
	openWork = (key) => {
		console.log("open work!", key)
		if(key.openSettings == true){
			this.toggleSettings(key);
		}
		
		key.isSynced = true;

		this.setState({
			currentWork: key,
			currentSection: 'chapters'
		})

		this.$openChapters(key);
	}

	openChapter = async(chapter, book) => {
		//console.log("open chapter!!", chapter, book)

		let openedFiles = this.state.openedFiles;

		let newOpenedFile = await(Remote.OpenFiles().openChapter(chapter, book));
		console.log("drafts!", newOpenedFile)
		if(newOpenedFile != null){
			let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', chapter._id]);

			if(openIndex == -1){
				openedFiles.all.push(newOpenedFile);
				openIndex = _.findIndex(this.state.openedFiles.all, ['_id', chapter._id]);

				this.setState({
		        	openedFiles: openedFiles,
		        	selectedTab: openIndex
		        })
			} else {
				this.setState({
		        	selectedTab: openIndex
		        })
			}
			
		} 
		if(newOpenedFile == true) {
			let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', chapter._id]);

			if(openIndex == -1){

			}
			//console.log("openn fileee!", openedFiles, openIndex)
		}
		
	}

	$onCreateWork = async() => {
	    let c = await(Remote.Work().drafts().create());
	    
	   // this.cancelAndRestartSync();
	    	//console.log("o create work!", c)
	   // this.state.works.rows.unshift(c);

	   /* let nDocs = (this.state.works && this.state.works.rows != null) ? this.state.works.rows : [];
	    let wDocs = nDocs.concat(c);

	    console.log("this state works!", this.state.works)
	    this.state.works.rows = wDocs;

	    console.log("this state works! after", this.state.works)*/
	   // this.setState({ works: this.state.works, search: '' })

	  }
	$onCreateChapter = async() => {
		if(this.state.currentWork == null){
			return;
		}
		//console.log("this state work curret!", this.state.currentWork)
		let n = await(Remote.Work().drafts().chapters().create(this.state.currentWork._id))

		/*if(this.state.chapters == null || this.state.chapters.length == 0){
			this.state.chapters = [];
		}
		this.state.chapters.push(n);


		this.setState({ chapters: this.state.chapters, search: '' })*/
	}
	onChangeBulk = (bulk, book) => {
		//console.log("on chang bulk!", bulk)

		const openIndex = _.findIndex(this.state.openedFiles.all, ['_id', bulk._id]);

		//console.log("open index!", openIndex, this.state.openedFiles.all[openIndex])
		if(openIndex != -1){

			//if(!this.state.openedFiles.all[openIndex].changed || this.state.openedFiles.all[openIndex].changed == false){
				this.state.openedFiles.all[openIndex].changed = true;

				this.setState({
					openedFiles: this.state.openedFiles,
					selectedTab: openIndex
				})
			//}


		}
	}

	askSave = () => {
		const options = {
			    type: 'question',
			    buttons: ['Cancel', 'No, close', 'Yes, save'],
			    defaultId: 2,
			    title: 'Save File',
			    message: 'This file has unsaved changes!',
			    detail: 'Do you want to save it to save it?',
			    checkboxLabel: 'Remember my answer',
			    checkboxChecked: true,
			  };


		let s = dialog.showMessageBox(null, options);
		s.then(res => {
			console.log("resp!", res.response)

			if(res.response == 2){

			}
			if(res.response == 1){
				
			}

		})

		return;
	}
	answerAsk = (response) => {
		//console.log("go!",response)
	}
	closeFile = async(file) => {
		//console.log("console file close!", file)
		/* 
		this.setState(prevState => ({
	        items: {
	            ...prevState.items,
	            [prevState.items[1].name]: e.target.value,
	        },
	    }))
	    ;*/
		let openedFiles = this.state.openedFiles;

		let openIndex = _.findIndex(openedFiles.all, ['_id', file._id]);

		if(openedFiles.all[openIndex].type == 'bulk'){

		}

		if(openedFiles.all[openIndex].changed == true && openedFiles.all[openIndex].type == 'wysiwyg'){


			const options = {
			    type: 'question',
			    buttons: ['Cancel', 'No, close', 'Yes, save'],
			    defaultId: 2,
			    title: 'Save File',
			    message: 'This file has unsaved changes!',
			    detail: 'Do you want to save it?',
			    checkboxLabel: 'Remember my answer',
			    checkboxChecked: true,
			  };


				let s = dialog.showMessageBox(null, options);
				s.then(async(res) => {

					console.log("resp file!", res.response)


					if(res.response == 0){
						return null;
					}
					if(res.response == 2){
						this.saveChapter(file);
						//let savedFile = await(Remote.OpenFiles().saveChapter(file));
					}

					if(res.response == 1 || res.response == 2){
						let closedFile = await(Remote.OpenFiles().closeChapter(file._id));
						console.log("splice!", openedFiles, openIndex)
				          openedFiles.all.splice(openIndex, 1);

				        this.setState({
				        	openedFiles: openedFiles,
				        	selectedTab: 0
				        })
					}

			        return;

				})
			  
			return;
		}

		if(openedFiles.all[openIndex].changed == true && openedFiles.all[openIndex].type == 'bulk'){


			const options = {
			    type: 'question',
			    buttons: ['Cancel', 'No, close', 'Yes, save'],
			    defaultId: 2,
			    title: 'Save Bulk',
			    message: 'This bulk of books has unsaved changes!',
			    detail: 'Do you want to save it?',
			    checkboxLabel: 'Remember my answer',
			    checkboxChecked: true,
			  };


				let s = dialog.showMessageBox(null, options);
				s.then(async(res) => {
					console.log("resp bulk!", res.response)


					if(res.response == 0){
						return null;
					}
					if(res.response == 2){
						let savedFile = await(Remote.OpenFiles().saveBook(file));

						//console.log("RESPUESTA OF SAVE FILE!", savedFile)
						for (var i = savedFile.length - 1; i >= 0; i--) {

							let workIndex = _.findIndex(this.state.works.rows, ['_id', savedFile[i]._id]);

							this.state.works.rows[workIndex] = savedFile[i];
							            //console.log("work index!", workIndex, savedFile[i])

							            //console.log("this state works!", this.state.works)
						}
						
						this.setState({
								works: this.state.works
							})
						
						


					}

					if(res.response == 2 || res.response == 1){
						let closedFile = await(Remote.OpenFiles().closeChapter(file._id));
						console.log("splice bulk!", openedFiles, openIndex)
				          openedFiles.all.splice(openIndex, 1);

				        this.setState({
				        	openedFiles: openedFiles,
				        	selectedTab: 0
				        })
					}


			        return;

				})
			return;
		}

		let closedFile = await(Remote.OpenFiles().closeChapter(file._id));
					console.log("splice!", openedFiles, openIndex)
			          openedFiles.all.splice(openIndex, 1);

			        this.setState({
			        	openedFiles: openedFiles,
			        	selectedTab: 0
			        })
		
	}

	onSaveBulkChangesToBooks = async(book) => {
		console.log("save bulk to books", book)
		let isForDeleted = false;
		let savedFile = await(Remote.OpenFiles().saveBook(book));

						//console.log("RESPUESTA OF SAVE FILE!", savedFile)
						for (var i = savedFile.length - 1; i >= 0; i--) {

							let workIndex = _.findIndex(this.state.works.rows, ['_id', savedFile[i]._id]);

							this.state.works.rows[workIndex] = savedFile[i];

							if(savedFile[i]._deleted){
								isForDeleted = true;
							}
							            //console.log("work index!", workIndex, savedFile[i])

							            //console.log("this state works!", this.state.works)
						}

		let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', book._id]);

		if(openIndex != -1){
			book.changed = false;

			this.state.openedFiles.all[openIndex].changed = false;
		}
						
						
		

		//console.log("is for delete?", isForDeleted)
		if(isForDeleted == true){
			let closedFile = await(Remote.OpenFiles().closeChapter(book._id));
						//console.log("splice!", openedFiles, openIndex)
				         this.state.openedFiles.all.splice(openIndex, 1);

				        this.setState({
				        	openedFiles: this.state.openedFiles,
				        	selectedTab: 0
				        })
			return;
		}
		this.setState({
				works: this.state.works,
				openedFiles: this.state.openedFiles
			})
	}

	setDeleted = async(key) => {

		const openIndex = _.findIndex(this.state.openedFiles.all, ['_id', key._id]);

		console.log("set delete of!", this.state.openedFiles.all[openIndex])
		if(openIndex != -1){
			this.state.openedFiles.all[openIndex].chapter._deleted = true;

			if(!this.state.openedFiles.all[openIndex].chapter.chaged || this.state.openedFiles.all[openIndex].chapter.changed == false){
				this.state.openedFiles.all[openIndex].changed = true;
				this.state.openedFiles.all[openIndex].chapter.changed = true;
			}
		}


	

		let s = await(Remote.OpenFiles().saveChapter(key));

		let closedFile = await(Remote.OpenFiles().closeChapter(key._id));

		this.state.openedFiles.all.splice(openIndex, 1);

				        this.setState({
				        	openedFiles: this.state.openedFiles,
				        	selectedTab: 0,
				        	optionsFile: false
				        })

		return openIndex;

	}

	saveChapter = async(key) => {
		let savedChapter = await(Remote.OpenFiles().saveChapter(key));

		let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', key._id]);

		
		if(this.state.currentWork && this.state.currentSection && this.state.chapters){
			console.log("opeeeee",key,this.state.currentWork._id)
			if(key.book._id == this.state.currentWork._id){
				if(this.state.chapters && this.state.chapters != null){
					let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
					console.log("chapter index!", chapterIndex, this.state.chapters[chapterIndex])
					if(chapterIndex != -1){
						this.state.chapters[chapterIndex].title = key.chapter.title;
						if(key.chapter._deleted == true){
							this.state.chapters[chapterIndex]._deleted = true;
						}
						this.state.openedFiles.all[openIndex].changed = false;
						this.setState({
							chapters: this.state.chapters,
							openedFiles: this.state.openedFiles
						})
					}
				} else {
					console.log("go along", openIndex, this.state.openedFiles.all[openIndex])
						this.state.openedFiles.all[openIndex].changed = false;
						this.setState({
							openedFiles: this.state.openedFiles
						})
				}
			} else {
				this.state.openedFiles.all[openIndex].changed = false;
						this.setState({
							openedFiles: this.state.openedFiles
						})
			}
		} else {
				this.state.openedFiles.all[openIndex].changed = false;
						this.setState({
							openedFiles: this.state.openedFiles
						})
		}



		console.log("#saved chapter!", this.state.openedFiles.all, this.state.chapters)
		
	}
	handleChange = async(text, key) => {
		//console.log("handle change!", text)

		const openIndex = _.findIndex(this.state.openedFiles.all, ['_id', key._id]);

		if(openIndex != -1){
			this.state.openedFiles.all[openIndex].chapter.content = text;

			if(!this.state.openedFiles.all[openIndex].chapter.chaged || this.state.openedFiles.all[openIndex].chapter.changed == false){
				this.state.openedFiles.all[openIndex].changed = true;
			}
		}


		this.setState({
			selectedTab: openIndex
		})

		let s = await(Remote.OpenFiles().save(key, text));
		return openIndex;
	 };

	 _handleTabChange = (index) => {

	 	this.setState({
	 		selectedTab: index || 0
	 	})

	 }

	 _handleKeyDownChapter = (e) => {
	 	//console.log("handle keydown!", this.state.searchTyping)
	    if (e.key === 'Enter') {
	     // let s = await(Remote.OpenFiles().save(key));
	     this.setState({ chapterTitlePopover: false })
	    }
	  }
	  onChangeTitle = async(e, key) => {
	  	//console.log("e targe title chap", e.target.value)
	  	//console.log("e targe title key", key)

	  	const openIndex = _.findIndex(this.state.openedFiles.all, ['_id', key._id]);
	  	if(e.target.value != '' && e.target.value != null && openIndex != -1){
	  		this.state.openedFiles.all[openIndex].chapter.title = e.target.value;
	  		if(!this.state.openedFiles.all[openIndex].changed){
	  			this.state.openedFiles.all[openIndex].changed = true; 
	  		}

	  		let s = await(Remote.OpenFiles().saveTitle(key, e.target.value));

		  	this.setState({
		  		openedFiles: this.state.openedFiles
		  	})
	  	}
	  	
	  	//this.state.searchTyping = e.target.value;
	  }
	_renderOpenedFile = (key, index) => {
		//{ ReactHtmlParser(key.chapter.content) }
		/*let editorState;
	    if (key.chapter.content) {
	      const rawState = convertToRaw(convertFromHTML(this.state.editorState));
	      editorState = createEditorState(rawState);
	    } else {
	      editorState = createEditorState();
	    }*/


	    	return (
				<div className={['tabWysiwyg']} key={key.chapter._id} changed={key.changed} id={key.chapter._id} title={key.chapter.title} closeChapter={() => this.closeFile(key)}>
					<div className={['toolsBar', 'noselect'].join(" ")}>
						<div className={'toolsTitleBook'}>
							{ key.changed == true &&
								<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.saveChapter(key)} style={{padding: '1px 6px 3px 10px', marginRight: 5}}>
													<Icon
														 name='md-save'
														 font='Ionicons'
														 style={{verticalAlign: 'bottom', margin: '3px 3px 0 0'}}
														 color='#fff'
														 size={13}
													/> 
													<span>Save</span>
										</button>
								}
							<nav className="breadcrumbs">
									  <ul>
									  	<Popover
										    isOpen={this.state.optionsFile}
										    position={'bottom'} // preferred position
										    transitionDuration={0}
										    onClickOutside={() => this.setState({ optionsFile: false })}
										    content={({ position, targetRect, popoverRect }) => (
										        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
										            position={'bottom'}
										            targetRect={targetRect}
										            popoverRect={popoverRect}
										            arrowColor={'#232323'}
										            arrowSize={10}
										            arrowStyle={{ opacity: 1 }}
										        >
										            <div
										                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 140, height: 30,  display: 'table-cell' }}

										            >
										            	<ul className={'popoverNewt'}>
											            	<li  onClick={() => this.setDeleted(key)}>
																<span>Delete</span>
															</li>
											            </ul>
										            </div>
										        </ArrowContainer> )}>
											

											<li onClick={() => this.setState({ optionsFile: !this.state.optionsFile })}><a href="#">
										  		<Icon
															 name='cog'
															 font='Entypo'
															 style={{verticalAlign: 'bottom', margin: '3px 3px 0 0'}}
															 color='#444'
															 size={13}
														/> 
											</a></li>
										</Popover>

									  	
									  	<li><a href="#">@{key.book.userId}</a></li>
									  	<li><a href="#">{key.book.title.slice(0,30)}</a></li>

									  	<Popover
										    isOpen={this.state.chapterTitlePopover}
										    position={'bottom'} // preferred position
										    transitionDuration={0}
										    onClickOutside={() => this.setState({ chapterTitlePopover: false })}
										    content={({ position, targetRect, popoverRect }) => (
										        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
										            position={'bottom'}
										            targetRect={targetRect}
										            popoverRect={popoverRect}
										            arrowColor={'#232323'}
										            arrowSize={10}
										            arrowStyle={{ opacity: 1 }}
										        >
										            <div
										                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 140, height: 30,  display: 'table-cell' }}

										            >
										            	<ul className={'popoverNewt'}>
											            	<li>
											            		
																<input type="text" defaultValue={key.chapter.title} autoFocus onChange={(e) => this.onChangeTitle(e, key)} placeholder="Search" className="input-chapter-title" onKeyDown={this._handleKeyDownChapter} required />
											            	</li>
											            </ul>
										            </div>
										        </ArrowContainer> )}>
											<li onClick={() => this.setState({ chapterTitlePopover: !this.state.chapterTitlePopover })}>
												<a className="current">{key.chapter.title}</a>
											</li>
										</Popover>


									  </ul>
									</nav>


						</div>
					</div>
					<Editor
			          tag="div"
			          className={["editableInput"+key._id, "tabWysiwyg"].join(" ")}
			          text={key.chapter.content || ''}
			          onChange={(text, medium) => this.handleChange(text, key)}
			          options={{ buttonLabels: 'fontawesome', toolbar: {  buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'quote', 'justifyLeft','justifyCenter', 'justifyRight', 'justifyFull'] }, sticky: true, static: true }}
			        />
					         
				</div>
			);

		
	}


	onDrop = (files) => {
		console.log("filesssssss", files)
      this.setState({files})
    }
    onImportWork = () => {

    }
	_renderSettingsBook = (keyBulk, index) => {
		//console.log("render settings book", keyBulk)
		return (
			<div className={'tabSettings'} key={keyBulk._id} changed={keyBulk.changed} id={keyBulk._id} type={keyBulk.type} title={keyBulk.books.length == 1 ? keyBulk.books[0].title : 'Bulk Settings'} closeChapter={() => this.closeFile(keyBulk)}>
				<div className={['toolsBar', 'noselect'].join(" ")}>
						<div className={'toolsTitleBook'}>
							{ keyBulk.changed == true &&
								<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.onSaveBulkChangesToBooks(keyBulk)} style={{padding: '1px 6px 3px 10px', marginRight: 5}}>
													<Icon
														 name='md-save'
														 font='Ionicons'
														 style={{verticalAlign: 'bottom', margin: '3px 3px 0 0'}}
														 color='#fff'
														 size={13}
													/> 
													<span>Save</span>
										</button>
								}
							{ keyBulk.books.length == 1 &&
								<nav className="breadcrumbs">
									  <ul>
									  	<li><a href="#">@{keyBulk.books[0].userId}</a></li>
									    <li><a className="current">{keyBulk.books[0].title}</a></li>
									  </ul>
									</nav>
								
							}
							{ keyBulk.books.length > 1 &&
								<nav className="breadcrumbs">
									  <ul>
									  	<li><a href="#">@{keyBulk.books[0].userId}</a></li>
									    <li><a className="current">{keyBulk.books.length} selected</a></li>
									  </ul>
									</nav>
							}

							{ keyBulk.changed == true &&
									<div className={'saveButtonsToolbar'}>

										
									</div>
						}
							
						</div>
					</div>
				<div style={{paddingTop: 15}}>
				{
					keyBulk.books.map((key, index) => {
						return (
								<BookRow key={key._id} keyBulked={keyBulk} bookRow={key} onChange={(bulk, book) => this.onChangeBulk(bulk, book)} onSaveBulkChanges={(bulk) => this.onSaveBulkChangesToBooks(bulk)}/>
							);
					})
				}
				</div>
			</div>
			)
	}

	openSettings = async(book) => {


		book.openSettings = null;

		let openedFiles = this.state.openedFiles;

		let newOpenedFile = await(Remote.OpenFiles().openSettings(book));


		if(newOpenedFile != null){
			let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', 'openSettings-'+book._id]);


			if(openIndex == -1){
				openedFiles.all.push(newOpenedFile);
				openIndex = _.findIndex(this.state.openedFiles.all, ['_id', 'openSettings-'+book._id]);

				this.setState({
		        	openedFiles: openedFiles,
		        	selectedTab: openIndex
		        })

		        return null;
			} else {
				this.setState({
		        	selectedTab: openIndex
		        })
		        return;
			}

			this.setState({
		        	selectedTab: 0
		        })

			return;	
			
		}
		
	}

	setDraftsCheckpoint = async(seq) => {
	    console.log("this state ccheckpoinnt", this.state.rootUser, seq)

	   	await this.setState((prevState) => update(prevState, { 
                  rootUser: {
                      draftsCheckpoint: {
                        $set: seq
                      }
                  }
                 }));

	    let u = await(Remote.Auth().saveLocalUser(this.state.rootUser)).catch(e => e);

	    

	    return;
	  }

	openBulk = async(bulk) => {


		bulk = bulk.map(b => {
			b.selected = null;
			b.openSettings = null;
			return b;
		})
		let openedFiles = this.state.openedFiles;

		let newOpenedBulk = await(Remote.OpenFiles().openBulk(bulk));


		if(newOpenedBulk != null){
			let openIndex = _.findIndex(this.state.openedFiles.all, ['_id', newOpenedBulk._id]);

			if(openIndex == -1){
				openedFiles.all.push(newOpenedBulk);
				openIndex = _.findIndex(this.state.openedFiles.all, ['_id', newOpenedBulk._id]);

				this.setState({
		        	openedFiles: openedFiles,
		        	selectedTab: openIndex,
		        	selectedBooks: null
		        })

		        return null;
			} else {
				this.setState({
		        	selectedTab: openIndex,
		        	selectedBooks: null
		        })
		        return;
			}

			this.setState({
		        	selectedTab: 0,
		        	selectedBooks: null
		        })

			return;	
			
		}
		
	}

	onSelectBook = (book) => {
		console.log("on select book!", this.state.selectedBooks)
		if(this.state.selectedBooks == null){
			this.state.selectedBooks = [];
		}

		let selectedIndex = _.findIndex(this.state.selectedBooks, ['_id', book._id]);

		let workIndex = _.findIndex(this.state.works.rows, ['_id', book._id]);

		if(selectedIndex == -1){
			this.state.selectedBooks.push(book);
			this.state.works.rows[workIndex].selected = true;
		} else {
			this.state.selectedBooks.splice(selectedIndex, 1);
			this.state.works.rows[workIndex].selected = false;
		}
		
		/*if(this.state.selectedBooks != null && this.state.selectedBooks.length > 0){

		}*/
		this.setState({
				works: this.state.works,
				selectedBooks: this.state.selectedBooks
			})
	}
	toggle = (toState = null) =>  {
	    this.setState({ openPop: toState === null ? !this.state.openPop : toState })
	  }


	  triggerSearch = (a) => {
	  	if(a == 'show'){
	  		this.setState({
	  			isSearching: true
	  		})
	  	} else if(a == 'hide'){
	  		this.setState({
	  			isSearching: false,
	  			searchTyping: '',
	  			searchTerm: ''
	  		})
	  	} else {
	  		this.setState({
	  			isSearching: !this.state.isSearching || false
	  		})
	  	}
	  	
	  }

	  onGoBack = () => {
	  	this.setState({currentSection:'works', chapters: null, statusPush: null, statusPull: null})

	  	if(this.replicatorChapters){
	  		this.replicatorChapters.cancel();
	  	}
	  }
	 _renderGoBackSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}} onClick={() => this.onGoBack()}>
	 		<div className={signedInStyles['sidebarButtonCircle']}>

				  			<Icon
							  name='ios-arrow-back'
							  font='Ionicons'
							  color='#111'
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
	 _renderCoreChaptersSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}}>
	 		<div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.triggerSearch('show')}>

				  			<Icon
							  name='cloud-search'
							  font='MaterialCommunityIcons'
							  color='#111'
							  size={20}
							  // style={{}}
							/>
							
				  		</div>
				  		
				  			
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
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 140, height: 30,  display: 'table-cell' }}
							                onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.$onCreateChapter()}>
								            		<Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>New chapter</span>
								            	</li>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							    <div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}>

							        <Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#111'
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
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 130, height: 30,  display: 'table-cell' }}
							                onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.onSignOut()}>
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
							    	style={{backgroundImage: 'url('+this.state.rootUser.avatar+')'}} 
							    	onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })} 
							    	className={signedInStyles['sidebarButtonCircleAvatar']}
							    	>
							    </div>

							</Popover>




				  		<div className={signedInStyles['sidebarUsername']}>
				  			@{this.state.rootUser.name}
				  				
				 

				  		</div>
				  		</div>
				  		);
	 }

	 _handleKeyDown = (e) => {
	 	//console.log("handle keydown!", this.state.searchTyping)
	    if (e.key === 'Enter') {
	      console.log('do validate');
	      this.setState({
	      	searchTerm: this.state.searchTyping
	      })
	    }
	  }
	  onTypeSearch = (e) => {
	  	//console.log("e targe search", e.target.value)
	  	this.state.searchTyping = e.target.value;
	  }
	 _renderCoreSearchSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}}>
	 					<div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.triggerSearch('hide')} style={{marginTop: 2, backgroundColor: 'transparent'}}>

				  			<Icon
							  name='closecircle'
							  font='AntDesign'
							  color='#111'
							  size={20}
							  // style={{}}
							/>
							
				  		</div>


				  				<div className="search">
  
								    <div className="field">

								      <input type="text" autoFocus onChange={(e) => this.onTypeSearch(e)} placeholder="Search" className="input-search" id="input-search" onKeyDown={this._handleKeyDown} name="input-search" required />
								      <label htmlFor="input-search"></label>

								    </div>
								  </div>
				 


				  		</div>
				  		);
	 }
	 _renderCoreSidebar = () => {
	 	return (
	 		<div style={{display: 'inline-flex'}}>
	 		<div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.triggerSearch('show')}>

				  			<Icon
							  name='cloud-search'
							  font='MaterialCommunityIcons'
							  color='#111'
							  size={20}
							  // style={{}}
							/>
							
				  		</div>
				  		
				  			
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
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 100, height: 30,  display: 'table-cell' }}
							                onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.$onCreateWork()}>
								            		<Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>New</span>
								            	</li>
								            <Dropzone className={'dimensionsEpubImportDrop'} onDrop={(files) => this.onDropEpubs(files)}>
								            	<li>
								            		<Icon
																			  name='book'
																			  font='MaterialCommunityIcons'
																			  color='#fff'
																			  size={18}
																			  // style={{}}
																			/><br/>
													<span>Drop epubs<br />or press to select</span>
													{this.state.isImporting == true && <div className={'dimensionsEpubImportDropLoading'}>Processing.<br />Wait a few seconds.</div>}

												</li>
											</Dropzone>
								            	
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							    <div className={signedInStyles['sidebarButtonCircle']} onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}>

							        <Icon
																			  name='plus'
																			  font='MaterialCommunityIcons'
																			  color='#111'
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
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 100, height: 30,  display: 'table-cell' }}
							                onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<li onClick={() => this.onSignOut()}>
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
							    	style={{backgroundImage: 'url('+this.state.rootUser.avatar+')'}} 
							    	onClick={() => this.setState({ isPopoverUserOpen: !this.state.isPopoverUserOpen })} 
							    	className={signedInStyles['sidebarButtonCircleAvatar']}
							    	>
							    </div>

							</Popover>




				  		<div className={signedInStyles['sidebarUsername']}>
				  			@{this.state.rootUser.name}
				  				
				 

				  		</div>
				  		</div>
				  		);
	 }

	 onDropEpubs = (files) => {
	 	console.log("files!", files)

	 	const reader = new FileReader();

	      reader.readAsDataURL(files[0]);
	      reader.onload = async(event) => {
	      	
	      	this.setState({
	      		isImporting: true
	      	})
	        let b64 = event.target.result.split(';base64,')[1];
	        let data = {
	            type: files[0].type,
	            name: files[0].name,
	            size: files[0].size,
	            data: b64,
	            source: {uri: files[0].path}
	          };

	          //console.log("reeader on load", data)
	        let f = await(Remote.Work().drafts().importEpub(JSON.stringify(data)));


	       // console.log("reeader of11111d", f)
          let ic = await(Remote.Work().drafts().importContents(f.objects))
          
         // console.log("f22222", ic)


          let bulkIt = await(Remote.Work().drafts().bulkIt(ic.chapters));

         console.log("bilkit!", bulkIt)
          //let w = this.state.works;
          //w.rows.unshift(ic.book);
          //console.log("test")
	   /* let nDocs = (this.state.works && this.state.works.rows != null) ? this.state.works.rows : [];
	    let wDocs = nDocs.concat(c);

	    console.log("this state works!", this.state.works)
	    this.state.works.rows = wDocs;

	    console.log("this state works! after", this.state.works)*/
	    this.setState({ search: '', isImporting: false, isPopoverOpen: false })

	      		




	      };

	 }
	 onEditNewBulk = (bulk) => {

	 }

	 onCancelSelect = () => {

	 	let d = this.state.selectedBooks.map(b => {
	 		let bI = _.findIndex(this.state.works.rows, ['_id', b._id]);
	 		this.state.works.rows[bI].selected = false;
	 		return b;
	 	})
	 	this.setState({selectedBooks: null, works: this.state.works})
	 }

	_renderSelectedBar = () => {
		return (
			<div style={{display: 'inline-flex'}}>
				<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.onCancelSelect()} style={{padding: '5px 10px 7px 10px', marginRight: 5}}>
													<span>Cancel</span>
										</button>

				<button className={['buttonShine', 'bookRowButton'].join(' ')} onClick={() => this.openBulk(this.state.selectedBooks)} style={{padding: '5px 10px 7px 10px', marginRight: 5}}>
													<Icon
														 name='select-all'
														 font='MaterialIcons'
														 style={{verticalAlign: 'bottom', marginTop: 2}}
														 color='#fff'
														 size={13}
													/> 
													<span>Edit {this.state.selectedBooks.length} selected</span>
										</button>
										
			</div>
			)
	}

	closeWork = (key) => {
		/*this.setState({
			currentWork: null,
			currentSection: 'works',
			chapters: null
		})*/
		this.onGoBack()
	}

	performPushDrafts = async() => {
		this.setState({
			stateSync: 'loadingPush'
		})


		this.pushDB('drafts')
	}
	performPullDrafts = async() => {
		this.setState({
			stateSync: 'loadingPull'
		})

		this.pullDB('drafts')
	}

	performPushChapters = async() => {
		this.setState({
			stateSync: 'loadingPush'
		})


		this.pushDB('chapters')
	}
	performPullChapters = async() => {
		this.setState({
			stateSync: 'loadingPull'
		})

		this.pullDB('chapters')
	}

	pullDB = async(db) => {

      let p = await Remote.Sync().pullPush('pull', db);

		console.log("pull!!!", p)
		this.setState({
			stateSync: null,
			statusPull: p
		})

    }
    pushDB = async(db) => {


      let push = await Remote.Sync().pullPush('push', db);

      //let pull = await Remote.Sync(). ush('pull', db);
      if(db == 'drafts'){
      	const toSync = this.state.works.rows.filter(r => {
			return r.toSync == true;
		})

	      let tS = toSync.map(r => {
	      	r.toSync = null;
	      	return r;
	      })

	      if(tS && tS.length > 0){
	      	let sA = await Remote.Sync().setAsSynced(tS);
	      }

	      console.log("pulsh!", tS)
      }
      


		this.setState({
			stateSync: null,
			statusPush: push
		})

    }

    pendingMax = 0;
	batch_size = 1000;    // must match your replication options

	getProgress = (pending) => {
	  var progress;
	  pendingMax = pendingMax < pending ? pending + batch_size : pendingMax;  // first time capture
	  if (pendingMax > 0) {
	    progress = 1 - pending/pendingMax;
	    if (pending === 0) {
	      pendingMax = 0;    // reset for live/next replication
	    }
	  } else {
	    progress = 1;  // 100%
	  }
	  return progress;
	}

	_renderSync = () =>  {
		if(this.state.works == null){
			return;
		}
		const toSync = this.state.works.rows.filter(r => {
			return r.toSync == true;
		})
		console.log("to sync!", toSync)
		return  (
			<div>
				<div className="nav-switch">
			      <input type="radio" name="sex" value="F" id="drafts_switch" className="nav-switch-input" checked={this.state.currentSync === 'drafts'}  />
			      <label onClick={() => this.setState({currentSync: 'drafts'})} htmlFor="drafts_switch" className="nav-switch-label">Drafts</label>
			      <input type="radio" name="sex" value="M" id="chapters_switch" className="nav-switch-input" checked={this.state.currentSync === 'chapters'}/>
			      <label onClick={() => this.setState({currentSync: 'chapters'})} htmlFor="chapters_switch" className="nav-switch-label">Chapters</label>
			    </div>
			    <p style={{textAlign: 'center', margin: 0}}>{this.state.statusPush == null && toSync && toSync.length > 0 && toSync.length+' changes to push'}</p>

			    {this.state.currentSync == 'drafts' &&
			    	<div className={'buttonsPullPush'}>
			    	 <button className={['buttonProgress', 'buttonPushPull', this.state.stateSync == 'loadingPull' && 'loading'].join(' ')} onClick={() => this.performPullDrafts()}>
						    	Pull
					</button>
				    <button className={['buttonProgress', 'buttonPushPull', this.state.stateSync == 'loadingPush' && 'loading'].join(' ')} onClick={() => this.performPushDrafts()}>
						    	Push
					</button>
					</div>
				}
				{this.state.currentSync == 'chapters' &&
					<div className={'buttonsPullPush'}>
			    	 <button className={['buttonProgress', 'buttonPushPull', this.state.stateSync == 'loadingPull' && 'loading'].join(' ')} onClick={() => this.performPullChapters()}>
						    	Pull
					</button>
				    <button className={['buttonProgress', 'buttonPushPull', this.state.stateSync == 'loadingPush' && 'loading'].join(' ')} onClick={() => this.performPushChapters()}>
						    	Push
					</button>
					</div>
				}


			    <div style={{margin: 10}}>
			    {this.state.stateSync == 'loadingPull' && <p style={{textAlign: 'center'}}>Syncing {this.state.currentSync}. <br/>Wait until complete.</p>}
			    {this.state.statusPush != null && <p>You're up to date.<br /> Documents written: {this.state.statusPush.docs_written}</p>}
			    {this.state.statusPull != null && <p>You're up to date.<br /> Documents read: {this.state.statusPull.docs_written}<br />{toSync && toSync.length > 0 && 'Beware that you had '+toSync.length+' changes that you did not push before pulling.'}</p>}
			    </div>
		    </div>
			)
	}
	render(){

	 if(this.state.rootUser != null){
	 	
	 	return (
	  	<div style={{backgroundColor: 'rgb(245, 251, 255)', width: '100%', height: '100%'}}>
	  		<div className={'topAppDraggable'}></div>
	  		<SplitterLayout
	  			vertical={false}
	  			secondaryMinSize={this.state.isSearching == true ? 200 : 75}
	  			primaryMinSize={400}
	  			primaryIndex={1}
	  			secondaryInitialSize={75}>

				  <div className={[signedInStyles['newtSidebar'], 'noselect'].join(" ")}>

				  	<div className={signedInStyles['sidebarTop']}>
				  		{(this.state.selectedBooks == null && (this.state.currentSection == 'works') &&  this.state.isSearching != true) && this._renderCoreSidebar()}
				  		{(this.state.selectedBooks == null && this.state.currentSection == 'chapters' && this.state.isSearching != true) && this._renderGoBackSidebar()}
				  		{(this.state.selectedBooks == null && this.state.isSearching == true) && this._renderCoreSearchSidebar()}
				  		{(this.state.selectedBooks != null) && this._renderSelectedBar()}
				  		{(this.state.selectedBooks == null && (this.state.currentSection == 'sync') &&  this.state.isSearching != true) && this._renderGoBackSidebar()}
				  	</div>

				  	<div className={signedInStyles['sidebarChapters']}>

				  		{
				  			(this.state.currentSection == 'works' || this.state.currentSection == 'chapters') && this.state.works == null && Array(0,1,2,3).map(res => {
				  				return (
				  					<div style={{padding: 10,height: 58}} key={Math.random()}>
				  						<ContentLoader 
															    speed={2}
															    width={400}
															    height={160}
															    viewBox="0 0 400 160"
															    backgroundColor="transparent"
															    foregroundColor="#ecebeb"
															  >
															    <rect x="65" y="6" rx="3" ry="3" width="217" height="10" /> 
															    <rect x="65" y="21" rx="3" ry="3" width="150" height="9" /> 
															    <rect x="2" y="1" rx="0" ry="0" width="51" height="56" /> 
															    <rect x="42" y="30" rx="0" ry="0" width="8" height="11" />
															  </ContentLoader></div>
															  )
				  			}) 
				  		}
				  		{
				  			(this.state.currentSection == 'works' || this.state.currentSection == 'chapters') && this.state.works != null && <SidebarWorks 
				  											onMoveChapters={(chapters) => this.$onChaptersMove(chapters)}
				  											onCreateChapter={() => this.$onCreateChapter()}
				  											onCreateWork={() => this.$onCreateWork()}
				  											onGoSync={() => this.setState({currentSection: 'sync'})}
				  											chapters={this.state.chapters} 
				  											currentWork={this.state.currentWork} 
				  											currentSection={this.state.currentSection} 
				  											openWork={(k) => this.openWork(k)} 
				  											closeWork={(k) => this.closeWork(k)} 
				  											openBookSettings={(book) => this.openSettings(book)} 
				  											onSelectBook={(book) => this.onSelectBook(book)} 
				  											openChapter={(chapter, book) => this.openChapter(chapter, book)} 
				  											works={this.state.works.rows.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))} 
				  											selectedWorks={this.state.selectedBooks} 
				  											rootUser={this.state.rootUser} 
				  											isSearching={this.state.isSearching}
				  											searchTerm={this.state.searchTerm}
				  											toggleSettingsChapters={(key) => this.toggleSettingsChapters(key)}
				  											onUpdatedOrInserted={this.onUpdatedOrInserted.bind(this)}
				  											onUpdatedOrInsertedChapter={this.onUpdatedOrInsertedChapter.bind(this)}
				  											onSyncChapters={(id) => this.onSyncChapters(id)}
				  										/>

				  		}
				  		{
				  			this.state.currentSection == 'sync' && this._renderSync()
				  		}
				  		{/*<BrowserRouter>
					      <Switch>
					          <Route path='/' exact component={pageA} />
					          <Route path={'/program'} component={pageB} />
					      </Switch>
					    </BrowserRouter>*/}
					    

					    
				  	</div>
				  </div>
				  <div className={signedInStyles['newtContainer']} style={{zIndex: 2}}>

				  {
				  	this.state.openedFiles != null && this.state.openedFiles.all && this.state.openedFiles.all.length > 0 && 
				  	<TabPanel ref={r => (this.tabPanel = r)} selectedTab={this.state.selectedTab} onTabChange={this._handleTabChange}>

				  		{
				  			this.state.openedFiles.all.map((key, index) => {

				  				if(key.type == 'wysiwyg'){
				  					return this._renderOpenedFile(key, index)
				  				} 
				  				else if(key.type == 'bulk') {
				  					return this._renderSettingsBook(key, index);
				  				} else {
				  					return (
				  						<div title="title">test</div>
				  						);
				  				}
				  				
				  			})
				  		}
				       

				      </TabPanel>
				  }
				  {this.state.works == null && this.state.openedFiles == null && <div className={'absoluteCenter'}><Loading /></div>}
				  {this.state.openedFiles == null || this.state.openedFiles.all && this.state.openedFiles.all.length == 0 && 
				  	<div className={'noOpensFiles'} style={{backgroundColor: '#151515'}}>
				  		
				  		<div className="parallax-container">
						  <img src={blue1} alt=" " />
						  <img src={purple1} alt=" " />
						  <img src={green1} alt=" " />
						  <img src={blue2} alt=" " />
						  <img src={purple2} alt=" " />
						  <img src={blue3} alt=" " />

						  <div className="parallax-section">
						  	<h1><div className="parallax-counter"><span>1</span></div>Get Started</h1>
						  	<p>Hi. Welcome to Newt.<br />
						  	A multi-platform system to keep your stories in sync.s
						  		</p>

						  	<img className={'imgnoOpenFiles'} style={{marginTop: 50}} src={firt} />
						  </div>

						  <div className="parallax-section">
						  	<h1>Stay Focused <div className="parallax-counter"><span>2</span></div></h1>
						  	<p>We're here to help you with your stories.<br />
						  	Here you can plan, write, archive, review,<br />
						  	search, versioning, storyboard,<br />
						  	publish...<br  /><br />
						  	If you need inspiration,<br />we're good about that too.</p>
						  	<img className={'imgnoOpenFiles'} src={immTh} />
						  </div>


						  <div className="parallax-section">
						  	<h1><div className="parallax-counter"><span>3</span></div> Continue the story<br /> in your phone</h1>
						  	<p>Newt works offline, <br/>keeping revisions of your work across time.<br />
						  		Those revisions are useful to keep <br />your work in sync with the cloud.<br /><br />
						  		And with your phone.<br />
						  		</p>
						  	<img className={'imgnoOpenFiles'} src={conts} />
						  </div>

						  <div className="parallax-section">
						  	<h1>A lot like<br /> the modern world<div className="parallax-counter"><span>4</span></div></h1>
						  	<p>
						  		It doesn't need to be this hard <br />to be able to edit multiple stories and chapters<br />
						  		at once. Newt offers a brand-new bulk edit.<br /><br/>
						  		
						  		Colorful stories <br/>can have lots of images, illustrations and videos.<br />
						  		Drag and drop 'em in!<br /><br />
						  		Editing in Newt looks just like the final page.

						  		</p>
						  	<img className={'imgnoOpenFiles'} src={modsv} />
						  </div>

						  <div className="parallax-section">
						  	<h1><div className="parallax-counter"><span>5</span></div> Want to<br /> Publish?</h1>
						  	<p>Your story has a place here!<br />
						  		Set your story as Published, and push it to the cloud.<br />
						  		Then wait to see what happens.

						  		<br/><br/>
						  		Your story it's private by default.<br />You can keep it that way.
						  		
						  		</p>
						  	<img className={'imgnoOpenFiles'} src={pubs} />
						  </div>

						  	<div className="parallax-section" style={{marginBottom: 100}}>
						  	<h1>Use tags to<br />scale up<div className="parallax-counter"><span>6</span></div></h1>
						  	<p>
						  		Whether it's science, math, fiction, novels, suspense, ...<br />
						  		Add it to the book. <br />
						  		If you publish your story,<br />those tags will help you scale<br />through Newt.
						  		</p>
						  	<img className={'imgnoOpenFiles'} src={svg8} />
						  </div>
						  <div className="parallax-section" style={{marginBottom: 100}}>
						  	<h1>Get<br />Inspired<div className="parallax-counter"><span>7</span></div></h1>
						  	<p>We understand that in order to write nice<br />first you have to think nice.<br /><br />
						  		We can fill a lot of libraries full of books<br />of things you don't know.

						  		<br/><br/>
						  		Actually, we did. And it's open for everyone.</p>
						  	<img className={'imgnoOpenFiles'} src={svg7} />
						  </div>

						 
						</div>
				  		{/*<div style={{width: '60%', textAlign: 'center', paddingTop: 70, height: 130}}>
				  			<h1>Immersive thinking</h1>
				  		<p>Create books and edit properties and parts in this place.<br />
				  			Push what you've had write to the cloud, pull it from your phone to keep writing.</p>
				  			</div>
				  		<img className={'imgnoOpenFiles'} src={svg1} />*/}
				  	</div>
				  	}
				  	
				  	
				  </div>

		      </SplitterLayout>

		</div>
	  	);
	 } else {
	 	return (
	  	<div style={{backgroundColor: '#ff7575', width: '100%', height: '100%'}}>
	  		Loading

		</div>
	  	);
	 }
	  
	}
}

class TabPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: props.selectedTab
    };



  }


  _handleClick = async(index) => {
    	await this.props.onTabChange(index);
  }

  _renderTabs() {
    let tabs = [];

    for (let i = 0; i < this.props.children.length; i++) {


    	let titled = this.props.children[i].props.title != null ? this.props.children[i].props.title : 'Untitled';

      tabs.push(
        <Tab
          key={`tab-${i}`}
          label={titled}
          index={i}
          key={this.props.children[i].props.id}
          closeFile={(file) => this.props.children[i].props.closeChapter(this.props.children[i].props.id)}
          isSelected={i === this.props.selectedTab}
          type={this.props.children[i].props.type}
          isUpdated={this.props.children[i].props.changed}
          selectedTab={this.props.selectedTab}
          onClick={(index) => this._handleClick(index)} />
      );
    }

    return tabs;
  }
  
  _renderTabContent() {
  	return this.props.children[this.props.selectedTab].props.children;
  }

  render() {
    if (this.props.selectedTab == null) {
      return false;
    }

    return (
      <div className="tab-panel">
        <div className={["tab-panel__header", "noselect"].join(" ")}>
        	<div className="tab-panel__header_overflow">
          		{this._renderTabs()}
          	</div>
        </div>
        <div className="tab-panel__content">
          { (this.props && this.props.children[this.props.selectedTab] && this.props.children[this.props.selectedTab].props) &&
          	this.props.children[this.props.selectedTab].props.children
          }
        </div>
      </div>
   );
  }
}

class Tab extends React.Component {
  constructor(props) {
    super(props);


  }

  _handleClick = () => {
    this.props.onClick(this.props.index);
  }

  render() {
    const tabClassName = this.props.isSelected ? 'tab tab--selected' : 'tab';

    return (
      <span className={tabClassName} onClick={() => this._handleClick()}>
        <span className="tab__label">
        {
        		this.props.type == 'bulk' && <Icon
							  name='settings'
							  font='Feather'
							  color='#777'
							  size={12}
							  style={{marginRight: 3, marginLeft: -12, marginTop: -1}}
							/>
        	}
        	{this.props.label.slice(0,15)}
        	
        	<span className={["tab__close", this.props.isUpdated == true && 'tab__updated'].join(' ')} onClick={() => this.props.closeFile(this.props.id)}>
        	<Icon
				name='ios-close-circle-outline'
				font='Ionicons'
				color={this.props.isUpdated == true ? '#fff' : '#111'}
				size={10}
				style={{marginLeft: 1}}
			/>
			</span>
        </span>
      </span>
    );
  }
}



