'use client'

import { createContext, useContext, useState } from "react";

type LoginPopupContextStateType = {
  isPopup: boolean
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>
  isLogoutPopup: boolean
  setIsLogoutPopup: React.Dispatch<React.SetStateAction<boolean>>
}

const initLoginPopupContextState: LoginPopupContextStateType = {
  isPopup: false,
  setIsPopup: () => { },
  isLogoutPopup: false,
  setIsLogoutPopup: () => { },
}

const LoginPopupContext = createContext(initLoginPopupContextState)

type LoginPopupProviderProps = {
  children: React.ReactNode
}

export function LoginPopupProvider({ children }: LoginPopupProviderProps) {
  const [isPopup, setIsPopup] = useState(false)
  const [isLogoutPopup, setIsLogoutPopup] = useState(false)

  const contextValue = {
    isPopup,
    setIsPopup,
    isLogoutPopup,
    setIsLogoutPopup,
  }

  return <LoginPopupContext.Provider value={contextValue}>
    {children}
  </LoginPopupContext.Provider>
}

export function useLoginPopupContext() {
  const popup = useContext(LoginPopupContext)
  if (!popup)
    throw new Error('useLoginPopupContext must be used within LoginPopupProvider')

  return popup
}