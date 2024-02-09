import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faBuilding, faLaptop } from '@fortawesome/free-solid-svg-icons';

const AnalyticsReports = () => {
  const [userCount, setUserCount] = useState(0);
  const [collabSiteCount, setCollabSiteCount] = useState(0);
  const [nonCollabSiteCount, setNonCollabSiteCount] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const usersResponse = await axiosPrivate.get("/admin/users");
        const sitesResponse = await axiosPrivate.get("/admin/websites");

        isMounted && setUserCount(usersResponse.data.totalUsers);
        isMounted && setCollabSiteCount(sitesResponse.data.collabSites);
        isMounted && setNonCollabSiteCount(sitesResponse.data.nonCollabSites);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap content-evenly">
      {/* User Count Card */}
      <div className="bg-blue-200 rounded p-4 mr-2 flex items-center">
        <div>
          <h3 className="text-lg font-bold">Users</h3>
          <p className="text-xl font-semibold">{userCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faUser} className="text-blue-800" />
        </div>
      </div>

      {/* Collaboration Site Count Card */}
      <div className="bg-green-200 rounded p-4 mr-2 flex items-center">
        <div>
          <h3 className="text-lg font-bold">Collab Sites</h3>
          <p className="text-xl font-semibold">{collabSiteCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faBuilding} className="text-green-800" />
        </div>
      </div>

      {/* Non-Collaboration Site Count Card */}
      <div className="bg-yellow-200 rounded p-4 flex items-center">
        <div>
          <h3 className="text-lg font-bold">Non-Collab Sites</h3>
          <p className="text-xl font-semibold">{nonCollabSiteCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faLaptop} className="text-yellow-800" />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsReports;
