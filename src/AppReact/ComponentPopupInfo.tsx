import './ComponentPopupInfo.css'
import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        сurrentSectorId: state.threeUI.сurrentSectorId,
    }
}

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentPopupInfo: React.FC<PropsFromRedux> = ({ сurrentSectorId }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setPosition({
                x: event.clientX,
                y: event.clientY,
            })
        }
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    document.body.style.cursor = сurrentSectorId ? 'pointer' : '';

    return (
        <div>
            {сurrentSectorId && (
                <div
                    className="popup-info"
                    style={{
                        left: position.x + 'px',
                        top: position.y - 60 + 'px',
                    }}
                >{'Section Id: ' + сurrentSectorId}</div>
            )}
        </div>
    )
}

export default connector(ComponentPopupInfo)
