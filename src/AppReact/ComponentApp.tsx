import './stylesheets/ComponentApp.css'
import ComponentLoader from './ComponentLoader.tsx'
import ComponentPopupInfo from './ComponentPopupInfo.tsx'
import ComponentHorizonsList from './ComponentHorizonsList.tsx'
import ComponentBottomInfo from './ComponentBottomInfo.tsx'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import { useRef, useEffect } from 'react'
import { TYPES_ACTIONS, RootState } from './store.ts'

// @ts-ignore
import xmlFileSrc from '../assets/MIM_Scheme.xml' // Импорт XML-файла с данными
import { loadXMLFile } from '../helpers/loadXML.ts'
import { Graph } from './Graph.ts'
import { ThreeViewer } from '../ThreeViewer/ThreeViewer.ts'

const mapStateToProps = (state: RootState) => {
    return {
        isShowComponentLoader: state.threeUI.isShowComponentLoader,
        currentHorizon: state.threeUI.currentButtonHorizon,
        сurrentItemId: state.threeUI.сurrentItemId,
        сurrentItemType: state.threeUI.сurrentItemType,
        bottomInfo: state.threeUI.bottomInfo
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    showApplication: () =>
        dispatch({ type: TYPES_ACTIONS.SHOW_APPLICATION }),
    setCurrentItem: (typeItem: string | null, Id: number | null = null) =>
        dispatch({ type: TYPES_ACTIONS.SET_CURRENT_ITEM, typeItem, Id }),
    setHorizonsNames: (horizonsNames: string[]) =>
        dispatch({ type: TYPES_ACTIONS.SET_BUTTONS_HORIZONS, value: horizonsNames }),
    showBottomSectorInfo: (text: string | null) =>
        dispatch({ type: TYPES_ACTIONS.SHOW_BOTTOM_SECTOR_INFO, text }),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = (props) => {
    // Контейнер для хранения экземпляра 3д вьювера
    const threeViewerWrapperRef = useRef<HTMLDivElement | null>(null)
    const viewerRef = useRef<ThreeViewer | null>(null)

    // Инициализация приложения при первом рендере один раз
    useEffect(() => {
        if (viewerRef.current) {
            return;
        }
        const viewer = new ThreeViewer()
        viewerRef.current = viewer

        const initAllApplication = async () => {
            // Загружаем и инициализируем граф из XML-файла
            const fileData = await loadXMLFile(xmlFileSrc)
            const graph = new Graph()
            graph.parse(fileData)

            // Настраиваем 3D-сцену и вешаем коллбэки на взаимодействие с ней
            viewer.setGraph(graph)
            await viewer.build()
            viewer.onMouseOver(e => {
                if (e === null) {
                    props.setCurrentItem(null)
                    return;
                }
                props.setCurrentItem(e.typeItem, e.Id)
            })
            viewer.appendParentDomContainer(threeViewerWrapperRef.current)

            // Подготавливаем интерфейс: скрываем лоадер и показываем приложение
            props.setHorizonsNames(graph.getHorizonsNames())
            props.showApplication()
        }
        initAllApplication().then()

    }, [props.setCurrentItem])

    // Эффект для подсветки текущих Секторов Горизонта в 3D-вьювере
    useEffect(() => {
        if (!viewerRef.current) {
            return;
        }
        viewerRef.current.setCurrentHorizonName(props.currentHorizon)
    }, [props.currentHorizon])

    // Эффект для показа информации при клике на сектор и окрас его в синий
    useEffect(() => {
        if (!threeViewerWrapperRef.current) return;

        let time = Date.now()
        const handleDown = () => {
            time = Date.now()
        }

        const handleUp = () => {
            if (!viewerRef.current || !viewerRef.current.graph) return;

            if (Date.now() - time > 200) return;

            const bottomInfo = viewerRef.current.graph.getItemData(props.сurrentItemType, props.сurrentItemId)
            props.showBottomSectorInfo(bottomInfo)
        }
        threeViewerWrapperRef.current.addEventListener('pointerdown', handleDown)
        threeViewerWrapperRef.current.addEventListener('pointerup', handleUp)
        return () => {
            if (!threeViewerWrapperRef.current) return;

            threeViewerWrapperRef.current.removeEventListener('pointerdown', handleDown)
            threeViewerWrapperRef.current.removeEventListener('pointerup', handleUp)
        }
    }, [props.сurrentItemId, props.сurrentItemType])

    // Эффект для очистки окраса в синий
    useEffect(() => {
        if (!viewerRef.current) {
            return;
        }
        if (props.bottomInfo) {
            viewerRef.current.setCurrentItemPicked(props.сurrentItemType, props.сurrentItemId)
        } else {
            viewerRef.current.setCurrentItemPicked(null)
        }
    }, [props.bottomInfo])

    return (
        <div className="App">
            <div className='three-viewer-wrapper' ref={threeViewerWrapperRef}></div>
            {props.isShowComponentLoader && <ComponentLoader />}
            <ComponentPopupInfo />
            <ComponentHorizonsList />
            <ComponentBottomInfo />
        </div>
    )
}

export default connector(App)