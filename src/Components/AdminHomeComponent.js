import React, { useContext } from 'react';

import {AuthContext} from '../Auth'

export default function AdminHomeComponent() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div>
      <h1>Welcome back {currentUser.fullName}</h1>
    </div>
  );
}
