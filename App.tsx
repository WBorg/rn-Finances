import React from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { ThemeProvider } from 'styled-components'
import theme from './src/global/styles/theme'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './src/routes/app.routes'
import { SignIn } from './src/screens/SignIn/index'

import { AuthProvider } from './src/hooks/auth'
import { Routes } from './src/routes'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })
  if (!fontsLoaded) return null

  SplashScreen.hideAsync()

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}
