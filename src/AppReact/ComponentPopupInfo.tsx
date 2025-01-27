import './stylesheets/ComponentPopupInfo.css'
import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        сurrentItemId: state.threeUI.сurrentItemId,
        сurrentItemType: state.threeUI.сurrentItemType,
    }
}

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentPopupInfo: React.FC<PropsFromRedux> = ({ сurrentItemId, сurrentItemType }) => {
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

    document.body.style.cursor = сurrentItemId ? 'pointer' : '';

    return (
        <div>
            {сurrentItemId && (
                <div
                    className="popup-info"
                    style={{
                        left: position.x + 'px',
                        top: position.y - 60 + 'px',
                    }}
                >{`${сurrentItemType}: ${сurrentItemId}`}</div>
            )}
        </div>
    )
}

export default connector(ComponentPopupInfo)
