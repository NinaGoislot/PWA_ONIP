import React, { useState, useEffect } from "react";

function Accelerometer() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [z, setZ] = useState(null);
  const [totalRotation, setTotalRotation] = useState(0);

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            setPermissionGranted(true);
            window.addEventListener("devicemotion", handleMotionEvent);
          }
        })
        .catch(console.error);
    } else {
      setPermissionGranted(true);
      window.addEventListener("devicemotion", handleMotionEvent);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent);
    };
  }, []);

  function handleMotionEvent(event) {
    const accelerometerRotationIncrement = -Math.round(
      event.accelerationIncludingGravity.x * 10
    );
    const gyroscopeRotationIncrement = event.rotationRate
      ? event.rotationRate.gamma
      : 0;

    // Combine both accelerometer and gyroscope data for more accurate tracking
    const rotationIncrement =
      accelerometerRotationIncrement + gyroscopeRotationIncrement;

    const newRotation = (totalRotation + rotationIncrement) % 360;
    setTotalRotation(newRotation >= 0 ? newRotation : 360 + newRotation);
    setX(event.accelerationIncludingGravity.x);
    setY(event.accelerationIncludingGravity.y);
    setZ(event.accelerationIncludingGravity.z);
  }

  function handlePermissionGranted() {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          setPermissionGranted(true);
          window.addEventListener("devicemotion", handleMotionEvent);
        }
      })
      .catch(console.error);
  }

  return (
    <>
      {permissionGranted ? (
        <div>
          <p>X: {Math.round(x)}</p>
          <p>Y: {Math.round(y)}</p>
          <p>Z: {Math.round(z)}</p>
          <p>totalRotation: {Math.round(totalRotation)}</p>

          <div
            style={{
              width: "50px",
              height: "50px",
              background: "red",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${totalRotation}deg)`,
              textAlign: "center"
            }}
          >
            hello julien
          </div>
        </div>
      ) : (
        <div className="modal" id="modal">
          <div className="modal-content">
            <h2>Allow access to device motion and orientation</h2>
            <p>
              This app requires access to device motion and orientation to
              function properly.
            </p>
            <button className="btn" onClick={handlePermissionGranted}>
              Grant Permission
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Accelerometer;
