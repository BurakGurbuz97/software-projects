use State;
use actix_web::middleware::RequestSession;
use actix_web::{AsyncResponder, Either, Error, HttpRequest, HttpResponse, Json, Result};
use crypto::digest::Digest;
use crypto::sha2::Sha256;
use db;
use futures::Future;
use status;
use status::Status;
use uuid::Uuid;

fn sha(s: String) -> String {
    let mut hasher = Sha256::new();
    hasher.input_str(s.as_str());
    hasher.input_str("b6bfa8b1-0e6a-4c23-aefc-07d2203ed190");
    hasher.result_str().to_string()
}

#[derive(Serialize)]
pub struct StatusResponse {
    status: Status,
}

///----------------------------------INFO ADD-----------------------------------------///
#[derive(Deserialize)]
pub struct AddRequest {
    pub col1: String,
    pub col2: String,
    pub col3: String,
    pub col4: String,
    pub col5: String,
    pub col6: String,
    pub col7: String,
    pub col8: String,
    pub col9: String,
    pub username: String,
}

pub fn add(
    mut req: HttpRequest<State>,
    data: Json<AddRequest>,
) -> Either<Box<Future<Item = HttpResponse, Error = Error>>, Result<HttpResponse>> {
    let _auth = match req.session().get::<String>("user_id") {
        Ok(o) => match o {
            Some(s) => s,
            None => {
                return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
                    status: status::NOT_AUTHORIZED,
                })));
            }
        },
        Err(e) => return Either::B(Err(e)),
    };
    Either::A(
        req.state()
            .db
            .send(db::AddInfo {
                info_id: Uuid::new_v4().to_string(),
                col1: data.col1.clone(),
                col2: data.col2.clone(),
                col3: data.col3.clone(),
                col4: data.col4.clone(),
                col5: data.col5.clone(),
                col6: data.col6.clone(),
                col7: data.col7.clone(),
                col8: data.col8.clone(),
                col9: data.col9.clone(),
                user_id: sha(data.username.clone()),
            })
            .from_err()
            .and_then(move |res| {
                Ok(HttpResponse::Ok().json(StatusResponse {
                    status: match res {
                        status::SUCCESS => status::SUCCESS,
                        status::DB_ERR => status::DB_ERR,
                        _ => status::DB_ERR,
                    },
                }))
            })
            .responder(),
    )
}

///----------------------------------CREATE USER-----------------------------------------///
#[derive(Deserialize)]
pub struct CreateUserRequest {
    username: String,
    password: String,
}

pub fn signup(
    req: HttpRequest<State>,
    data: Json<CreateUserRequest>,
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    let id = sha(data.username.clone());
    req.state()
        .db
        .send(db::CreateUser {
            user_id: id.clone(),
            username: data.username.clone(),
            hash: sha(data.password.clone()),
        })
        .from_err()
        .and_then(move |res| Ok(HttpResponse::Ok().json(StatusResponse { status: res })))
        .responder()
}

///----------------------------------Login-----------------------------------------///
#[derive(Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

pub fn login(
    mut req: HttpRequest<State>,
    data: Json<LoginRequest>,
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    req.state()
        .db
        .send(db::Login {
            username: data.username.clone(),
            hash: sha(data.password.clone()),
        })
        .from_err()
        .and_then(move |res| match res {
            Ok(id) => {
                if id == "" {
                    Ok(HttpResponse::Ok().json(StatusResponse {
                        status: status::WRONG_CREDENTIALS,
                    }))
                } else {
                    req.session().set("user_id", id.clone())?;
                    Ok(HttpResponse::Ok().json(StatusResponse {
                        status: status::SUCCESS,
                    }))
                }
            }
            Err(_) => Ok(HttpResponse::Ok().json(StatusResponse {
                status: status::DB_ERR,
            })),
        })
        .responder()
}

///----------------------------------Logout-----------------------------------------///

pub fn logout(mut req: HttpRequest<State>) -> Json<StatusResponse> {
    req.session().clear();

    Json(StatusResponse {
        status: status::SUCCESS,
    })
}

///----------------------------------Check-----------------------------------------///
#[derive(Serialize)]
pub struct IdResponse {
    user_id: String,
    status: Status,
}

pub fn check(mut req: HttpRequest<State>) -> Result<Json<IdResponse>, Error> {
    let mut user_id = String::from("");
    let mut stat = status::SUCCESS;
    if let Some(id) = req.session().get::<String>("user_id")? {
        user_id = id;
    } else {
        stat = status::NOT_AUTHORIZED;
    }

    Ok(Json(IdResponse {
        user_id,
        status: stat,
    }))
}
///----------------------------------GET USERS-----------------------------------------///
#[derive(Serialize)]
pub struct UserList {
    status: Status,
    list: Vec<String>,
}

