export default class FetchService {
  API_BASE = `https://dims-f1a5f.firebaseio.com/`;
  // API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;

  getResource = async (url) => {
    // try {
    const res = await fetch(`${this.API_BASE}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
    // } catch (err) {
    // console.log(err);
    // }
  };

  setResource = async (url, body) => {
    // try {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
    // } catch (err) {
    // console.log(err);
    // }
  };

  editResource = async (url, body) => {
    // try {
    const res = await fetch(`${this.API_BASE}${url}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
    // } catch (err) {
    // console.log(err);
    // }
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

  getAllTask = async () => {
    const res = await this.getResource(`/Task.json`);
    const tasks = [];
    if (res) {
      Object.entries(res).forEach((key) => {
        const [taskId, values] = key;
        const { name, description, startDate, deadlineDate } = values;
        tasks.push({
          taskId,
          name,
          description,
          startDate,
          deadlineDate,
        });
      });
    }
    return tasks;
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

  registerAuth = async (url, body) => {
    // try {
    const API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;
    const response = await fetch(`${url}${API_Key}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    return await response.json();
    // } catch (err) {
    // console.log(err, '1');
    // }
  };

  setMember = async (body) => {
    return await this.setResource(`/UserProfile.json`, body);
  };

  setTask = async (body) => {
    return await this.setResource(`/Task.json`, body);
  };

  editMember = async (memberId, body) => {
    return await this.editResource(`/UserProfile/${memberId}.json`, body);
  };

  editTask = async (taskId, body) => {
    return await this.editResource(`/Task/${taskId}.json`, body);
  };

  delMember = async (memberId) => {
    return await this.delResource(`/UserProfile/${memberId}.json`);
  };

  delTask = async (taskId) => {
    return await this.delResource(`/Task/${taskId}.json`);
  };
}
