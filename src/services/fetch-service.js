export default class FetchService {
  API_BASE = `https://dims-f1a5f.firebaseio.com/`;

  getResource = async (url) => {
    const res = await fetch(`${this.API_BASE}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  setResource = async (url, body) => {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  editResource = async (url, body) => {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  delResource = async (url) => {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
  };

  getAllMember = async () => {
    const res = await this.getResource(`/UserProfile.json`);
    const members = [];
    if (res) {
      Object.entries(res).forEach((key) => {
        const [userId, values] = key;
        members.push({
          userId,
          values,
        });
      });
    }
    return members;
  };

  getDirection = async () => {
    const res = await this.getResource(`/Direction.json`);
    const direction = [];
    Object.entries(res).forEach((key) => {
      const [value, { name }] = key;
      direction.push({
        value,
        name,
      });
    });
    return direction;
  };

  setMember = async (body) => {
    return await this.setResource(`/UserProfile.json`, body);
  };

  editMember = async (memberId, body) => {
    return await this.editResource(`/UserProfile/${memberId}.json`, body);
  };

  delMember = async (memberId) => {
    return await this.delResource(`/UserProfile/${memberId}.json`);
  };
}
