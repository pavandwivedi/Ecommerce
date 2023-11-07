import React from "react";
import Layout from "../../components/Layout/Layout.js";
import UserMenu from "../../components/UserMenu.js";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            {/* Increase the margin for the card */}
            <div className="card w-75 p-3" style={{ margin: "20px" }}>
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
              <h3>{auth?.user?.address}</h3>
             
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
 