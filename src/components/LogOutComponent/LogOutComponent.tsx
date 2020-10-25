import React from "react";
import { logOut } from "../../api/api";
import { Redirect } from "react-router-dom";

function LogOut() {
  logOut();
  return <Redirect to="/manager/login" />;
}

export default LogOut;
