import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section>
      <h1 className="text-red-500 mb-0">Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page.</p>
      <div className="flexGrow underline underline-offset-2 text-lg decoration-blue-600 px-0 py-0 text-black w-1/6 font-bold">
        <button onClick={goBack}>Go Back</button>
      </div>
    </section>
  );
};

export default Unauthorized;
