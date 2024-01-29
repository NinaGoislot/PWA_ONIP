import React from "react";
import DeviceOrientation from "react-device-orientation";

const Device = () => {
  return (
    <DeviceOrientation>
      {({ absolute, alpha, beta, gamma }) => (
        <div>
          {`Absolute: ${absolute}`}
          {`Alpha: ${alpha}`}
          {`Beta: ${beta}`}
          {`Gamma: ${gamma}`}
        </div>
      )}
    </DeviceOrientation>
  );
};

export default Device;
