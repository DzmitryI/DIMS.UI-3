import axios from 'axios';

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
  apiBase = process.env.REACT_APP_API_BASE_AZURE;

  getSource = (url) => {
    return axios.get(`${this.apiBase}${url}`);
  };

  setSource = (url, body) => {
    return axios.post(`${this.apiBase}${url}`, body);
  };

  editSource = (url, body) => {
    return axios.put(`${this.apiBase}${url}`, body);
  };

  deleteSource = (url) => {
    return axios.delete(`${this.apiBase}${url}`);
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
          directionId: values.Direction,
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
    const response = await this.getSource(`/api/profiles`);
    let direction = [];
    const directionSet = new Set();
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [, values] = key;
        directionSet.add(values.Direction);
      });
    }
    directionSet.forEach((value) => {
      direction = direction.concat({
        value,
        name: value,
      });
    });
    return direction;
  };

  setMember = (body) => {
    return this.setSource(`/api/create`, renderBody(body));
  };

  editMember = (memberId, body) => {
    return this.editSource(`/api/profile/edit/${memberId}`, renderBody(body, memberId));
  };

  delMember = (memberId) => {
    return this.deleteSource(`/api/profile/delete/${memberId}`);
  };
}
