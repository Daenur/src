import React from 'react';
import {BrowserRouter,Route,Routes,NavLink} from 'react-router-dom'
import Game from './board'

import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/login";
function App() {
    return (
        <BrowserRouter>
            <div className='app'>
                <Navbar/>
                <div className="wrap">
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/main" element={<Game/>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
export default App;