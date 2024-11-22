import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const useAppState = (onAppStateChange: (status: AppStateStatus) => void) => {
	useEffect(() => {
		const subscription = AppState.addEventListener('change', onAppStateChange)
		return () => subscription.remove()
	}, [])
}
