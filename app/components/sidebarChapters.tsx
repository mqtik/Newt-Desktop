import React, {Component} from 'react';
import Home from '../components/Home';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import sidebarChaptersStyle from '../styles/sidebarChapters.css';

import Icon, { Feather } from 'react-web-vector-icons';

const Remote = new API({ url: process.env.API_URL })

import Popover, { ArrowContainer } from 'react-tiny-popover'

import {sortableContainer,
		  sortableElement,
		  sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import ContentLoader from "react-content-loader" 

import svg1 from '../assets/illus/illustration_58.svg';

const SortableItem = sortableElement(({value, openChapter}) => {

	return (
		<li>
		  	<div key={value._id} 
		  		//style={value._deleted && {display: 'none'}} 
		  		className={sidebarChaptersStyle['sidebarWorkChapterList']}>
				<div className={sidebarChaptersStyle['titleChapter']} onClick={() => openChapter(value)}>
					{value.title} {value._deleted && ' (deleted)'}
				</div>
				<DragHandle /> 
			</div>
		  </li>
		)
  
});

const SortableContainer = sortableContainer(({children}) => {
  return <ul>{children}</ul>;
});

const DragHandle = sortableHandle(() => <span style={{padding: '12px 10px'}}><Icon
													  name='drag-handle'
													  font='MaterialIcons'
													  color='#fff'
													  size={18}
													  
													/></span>);

export default class SidebarChapters extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			rootUser: props.rootUser,
			currentWork: props.currentWork,
			isLoading: true,
			chapters: null
		}
	}
	componentDidMount(){

		  Remote.ApplicationChapters.changes({live: true, since: 'now', include_docs: true})
	                .on('change', (change) => {
	                //console.log("[PLACESLIST] ON CHANNGE!", change, this.state)
	                this.props.onUpdatedOrInsertedChapter(change.doc)
	              }).on('error', console.log.bind(console))

	}

	componentDidUpdate(){

	}

	toggleSettings = (key) => {
		let chapters = this.props.chapters;
		
		let chapterIndex = _.findIndex(chapters, ['_id', key._id]);

		if(!chapters[chapterIndex].openSettings || chapters[chapterIndex].openSettings == false){
			chapters[chapterIndex].openSettings = true;
		} else {
			chapters[chapterIndex].openSettings = false;
		}

		this.setState({
			chapters: chapters
		})
	}

	_renderSingleChapter = (key) => {
		//console.log("key!", key)
		return (
			<div key={key._id} className={sidebarChaptersStyle['sidebarWorkChapterList']}>
				<div className={sidebarChaptersStyle['titleChapter']} onClick={() => this.props.openChapter(key, this.state.currentWork)}>{key.title}</div>
				<Popover
							    isOpen={key.openSettings}
							    position={'left'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.props.toggleSettingsChapters(key)}
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
																			  color='#dadada'
																			  size={18}
																			  // style={{}}
																			/>
								            		<span>Delete</span>
								            	</li>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
								

							<div className={'sidebarWorkListRowActions'} style={{padding: '10px 5px'}} onClick={() => this.props.toggleSettingsChapters(key)}><Icon
							  name='dots-two-vertical'
							  font='Entypo'
							  color='#fff'
							  size={25}
							  // style={{}}
							/></div>
							</Popover>
			</div>
		)
	}
	_renderChapters = () => {
		return (<SortableContainer 
				onSortEnd={this.onSortEnd} 
				hideSortableGhost={false}
				useDragHandle={true}>
	        {
	        	this.props.chapters.map((value, index) => {

	        		return (
	        			<SortableItem 
	        				key={value._id} 
	        				index={index} 
	        				disabled={false}
	        				value={value} 
	        				toggleSettingsChapters={(value) => this.props.toggleSettingsChapters(value)} 
	        				openChapter={(value) => this.props.openChapter(value, this.state.currentWork)}/>
	        		)

		        })
	    	}
	      </SortableContainer>
	      );
		
	}

	onSortEnd = ({oldIndex, newIndex}) => {
		let nc = arrayMove(this.props.chapters, oldIndex, newIndex);



		nc = nc.map((k,i) => {
			k.position = i;
			return k;
		})
		__DEV__ && console.log("nc!", nc)
		this.props.onMoveChapters(nc);

		return;
	  };
	
	render(){
	 if(this.props.chapters != null){
	 	return (
	  	<div className={'chaptersSection'}>
	  		{
	  			this.props.chapters && this.props.chapters.length == 0 &&
	  			<div style={{textAlign:'center'}}>
	  				<h3>This book has no chapters.</h3>
				    <p>You can create chapters in the left panel</p>

				    <object type="image/svg+xml" data={svg1} style={{marginTop:50,height: 200}}>
			                    Your browser does not support SVG
			                  </object>
				</div>
	  		}
	  		{
	  			this._renderChapters()
	  		}
		</div>
	  	);
	 } else {
	 	return (
	  	<div style={{width: '100%', height: '100%'}}>
	  		<div style={{padding: 0,height: 58}} key={Math.random()}>
				  						<ContentLoader 
															    speed={2}
															    width={490}
															    height={160}
															    viewBox="0 0 535 160"
															    backgroundColor="#333"
															    foregroundColor="#444"
															  >
															     <rect x="6" y="3" rx="10" ry="10" width="535" height="46" /> 
																    <rect x="6" y="54" rx="10" ry="10" width="535" height="46" /> 
																    <rect x="6" y="105" rx="10" ry="10" width="535" height="46" />
															  </ContentLoader></div>

		</div>
	  	);
	 }
	  
	}
}
