"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.read = (id) => {
  var found = db.prepare('SELECT * FROM word WHERE id = ?').get(id);
  if(found !== undefined) {
    return found;
  } else {
    return null;
  }
};

exports.create = function(word) {
  var id = db.prepare('INSERT INTO word ( key, video) VALUES ( @key, @video)').run(word).lastInsertRowid;
  return id;
}

exports.update = function(id, word) {
  var result = db.prepare('UPDATE word SET key = @key, video = @video WHERE id = ?').run(word, id);
  if(result.changes == 1) {
    return true;
  }
  return false;
}


exports.delete = function(id) {
  db.prepare('DELETE FROM word WHERE id = ?').run(id);
}

exports.search = (query,page) => {
  const num_per_page = 4;
  let  results ;
  query = query || "";
  page = parseInt(page || 1);
  var num_found = db.prepare('SELECT count(*) FROM word WHERE key LIKE ?').get('%' + query + '%')['count(*)'];
     results = db.prepare('SELECT id as entry, key, video FROM word WHERE key LIKE ? ORDER BY id LIMIT ? OFFSET ?').all('%' + query + '%', num_per_page, (page - 1) * num_per_page);
    return {
    results: results,
    num_found: num_found, 
    query: query,
    next_page: page + 1,
    previous_page : page - 1,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1,
  };
};


exports.login = function(name, password){

  let res =  db.prepare('SELECT id FROM account WHERE name = ? and password =  ?').get(name,password);

  if(res == undefined){
    return -1;
  }
  
  return res.id;
};


exports.getrole = function(id){

  let therole = db.prepare('SELECT role FROM account WHERE id =? ').get(id);

  if(therole == undefined){
    return -1;
  }
  
  return therole.role;
};

exports.new_user =  function(name, password,role, code){
  let newuser
  if(role == 'utilisateur' ||(role == 'admin' && code == '123')){
     newuser = db.prepare('INSERT INTO account (name,password,role) VALUES(?,?,?) ').run(name,password,role);
     return newuser.lastInsertRowid;
  }
      return null;
  
}
// exports.contact = function()
