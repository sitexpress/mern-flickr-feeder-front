import React, {ChangeEvent, useEffect, useState} from 'react';
import s from './App.module.css'
import {MiniDrawer} from "./components/mui/MiniDrawer";
import {Route, Routes} from "react-router-dom";

function App() {
    return <div className={s.app}>
                <Routes>
                    <Route path="/" element={<MiniDrawer/>}/>
                    {/*<Route path="/photo/:values/:mode" element={<MiniDrawer/>}/>*/}
                </Routes>
            </div>
}

export default App;
