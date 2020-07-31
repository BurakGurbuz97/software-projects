pub type Status = i32;

pub const SUCCESS: Status = 0;
pub const WRONG_CREDENTIALS: Status = 1;
pub const NOT_AUTHORIZED: Status = 2;
pub const DB_ERR: Status = 3;
pub const USERNAME_TAKEN: Status = 4;
