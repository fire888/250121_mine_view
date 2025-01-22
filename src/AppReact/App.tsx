import React, { useState } from 'react'
import './App.css'
import { ComponentPopupInfo } from './ComponentPopupInfo.tsx'
import { ComponentLoader } from './ComponentLoader.tsx'

export const containerChangeAppProps = {
    changers:  {
        setShowLoader: (v: boolean): void => {},
        setShowPopupInfo: (v: boolean): void => {},
        setTextPopupInfo: (v: string): void => {},
    }
}

export const App = () => {
    const [isShowLoader, setShowLoader] = useState(true)  
    const [isShowPopupInfo, setShowPopupInfo] = useState(false)
    const [textPopupInfo, setTextPopupInfo] = useState('|')

    containerChangeAppProps.changers.setShowLoader = setShowLoader
    containerChangeAppProps.changers.setShowPopupInfo = setShowPopupInfo
    containerChangeAppProps.changers.setTextPopupInfo = setTextPopupInfo
    
    return (
        <div className="App">
            {isShowLoader && <ComponentLoader />}
            {isShowPopupInfo && <ComponentPopupInfo textValue={textPopupInfo} />}
        </div>
    )
}
