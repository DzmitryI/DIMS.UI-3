export default class SwapiService {
  _apiBase = `https://dims-f1a5f.firebaseio.com/`;

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  getAllPeople = async () => {
    const res = await this.getResource(`/UserProfile.json`);
    const members = [];
    Object.entries(res).forEach((key, value) => {
      members.push({
        value: key,
      });
    });
    return members;
  };

  // _transformPerson = (person) => {
  //   return {
  //     userId: person.UserId,
  //   };
  // };

  setResource = async (url, body) => {
    const res = await fetch(`${this._apiBase}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return await res.json();
  };

  setPeople = async (body) => {
    return await this.setResource(`/UserProfile.json`, body);
  };
}
