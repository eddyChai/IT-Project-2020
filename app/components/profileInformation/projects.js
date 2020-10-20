var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Project = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false, projects: [], id: this.props.pageID};
	},

	componentWillMount: function(){
        this.classRef = firebase.database().ref().child('user-project/'+this.props.pageID);
        this.classRef.on("child_added", snap => {
        	var project = snap.val();
			if(project){
				project.key = snap.ref.key;
				this.state.projects.push(project);
				this.setState({projects: this.state.projects});
			}
        });

        this.classRefChanged = firebase.database().ref().child('user-project/'+this.props.pageID);
        this.classRefChanged.on("child_changed", snap => {
        	var project = snap.val();
			if(project){
				project.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.projects.length; i++){
					if(this.state.projects[i].key == project.key){
						index = i;
					}
				}

				this.state.projects.splice(index, 1, project);
				this.setState({projects: this.state.projects});
			}
        });

        this.classRefRemoved = firebase.database().ref().child('user-project/'+this.props.pageID);
        this.classRefRemoved.on("child_removed", snap => {
        	var project = snap.val();
			if(project){
				project.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.projects.length; i++){
					if(this.state.projects[i].key == project.key){
						index = i;
					}
				}

				this.state.projects.splice(index, 1);
				this.setState({projects: this.state.projects});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		if(nextProps.pageID != this.state.id){
			this.classRef.off(); //turn off the classRef in compWillMount-listen only from one.
			this.classRefChanged.off();
			this.classRefRemoved.off();
			this.setState({projects: []});

			this.classRef = firebase.database().ref().child('user-project/'+ nextProps.pageID);
	        this.classRef.on("child_added", snap => {
	        	var project = snap.val();
				if(project){
					project.key = snap.ref.key;
					this.state.projects.push(project);
					this.setState({projects: this.state.projects});
				}
	        });

	        this.classRefChanged = firebase.database().ref().child('user-project/' + nextProps.pageID);
	        this.classRefChanged.on("child_changed", snap => {
	        	var project = snap.val();
				if(project){
					project.key = snap.ref.key;
					var index;
					for(var i = 0; i < this.state.projects.length; i++){
						if(this.state.projects[i].key == project.key){
							index = i;
						}
					}

					this.state.projects.splice(index, 1, project);
					this.setState({projects: this.state.projects});
				}
	        });

	        this.classRefRemoved = firebase.database().ref().child('user-project/' + nextProps.pageID);
	        this.classRefRemoved.on("child_removed", snap => {
	        	var project = snap.val();
				if(project){
					project.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.projects.length; i++){
						if(this.state.projects[i].key == project.key){
							index = i;
						}
					}

					this.state.projects.splice(index, 1);
					this.setState({projects: this.state.projects});
				}
	        });
	    }
	},

	handleClickAdd: function(){
		this.setState({adding: true});
	},

	handleClickEdit: function(index){
		this.setState({editing: true});
		this.setState({indexToEdit: index});
	},

	handleClickSave: function(){
		var url;
		var pattern = /^https?:\/\//i;

		if(pattern.test(this.refs.url.value)){
			url = this.refs.url.value;
		}else{
			url = "http://" + this.refs.url.value;
		}

		var projectData = {
			name: this.refs.name.value,
			url: url,
			startDate: this.refs.startDate.value,
			endDate: this.refs.endDate.value,
			description: this.refs.description.value
		}

		if(this.state.editing){
			var projectUpdate = {};
			projectUpdate['/user-project/' + this.props.pageID + '/' + this.state.projects[this.state.indexToEdit].key] = projectData;
			firebase.database().ref().update(projectUpdate);
		}else{
			var newProjectKey = firebase.database().ref().child('project').push().key;
			firebase.database().ref('/user-project/' + this.props.pageID + '/' + newProjectKey).set(projectData);
		}

		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var classRef = firebase.database().ref('user-project/' + this.props.pageID + '/' + this.state.projects[this.state.indexToEdit].key);
		classRef.remove();

		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

	projectHeading: function(){
		if(this.props.isCurrentUser){
			return <h4 className="profile-heading">Projects <button className="btn btn-default" onClick={this.handleClickAdd}>+</button></h4>
		}else{
			return <h4 className="profile-heading">Projects</h4>
		}
	},

	addComponent: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="name" className="form-control" placeholder="Project Name"/><br />
					<input type="text" ref="url" className="form-control" placeholder="Project URL"/><br />
					<div className="input-group">
						<input type="month" ref="startDate" className="form-control"/>
						<span className="input-group-addon">-</span>
						<input type="month" ref="endDate" className="form-control"/>
					</div><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" placeholder="Description" /><br/>
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	},

	editComponent: function(){
		var indexedProject = this.state.projects[this.state.indexToEdit];

		return(
			<div className="card-profile">
				<div className="card-body d-flex flex-row">
					<div className="col-md-12">
						<div className="col-md-8">
							<input type="text" ref="name" className="form-control" defaultValue={indexedProject.name} /><br />
							<input type="text" ref="url" className="form-control" defaultValue={indexedProject.url}/><br />
							<div className="input-group">
								<input type="month" ref="startDate" className="form-control" defaultValue={indexedProject.startDate}/>
								<span className="input-group-addon">-</span>
								<input type="month" ref="endDate" className="form-control" defaultValue={indexedProject.endDate}/>
							</div><br/>
							<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" defaultValue={indexedProject.description}/><br/>

							<center>
								<div className="btn btn-toolbar">
									<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
									<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
									<button className="btn btn-link" onClick={this.handleRemoveExisting}>Remove this project</button>
								</div>
							</center><br/>
						</div>
					</div>
				</div>
			</div>
		)
	},

	defaultComponent: function(){
		if(this.props.isCurrentUser){
			return(
				<div>
					{this.state.projects.map((project,index) => (
			        	<div key={index}>
			       			<h4><strong>{project.name}</strong> <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}>Edit</button></h4>
			       			<h5><a href={project.url}>{project.url}</a></h5>
			       			<h6>{project.startDate} - {project.endDate}</h6>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px"}}>{project.description}</pre></h6>
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.projects.map((project,index) => (
			        	<div key={index}>
			       			<h4><strong>{project.name}</strong></h4>
			       			<h5><a href={project.url}>{project.url}</a></h5>
			       			<h6>{project.startDate} - {project.endDate}</h6>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px"}}>{project.description}</pre></h6>
			       		</div>
			   		))}
				</div>
			)
		}
	},

	render: function(){
		var show;

		if(this.state.adding){
			show = this.addComponent();
		}else if(this.state.editing){
			show = this.editComponent();
		}else{
			show = this.defaultComponent();
		}

		return (
			<div className="card-profile">
				<div className="card-body d-flex flex-row">
					{this.projectHeading()}
					{show}
					<hr></hr>
				</div>
			</div>
		)
	},

	componentWillUnmount: function(){
		this.classRef.off();
		this.classRefChanged.off();
		this.classRefRemoved.off();
	},
});

module.exports = Project;