pub fn get_user(
    mut req: HttpRequest<State>,
) -> Either<Box<Future<Item = HttpResponse, Error = Error>>, Result<HttpResponse>> {
    let auth = match req.session().get::<String>("user_id") {
        Ok(o) => match o {
            Some(s) => s,
            None => {
                return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
                    status: status::NOT_AUTHORIZED,
                })));
            }
        },
        Err(e) => return Either::B(Err(e)),
    };
    if auth != "590c38672d67f4c45ae98280127bdc8e602f519ba669e219ae07bc3cac0ae873" {
        return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
            status: status::NOT_AUTHORIZED,
        })));
    }

    Either::A(
        req.state()
            .db
            .send(db::GetUsers)
            .from_err()
            .and_then(move |res| match res {
                Ok(array) => Ok(HttpResponse::Ok().json(UserList {
                    status: status::SUCCESS,
                    list: array,
                })),
                Err(e) => {
                    println!("{:?}", e);
                    Ok(HttpResponse::Ok().json(UserList {
                        status: status::DB_ERR,
                        list: vec![],
                    }))
                }
            })
            .responder(),
    )
}

///----------------------------------GET INFO-----------------------------------------///
#[derive(Deserialize)]
pub struct GetRequest {
    username: String,
}

#[derive(Serialize)]
pub struct InfoList {
    status: Status,
    list: Vec<db::Info>,
}

pub fn get(
    mut req: HttpRequest<State>,
    data: Json<GetRequest>,
) -> Either<Box<Future<Item = HttpResponse, Error = Error>>, Result<HttpResponse>> {
    let auth = match req.session().get::<String>("user_id") {
        Ok(o) => match o {
            Some(s) => s,
            None => {
                return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
                    status: status::NOT_AUTHORIZED,
                })));
            }
        },
        Err(e) => return Either::B(Err(e)),
    };

    Either::A(
        req.state()
            .db
            .send(db::GetInfo {
                user_id: if data.username == "client" {
                    auth
                } else {
                    sha(data.username.clone())
                },
            })
            .from_err()
            .and_then(move |res| match res {
                Ok(array) => Ok(HttpResponse::Ok().json(InfoList {
                    status: status::SUCCESS,
                    list: array,
                })),
                Err(e) => {
                    println!("{:?}", e);
                    Ok(HttpResponse::Ok().json(InfoList {
                        status: status::DB_ERR,
                        list: vec![],
                    }))
                }
            })
            .responder(),
    )
}

///----------------------------------DELETE INFO-----------------------------------------///
#[derive(Deserialize)]
pub struct DeleteRequest {
    pub info_id: String,
}

pub fn delete(
    mut req: HttpRequest<State>,
    data: Json<DeleteRequest>,
) -> Either<Box<Future<Item = HttpResponse, Error = Error>>, Result<HttpResponse>> {
    let _auth = match req.session().get::<String>("user_id") {
        Ok(o) => match o {
            Some(s) => s,
            None => {
                return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
                    status: status::NOT_AUTHORIZED,
                })));
            }
        },
        Err(e) => return Either::B(Err(e)),
    };

    Either::A(
        req.state()
            .db
            .send(db::DeleteInfo {
                info_id: data.info_id.clone(),
            })
            .from_err()
            .and_then(move |res| {
                Ok(HttpResponse::Ok().json(StatusResponse {
                    status: match res {
                        Ok(_) => status::SUCCESS,
                        Err(_) => status::DB_ERR,
                    },
                }))
            })
            .responder(),
    )
}
///----------------------------------DELETE INFO-----------------------------------------///
#[derive(Deserialize)]
pub struct DeleteUserRequest {
    pub username: String,
    pub password: String,
}

pub fn delete_user(
    mut req: HttpRequest<State>,
    data: Json<DeleteUserRequest>,
) -> Either<Box<Future<Item = HttpResponse, Error = Error>>, Result<HttpResponse>> {
    let auth = match req.session().get::<String>("user_id") {
        Ok(o) => match o {
            Some(s) => s,
            None => {
                return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
                    status: status::NOT_AUTHORIZED,
                })))
            }
        },
        Err(e) => return Either::B(Err(e)),
    };

    if auth != "590c38672d67f4c45ae98280127bdc8e602f519ba669e219ae07bc3cac0ae873" {
        return Either::B(Ok(HttpResponse::Ok().json(StatusResponse {
            status: status::NOT_AUTHORIZED,
        })));
    }

    Either::A(
        req.state()
            .db
            .send(db::DeleteUser {
                user_id: sha(data.username.clone()),
                hash: sha(data.password.clone()),
            })
            .from_err()
            .and_then(move |res| {
                Ok(HttpResponse::Ok().json(StatusResponse {
                    status: match res {
                        Ok(o) => o,
                        Err(_) => status::DB_ERR,
                    },
                }))
            })
            .responder(),
    )
}
