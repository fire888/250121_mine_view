import React, { useRef, useEffect } from 'react'
import './ComponentThree.css'
import { AppThree } from '../AppThree/AppThree.ts'

const classNameThreeContainer = "three-viewer"
let viewer: AppThree | null = null 

export const ComponentThree = () => {
    const contRef = useRef(null)
    useEffect(() => {
        if (viewer) {
            return;
        }
        viewer = new AppThree()
        viewer.init(classNameThreeContainer).then()
	  }, [])
    return (<div className={classNameThreeContainer} ref={contRef}></div>)
}
