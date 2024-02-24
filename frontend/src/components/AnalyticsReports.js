import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHandshake, faLaptop, faStar } from '@fortawesome/free-solid-svg-icons';

const AnalyticsReports = () => {
  const [userCount, setUserCount] = useState(0);
  const [collabSiteCount, setCollabSiteCount] = useState(0);
  const [nonCollabSiteCount, setNonCollabSiteCount] = useState(0);
  const [weightedRating, setWeightedRating] = useState(0.0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const usersResponse = await axiosPrivate.get("/admin/users");
        const sitesResponse = await axiosPrivate.get("/admin/websites");
        const response2 = await axiosPrivate.get("/admin/rating");

        isMounted && setUserCount(usersResponse.data.totalUsers);
        isMounted && setCollabSiteCount(sitesResponse.data.collabSites);
        isMounted && setNonCollabSiteCount(sitesResponse.data.nonCollabSites);
        isMounted && setWeightedRating(response2.data.weightedRating);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message);
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
      <div className="bg-blue-200 rounded p-4 mr-2 mt-2 flex items-center">
        <div>
          <h3 className="text-md font-bold">Users</h3>
          <p className="text-l font-semibold flex justify-center">{userCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faUser} className="text-blue-800" />
        </div>
      </div>

      {/* Collaboration Site Count Card */}
      <div className="bg-green-200 rounded p-4 mr-2 mt-2 flex items-center">
        <div>
          <h3 className="text-md font-bold">Collaborative Websites</h3>
          <p className="text-l font-semibold flex justify-center">{collabSiteCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faHandshake} className="text-green-800" />
        </div>
      </div>

      {/* Non-Collaboration Site Count Card */}
      <div className="bg-yellow-200 rounded p-4 mr-2 mt-2 flex items-center">
        <div>
          <h3 className="text-md font-bold">Non-Collaborative Websites</h3>
          <p className="text-l font-semibold flex justify-center">{nonCollabSiteCount}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faLaptop} className="text-yellow-800" />
        </div>
      </div>

      <div className="bg-red-200 rounded p-4 mr-2 mt-2 flex items-center">
        <div>
          <h3 className="text-md font-bold">Weighted Rating</h3>
          <p className="text-l font-semibold flex justify-center">{weightedRating}</p>
        </div>
        <div className="ml-4 mb-6">
          <FontAwesomeIcon icon={faStar} className="text-yellow-800" />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsReports;
