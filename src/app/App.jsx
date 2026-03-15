import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Header from "@shared/components/layout/Header/Header.jsx";
import Navbar from "@shared/components/layout/NavBar/NavBar.jsx";

import pages from "./router/routes.jsx"

import '@styles/main.scss';

function App() {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get('ref');

    if (typeof ref === 'string' && ref.trim()) {
        localStorage.setItem('ref', ref.trim());
    }

    return (
        <Router>
            <div className="app">
                <Navbar/>
                <div className="content">
                    <Header/>
                    <Routes>
                        {pages.map(({path, Component, element}) => (
                            <Route key={path} path={path} element={element || <Component />}/>
                        ))}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;