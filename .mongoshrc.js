//https://www.npmjs.com/package/cli-color
const cli = require('cli-color');
const { exit } = require('process');


ObjectId.prototype.toDate=function(){
  return new Date(parseInt(this.toJSON().substring(0, 8), 16) * 1000);
}

String.prototype.toDate = function () {
  return new Date(parseInt(this.substring(0, 8), 16) * 1000);
};

Date.prototype.toObjectId = function () {
  return new ObjectId(Math.floor(this.getTime() / 1000).toString(16) + "0000000000000000");
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}

Date.prototype.addMinutes = function (mm) {
  this.setTime(this.getTime() + (mm * 60 * 1000));
  return this;
}

Date.prototype.getStringDate = function () {
  return this.toISOString().split('T')[0];
}

Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}

getDates = function (startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

addLeadingZeros = function (num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

roundNum = function (num) {
  Math.round(num * 100) / 100
}

randomUUID = function () { return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0/g, function () { return (0 | Math.random() * 16).toString(16) }) }


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

randomStringWithPattern = function (n, characters) {
  var length = n;
  var result = '';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

randomDouble = function (min, max) {
  return Double((Math.random() * (max - min) + min).toFixed(2));
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

randomMongoDBGeoCoords = function (lat, long) {
  let coord = []
  coord.push(randomDoubleFixedN(lat, (lat + randomDouble(-2.02, -3.05)), 6))
  coord.push(randomDoubleFixedN(long, (long + randomDouble(1.01, 2.05)), 6))
  return coord;
}


checkRS = function () {
  var st = rs.status(), cfg = rs.config(), nn = 0;
  st.members.forEach(s => {
    var tags = JSON.stringify(cfg.members[nn].tags);
    console.log(`Host ${s.name}`);
    console.log(`\tpriority ${cfg.members[nn].priority} | votes ${cfg.members[nn].votes} | health: ${s.health} | ${s.stateStr}`);
    console.log(`\ttags:${tags}`);
    nn++;
  });
}

// https://www.npmjs.com/package/cli-color
// only compatible with mongosh, for legacy shell use just print() instead of console.log
// npm install cli-color
checkRSc = function () {
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



deleteAllDBs = function () {
  var dbnames = function () {
    var r = db.adminCommand({
      listDatabases: 1
    });
    if (!r || r.databases === undefined) {
      return [];
    };
    return r.databases.map(n => n.name).filter(name => name !== "admin" && name !== "config" && name !== "local");
  };
  dbl = dbnames();
  dbl.forEach(function (thisDb) { db.getSiblingDB(thisDb).dropDatabase() })
}


//a=db.getCollectionInfos({name:"fooView"} )
//a[0]['options']['viewOn']

// export csv
colls = function (path) {
  // header
  let collInfo = 'Database;Collection;Data size MB;Storage size MB;Avg obj size KB;Index size MB\n';
  let excludeDB = ['admin', 'config', 'local'];
  db.getMongo().getDBs().databases.forEach(function (thisDb) {
    if (excludeDB.indexOf(thisDb.name) == -1) {
      db.getSiblingDB(thisDb.name).getCollectionNames().forEach(function (coll) {
        try {
          let cc = db.getSiblingDB(thisDb.name).getCollectionInfos({ name: coll })
          if (cc[0]['options']['viewOn']) {
            // it's a view
          } else if (coll.startsWith("system.")) {
            // it's a system collection
          } else {
            // it's a collection
            collInfo += `${thisDb.name};${coll};`

            if (db.getSiblingDB(thisDb.name).getCollection(coll).stats().totalSize){
              collInfo += `${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().totalSize / 1024) / 1024).toFixed(2)};`
            }  else {
              // 4.2
              collInfo += `${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().size / 1024) / 1024).toFixed(2)};`
            }
            collInfo += `${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().storageSize / 1024) / 1024).toFixed(2)};`
            collInfo += `${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().avgObjSize / 1024)).toFixed(2)};`
            collInfo += `${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().totalIndexSize / 1024) / 1024).toFixed(2)}\n`
            // print(collInfo)
          }
        } catch (err) {
          print('err:' + err)
        }
      });
    }
  })
  fs.writeFile(path, collInfo, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved! I am exiting shell");
    process.exit(1);
  });
}



oplog = function () {
  let div = 1000 * 1000 * 1000;
  let oplogSize = db.getSiblingDB('local').getCollection('oplog.rs').stats().size;
  print(`size ${(oplogSize / div).toFixed(2)} GB`)
  print(`max size ${(db.getSiblingDB('local').getCollection('oplog.rs').stats().maxSize / div).toFixed(2)} GB`)

  let firstOp, cc = db.getSiblingDB('local').getCollection('oplog.rs').find({}, { op: 1, wall: 1 }).sort({ $natural: 1 }).limit(1);
  cc.forEach(function (doc) { firstOp = doc.wall; })
  print(`first operation ${firstOp}`)

  let lastOp, cc2 = db.getSiblingDB('local').getCollection('oplog.rs').find({}, { op: 1, wall: 1 }).sort({ $natural: -1 }).limit(1);
  cc2.forEach(function (doc) { lastOp = doc.wall; })
  print(`last operation ${lastOp}`)

  let mstime = (lastOp.getTime() - firstOp.getTime()) / (60 * 60 * 1000);
  let oplogGBhr = (oplogSize / (mstime));
  print(`Oplog GB/Hour ${(oplogGBhr / div).toFixed(4)}`);

  // GB/hr is calculated as <size of oplog>/(<end time>-<start time>) 
}


indexStats = function () {
  var excludeDB = ['admin', 'config', 'local'];
  db.getMongo().getDBs().databases.forEach(function (thisDb) {
    if (excludeDB.indexOf(thisDb.name) == -1) {
      print(`|================================================================================================`)
      print(`| Database '${thisDb.name}'`)
      print(`|================================================================================================`)
      db.getSiblingDB(thisDb.name).getCollectionNames().forEach(function (coll) {
        try {
          print(`|\tCollection '${coll}' - Total Index size ${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().totalIndexSize / 1024) / 1024).toFixed(2)} in MB`);
          db.getSiblingDB(thisDb.name).getCollection(coll).aggregate([
            { $indexStats: {} },
            { $sort: { "name": 1, "accesses.ops": -1 } }
          ]).forEach(function (idx) {
            print(`|\t\t index '${idx.name}'`);
            print(`|\t\t\t accessed ${idx.accesses.ops} times, since ${idx.accesses.since}`);
            print(`|\t\t\t is ${((db.getSiblingDB(thisDb.name).getCollection(coll).stats().indexSizes[idx.name] / 1024) / 1024).toFixed(2)} MB big`)
            print(`|\t\t\t detected defragmentation ${db.getSiblingDB(thisDb.name).getCollection(coll).stats({ indexDetails: true }).indexDetails[idx.name]["block-manager"]["file bytes available for reuse"]} bytes`);
            print(`|\t\t\t bytes currently in cache ${db.getSiblingDB(thisDb.name).getCollection(coll).stats({ indexDetails: true }).indexDetails[idx.name]["cache"]["bytes currently in the cache"]} bytes`);
            if (idx.spec.expireAfterSeconds) {
              print(`|\t\t\t TTL index expireAfterSeconds:${idx.spec.expireAfterSeconds}`);
            }
            print(`|\t\t\t fields ${JSON.stringify(idx.spec.key)}`);

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




// produces dummy documents for testing
loadDummy = function (dbName, collName, numberOfDocuments, commitEveryNDocs, dropCollection) {
  if (dropCollection) {
    console.log(`dropping ${dbName}.${collName}`);
    db.getSiblingDB(dbName).getCollection(collName).drop()
  }
  if ((numberOfDocuments % commitEveryNDocs) > 0) { console.log(`commitEveryNDocs (${commitEveryNDocs}) must divide numberOfDocuments (${numberOfDocuments}) perfectly`); return; }

  let docs = [], batch = commitEveryNDocs;
  for (n = 1; n <= numberOfDocuments; n++) {

    docs.push(genDummyDoc2(n));
    if (docs.length == batch) {
      db.getSiblingDB(dbName).getCollection(collName).insertMany(docs, { ordered: false, writeConcern: { w: 0, j: false } });
      console.log(`loaded ${n} docs in ${dbName}.${collName}`)
      docs = []
    }

  }
}



genDummyDoc = function (x) {
  return {
    "a": x,
    "b": randomString(12),
    "c": randomNumber(0, 100),
    "d": new ISODate(),
    "e": randomText(500),
    "f": randomList(["A", "B", "C", "D"]),
  }
}


genDummyDoc2 = function (x) {
  const dt = new ISODate();
  const expdt = dt.addDays(randomNumber(120, 1000));
  const year = expdt.getFullYear();

  return {
    "_id": randomUUID(),
    "name": randomString(10),
    "description": randomText(200),
    "category": randomList(["A", "B", "C", "D", "E", "F", "F"]),
    "createdAt": dt,
    "updatedAt": dt,
    "expiresAt": expdt,
    "expirationYear": year,
    "attributes": [
      { "key": randomString(5), "value": randomString(15) },
      { "key": randomString(5), "value": randomNumber(1, 10000) }
    ],
    "subDocument": {
      "subField1": randomString(10),
      "subField2": randomNumber(1, 100)
    }
  }
}





// mongosh --nodb
let source = "mongodb://ilian:Password.@mongo1/?replicaSet=testRS";
let destination = "mongodb+srv://ilian:Password.@migration.nkjj0.mongodb.net";

dataValidation = function (database, collection, checkNDocs, source, destination) {
  // how many document to sample and match between the two clusters
  let found = 0;
  // connect to the source cluster
  // connect and select random documents from a specific collection on the source cluster
  db = new Mongo(source).getDB(database);
  let sourceIds = db.getCollection(collection).aggregate([{ "$sample": { "size": checkNDocs } }, { "$project": { "a": 1 } }])
  // connect to the destination and search for selected documents
  db = new Mongo(destination).getDB(database);
  sourceIds.forEach(__doc => {
    // comment the print part if you don't want to see the output of every single found document
    let doc = db.getCollection(collection).find({ "_id": __doc["_id"], "a": __doc["a"] }, { "_id": 1, "a": 1 })
    if (doc) {
      print(doc);
      found++;
    }
  });
  // output
  if (found == checkNDocs) {
    print(`All ${checkNDocs} sampled documents in ${database}.${collection} were found on the destination cluster`)
  } else {
    print(`Data validation failed. Only ${found} documents in ${database}.${collection} were found on the destination cluster`)
  }
}

