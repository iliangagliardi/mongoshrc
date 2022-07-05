//https://www.npmjs.com/package/cli-color
const cli = require('cli-color');

String.prototype.toDate = function () {
  return new Date(parseInt(this.substring(0, 8), 16) * 1000);
};

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

randomUUID = function(){return(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,function(){return(0|Math.random()*16).toString(16)})}


randomDate = function (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

randomString = function (n) {
  var length = n;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


randomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


randomList = function (arr) {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];;
  } else {
    return "argument must be an array"
  }
}

randomText = function (nwords) {
  const text = "a wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. when, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the almighty, who formed us in his own image, and the breath"
  var textArray = text.split(" ");
  var ret = "";
  var t = 0;
  for (t = 1; t <= nwords; t++) {
    ret += textArray[Math.floor(Math.random() * textArray.length)];
    if (t < nwords) ret += " ";
  }
  return ret;
}



// https://www.npmjs.com/package/cli-color
// only compatible with mongosh, for legacy shell use just print() instead of console.log
// npm install cli-color
checkRS = function () {
  var st = rs.status(), cfg = rs.config(), nn = 0;
  st.members.forEach(s => {
    var tags = JSON.stringify(cfg.members[nn].tags);
    console.log(cli.white.bgGreen.bold(`Host ${s.name}`));
    console.log(cli.yellow(`\tpriority ${cfg.members[nn].priority} | votes ${cfg.members[nn].votes} | health: ${s.health} | ${s.stateStr}`));
    console.log(cli.white(`\ttags:${tags}`));
    nn++;
  });
}


dr = function () {
  var st = rs.status();
  var cfg = rs.config();
  st.members.forEach(s => {
    if (s.health == 0) {
      for (var i = 0; i < cfg.members.length; i++) {
        if (cfg.members[i]._id == s._id) {
          cfg.members[i].votes = 0;
          cfg.members[i].priority = 0;
        }
      }
    } else {
      for (var i = 0; i < cfg.members.length; i++) {
        if (cfg.members[i]._id == s._id) {
          cfg.members[i].votes = 1;
          cfg.members[i].priority = 1;
        }
      }
    }
  });
  rs.reconfig(cfg, { force: true });
  print(`Replica set ${rs.status().set} reconfigured. The new write majority count is ${rs.status().writeMajorityCount}`)
};



deleteAllDBs = function (){
  db.getMongo().getDBs().databases.forEach(function (thisDb) {db.getSiblingDB(thisDb.name).dropDatabase()})
}


indexStats = function () {
  var excludeDB = ['admin', 'config', 'local'];
  db.getMongo().getDBs().databases.forEach(function (thisDb) {
    if (excludeDB.indexOf(thisDb.name) == -1) {
      print(`================================================================================================`)
      print(`| Database '${thisDb.name}'`)
      print(`================================================================================================`)
      db.getSiblingDB(thisDb.name).getCollectionNames().forEach(function (coll) {

        try {
          print(`|\tCollection '${coll}' - Total Index size ${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().totalIndexSize / 1024) / 1024).toFixed(2)} in MB`);
          db.getSiblingDB(thisDb.name).getCollection(coll).aggregate([{
            $indexStats: {}
          }, {
            $sort: {
              "accesses.ops": 1
            }
          }]).forEach(function (idx) {
            print(`|\t\t index '${idx.name}'`);
            print(`|\t\t\t accessed ${idx.accesses.ops} times, since ${idx.accesses.since}`);
            print(`|\t\t\t is ${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().indexSizes[idx.name] / 1024) / 1024).toFixed(2)} MB big`)
            print(`|\t\t\t detected defragmentation ${db.getSiblingDB(thisDb.name).getCollection(coll).stats({ indexDetails: true }).indexDetails[idx.name]["block-manager"]["file bytes available for reuse"]} bytes`);
          });
        } catch (err) {
          // when the exception occurs it is because a view or profiler collection
          print(err)
        }
      })
    }
  })
}


indexSize = function () {
  let div = 1024 * 1024;
  var total = 0,
    dbnames = function () {
      var r = db.adminCommand({
        listDatabases: 1
      });
      if (!r || r.databases === undefined) {
        return [];
      };
      return r.databases.map(n => n.name).filter(name => name !== "admin" && name !== "config" && name !== "local");
    };
  dbl = dbnames();
  for (var i = 0; i < dbl.length; i++) {
    var s = db.getSiblingDB(dbl[i]).stats();
    if (!s) continue;
    total += Number(s.indexSize ? s.indexSize : 0);
  }
  return Math.round(total / div) + ' MB';
}

oplogSize = function(){
  let div = 1024 * 1024;
  totalSize=Math.round(db.getSiblingDB("local").oplog.rs.stats().maxSize/div)
  print(`This cluster oplog size is ${totalSize} MB`)
}



// produces dummy documents for testing, it's slow
loadDummy = function(n,t){
  // db.foo.drop();
  for (i=0;i<n;i++){
    let a = db.foo.insertOne({
      "a":i, 
      "b":randomString(12), 
      "c": randomNumber(0,100), 
      "d":new ISODate(),
      "e":randomText(500),
      "f":randomList(["A","B","C","D"]),
      "g":"".padEnd(100)}); 
    if (t!=null){
      let d = new Date();
      print(`doc #${i} ${a.insertedId} ${d.toISOString().split('T')[1]}`);
      sleep(t);
    }
  }
}


