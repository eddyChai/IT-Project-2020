const React = require('react');
const firebase = require('firebase');
const hashHistory = require('react-router').hashHistory;
const mailto = require('react-mailto');

/* this component is for social media section in the portfolio */
class socialMedia extends React.Component{
    constructor(props) {
        super();
        
        this.state = {
            description : "",
            instagram : "",
            linkedin : "",
            facebook : "",
            mail : "",
            alert : "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    getInitialState(){
      return{isCurrentUser: false, id: this.props.pageID};
    }
  
    componentWillMount(){
      
      firebase
      .database()
      .ref('user-social/' + this.props.pageID)
      .child('instagram')
      .once('value')
      .then(snapshot => {
        this.setState({
            instagram: snapshot.val()
        });
      });
    
      firebase
      .database()
      .ref('user-social/' + this.props.pageID)
      .child('linkedin')
      .once('value')
      .then(snapshot => {
        this.setState({
            linkedin: snapshot.val()
        });
      });


      firebase
      .database()
      .ref('user-social/' + this.props.pageID)
      .child('facebook')
      .once('value')
      .then(snapshot => {
        this.setState({
            facebook: snapshot.val()
        });
      });

      firebase
      .database()
      .ref('user-social/' + this.props.pageID)
      .child('mail')
      .once('value')
      .then(snapshot => {
        this.setState({
            mail: snapshot.val()
        });
      });

      firebase
      .database()
      .ref('user-social/' + this.props.pageID)
      .child('description')
      .once('value')
      .then(snapshot => {
        this.setState({
            description: snapshot.val()
        });
      });
      

  }

  componentWillReceiveProps(nextProps){

    firebase
    .database()
    .ref('user-social/' + this.props.pageID)
    .child('instagram')
    .once('value')
    .then(snapshot => {
      this.setState({
          instagram: snapshot.val()
      });
    });
  
    firebase
    .database()
    .ref('user-social/' + this.props.pageID)
    .child('linkedin')
    .once('value')
    .then(snapshot => {
      this.setState({
          linkedin: snapshot.val()
      });
    });


    firebase
    .database()
    .ref('user-social/' + this.props.pageID)
    .child('facebook')
    .once('value')
    .then(snapshot => {
      this.setState({
          facebook: snapshot.val()
      });
    });

    firebase
    .database()
    .ref('user-social/' + this.props.pageID)
    .child('mail')
    .once('value')
    .then(snapshot => {
      this.setState({
          mail: snapshot.val()
      });
    });

    firebase
    .database()
    .ref('user-social/' + this.props.pageID)
    .child('description')
    .once('value')
    .then(snapshot => {
      this.setState({
          description: snapshot.val()
      });
    });

  }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
        [name]: value
        }); 
    }
  
  
    handleSubmit(event) {
        var user = firebase.auth().currentUser;
  
        let socialRef = firebase.database().ref('user-social');
        firebase.database().ref('user-social/' + this.props.pageID).set({
            instagram: this.state.instagram,
            linkedin: this.state.linkedin,
            facebook: this.state.facebook,
            mail: this.state.mail,
            description: this.state.description
        })
        this.setState({instagram: this.state.instagram});
        this.setState({linkedin: this.state.linkedin});
        this.setState({facebook: this.state.facebook});
        this.setState({mail: this.state.mail});
        this.setState({description: this.state.description});
        this.setState({alert : "Change has been successfully saved"})

        event.preventDefault();
    };
  

    render() {

      //render the place to edit and save changes to social media 
      if(this.props.isCurrentUser){
      return ( 
        <div className="card-profile">
        <form onSubmit={this.handleSubmit} className="form">
          <h4>Contact</h4>

        <div>
        
          <textarea
            className = "form-control"
            rows = "3"
            name="description"
            placeholder = "Message : please do not hesitate to contact me if there are questions..."
            value={this.state.description == null ? "" : this.state.description}
            onChange={this.handleChange}
          />
        </div>
        
        <div className = "form-control">
          <h4>Instagram</h4>
          <input
            name="instagram"
            placeholder = "https://instagram.com"
            value={this.state.instagram == null ? "" : this.state.instagram}
            onChange={this.handleChange}
          />
           <br/>
        </div>
        <br/>
        <br/>
        <br/>

        <div className="form-control">
        <h4> LinkedIn </h4>
          <input
            name="linkedin"
            placeholder = "https://linkedin.com"
            value={this.state.linkedin == null ? "" : this.state.linkedin}
            onChange={this.handleChange}
          />
        </div>
        <br/>
        <br/>
        <br/>
        
        <div className="form-control">
        <h4> Facebook </h4>
          <input
            name="facebook"
            placeholder = "https://facebook.com"
            value={this.state.facebook == null ? "" : this.state.facebook}
            onChange={this.handleChange}
          />
        </div>
        <br/>
        <br/>
        <br/>
        
        <div className="form-control">
            <h4>Mail</h4> 
          <input
            name="mail"
            placeholder = "test123@gmail.com"
            value={this.state.mail == null ? "" : this.state.mail}
            onChange={this.handleChange}
          />
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        
        
        <button className="btn btn-default">Save</button>
        
      </form>

        <div className="errorMessage">
            {this.state.alert}
        </div>
        <div>
            <a href={this.state.instagram} target="_blank" className="icons"> 
            {this.state.instagram ? <img src="igIcon.png" alt="logo" height="30px"/> : ""}
            </a>

            <a href={this.state.linkedin} target="_blank" className="icons"> 
            {this.state.linkedin ? <img src="LiIcon.png" alt="logo" height="30px"/> : ""}
            </a>
            
            <a href={this.state.facebook} target="_blank" className="icons">
            {this.state.facebook ? <img src="fbIcon.png" alt="logo" height="30px"/> : ""}
            </a>

            <a href={"mailto:" + this.state.mail} className="icons">
            {this.state.mail ? <img src="mailIcon.png" alt="logo" height="30px"/> : ""}
            </a>
            
        </div>

      </div>
      )
      }

      //only return the icons 
      else{
        return(
          <div>
            <h4>Contact</h4>
            <br></br>
            <div> {this.state.description}</div>
            {this.state.description ? <br></br> : <div></div>}

          <a href={this.state.instagram} target="_blank" className="icons"> 
          {this.state.instagram ? <img src="igIcon.png" alt="logo" height="30px"/> : ""}
          </a>

          <a href={this.state.linkedin} target="_blank" className="icons"> 
          {this.state.linkedin ? <img src="LiIcon.png" alt="logo" height="30px"/> : ""}
          </a>
          
          <a href={this.state.facebook} target="_blank" className="icons">
          {this.state.facebook ? <img src="fbIcon.png" alt="logo" height="30px"/> : ""}
          </a>

          <a href={"mailto:" + this.state.mail} className="icons">
          {this.state.mail ? <img src="mailIcon.png" alt="logo" height="30px"/> : ""}
          </a>
          
      </div>
        )
      }
    }
  }

module.exports = socialMedia;
