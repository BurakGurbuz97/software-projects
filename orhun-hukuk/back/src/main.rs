extern crate actix;
extern crate actix_web;
extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate serde_derive;
extern crate crypto;
extern crate futures;
extern crate postgres;
extern crate uuid;
use actix::prelude::*;
use actix_web::middleware::{CookieSessionBackend, SessionStorage};
use actix_web::{server, App, fs::{NamedFile, StaticFiles}, http::Method, HttpRequest};
use postgres::{Connection, TlsMode};
mod db;
mod logic;
mod status;

use db::DbExecutor;

pub struct State {
    db: Addr<Syn, DbExecutor>,
}
fn main() {
    let sys = System::new("Orhun Hukuk");

    let addr = SyncArbiter::start(2, || DbExecutor {
        conn: Connection::connect(
            "postgres://postgres:asdasdfasd@127.0.0.1:5432/hukuk",
            TlsMode::None,
        ).expect("ERROR WHILE CONNECTING TO DATABASE"),
    });

    server::new(move || {
        vec![
            App::with_state(State { db: addr.clone() })
                .prefix("/api")
                .middleware(SessionStorage::new(
                    CookieSessionBackend::private(&[0; 32]).secure(false),
                ))
                .resource("/add-info", |r| r.method(Method::POST).with2(logic::add))
                .resource("/signup", |r| r.method(Method::POST).with2(logic::signup))
                .resource("/login", |r| r.method(Method::POST).with2(logic::login))
                .resource("/logout", |r| r.method(Method::GET).f(logic::logout))
                .resource("/check", |r| r.method(Method::POST).f(logic::check))
                .resource("/get-info", |r| r.method(Method::POST).with2(logic::get))
                .resource("/delete-info", |r| {
                    r.method(Method::POST).with2(logic::delete)
                })
                .resource("/get-user", |r| r.method(Method::GET).f(logic::get_user))
                .resource("/delete-user", |r| {
                    r.method(Method::POST).with2(logic::delete_user)
                }),
            App::with_state(State { db: addr.clone() })
                .handler("/static", StaticFiles::new("static"))
                .handler("/", index),
        ]
    }).bind("127.0.0.1:8080")
        .expect("server cannot bind to port")
        .start();

    println!("Server listening on port ... 127.0.0.1:8080");
    sys.run();
}

fn index(_req: HttpRequest<State>) -> Result<NamedFile, actix_web::Error> {
    Ok(NamedFile::open("static/index.html")?)
}
