import React, { useRef, useEffect } from 'react'
import './ComponentThree.css'
import { AppThree } from '../AppThree/AppThree.ts'

const CLASS_NAME_THREE_CONTAINER = "three-viewer"
let viewer: AppThree | null = null 

export const ComponentThree = () => {
    const contRef = useRef(null)
    useEffect(() => {
        if (viewer) {
            return;
        }
        viewer = new AppThree()
        viewer.init(CLASS_NAME_THREE_CONTAINER).then()
    }, [])
    return (<div className={CLASS_NAME_THREE_CONTAINER} ref={contRef}></div>)
}
