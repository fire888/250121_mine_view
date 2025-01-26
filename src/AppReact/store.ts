import { configureStore } from '@reduxjs/toolkit'

interface AppState {
    isShowComponentLoader: boolean
    valuePopupInfo: string
    valuePopupX: number,
    valuePopupY: number,
    buttonsHorizons: string[]
    currentButtonHorizon: string
}

export const TYPES_ACTIONS = {
    SHOW_APPLICATION: 'SHOW_APPLICATION',
    SET_CURRENT_SECTOR_ID: 'SET_CURRENT_SECTOR_ID',
    SET_VALUE_POPUP_COORDS: 'SET_VALUE_POPUP_COORDS',
    SET_BUTTONS_HORIZONS: 'SET_BUTTONS_MINES',
    SET_CURRENT_BUTTON_HORIZON: 'SET_CURRENT_BUTTON_HORIZON',
}

type AppAction = {
    type: string,
    [key: string]: any
}

const appStartState: AppState = {
    isShowComponentLoader: true,
    valuePopupInfo: '',
    valuePopupX: 0,
    valuePopupY: 0,
    buttonsHorizons: [],
    currentButtonHorizon: 'X',
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
            valuePopupInfo: action.text,
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