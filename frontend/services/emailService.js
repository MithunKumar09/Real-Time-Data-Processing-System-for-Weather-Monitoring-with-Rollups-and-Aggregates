import axios from 'axios';

export const sendEmailNotification = async (message) => {
  try {
    const response = await axios.post('http://192.168.201.187:5001/send-email', {
      subject: 'Weather Alert',
      text: message,
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Handle error appropriately, maybe with a toast or alert
  }
};
