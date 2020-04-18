import axios from 'axios';

export default class FetchAzure {
  api_base = `https://dimsserver.azurewebsites.net/`;

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
        const [, values] = key;
        const [name, lastName] = values.FullName.split(',');
        members.push({
          userId: values.UserId,
          email: values.Email,
          education: values.Education,
          age: values.Age,
          universityAverageScore: values.UniversityAverageScore,
          mathScore: values.MathScore,
          address: values.Address,
          mobilePhone: values.MobilePhone,
          skype: values.Skype,
          startDate: values.StartDate,
          sex: values.Sex,
          direction: values.Direction,
          fullName: `${values.FullName}`,
          checked: false,
          name,
          lastName,
        });
      });
    }
    return members;
  };

  getDirection = async () => {
    const response = await this.getSource(`/Direction.json`);
    const direction = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [value, { name }] = key;
        direction.push({
          value,
          name,
        });
      });
    }
    return direction;
  };
}
