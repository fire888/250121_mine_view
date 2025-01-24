import './ComponentPopupInfo.css'
import { connect } from 'react-redux'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        segmentData: state.threeUI.valuePopupInfo,
        x: state.threeUI.valuePopupX,
        y: state.threeUI.valuePopupY,
    }
}

interface PopupInfoProps {
    segmentData: string
    x: number
    y: number
}

const ComponentPopupInfo = (props: PopupInfoProps) => {
    return (
        <div> 
            {props.segmentData !== '' && 
                <div 
                    className='popup-info'
                    style={{ left: props.x + 'px', top: props.y - 60 + 'px' }}
                >{props.segmentData}</div>}
        </div>
    )
}

export default connect(mapStateToProps, null)(ComponentPopupInfo)
