import { navigate } from "gatsby-link";
import * as React from "react";
import { useAuth } from "../hooks/useAuth";
import { Layout, Tabs, Skeleton } from "antd";
import NavbarLinks from "../components/NavbarLinks";
import "antd/dist/antd.css";
import "../style.css";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};

const wrapper = {
  backgroundColor: `rgb(197,250,3)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  height: `100vh`,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const loginCard = {
  maxWidth: 420,
  width: `100%`,
  background: `black`,
  boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
  borderRadius: `30px`,
  alignSelf: `center`,
  padding: `48px 16px`,
  color: `rgb(197,250,3)`,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const button = {
  borderRadius: `4px`,
  border: `1px solid rgb(247, 248, 250)`,
  backgroundColor: `rgb(255, 255, 255)`,
  height: `40px`,
  width: 240,
  cursor: `pointer`,
};

const buttonWrapper = {
  textAlign: `center`,
};

// markup
const IndexPage = () => {
  const { logout, currentUser } = useAuth();
  const user = currentUser();
  const userAddress = user?.get("ethAddress");

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Header style={styles.header}>
        <NavbarLinks />
      </Header>
      <main style={wrapper}>
        <title>Home Page</title>

        <div style={loginCard}>
          <p>ETH Address: {userAddress}</p>
          <div style={buttonWrapper}>
            <button
              style={button}
              onClick={() => {
                return logout().catch((e) => {
                  console.error(e);
                });
              }}
            >
              LOG OUT
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;