import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';

import Clarifai from 'clarifai';

const particlesOption = {
  particles: {
    number:{
      value:100,
      density :{
        enable:true,
        value_area:800
      }
    }  
  }
}

const app = new Clarifai.App({
  apiKey:'e25498b85cdf4f6bb1213a6994bc6e64'
});

class App extends Component{

  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin'
    }
  }

  calculateFaceLocation = (data) =>{

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) =>{
      console.log(box);
      this.setState({box:box})
  }

  onInputChange = (event) => {
  
    this.setState({input:event.target.value})

  }

  
  
  onButtonSubmit = () =>{

    this.setState({imageUrl:this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))

  }


  onRouteChange = () =>{

  }

  render(){

    return (

      <div className='App'>
          <Particles className="particles"
              params={particlesOption}/>
        
        <Navigation />
        {
          this.state.route ==='signin'?
        <Signin onRouteChange = {this.state.onRouteChange} />
        :<div>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        
        }
      </div>

    );

  }


}




export default App;
