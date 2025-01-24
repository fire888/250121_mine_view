import './ComponentThree.css'
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppThree } from '../AppThree/AppThree'
import './ComponentThree.css'
import { TYPES_ACTIONS } from './store'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        currentHorizon: state.threeUI.currentButtonHorizon,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        showApplication: () => dispatch({ type: TYPES_ACTIONS.SHOW_APPLICATION }),
        setValuePopupInfo: (text: string) => { 
            dispatch({ type: TYPES_ACTIONS.SET_VALUE_POPUP_INFO, text })
        },
        setHorizonsNames: (horizonsNames: string[]) => { 
            dispatch({ type: TYPES_ACTIONS.SET_BUTTONS_HORIZONS, value: horizonsNames })
        },
        setValuePopupCoords: (x: number, y: number) => {
            dispatch({ type: TYPES_ACTIONS.SET_VALUE_POPUP_COORDS, x, y })
        }
    }
}

let viewer: AppThree | null = null
const connectorToThreeApp: any = { 
    props: {
}
} 

interface ThreeProps {
    currentHorizon: string
    showApplication: () => void
    setValuePopupInfo: (text: string) => void
    etHorizonsNames: (horizonsNames: string[]) => void
    setValuePopupCoords: (x: number, y: number) => void
}

const ComponentThree = (props: ThreeProps) => {
    connectorToThreeApp.props = props
    viewer && viewer.setNewHorizonName(props.currentHorizon) 

    const contRef = useRef(null)
    useEffect(() => {
        if (viewer) {
            return;
        }
        viewer = new AppThree()
        viewer.init(contRef.current, connectorToThreeApp).then()
    }, [])
    return (
        <div 
            className='three-viewer-wrapper' 
            textvalue={props.currentHorizon} 
            ref={contRef}
        ></div>)
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentThree)
