import React, {Component} from 'react';
import Home from '../components/Home';

import API from '../services/api.tsx';

import globalStyles from '../styles/globals.css';
import sidebarChaptersStyle from '../styles/sidebarChapters.css';

import Icon, { Feather } from 'react-web-vector-icons';

const Remote = new API({ url: process.env.API_URL })

import Dropzone from 'react-dropzone';

import Popover, { ArrowContainer } from 'react-tiny-popover'

import ReactTooltip from 'react-tooltip'

import ToggleDisplay from 'react-toggle-display';

import ContextMenuArea from "./contextMenuArea";

import _ from 'lodash'

export default class BookRow extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
			isLoading: true,
			chapters: null,
			book: props.bookRow
		}
	}
	componentDidMount(){

	}

	onChange = (newValue) => {
        console.log(newValue);
    }

	onDrop = (files) => {
		console.log("filesssssss", files)

		const reader = new FileReader();

	      reader.readAsDataURL(files[0]);
	      reader.onload = async(event) => {
	      	
	        let b64 = event.target.result.split(';base64,')[1];
	        let data = {
	            type: files[0].type,
	            name: files[0].name,
	            size: files[0].size,
	            data: b64,
	            source: {uri: files[0].path}
	          };

	          console.log("reeader on load", data)
	        let f = await(Remote.Work().drafts().coverUp(data));

		    this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            cover: process.env.API_STATIC+'/covers/'+f.objects.filename,
			            colors: f.objects.colors || this.state.book.colors || ['#fff', '#fff', '#fff'],
			            changed: true
			        },
			    }))

		    this.onSave()
	      };
     // this.setState({files})
    }

	_renderAdd = (key) => {
		const itemsAdd = [
					    {
					      label: "Description",
					      click: () => this.addField('description')
					    },
					    {
					      label: "Author",
					      click: () => this.addField('author')
					    },
					    {
					      label: "Tags",
					      click: () => this.addField('tags')
					    },
					    {
					      label: "Picked",
					      click: () => this.setPicked(key)
					    }
					  ];

		return (
			<ContextMenuArea menuItems={itemsAdd}>
			  	<button className={['badge'].join(' ')} style={{height:'29px',border: 0}}>
					<span>Add</span>
				</button>
		    </ContextMenuArea>
		);
	}

	_renderStatus = (key) => {

		const itemsSettings = [
						{
					      label: "Private",
					      click: () => this.changeStatus('private', key)
					    },
					    {
					      label: "Public",
					      click: () => this.changeStatus('public', key)
					    },
					    {
					      label: "Delete",
					      click: () => this.setDeleted(key)
					    }
					  ];
	 	
	  		

		return (
			<ContextMenuArea menuItems={itemsSettings}>
			  	<div className={['badge', key.status == 'public' && 'badgePublic'].join(" ")}>
													<span>
														{(!key._deleted && key.status) && key.status}
														{(!key.status && !key._deleted) && 'Private'}
														{key._deleted && 'Deleted'}
													</span>
												</div>
		    </ContextMenuArea>
		);
	}

	_renderLanguage = (key) => {
		const itemsLanguages = [
						{
					      label: "Español",
					      click: () => this.changeLanguage('es', key)
					    },
					    {
					      label: "English",
					      click: () => this.changeLanguage('en', key)
					    }
					  ];
	 	
	  		

		return (
			<ContextMenuArea menuItems={itemsLanguages}>
			  	<div className={['badge', 'badgeSubBar'].join(" ")}>
												<span>
													{key.language}
													{!key.language && 'Unset'}
												</span>
											</div>
		    </ContextMenuArea>
		);
	}

	_renderTitleEdit = () => {
		return (
			<Popover
							    isOpen={this.state.isTitleOpen}
							    position={'top'} // preferred position
							    transitionDuration={0}
							    onClickOutside={() => this.setState({ isTitleOpen: false })}
							    content={({ position, targetRect, popoverRect }) => (
							        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
							            position={'top'}
							            targetRect={targetRect}
							            popoverRect={popoverRect}
							            arrowColor={'#232323'}
							            arrowSize={10}
							            arrowStyle={{ opacity: 1 }}
							        >
							            <div
							                style={{ backgroundColor: '#232323', border: '1px solid #242424', boxShadow: '0px 0px 20px -9px rgba(0,0,0,0.75)', borderRadius:4, padding: 0, opacity: 1, width: 100, height: 30,  display: 'table-cell' }}
							                onClick={() => this.setState({ isTitleOpen: !this.state.isTitleOpen })}
							            >
							            	<ul className={'popoverNewt'}>
								            	<textarea></textarea>
								            </ul>
							            </div>
							        </ArrowContainer>    )}
							>
						
							    <button className={'buttonShine'} onClick={() => this.setState({ isTitleOpen: !this.state.isTitleOpen })}>
											<Icon
												 name='pencil'
												 font='MaterialCommunityIcons'
												 color='#fff'
												 size={18}
											/> Title
								</button>
							</Popover>
							);
	}

	setPicked =async (key) => {
		let pick = false;
		if(!key.picked){
			pick = false;
		}
		if(key.picked && key.picked == true){
			pick = false;
		} else {
			pick = true;
		}

		await this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            picked: pick == true ? true : false,
			            changed: true
			        },
			    }))



		this.onSave();
	}
	addField = (field) => {
		console.log('adding fields!', field)
		if(field == 'description'){

			if(this.state.book.showDescriptionField == false || !this.state.book.showDescriptionField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            description: '',
			            showDescriptionField: true,
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showDescriptionField: false,
			        },
			    }))
			}
		}
		if(field == 'author'){

			if(this.state.book.showAuthorField == false || !this.state.book.showAuthorField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showAuthorField: true,
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showAuthorField: false,
			        },
			    }))
			}
		}
		if(field == 'tags'){

			if(this.state.book.showTagsField == false || !this.state.book.showTagsField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            tags: this.state.book.tags || [],
			            showTagsField: true,
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showTagsField: false,
			        },
			    }))
			}
		}

	}

	changeStatus = async(status, key) => {
		if(status == 'private'){
			await this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            status: 'private',
			            changed: true
			        },
			    }))
			this.onSave();
		}
		if(status == 'public'){
			await this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            status: 'public',
			            changed: true
			        },
			    }))
			this.onSave();
		}
	}

	setDeleted = async(book) => {
		if(book){
			await(this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            _deleted: true,
			            status: 'private',
			            changed: true
			        },
			    })))
			if(!this.state.book._deleted){
				this.state.book._deleted = true;
			}
			console.log("set deleted!", this.state.book)
			this.onSave();
		}
	}

	changeLanguage = async(language, key) => {
		if(language == 'es'){
			await this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            language: 'Español',
			            changed: true
			        },
			    }))
			this.onSave();
		}
		if(language == 'en'){
			await this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            language: 'English',
			            changed: true
			        },
			    }))
			this.onSave();
		}
	}
	showField = (key, field) => {
		if(field == 'author'){

			if(this.state.book.showAuthorField == false || !this.state.book.showAuthorField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showAuthorField: true,
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showAuthorField: false,
			        },
			    }))
			}
		}



		if(field == 'title'){

			if(this.state.book.showTitleField == false || !this.state.book.showTitleField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showTitleField: true,
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showTitleField: false,
			        },
			    }))
			}
		}

		if(field == 'description'){

			if(this.state.book.showDescriptionField == false || !this.state.book.showDescriptionField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showDescriptionField: true,
			            changed: true
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showDescriptionField: false,
			            changed: true
			        },
			    }))
			}
		}

		if(field == 'tags'){

			if(this.state.book.showTagsField == false || !this.state.book.showTagsField){
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            tags: this.state.book.tags || [],
			            showTagsField: true
			        },
			    }))
			} else {
				this.setState(prevState => ({
			        book: {
			            ...prevState.book,
			            showTagsField: false
			        },
			    }))
			}
		}
	}
	selectedTags =  (tags) => {


		if(typeof tags !== 'undefined'){
			if(typeof this.state.book.tags === 'string'){

				this.state.book.tags = [];
			}


			this.state.book.tags.push(tags);
			this.state.book.changed = true;
			//this.state.book.tags = tags;

			this.setState({
				book: this.state.book
			})


			this.onSave();
		}

      }

    onChangeField = async(field, text) => {

    	if(text){
    		/*if(field == 'title'){
					this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            title: text.target.value
				        },
				    }))
	    	}

	    	if(field == 'description'){
					this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            description: text.target.value
				        },
				    }))
	    	}

	    	if(field == 'author'){
					this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            author: text.target.value
				        },
				    }))
	    	}
*/
		if(field == 'description'){
					await this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            description: text,
				            changed: true
				        },
				    }))
	    }

	    if(field == 'author'){
					await this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            author: text,
				            changed: true
				        },
				    }))
	    }
	    if(field == 'title'){
					await this.setState(prevState => ({
				        book: {
				            ...prevState.book,
				            title: text,
				            changed: true
				        },
				    }))
	    }
	    

	    this.onSave();
    	}

    	
    }
    onSave = async() => {


    	let openIndex = _.findIndex(this.props.keyBulked.books, ['_id', this.state.book._id]);

    	this.props.keyBulked.books[openIndex] = this.state.book;


    	//console.log("props of", this.props.keyBulked)
    	//console.log("on save!!", this.state.book, this.props.keyBulked.books[openIndex])

    	let saveBook = await(Remote.OpenFiles().saveBulk(this.props.keyBulked));

    	this.props.keyBulked.changed = true;
    	this.props.onChange(this.props.keyBulked, this.state.book);
    	

    }


	render(){
		
		const key = this.state.book;
		const colorsBook = this.state.book.colors || ['rgba(0, 0, 0, 0.3)', '0 0 3px rgba(0, 0, 0, 0.1)'];

	 	return (
		  	<div key={this.state.book._id} className={["bookTabSettigs", "gradient-border", "noselect"].join(" ")}
									style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 0px 2px inset'}}>
									<ReactTooltip />
									<div className={'flexBookSettings'}>
										<div className={'flexBookSettingsInfo'}>
											<h1 onClick={() => this.showField(this.state.book, 'title')}>
												<b data-tip="Click to edit" data-place={'bottom'} 	data-effect={'solid'}>{this.state.book.title}</b>
 

											</h1>
										<div className={'flexBookSettingsSubBar'}>
											{this._renderStatus(this.state.book)}


											{this._renderLanguage(this.state.book)}

											<ToggleDisplay if={typeof this.state.book.author == 'string'}>
												<div className={['badge', 'badgeSubBar'].join(" ")} style={{ padding: '2px 10px 8px',height: '19px', display: 'inherit'}} onClick={() => this.showField(this.state.book, 'author')}>
													<span>
														{this.state.book.author}
													</span>
												</div>
											</ToggleDisplay>

											<ToggleDisplay if={typeof this.state.book.tags == 'object'}>
											<div className={['badge', 'badgeSubBar'].join(" ")} style={{ padding: '2px 10px 8px',height: '19px', display: 'inherit'}} onClick={() => this.showField(this.state.book, 'tags')}>
												<span>
													{typeof this.state.book.tags == 'object' && this.state.book.tags.length} tags
												</span>
											</div>
											</ToggleDisplay>

											<ToggleDisplay if={typeof this.state.book.picked !== 'undefined' && this.state.book.picked != false} onClick={() => this.setPicked(this.state.book)}>
									            	<div className={['badge', 'badgeSubBar'].join(" ")} style={{ padding: '2px 10px 8px',height: '19px', display: 'inherit'}}>
														<span>
															Picked
														</span>
													</div>
									            </ToggleDisplay>

											<ToggleDisplay if={typeof this.state.book.description === 'string' && this.state.book.description != ''} onClick={() => this.showField(this.state.book, 'description')}>
									            	<div className={['badge', 'badgeSubBar'].join(" ")} style={{ padding: '2px 10px 8px',height: '19px', display: 'inherit'}}>
														<span>
															Description
														</span>
													</div>
									            </ToggleDisplay>

											<div style={{marginLeft: 5}}>
												{(!this.state.book.description || !this.state.book.tags || !this.state.book.title || !this.state.book.author || !this.state.book.picked) && this._renderAdd(this.state.book)}
											</div>
										</div>
										
										</div>
										<div className={'flexBookSettingsCover'}>
											<Dropzone className={'dimensionsCoverSettingsDrop'} onDrop={(files) => this.onDrop(files)}>
												<img src={this.state.book.cover} className={'dimensionsCoverSettings'}/>
											</Dropzone>
										</div>
									</div>
									
								    <div className={'flexBookSettingsContent'}>
											

											<ToggleDisplay show={this.state.book.showTitleField == true || this.state.book.showTitleField == null}>
											  <div className={"webflow-style-input"}>
											    <input className="" type="email" placeholder="Title" onChange={(text) => this.onChangeField('title', text.target.value)} defaultValue={this.state.book.title}></input>
											   
											  </div>
											 </ToggleDisplay>
											  <ToggleDisplay show={this.state.book.showAuthorField == true}>
											  		<div className={"webflow-style-input"}>
													    <input className="" type="email" placeholder="Authors" onChange={(text) => this.onChangeField('author', text.target.value)} defaultValue={this.state.book.author}></input>
													   
													  </div>
										        </ToggleDisplay>
											  
										      <ToggleDisplay show={this.state.book.showDescriptionField == true}>
											  <div className={"webflow-style-input"}>
											    <textarea className="" type="email" placeholder="Description" onChange={(text) => this.onChangeField('description', text.target.value)} defaultValue={this.state.book.description}></textarea>
											   
											  </div>
											  </ToggleDisplay>
											  <ToggleDisplay show={this.state.book.showTagsField == true}>
												  <div className={"webflow-style-input-tags"}>
												  	<TagsInput
							                             value={this.state.book.tags}
							                            onChange={(tags) => this.selectedTags(tags)}
							                            />
												  </div>
											  </ToggleDisplay>


										</div>

									
									

								</div>
	  	);
	
	  
	}
}

	
const Tag = props => <span className="tag" {...props} />
const Delete = props => <span {...props}><Icon name='close' font='MaterialCommunityIcons' color='rgb(130, 130, 130)' size={15} style={{marginLeft: 5, marginTop: 2}}/></span>
const Help = props => <span className="help" {...props} />

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {
      newTag: ''
    }
    
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleRemoveTag = this.handleRemoveTag.bind(this)
  }
  
  handleChange (e) {
    this.setState({ newTag: e.target.value })
  }
  
  handleKeyDown (e) {
    if (e.keyCode === 13 && e.target.value !== '')  {
      let newTag = this.state.newTag.trim()

 
      if (this.props.value.indexOf(newTag) === -1) {

        this.setState({ newTag: '' })
        this.props.onChange(newTag);
      }
      e.target.value = ''
    }
  }
  
  handleRemoveTag (e) {
    let tag = e.target.parentNode.textContent.trim()
    let index = this.props.value.indexOf(tag)
    this.props.value.splice(index, 1)
    this.setState({ newTag: '' })
  }
  
  render () {
    return (
      <div>
        <div className="tags-input">
          { typeof this.props.value == 'object' && this.props.value.map((tag, index) => (
            <Tag key={index}>
              {tag}
              <Delete onClick={this.handleRemoveTag} />
            </Tag>
          ))}
          <input type="text" 
            onChange={this.handleChange}
            placeholder={'Add tags'}
            onKeyDown={this.handleKeyDown} />
        </div>
      </div>
    )
  }
}
