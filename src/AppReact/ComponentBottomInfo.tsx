import './ComponentBottomInfo.css'
import { connect, ConnectedProps } from 'react-redux'
import { RootState, TYPES_ACTIONS } from './store'
import { Dispatch } from 'redux'


const mapStateToProps = (state: RootState) => {
    return {
        bottomInfo: state.threeUI.bottomInfo,
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
    showBottomSectorInfo: (text: string | null) =>
        dispatch({ type: TYPES_ACTIONS.SHOW_BOTTOM_SECTOR_INFO, text }),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentBottomInfo: React.FC<PropsFromRedux> = (props) => {
    return (
        <div>
            {props.bottomInfo && (
                <div 
                    className="bottom-info"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <div 
                        className='close-bottom-info'
                        onClick={(e) => {
                            e.stopPropagation()
                            props.showBottomSectorInfo(null)
                        }}
                    >close</div>
                    <p>{props.bottomInfo}</p>
                </div>
            )}
        </div>
    )
}

export default connector(ComponentBottomInfo)
