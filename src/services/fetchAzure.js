import axios from 'axios';
import DisplayNotification from '../components/displayNotification';

const notification = new DisplayNotification();

const renderBody = (values) => {
  return {
    Email: values.email,
    Education: values.education,
    Age: values.age,
    UniversityAverageScore: values.universityAverageScore,
    MathScore: values.mathScore,
    Address: values.address,
    MobilePhone: values.mobilePhone,
    Skype: values.skype,
    StartDate: values.startDate,
    Sex: values.sex,
    Direction: values.direction,
    FullName: `${values.fullName}`,
    Name: values.name,
    LastName: values.lastName,
  };
};
export default class FetchAzure {
  api_base = process.env.REACT_APP_API_BASE_AZURE;

  getSource = async (url) => {
    try {
      return await axios.get(`${this.api_base}${url}`);
    } catch (error) {
      notification.notify('error', error.message);
    }
  };

  setSource = async (url, body) => {
    try {
      return await axios.post(`${this.api_base}${url}`, body);
    } catch (error) {
      notification.notify('error', error.message);
    }
  };

  editSource = async (url, body) => {
    try {
      return await axios.put(`${this.api_base}${url}`, body);
    } catch (error) {
      notification.notify('error', error.message);
    }
  };

  deleteSource = async (url) => {
    try {
      return await axios.delete(`${this.api_base}${url}`);
    } catch (error) {
      notification.notify('error', error.message);
    }
  };

  getAllMember = async () => {
    const response = await this.getSource(`/api/profiles`);
    let members = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [, values] = key;
        const [name, lastName] = values.FullName.split(' ');
        members = members.concat({
          userId: `${values.UserId}`,
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
    let direction = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [value, { name }] = key;
        direction = direction.concat({
          value,
          name,
        });
      });
    }
    return direction;
  };

  setMember = async (body) => {
    return await this.setSource(`/api/create`, renderBody(body));
  };

  editMember = async (memberId, body) => {
    return await this.editSource(`/api/profile/edit/${memberId}`, renderBody(body, memberId));
  };

  delMember = async (memberId) => {
    return await this.deleteSource(`/api/profile/delete/${memberId}`);
  };
}
