import React from "react";
import { useAuth } from "../hooks/useAuth";

const wrapper = {
  backgroundColor: `rgb(255,255,255)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  height: `100vh`,
};

const loginCard = {
  maxWidth: 420,
  width: `100%`,
  background: `rgb(123,221,164)`,
  boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
  borderRadius: `30px`,
  alignSelf: `center`,
  padding: `48px 16px`,
  color: `rgb(0,0,0)`,
  textAlign: `center`,
  fontFamily: `Roboto`,
};

const header = { textAlign: `center`, margin: `0 0 8px` };

const paragraph = { margin: `0 0 24px` };

const button = {
  borderRadius: `4px`,
  border: `1px solid rgb(247, 248, 250)`,
  backgroundColor: `rgb(255, 255, 255)`,
  height: `40px`,
  width: 240,
  cursor: `pointer`,
};

export default function Login() {
    const { login } = useAuth();
    return (
      <section style={wrapper}>
        <div style={loginCard}>
          <h1 style={header}>Welcome to the App</h1>
  
          <p style={paragraph}>You can try out logging in below!</p>
  
          <button
            style={button}
            onClick={() => {
              return login().catch((e) => {
                console.error(e);
              });
            }}
          >
            LOG IN
          </button>
        </div>
      </section>
    );
  }