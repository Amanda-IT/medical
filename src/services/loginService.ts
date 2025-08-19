
import config from "../config";

export const getLoginResponse = async (payload: any) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();

    localStorage.setItem('token', responseData.access_token);
    return true;

  } catch (error) {
    console.error('Failed to login:', error);
  }
};
