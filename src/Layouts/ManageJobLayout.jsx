// ManageJobsLayout.jsx
import { Outlet } from "react-router-dom";

function ManageJobsLayout() {
  return (
    <div className="">
      {/* You can add shared UI here like a header or tabs */}
      <Outlet />
    </div>
  );
}

export default ManageJobsLayout;
