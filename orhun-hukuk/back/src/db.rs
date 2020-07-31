use actix::prelude::*;
use postgres::{Connection, Error};

use status;
use status::Status;

pub struct DbExecutor {
    pub conn: Connection,
}

impl Actor for DbExecutor {
    type Context = SyncContext<Self>;
}

///-------------------------------AddInfo--------------------------------------------///
#[derive(Debug)]
pub struct AddInfo {
    pub info_id: String,
    pub col1: String,
    pub col2: String,
    pub col3: String,
    pub col4: String,
    pub col5: String,
    pub col6: String,
    pub col7: String,
    pub col8: String,
    pub col9: String,
    pub user_id: String,
}

impl Message for AddInfo {
    type Result = Status;
}

impl Handler<AddInfo> for DbExecutor {
    type Result = Status;

    fn handle(&mut self, msg: AddInfo, _: &mut Self::Context) -> Self::Result {
        match self.conn.execute("INSERT INTO info (info_id, col1, col2, col3, col4, col5, col6, col7, col8, col9, user_id)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", &[&msg.info_id, &msg.col1, &msg.col2, &msg.col3, &msg.col4, &msg.col5, &msg.col6, &msg.col7,&msg.col8,&msg.col9,&msg.user_id])
		{
			Ok(_) => status::SUCCESS,
			Err(_) => status::DB_ERR
		}
    }
}

///-------------------------------CreateUser--------------------------------------------///

pub struct CreateUser {
    pub user_id: String,
    pub username: String,
    pub hash: String,
}

impl Message for CreateUser {
    type Result = Status;
}

impl Handler<CreateUser> for DbExecutor {
    type Result = Status;
    fn handle(&mut self, msg: CreateUser, _: &mut Self::Context) -> Self::Result {
        let res = self.conn.execute(
            "INSERT INTO users (user_id, username, hash)
		VALUES ($1,$2,$3)",
            &[&msg.user_id, &msg.username, &msg.hash],
        );

        match res {
            Ok(_) => status::SUCCESS,
            Err(e) => match e.code() {
                Some(c) => {
                    if c.code() == "23505" {
                        status::USERNAME_TAKEN
                    } else {
                        status::DB_ERR
                    }
                }
                None => status::DB_ERR,
            },
        }
    }
}

///-------------------------------LOGIN--------------------------------------------///
pub struct Login {
    pub username: String,
    pub hash: String,
}

impl Message for Login {
    type Result = Result<String, Error>;
}

impl Handler<Login> for DbExecutor {
    type Result = Result<String, Error>;

    fn handle(&mut self, msg: Login, _: &mut Self::Context) -> Self::Result {
        if let Some(row) = self.conn
            .query(
                "SELECT user_id FROM users Where username = $1 AND hash = $2",
                &[&msg.username, &msg.hash],
            )?
            .iter()
            .next()
        {
            return Ok(row.get(0));
        }
        Ok("".to_string())
    }
}

///-------------------------------GET INFO--------------------------------------------///
#[derive(Serialize)]
pub struct Info {
    pub info_id: String,
    pub col1: String,
    pub col2: String,
    pub col3: String,
    pub col4: String,
    pub col5: String,
    pub col6: String,
    pub col7: String,
    pub col8: String,
    pub col9: String,
    pub user_id: String,
}

pub struct GetInfo {
    pub user_id: String,
}

impl Message for GetInfo {
    type Result = Result<Vec<Info>, Error>;
}

impl Handler<GetInfo> for DbExecutor {
    type Result = Result<Vec<Info>, Error>;

    fn handle(&mut self, msg: GetInfo, _: &mut Self::Context) -> Self::Result {
        let mut arr: Vec<Info> = vec![];
        for row in &self.conn
            .query("SELECT * FROM info WHERE user_id = $1", &[&msg.user_id])?
        {
            arr.push(Info {
                info_id: row.get(0),
                col1: row.get(1),
                col2: row.get(2),
                col3: row.get(3),
                col4: row.get(4),
                col5: row.get(5),
                col6: row.get(6),
                col7: row.get(7),
                col8: row.get(8),
                col9: row.get(9),
                user_id: row.get(10),
            });
        }
        Ok(arr)
    }
}
///-------------------------------GET USERS--------------------------------------------///
pub struct GetUsers;

impl Message for GetUsers {
    type Result = Result<Vec<String>, Error>;
}

impl Handler<GetUsers> for DbExecutor {
    type Result = Result<Vec<String>, Error>;

    fn handle(&mut self, _msg: GetUsers, _: &mut Self::Context) -> Self::Result {
        let mut arr: Vec<String> = vec![];
        for row in &self.conn.query("SELECT username FROM users", &[])? {
            arr.push(row.get(0));
        }
        Ok(arr)
    }
}

///-------------------------------DELETE INFO--------------------------------------------///
pub struct DeleteInfo {
    pub info_id: String,
}

impl Message for DeleteInfo {
    type Result = Result<Status, Error>;
}

impl Handler<DeleteInfo> for DbExecutor {
    type Result = Result<Status, Error>;

    fn handle(&mut self, msg: DeleteInfo, _: &mut Self::Context) -> Self::Result {
        let _row = self.conn
            .execute("DELETE FROM info WHERE info_id = $1", &[&msg.info_id])?;
        Ok(status::SUCCESS)
    }
}

///-------------------------------DELETE User--------------------------------------------///
pub struct DeleteUser {
    pub user_id: String,
    pub hash: String,
}

impl Message for DeleteUser {
    type Result = Result<Status, Error>;
}

impl Handler<DeleteUser> for DbExecutor {
    type Result = Result<Status, Error>;

    fn handle(&mut self, msg: DeleteUser, _: &mut Self::Context) -> Self::Result {
        let row = self.conn.execute(
            "DELETE FROM users WHERE user_id = $1 AND hash = $2",
            &[&msg.user_id, &msg.hash],
        )?;

        if row == 1 {
            return Ok(status::SUCCESS);
        }
        Ok(status::NOT_AUTHORIZED)
    }
}
