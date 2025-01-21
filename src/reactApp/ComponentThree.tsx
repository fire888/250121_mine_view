import React, { useRef, useEffect } from 'react'
import './ComponentThree.css'
import { ThreeApp } from '../ThreeApp/ThreeApp.ts'

const classNameThreeContainer = "three-viewer"
let viewer: ThreeApp | null = null 

export const ComponentThree = () => {
    const contRef = useRef(null)
    useEffect(() => {
        if (viewer) {
            return;
        }
        viewer = new ThreeApp()
        viewer.init(classNameThreeContainer).then()
	  }, [])
    return (<div className={classNameThreeContainer} ref={contRef}></div>)
}
