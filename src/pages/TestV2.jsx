import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ClearCookie  from "../components/ClearCookie";
import ClearCache from "../components/ClearCache";
import Accelerometer from "../components/Accelerometer";



function Test() {
    return (
        <div className="bg-purple-300" >
          <h1>Gyroscope Data</h1>
    
          <ClearCache />
          <ClearCookie />
          <Accelerometer />
          {/* <Device /> */}

        </div>
      );
}

export default observer(Test);
