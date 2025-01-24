import './App.css'
import { ComponentLoader } from './ComponentLoader.tsx'
import ComponentPopupInfo from './ComponentPopupInfo.tsx'
import ComponentThree from './ComponentThree.tsx'
import ComponentHorizonsList from './ComponentHorizonsList.tsx'
import { connect } from 'react-redux'
import { RootState } from './store'

interface AppProps {
    isShowComponentLoader: boolean
}

const mapStateToProps = (state: RootState) => {
    return {
        isShowComponentLoader: state.threeUI.isShowComponentLoader,
    }
}

const App: React.FC<AppProps> = ({ 
    isShowComponentLoader,
}: AppProps) => {
    return (
        <div className="App">
            {isShowComponentLoader && <ComponentLoader />}
            <ComponentPopupInfo />
            <ComponentHorizonsList />
            <ComponentThree />
        </div>
    )
}

export default connect(mapStateToProps, null)(App)
