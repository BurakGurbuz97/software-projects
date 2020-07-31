import axios from "axios";
import status from "./status";

const receiveUser = (user_id) => {
    return {
        type: "RECEIVE_USER",
        user_id
    };
    
};

const requestUser = () => {
    return {
        type: "REQUEST_USER"
    };
};

export const check = () => {
    return dispatch => {
        dispatch(requestUser());
        return axios.post("/api/check").then(res => {
            const user_id = res.data.user_id;
            
            dispatch(receiveUser(user_id));
        
        }).catch(err => {
            console.log(err);
        });
    }
}


export const login = (username,password,callback) => {
    return dispatch => {
        return axios.post("/api/login", {username, password}).then(res => {
            const stat = res.data.status;
            callback(stat);
            if (stat === status.SUCCESS) {
                dispatch(check())
            }
            
        }).catch(err => {
            console.log(err);
        })
    }
}

export const add = (info,callback) => {
    return dispatch => {
        return axios.post("/api/add-info", info).then(res => {
            const stat = res.data.status;
            callback(stat);
        }).catch(err => {
            console.log(err);
        })
    }
}

export const signup = (username,password,callback) => {
    return dispatch => {
        return axios.post("/api/signup", {username,password}).then(res => {
            const stat = res.data.status;
            callback(stat);
        }).catch(err => {
            console.log(err);
        })
    }
}
export const logout = () => {
    return dispatch => {
        return axios.get("/api/logout").then(res => {
            const stat = res.data.status;
            if (stat === 0) {
                dispatch(receiveUser(""))
            }
        }).catch(err => {
            console.log(err);
        })
    }
}

const receiveInfoList = (list) => {
    return {
        type: "RECEIVE_INFO_LIST",
        payload: list
    }
} 

export const get = (user_id, callback) => {
    return dispatch => {
        return axios.post("/api/get-info", {username: user_id}).then(res => {
            const list = res.data.list;
            const stat = res.data.status;
            callback(stat);
            dispatch(receiveInfoList(list));
        }).catch(err => {
            console.log(err);
        })
    }
}


export const delete_info = (info_id, callback) => {
    return dispatch => {
        return axios.post("/api/delete-info", {info_id}).then(res => {
            callback(status);
        }).catch(err => {
            console.log(err);
        })
    }
}

const receiveUserList = (list) => {
    return {
        type: "RECEIVE_USER_LIST",
        payload: list
    }
}

export const get_users = () => {
    return dispatch => {
        return axios.get("/api/get-user").then(res => {
            dispatch(receiveUserList(res.data.list))
        }).catch(err => {
            console.log(err);
        })
    }
}

export const delete_user = (username, password, callback) => {
    return dispatch => {
        return axios.post("/api/delete-user", {username, password}).then(res => {
            callback(res.data.status)
        }).catch(err => {
            console.log(err);
        })
    }
}