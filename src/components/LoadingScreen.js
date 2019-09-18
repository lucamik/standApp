import React, { Component } from 'react';
import './LoadingScreen.css';

class LoadingScreen extends Component {
    render() {
        return (
            <div className="loading">
                <img src={'/loading.gif'} alt="loading"/>
                ( l o a d i n g )
            </div>
        );
    }
}

export default LoadingScreen;