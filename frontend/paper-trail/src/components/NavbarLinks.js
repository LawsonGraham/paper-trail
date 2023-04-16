import React from "react"
import { Link } from "gatsby"
import { useLocation } from '@reach/router';
import { Menu } from "antd";


const NavbarLinks = () => {
  const { pathname } = useLocation();
  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/">
        <Link to="/">📰 Main Feed</Link>
      </Menu.Item>
    </Menu>
  );
}

export default NavbarLinks;