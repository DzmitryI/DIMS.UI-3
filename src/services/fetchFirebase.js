import axios from 'axios';
import DisplayNotification from '../components/displayNotification';

const notification = new DisplayNotification();

export default class FetchFirebase {
  api_base = process.env.REACT_APP_API_BASE_FIREBASE;

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
    const response = await this.getSource(`/UserProfile.json`);
    let members = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userId, values] = key;
        members = members.concat({
          userId,
          ...values,
          fullName: `${values.name} ${values.lastName}`,
          checked: false,
        });
      });
    }
    return members;
  };

  getAllTask = async () => {
    const response = await this.getSource(`/Task.json`);
    let tasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [taskId, values] = key;
        const { name, description, startDate, deadlineDate } = values;
        tasks = tasks.concat({
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

  getTask = async (id) => {
    const response = await this.getSource(`/Task/${id}.json`);
    let tasks = [];
    if (response && response.data) {
      tasks = tasks.concat(response.data);
    }
    return tasks;
  };

  getAllUserTasks = async () => {
    const response = await this.getSource(`/UserTask.json`);
    let userTasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userTaskId, values] = key;
        const { taskId, userId, stateId } = values;
        userTasks = userTasks.concat({
          userTaskId,
          taskId,
          userId,
          stateId,
        });
      });
    }
    return userTasks;
  };

  getUserTask = async (id) => {
    const response = await this.getSource(`/UserTask/${id}.json`);
    if (response && response.data) {
      return response.data;
    }
  };

  getTaskState = async (id) => {
    const response = await this.getSource(`/TaskState/${id}.json`);
    return response;
  };

  getAllUserTaskTrack = async () => {
    const response = await this.getSource(`/TaskTrack.json`);
    let taskTrack = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [taskTrackId, values] = key;
        const { userTaskId, trackDate, trackNote } = values;
        taskTrack = taskTrack.concat({
          taskTrackId,
          userTaskId,
          trackDate,
          trackNote,
        });
      });
    }
    return taskTrack;
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
    return await this.setSource(`/UserProfile.json`, body);
  };

  setTask = async (body) => {
    return await this.setSource(`/Task.json`, body);
  };

  setUserTask = async (body) => {
    return await this.setSource(`/UserTask.json`, body);
  };

  setTaskState = async (body) => {
    return await this.setSource(`/TaskState.json`, body);
  };

  setTaskTrack = async (body) => {
    return await this.setSource(`/TaskTrack.json`, body);
  };

  editMember = async (memberId, body) => {
    return await this.editSource(`/UserProfile/${memberId}.json`, body);
  };

  editTask = async (taskId, body) => {
    return await this.editSource(`/Task/${taskId}.json`, body);
  };

  editTaskTrack = async (taskTrackId, body) => {
    return await this.editSource(`/TaskTrack/${taskTrackId}.json`, body);
  };

  editTaskState = async (taskId, body) => {
    return await this.editSource(`/TaskState/${taskId}.json`, body);
  };

  delMember = async (memberId) => {
    return await this.deleteSource(`/UserProfile/${memberId}.json`);
  };

  delTask = async (taskId) => {
    return await this.deleteSource(`/Task/${taskId}.json`);
  };

  delUserTask = async (userTaskId) => {
    return await this.deleteSource(`/UserTask/${userTaskId}.json`);
  };

  delTaskTrack = async (taskTrackId) => {
    return await this.deleteSource(`/TaskTrack/${taskTrackId}.json`);
  };

  delTaskState = async (taskStateId) => {
    return await this.deleteSource(`/TaskState/${taskStateId}.json`);
  };
}
