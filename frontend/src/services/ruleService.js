import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rules';

export const createRule = async (rule) => {
  const response = await axios.post(`${API_URL}/create`, { rule });
  return response.data;
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
  const response = await axios.put(`${API_URL}/modify/${ruleId}`, { modifications });
  return response.data;
};
