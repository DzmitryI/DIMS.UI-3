export default class SwapiService {
  API_BASE = `https://dims-f1a5f.firebaseio.com/`;

  getResource = async (url) => {
    const res = await fetch(`${this.API_BASE}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  getAllMember = async () => {
    const res = await this.getResource(`/UserProfile.json`);
    const members = [];
    Object.entries(res).forEach((key) => {
      members.push({
        value: key,
      });
    });
    return members;
  };

  setResource = async (url, body) => {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return await res.json();
  };

  setMember = async (body) => {
    return await this.setResource(`/UserProfile.json`, body);
  };
}
