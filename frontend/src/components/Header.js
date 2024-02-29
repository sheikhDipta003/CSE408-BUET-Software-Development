import { FaLaptop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import useWindowSize from "../hooks/useWindowSize";
import { useParams, Link } from "react-router-dom";

const Header = ({ title }) => {
  const { width } = useWindowSize();

  return (
    <header className="Header">
      <Link  to={`/home`}
                    target="_self"
                    rel="noopener noreferrer">
      <h1>{title}</h1>
      </Link>
      {width < 768 ? (
        <FaMobileAlt />
      ) : width < 992 ? (
        <FaTabletAlt />
      ) : (
        <FaLaptop />
      )}
    </header>
  );
};

export default Header;
