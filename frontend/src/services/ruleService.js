import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rules';

export const createRule = async (rule) => {
  try {
  const response = await axios.post(`${API_URL}/create`, { rule });
  return response.data;
  } catch (error) {
    // Check if the error response status is 400 and display an alert
    if (error.response && error.response.status === 400) {
      alert(error.response.data.error); // Display an alert with the error message
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error; // Re-throw the error for further handling if needed
  }
  };

export const evaluateRule = async (ast, data) => {
  const response = await axios.post(`${API_URL}/evaluate`, { ast, data });
  return response.data;
};


export const getRules = async () => {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
  };

export const combineRules = async (ruleIds, operator) => {
    const response = await axios.post(`${API_URL}/combine`, { ruleIds, operator });
    return response.data;
};

export const modifyRule = async (ruleId, modifications) => {
  try {
  const response = await axios.put(`${API_URL}/modify/${ruleId}`, { modifications });
  return response.data;
} catch (error) {
  // Check if the error response status is 400 and display an alert
  if (error.response && error.response.status === 400) {
    alert(error.response.data.error); // Display an alert with the error message
  } else {
    console.error('An unexpected error occurred:', error);
  }
  throw error; // Re-throw the error for further handling if needed
}
};
