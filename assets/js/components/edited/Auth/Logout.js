import React, { Component, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "~/_metronic/layout";
import { Auth, Profile, LogoutUser } from '~/store/modules/auth/Auth.actions'

export default function Logout() {
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(LogoutUser())
  }, [])

  return token ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;

}