import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { SignIn } from '../screens/SignIn'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as AuthSession from 'expo-auth-session'

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  name: string
  email: string
  photo?: string
}

interface IAuthContentData {
  user: User
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
}

interface AuthorizationResponse {
  params: {
    access_token: string
  }
  type: string
}

const AuthContext = createContext({} as IAuthContentData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User)
  const [loading, setLoading] = useState(true)

  async function signInWithGoogle() {
    try {
      const CLIENT_ID =
        '612765459901-octlun5tmufakmm0iu4g031icat063mg.apps.googleusercontent.com'
      const REDIRECT_URI = 'https://auth.expo.io/@wilcoy/goFinances'
      const RESPONSE_TYPE = 'token'
      const SCOPE = encodeURI('profile email')

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

      const response = await AuthSession.startAsync({ authUrl })
      console.log(response)
      console.log(response.type)
      //console.log(params.access_token)

      //----------------------------------------------------------------------------Auth
      // const { type, params } = (await AuthSession.startAsync({
      //   authUrl
      // })) as AuthorizationResponse

      // if (type === 'success') {
      //   const response = await fetch(
      //     `https://accounts.google.com/o/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
      //   )
      //   const userInfo = await response.json()
      //   console.log(userInfo)

      //   setUser({
      //     id: userInfo.id,
      //     email: userInfo.email,
      //     name: userInfo.name,
      //     photo: userInfo.photo
      //   })
      // }

      // console.log(response)
      //--------------------------------------------------------------------------------------
      await AsyncStorage.setItem('@gofinances:user', JSON.stringify(user))
    } catch (error) {
      throw new Error(error)
    }
  }

  async function signOut() {
    setUser({} as User)
    await AsyncStorage.removeItem('@gofinances:user')
  }

  useEffect(() => {
    async function loadStorageDate(): Promise<void> {
      const data = await AsyncStorage.getItem('@gofinances:user')
      if (data) {
        const userLogged = JSON.parse(data) as User
        setUser(userLogged)
      }
    }
    loadStorageDate()
  }, [setUser, setLoading])
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}
export { AuthProvider, useAuth }
