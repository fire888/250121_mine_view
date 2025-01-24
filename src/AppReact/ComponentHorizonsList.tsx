import './ComponentHorisonsList.css'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { TYPES_ACTIONS } from './store'
import { RootState } from './store'

interface HorizonListProps {
    buttonsNames: string[]
    currentButtonName: string
    setCurrentButtonName: (v: string) => void  
}

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

const ComponentHorizonsList = (props: HorizonListProps) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentHorizonsList)
