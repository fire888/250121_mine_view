import './ComponentPopupInfo.css'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        segmentData: state.threeUI.valuePopupInfo,
        x: state.threeUI.valuePopupX,
        y: state.threeUI.valuePopupY,
    }
}

const connector = connect(mapStateToProps, null)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentPopupInfo: React.FC<PropsFromRedux> = props => {
    return (
        <div> 
            {props.segmentData !== '' && <div 
                className='popup-info'
                style={{ left: props.x + 'px', top: props.y - 60 + 'px' }}
            >{props.segmentData}</div>}
        </div>
    )
}

export default connector(ComponentPopupInfo)