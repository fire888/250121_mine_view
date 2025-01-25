import './ComponentHorisonsList.css'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { TYPES_ACTIONS } from './store'
import { RootState } from './store'


const mapStateToProps = (state: RootState) => {
    return {
        buttonsNames: state.threeUI.buttonsHorizons,
        currentButtonName: state.threeUI.currentButtonHorizon,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setCurrentButtonName: (name: string) => dispatch({ type: TYPES_ACTIONS.SET_CURRENT_BUTTON_HORIZON, value: name }),
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ComponentHorizonsList: React.FC<PropsFromRedux> = props => {
    return (
        <div className='horizons-list'>
            {props.buttonsNames.map((horizonName: string) => (
                <div 
                    className='horizon-item' 
                    key={horizonName}
                    onClick={() => {
                        props.setCurrentButtonName(horizonName)
                    }}
                >{`[${ props.currentButtonName === horizonName ? 'V' : ' '}] ${ horizonName }`}</div>))}
        </div>
    )
}

export default connector(ComponentHorizonsList)