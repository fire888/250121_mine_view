import React, { useRef, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from './store'
import { TYPES_ACTIONS } from './store'
import { AppThree } from '../AppThree/AppThree'
import './ComponentThree.css'

const mapStateToProps = (state: RootState) => ({
    currentHorizon: state.threeUI.currentButtonHorizon,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    showApplication: () => dispatch({ type: TYPES_ACTIONS.SHOW_APPLICATION }),
    setValuePopupInfo: (text: string) => {
        dispatch({ type: TYPES_ACTIONS.SET_VALUE_POPUP_INFO, text })
    },
    setHorizonsNames: (horizonsNames: string[]) => {
        dispatch({ type: TYPES_ACTIONS.SET_BUTTONS_HORIZONS, value: horizonsNames })
    },
    setValuePopupCoords: (x: number, y: number) => {
        dispatch({ type: TYPES_ACTIONS.SET_VALUE_POPUP_COORDS, x, y })
    },
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentThree: React.FC<PropsFromRedux> = ({
    currentHorizon,
    showApplication,
    setValuePopupInfo,
    setHorizonsNames,
    setValuePopupCoords,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const viewerRef = useRef<AppThree | null>(null)

    // Инициализируем сцену один раз
    useEffect(() => {
        if (viewerRef.current) { 
            return;
        }

        const viewer = new AppThree()
        viewerRef.current = viewer
        viewer.init(containerRef.current, {
            showApplication,
            setValuePopupInfo,
            setHorizonsNames,
            setValuePopupCoords,
        })
    }, [showApplication, setValuePopupInfo, setHorizonsNames, setValuePopupCoords])

    // Следим за изменением текущего Горизонта
    useEffect(() => {
        if (!viewerRef.current) { 
            return;
        }
        viewerRef.current.setCurrentHorizonName(currentHorizon)
    }, [currentHorizon])

    return (
        <div
            className="three-viewer-wrapper"
            data-textvalue={currentHorizon}
            ref={containerRef}
        />
    )
}

export default connector(ComponentThree)