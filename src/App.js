import React from 'react';
import LoginForm from './LoginForm';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import './App.css';

class App extends React.Component {

  render(){
    return (
      <div className = "app">
        <div className = 'container'>

          //if (user is logged in){}
          //else just load the loginForm

            <LoginForm/>
        </div>
      </div>
      );
    }
}

export default App;
