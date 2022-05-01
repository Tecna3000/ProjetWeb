"use strict"

const fs = require('fs');
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

let entries = JSON.parse(fs.readFileSync('/amuhome/r20031646/Documents/ProjetWeb/lsf-data-master/vocabulaire.json').toString());

let load = function(filename) {

  const words = JSON.parse(fs.readFileSync(filename));

  db.prepare('DROP TABLE IF EXISTS word').run();
  db.prepare('DROP TABLE IF EXISTS account').run();
 
  db.prepare('CREATE TABLE word(id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, video TEXT)').run();
  db.prepare('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, role TEXT)').run();

  db.prepare("INSERT INTO account (name,password,role) VALUES ('meriem', 'm123', 'admin')").run();
  db.prepare("INSERT INTO account (name,password,role) VALUES ('marie', 'm456', 'user')").run();
  let insert1 = db.prepare('INSERT INTO word VALUES (@id, @key, @video)');
  db.prepare("DELETE from account ")

  
  let transaction = db.transaction((words) => {

    for(let id = 0;id < words.length; id++) {
      let word = words[id];
      word.id = id;
      insert1.run(word);
    }
  });

  transaction(words);
}

load('../lsf-data-master/vocabulaire.json');