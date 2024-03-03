import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios

const ContentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunScript = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make an HTTP request to run the script
      await axios.post(`admin/content-management/run-script`);

      // Handle success: Provide feedback to the user
      alert('Script executed successfully!');
    } catch (error) {
      // Handle error: Provide feedback to the user
      setError('An error occurred while executing the script.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRunScript} disabled={loading}>
        {loading ? 'Running Script...' : 'Run Script'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ContentManagement;
