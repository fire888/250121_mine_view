import './App.css'
import ComponentLoader from './ComponentLoader.tsx'
import ComponentPopupInfo from './ComponentPopupInfo.tsx'
import ComponentThree from './ComponentThree.tsx'
import ComponentHorizonsList from './ComponentHorizonsList.tsx'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
    return {
        isShowComponentLoader: state.threeUI.isShowComponentLoader,
    }
}

const connector = connect(mapStateToProps, null)
type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = ({ 
    isShowComponentLoader,
}) => {
    return (
        <div className="App">
            {isShowComponentLoader && <ComponentLoader />}
            <ComponentPopupInfo />
            <ComponentHorizonsList />
            <ComponentThree />
        </div>
    )
}

export default connector(App)