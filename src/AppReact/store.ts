import { configureStore } from '@reduxjs/toolkit'

interface AppState {
    isShowComponentLoader: boolean
    сurrentSectorId: number | null
    buttonsHorizons: string[]
    currentButtonHorizon: string
    bottomInfo: string | null
}

export const TYPES_ACTIONS = {
    SHOW_APPLICATION: 'SHOW_APPLICATION',
    SET_CURRENT_SECTOR_ID: 'SET_CURRENT_SECTOR_ID',
    SET_VALUE_POPUP_COORDS: 'SET_VALUE_POPUP_COORDS',
    SET_BUTTONS_HORIZONS: 'SET_BUTTONS_MINES',
    SET_CURRENT_BUTTON_HORIZON: 'SET_CURRENT_BUTTON_HORIZON',
    SHOW_BOTTOM_SECTOR_INFO: 'SHOW_BOTTOM_SECTOR_INFO',
}

type AppAction = {
    type: string,
    [key: string]: any
}

const appStartState: AppState = {
    isShowComponentLoader: true,
    сurrentSectorId: null,
    buttonsHorizons: [],
    currentButtonHorizon: 'X',
    bottomInfo: null,
}

const reducerThreeUI = (state: AppState = appStartState, action: AppAction) => {
    if (action.type === TYPES_ACTIONS.SHOW_APPLICATION) {
        return ({
            ...state,
            isShowComponentLoader: false,
        })
    }

    if (action.type === TYPES_ACTIONS.SET_CURRENT_SECTOR_ID) {
        return ({
            ...state,
            сurrentSectorId: action.text,
        })
    }

    if (action.type === TYPES_ACTIONS.SHOW_BOTTOM_SECTOR_INFO) {
        return ({
            ...state,
            bottomInfo: action.text
        })
    }

    if (action.type === TYPES_ACTIONS.SET_VALUE_POPUP_COORDS) {
        return ({
            ...state,
            valuePopupX: action.x,
            valuePopupY: action.y,
        })
    }

    if (action.type === TYPES_ACTIONS.SET_BUTTONS_HORIZONS) {
        return ({
            ...state,
            buttonsHorizons: ['X', ...action.value],
        })
    }

    if (action.type === TYPES_ACTIONS.SET_CURRENT_BUTTON_HORIZON) {
        return ({
            ...state,
            currentButtonHorizon: action.value
        })
    }

    return state
}

export const store = configureStore({ 
    reducer: { 
        threeUI: reducerThreeUI 
    } 
})

export type RootState = ReturnType<typeof store.getState>