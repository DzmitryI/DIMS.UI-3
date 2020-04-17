import axios from 'axios';

export default class FetchService {
  api_base = `http://localhost:5555/`;

  getSource = async (url) => {
    try {
      return await axios.get(`${this.api_base}${url}`);
    } catch (error) {
      // notification.notify('error', error.message);
    }
  };

  // setSource = async (url, body) => {
  //   try {
  //     return await axios.post(`${this.api_base}${url}`, body);
  //   } catch (error) {
  //     notification.notify('error', error.message);
  //   }
  // };

  // editSource = async (url, body) => {
  //   try {
  //     return await axios.put(`${this.api_base}${url}`, body);
  //   } catch (error) {
  //     notification.notify('error', error.message);
  //   }
  // };

  // deleteSource = async (url) => {
  //   try {
  //     return await axios.delete(`${this.api_base}${url}`);
  //   } catch (error) {
  //     notification.notify('error', error.message);
  //   }
  // };

  getAllMember = async () => {
    const response = await this.getSource(`/api/profiles`);
    const members = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        // const [userId, values] = key;
        // members.push({
        //   userId,
        //   values,
        //   fullName: `${values.name} ${values.lastName}`,
        //   checked: false,
        // });
      });
    }
    return members;
  };
}
