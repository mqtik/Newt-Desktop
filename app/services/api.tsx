import React, { Component } from 'react'


import moment from 'moment';

import PouchDB from 'pouchdb-browser'

import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import _ from 'lodash'
import Search from 'pouchdb-quick-search'
import {parse, parseDefaults} from 'himalaya'
//import DBDebug from 'pouchdb-debug';

import { getLang, getLangString, Languages } from '../static/languages.tsx';

 PouchDB.plugin(APIAuth)
 .plugin(APIFind)
 .plugin(Search)
 .plugin(APIUpsert);




const API_CHAPTERS = process.env.API_URL+'/'+process.env.LOCAL_DB_CHAPTERS;
const API_DRAFTS = process.env.API_URL+'/'+process.env.LOCAL_DB_DRAFTS;
//import clone/node editor

class API {
  constructor(options){
    
    //console.log("Constructing API", getLangString())
    

    this.endpoints = {};
    this.access_token = null;
    this.Auth = this.Auth.bind();
    this.Work = this.Work.bind();
    this.Sync = this.Sync.bind();
    this.Notifications = this.Notifications.bind();
    //const _this = this;
    //console.log("Functions from API", this)
    
    //this.Authorize = this.Auth.bind(this);

    this.ApplicationSettings = PouchDB(process.env.SETTINGS_LOCAL_DB_NAME, {skip_setup: true});

    this.RemoteStorage = PouchDB(process.env.API_URL+'/_users', {
                      fetch(url, opts){

                          opts.credentials='include'
                          return PouchDB.fetch(url, opts)
                        },
                        skip_setup:true

                     });

   // this.Auth().getCredentials().then(k => {
     // console.log("constructor credenntials", k)
      this.RemoteDrafts = PouchDB(process.env.API_URL+'/'+process.env.LOCAL_DB_DRAFTS,{
        skip_setup:true, 
       // auth: {username: k.user, password: k.pass}
      });
      this.RemoteChapters = PouchDB(process.env.API_URL+'/'+process.env.LOCAL_DB_CHAPTERS,{
        fetch(url, opts){
                        //console.log("FETCH API", url, opts)
                          //opts.credentials='include'
                          //opts.headers.set("Authorization", 'Basic ' + window.btoa(k.name + ':' + k.password));
                          //console.log("Authorization", 'Basic ' + window.btoa(k.name + ':' + k.password))
                          return PouchDB.fetch(url, opts)
                        },
        skip_setup:true, 
        //auth: {username: k.user, password: k.pass}
      });
  //  })
  

   this.ApplicationStorage = PouchDB(process.env.LOCAL_DB_NAME, {skip_setup: true, revs_limit: 1, auto_compaction: true});


    //PouchDB.plugin(DBDebug);

    //PouchDB.debug.enable('*');
    // LocalDrafts
   this.ApplicationPublished = PouchDB(process.env.LOCAL_DB_PUBLIC, {skip_setup: true, auto_compaction: true});

   this.ApplicationUsers = PouchDB(process.env.LOCAL_DB_USERS, {skip_setup: true, auto_compaction: true});

    //let RemotePublished = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+LOCAL_DB_PUBLIC, {skip_setup: true, auto_compaction: true});

   this.ApplicationDrafts = PouchDB(process.env.LOCAL_DB_DRAFTS,{});
    // this.RemoteDrafts


    //LocalChapters
   this.ApplicationChapters = PouchDB(process.env.LOCAL_DB_CHAPTERS, {});

   this.ApplicationNotifications = PouchDB(process.env.LOCAL_DB_NOTIFICATIONS, {auto_compaction: true});


    //this.RemoteChapters

    //PouchDB.debug.enable('pouchdb:find');
   this.OpenedWorks = PouchDB('this.OpenedWorks', {skip_setup: true, revs_limit: 1, auto_compaction: true,});

   /*this.ajaxOpts = {
      ajax: {
        headers: {
          Authorization: 'Basic ' + window.btoa(user.name + ':' + user.password)
        }
      }
    };*/
  }

  Public = () => {
    return {
      all: async() => {
        let d = await(this.ApplicationPublished.allDocs({
                  include_docs: true,
                  attachments: false,
                }));
        //console.log("[ALL PUBLIC]", d)
            //console.log("[drafts get all] user", k)
            //console.log("[drafts get all] all docs", d)
        let r = d.rows.map(function (row) {
            return row.doc;
           });

        //console.log("CONSOLE OF!", r)
        
        //console.log("user ids!", uIDs)
        let indexedRow = _.findIndex(r, ['_id', '_design/publicSync']);
        r.splice(indexedRow, 1);
       // console.log("PUBLIC", r)


        return r.splice(0,900);
      },
      replicateFrom: async() => {

        let k = await(this.Auth().getLoggedUser());

       // console.log("replicate user", k)
        let getIndexes = await this.RemoteDrafts.getIndexes().catch(e => null);
       // console.log("get indexes!", getIndexes)
        if(getIndexes != null){
          let indexOfIndex = _.findIndex(getIndexes.indexes, ['ddoc', '_design/publicFirstHit']);
         // console.log("index o first f!", indexOfIndex)
         if(indexOfIndex == -1){
            let indexx = await(this.RemoteDrafts.createIndex({
                            index: {fields: ['_id', 'status', 'language']},
                            ddoc: "publicFirstHit"
                          })).catch(e => null);

            getIndexes = await this.RemoteDrafts.getIndexes().catch(e => null);
            indexOfIndex = _.findIndex(getIndexes.indexes, ['ddoc', '_design/publicFirstHit']);
                     //   console.log("index reloaded!", indexOfIndex)
          }


             
            
              if(indexOfIndex > -1){
               //// console.log("index of !", indexOfIndex, getIndexes.indexes[indexOfIndex])
            
             let query = await(this.RemoteDrafts.find({

                              fields: ['_id', 'status', 'title', 'language', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'colors', 'author', 'description', 'original_published_date'],
                              selector: {
                                status: "public",
                                
                                language: getLangString()
                                
                              },
                              limit: 901,
                              use_index: 'publicFirstHit'

                            }));

             let u = await(this.ApplicationPublished.bulkDocs(query.docs));

              //console.log("query of!", query)
              return true;
            }

        } else {
          let index = {
            "_id": "_design/publicSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_status": "function (doc, req) {return doc.status === req.query.status;}",
              "by_status_and_language": "function (doc, req) {return doc.status == req.query.status && doc.language === req.query.language;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };


        let pI = await this.ApplicationPublished.put(index).catch(e => null);
        let pID = await this.ApplicationDrafts.put(index).catch(e => null);
        //let pIDR = await RemotePublished.put(index).catch(e => null);

        let dpIDR = await this.RemoteDrafts.put(index).catch(e => null);

        let optPublished = {
                 live: false,
                 retry: true,
                 batch_size: 100,
                 filter: 'publicSync/by_status_and_language',
                 query_params: { "status": "public", "language": getLangString() }
              };
               /* function myMapFunction(doc) {
                  if (doc.status === 'public') {
                    
                      emit(doc);
                    
                  }
                }*/

              

             
            let rep = await(this.ApplicationPublished.replicate.from(this.RemoteDrafts, optPublished));

            rep.cancel();
            
           /*await(this.RemoteDrafts.query('publicSync/by_status_and_language', {
                                    limit: 0
                                  }))

            let remotePub = await(this.RemoteDrafts.query('publicSync/by_status_and_language', {
                                    limit: 100,
                                    status: 'public',
                                    language: 'Español'
                                  }));*/

            //let r2 = await(this.ApplicationPublished.replicate.from(this.ApplicationDrafts, optPublished));

            true;
        }
        
        

         
        


        

      }
    }
  }

  OpenFiles = () => {
    return {
      openChapter: async(currentChapter, book) => {
        let k = await(this.Auth().getLoggedUser());

        if(!book){
          book = null;
        }

        let gc = await this.ApplicationChapters.get(currentChapter._id).catch(e => null);

        if(!currentChapter.native_content){
          let parsedDOM = await(this.Work().drafts().chapters().mapDOM(currentChapter.content))
          console.log("parse dom!", parsedDOM)
          gc.native_content = parsedDOM;
        }

        let nT = {
          _id: currentChapter._id,
          book: book,
          chapter: gc,
          changed: false,
          created_at: Date.now(),
          type: 'wysiwyg'
        }

        let g1 = await this.OpenedWorks.get(nT._id).catch(e => null);

        //console.log("open g1", g1)
        if(g1 == null){
          //console.log("doesnt exist!")
          let pN = await this.OpenedWorks.put(nT).catch(e => null);

          let g = await(this.OpenedWorks.get(nT._id));
          return g;
        } else {
          //console.log("exist")
          return g1;
        }
        
      },
      openSettings: async(book) => {
          let k = await(this.Auth().getLoggedUser());

          if(!book){
            return;
          }


          let nT = {
            _id: 'openSettings-'+book._id,
            books: [book],
            changed: false,
            created_at: Date.now(),
            type: 'bulk',
            rev: undefined
          }

          let g1 = await this.OpenedWorks.get(nT._id).catch(e => null);

          
          if(g1 == null){
            //console.log("doesnt exist!", nT, book) 
            let pN = await this.OpenedWorks.put(nT).catch(e => e);
            //console.log("pn!!", pN)
            let g = await this.OpenedWorks.get(nT._id).catch(e => null);
            return g;
          } else {
            //console.log("exist")
            return g1;
          }
      },
      openBulk: async(selected_books) => {
          let k = await(this.Auth().getLoggedUser());

          if(!selected_books){
            return;
          }


          let nT = {
            _id: 'openBulk-'+Date.now(),
            books: selected_books,
            changed: false,
            created_at: Date.now(),
            type: 'bulk',
            rev: undefined
          }
          console.log("nt of!", nT)
          let g1 = await this.OpenedWorks.get(nT._id).catch(e => null);

          
          if(g1 == null){
            //console.log("doesnt exist!", nT, selected_books) 
            let pN = await this.OpenedWorks.put(nT).catch(e => e);
            //console.log("pn!!", pN)
            let g = await this.OpenedWorks.get(nT._id).catch(e => null);
            return g;
          } else {
            //console.log("exist")
            return g1;
          }
      },
      closeChapter: async(currentChapter) => {

        let g1 = await this.OpenedWorks.get(currentChapter).catch(e => null);

        g1._deleted = true;
        let pN = await this.OpenedWorks.put(g1).catch(e => null);

        //console.log("g1 delete!", g1)
        return g1;
      },
      save: async(currentChapter, content) => {
          let g1 = await this.OpenedWorks.get(currentChapter._id).catch(e => null);

          if(g1 != null){
            g1.chapter.native_content = content;
            g1.changed = true;
            let pN = await this.OpenedWorks.put(g1).catch(e => null);
          }

          //console.log("g1 save data!", g1)
          return 'ok';
      },
      saveTitle: async(currentChapter, title) => {
          let g1 = await this.OpenedWorks.get(currentChapter._id).catch(e => null);

          if(g1 != null){
            g1.chapter.title = title;
            g1.changed = true;
            let pN = await this.OpenedWorks.put(g1).catch(e => null);
          }

          //console.log("g1 save data!", g1)
          return 'ok';
      },
      saveHeader: async(currentChapter, header) => {
          let g1 = await this.OpenedWorks.get(currentChapter._id).catch(e => null);

          if(g1 != null){
            g1.chapter.header = header;
            g1.changed = true;
            let pN = await this.OpenedWorks.put(g1).catch(e => null);
          }

          //console.log("g1 save data!", g1)
          return 'ok';
      },
      deleteHeader: async(currentChapter, header) => {
          let g1 = await this.OpenedWorks.get(currentChapter._id).catch(e => null);

          if(g1 != null){
            g1.chapter.header = null;
            g1.changed = true;
            let pN = await this.OpenedWorks.put(g1).catch(e => null);
          }

          //console.log("g1 save data!", g1)
          return 'ok';
      },
      saveBulk: async(currentBulk) => {
        //console.log("current bulk save", currentBulk)
          let g1 = await this.OpenedWorks.get(currentBulk._id).catch(e => null);

          if(g1 != null){

            g1.books = currentBulk.books;
            g1.changed = true;
            let pN = await this.OpenedWorks.put(g1).catch(e => null);


           // console.log("g1 save data!", g1, pN)
          }


          
          return g1;
      },
      saveBook: async(currentBulk) => {
        //console.log("current bulk save to book!", currentBulk)
          let g1 = await this.OpenedWorks.get(currentBulk._id).catch(e => null);

          let sB = currentBulk.books.filter(book => {
            return book.changed == true;
          })

          let toBulk = [];


          for (var i = sB.length - 1; i >= 0; i--) {
            console.log("book of!",  sB[i])
            let getBook = await this.ApplicationDrafts.get(sB[i]._id).catch(e => null);

            sB[i].changed = null;
            sB[i].showDescriptionField = null;
            sB[i].showAuthorField = null;
            sB[i].showTagsField = null;
            sB[i].showTitleField = null;
            sB[i].openSettings = null;
            sB[i].toSync = true;
            sB[i].updated_at = Date.now();
            if(!getBook._rev){
              return false;
            }
            sB[i]._rev = getBook._rev;

            toBulk.push(sB[i]);
          }
         // console.log("to bulk!!!", toBulk)
        /*  let sBMap = await sB.map(async(book) => {

            let getBook = await this.ApplicationDrafts.get(book._id).catch(e => null);

            console.log("get book!", getBook)
            book.changed = null;
            book.showDescriptionField = null;
            book.showAuthorField = null;
            book.showTagsField = null;
            book.showTitleField = null;
            book.openSettings = null;
            book.toSync = true;
            book.updatedAt = Date.now();
            book._rev = getBook._rev;

            console.log("to pussssh!", book)
            toBulk.push(book);
            return book;
          })

          console.log("sb  ap to bulk!", toBulk)
          */

          let u = await(this.ApplicationDrafts.bulkDocs(toBulk));


          
          return toBulk;
      },
      saveChapter: async(currentChapter) => {



          let g1 = await this.ApplicationChapters.get(currentChapter._id).catch(e => null);
          if(g1 != null){
            // g1.title = currentChapter.chapter.title;
            // g1.native_content = currentChapter.chapter.native_content;
            // g1.header = currentChapter.chapter.header;

            if(g1.title != currentChapter.chapter.title){
              g1.title = currentChapter.chapter.title;
            }
            if(g1.native_content != currentChapter.chapter.native_content){
              g1.native_content = currentChapter.chapter.native_content;
            }
            if(g1.header != currentChapter.chapter.header){
              g1.header = currentChapter.chapter.header;
            }

            if(currentChapter.chapter._deleted && currentChapter.chapter._deleted == true){
              g1._deleted = true;
            }
            g1.toSync = true;
            let pN = await this.ApplicationChapters.put(g1).catch(e => null);

            let g3 = await this.ApplicationChapters.get(currentChapter._id).catch(e => null);


            let g1e = await this.OpenedWorks.get(currentChapter._id).catch(e => null);

            if(g1e != null){

              g1e.changed = false;
              let pNe = await this.OpenedWorks.put(g1e).catch(e => null);
            }

            return g3;
          }
          
          return g1;
      },
      all: async() => {
        let k = await(this.Auth().getLoggedUser());

        let n = await(this.OpenedWorks.allDocs({
                  include_docs: true,
                  attachments: false
                }));


        let r = n.rows.map(function (row) { return row.doc; });

        return {
          all: r,
          total: n.total_rows
        }
      },
      setAllAsViewed: async() => {
        
      }
    }
  }

  Notifications = () => {
    return {
      all: async() => {
        let k = await(this.Auth().getLoggedUser());

        let n = await(this.ApplicationNotifications.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: k.name+'-', endkey: k.name+'-\uffff'
                }));


        r = n.rows.map(function (row) { return row.doc; });
        r = _.orderBy(r, ['created_at'],['desc'])
        nV = r.filter((obj) => obj.viewed === false).length;
        return {
          all: r,
          not_viewed: nV,
          total: n.total_rows
        }
      },
      selfNew: async(message, recip, action) => {
        let k = await(this.Auth().getLoggedUser());

        let msg, frm;
        if(!message || !recip || !action){
          return false;
        }

        let nT = {
          _id: k.name+'-'+Date.now(),
          message: message,
          from: recip,
          action: 'dismiss',
          created_at: Date.now(),
          viewed: false
        }
        let pN = await this.ApplicationNotifications.put(nT).catch(e => null);

        if(pN == null){
          return false;
        }
        return true;
      },
      truncateNotifications: async() => {
        let allNots = await this.ApplicationNotifications.allDocs({include_docs: true});
        let notsToGo = allNots.rows.map(row => { return {_id: row.id, _rev: row.doc._rev, _deleted: true}; });

        let perform = this.ApplicationNotifications.bulkDocs(notsToGo);

        return true;
      },
      setAllAsViewed: async() => {
        let allNots = await this.ApplicationNotifications.allDocs({include_docs: true});
        let notsToRead = allNots.rows.map(row => { return { ...row.doc, viewed: true }; });

        let perform = this.ApplicationNotifications.bulkDocs(notsToRead);
k
        return true;
      }
    }
  }

  Sync = () => {
    return {
      checkDrafts: async() => {
        let d = await this.ApplicationDrafts.info();

        let dR = await this.RemoteDrafts.info();

        let r = {
          local: d,
          remote: dR
        }
        return r;
      },
      checkChapters: async() => {
        let c = await this.ApplicationChapters.info();

        let cR = await this.RemoteChapters.info();

        let r = {
          local: c,
          remote: cR
        }
        return r;
      },
      checkPublishers: async() => {
        let c = await this.ApplicationPublished.info();

        let cR = await this.RemoteDrafts.info();

        let r = {
          local: c,
          remote: cR
        }
        return r;
      },
      syncReading: async() => {
        let optPublished = {
                 live: false,
                 retry: true,
                 filter: 'publicSync/by_status',
                 query_params: { "status": "public" }
              };

        let r = await(this.ApplicationPublished.replicate.from(this.RemoteDrafts, optPublished));

        return r;
      },
      syncDraftsAndChapters: async() => {
        let k = await(this.Auth().getLoggedUser());

        let optDrafts = {
                 live: false,
                 retry: true,
                 continuous: false, 
                 filter: 'draftSync/by_user_id',
                 query_params: { "userId": k.name }
              };

        let optChapters = {
                 live: false,
                 retry: true,
                 continuous: false,
                 filter: 'chapterSync/by_user_id',
                 query_params: { "userId": k.name }
              };

        let optPublished = {
                 live: false,
                 retry: true,
                 filter: 'publicSync/by_status_and_language',
                 query_params: { "status": "public", "language": "Español" }
              };

        let s = await(this.ApplicationDrafts.replicate.to(this.RemoteDrafts, optDrafts));
        let s2 = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optDrafts));

        let c = await(this.ApplicationChapters.replicate.to(this.RemoteChapters, optChapters));
        let c2 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));




        /*localDB.sync(remoteDB, {
        push: {
            live: false,
            timeout: false,
            heartbeat: false
        },
        pull: {
            live: false,
            timeout: false,
            heartbeat: false,
            filter: '_design/db_access/by_app',
            query_params: { "app" : "convert" }
        }
    }).on('complete', function () {
        // yay, we're done!
        console.log('success');
    }).on('error', function (err) {
        // boo, something went wrong!
        console.log(err);
    });*/
        

        //let p = await(this.ApplicationPublished.replicate.from(this.RemoteDrafts, optPublished));
        /*a
        p.on('change', function (info) {
                          console.log("[draft] On change!", info)
                          // handle change
                        }).on('paused', function (paused) {
                          console.log("[draft] On paused!", paused)
                          // replication paused (e.g. replication up to date, user went offline)
                        }).on('active', function (ac) {
                          console.log("[draft] On active!", ac)
                          // replicate resumed (e.g. new changes replicating, user went back online)
                        })
                        .on('change', function (change) {
                          console.log("[draft] On change!", change)
                          // replicate resumed (e.g. new changes replicating, user went back online)
                        }).on('denied', function (err) {
                          console.log("[draft] On denied!", err)
                          // a document failed to replicate (e.g. due to permissions)
                        }).on('complete', function (info) {
                          console.log("[draft] On complete!", info)
                          // handle complete
                        }).on('error', function (err) {
                          console.log("[draft] On error!", err)
                          // handle error
                        })*/

        //console.log("replicate to public!", p)
        let r = {
          'drafts': {
                    to: s,
                    from: s2
                  },
          'chapters': {
            to: c,
            from: c2
          },
          'public': {

          }
        };


        return r;
       // console.log("await s!", s)
      },
      setAsSynced: async(works) => {
        let u = await(this.ApplicationDrafts.bulkDocs(works));
        return u;
      },
      pullPush: async(type, db) => {
        let k = await(this.Auth().getLoggedUser());
       console.log("type and db!", type, db, k)
        if(db == 'drafts'){
          let optDrafts = {
                 live: false,
                 retry: true,
                 continuous: false, 
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 filter: 'draftSync/by_user_id',
                 query_params: { "userId": k.name }
              };
          if(type == 'pull'){
            let draftsPull = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optDrafts));
            console.log("draft pull!", draftsPull)
            //draftsPull.cancel();
            return draftsPull;
          }
          if(type == 'push'){
            let draftsPush = await(this.ApplicationDrafts.replicate.to(this.RemoteDrafts, optDrafts));

            console.log("drafts push!", draftsPush)
            //draftsPush.cancel();
            return draftsPush;
          }

        }
        if(db == 'chapters'){
          let optChapters = {
                 live: false,
                 retry: true,
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 continuous: false,
                 filter: 'chapterSync/by_user_id',
                 query_params: { "userId": k.name }
              };
          if(type == 'pull'){
            let chaptersPull = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters)); 
            //chaptersPull.cancel();
            return chaptersPull;
          }
          if(type == 'push'){
            let chaptersPush = await(this.ApplicationChapters.replicate.to(this.RemoteChapters, optChapters));
            //chaptersPush.cancel();


            return chaptersPush;
          }
        }
        if(db == 'public'){
          let optPublished = {
                 live: false,
                 retry: true,
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 filter: 'publicSync/by_status_and_language',
                 query_params: { "status": "public", "language": getLangString() }
              };

          if(type == 'pull'){
            let publicPull = await(this.ApplicationPublished.replicate.from(this.RemoteDrafts, optPublished));

            //publicPull.cancel();
            return true;
          }
          if(type == 'push'){
            return;
          }
        }

        return false;
        
      }
    }
  }
  /**
   * Log in
   * @param {username } string
   * @param {password} string
   **/
   Work = () => {
     return {
       setUp: async() =>{

        //let clean = await this.ApplicationChapters.viewCleanup();
        //let dclean = await this.ApplicationDrafts.viewCleanup();
        let i1 = {
            "_id": "_design/draftSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let i2 = {
            "_id": "_design/chapterSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

          let i3 = {
            "_id": "_design/publicSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_status": "function (doc, req) {return doc.status === req.query.status;}",
              "by_status_and_language": "function (doc, req) {return doc.status == req.query.status && doc.language === req.query.language;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };


        let pI = await this.ApplicationPublished.put(i3).catch(e => null);
        let pID = await this.ApplicationDrafts.put(i3).catch(e => null);
        //let pIDR = await RemotePublished.put(index).catch(e => null);

        let dpIDR = await this.RemoteDrafts.put(i3).catch(e => null);

        let ig1 = await(this.ApplicationDrafts.put(i1, { force: true })).catch(e => null);
        let ig2 = await this.ApplicationChapters.put(i2, { force: true }).catch(e => null);



       
       return true;

       },
       replicate: async() =>{
        //console.log("[Execute] Replication")
        //let clean = await this.ApplicationChapters.viewCleanup();
        //let dclean = await this.ApplicationDrafts.viewCleanup();
        let i1 = {
            _id: "_design/draftSync",
            filters: {
              by_user_id: "function (doc, req) {return doc.userId === req.query.userId;}",
              by_book_id: "function (doc, req) {return doc.bookId === req.query.bookId;}",
              by_both: "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let i2 = {
            _id: "_design/chapterSync",
            filters: {
              by_user_id: "function (doc, req) {return doc.userId === req.query.userId;}",
              by_book_id: "function (doc, req) {return doc.bookId === req.query.bookId;}",
              by_both: "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let ig1 = await(this.ApplicationDrafts.put(i1, { force: true }));
        let ig2 = await this.ApplicationChapters.put(i2, { force: true });

       // console.log("ig1", await this.ApplicationDrafts.get("_design/draftSync"))
        //console.log("ig2", await this.ApplicationChapters.get("_design/chapterSync"))
        let k = await(this.Auth().getLoggedUser());

    
        let sync1 = await(this.Work().drafts().replicateFrom());
          sync1.cancel();
        let sync2 = await(this.Work().drafts().chapters().replicateFrom());
          sync2.cancel();
     // console.log("sync stuff", sync1, sync2)

        
        //let r2 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));
        //console.log("Replicate!", r1, r2)
        let r = {
          drafts: sync1,
          chapters: sync2
        }

        return r;
      
       },
       list: () => {
         let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }

          return fetch(this.url +'/business', data)
                .then(response => response.json());
       },
       sync: async() => {
            this.ApplicationDrafts.sync(this.RemoteDrafts, {
                    live: true,
                    retry: true
                  }).on('change', function (change) {

                    // yo, something changed!
                  }).on('error', function (err) {
                    console.log("error !", err)
                    // yo, we got an error! (maybe the user went offline?)
                  });

            
          },
       drafts: () => {

        return {

          all: async() => {
            
            let k = await(this.Auth().getLoggedUser());
            //console.log("[get drafts] as: ", k)

            /*this.ApplicationDrafts.query('_drafts', {key : k.name}).then(res=>{
              console.log("RES QUERY!", res)
            }).catch(err=>{
              console.log("RES QUERY ERROR!", err)
            })*/
            //let q = await(this.ApplicationDrafts.query('_drafts', {key : k.name}))
            //console.log("Query!", q)
            let d = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: k.name+'-', endkey: k.name+'-\uffff'
                }));

            //console.log("all drafts!", d)
            /*let a = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                }));*/
            //console.log("[drafts get all] user", k)
            //console.log("[drafts get all] all docs", d)
            let r = d.rows.map(function (row) { return row.doc; });

            //console.log("[ALL] Drafts: ", a)
            //console.log("[ALL] Drafts a: ", d)
            //console.log("[ALL] Drafts 1: ", r)

            //let indexedRow = _.findIndex(r, ['_id', '_design/draftSync']);
            //r.splice(indexedRow, 1);
            /*let c = await(this.ApplicationDrafts.find({

                          fields: ['_id', 'userId', 'title'],
                          selector: {
                            userId: {
                              $eq: k.name
                            }
                            
                          },
                          use_index: '_my_drafts'
                        }));
            console.log("[drafts get all] finder", c)*/

            return {
              total_rows: d.total_rows,
              offset: d.offset,
              rows: r
            };
          },
          search: async(string) => {
            console.log("SEARCH!", string)
            let s = await this.ApplicationDrafts.search({
              query: string,
              fields: ['title', 'description', 'author', 'tags', 'status'],
              include_docs: true
            });
            console.log("test!", s)
            let r = s.rows.map(function (row) { return row.doc; });
            return r;
          },
          replicateFrom: async() => {
            let k = await(this.Auth().getLoggedUser());
            let optDrafts = {
                 live: false,
                 retry: true,
                 batch_size: 1000,
                 filter: 'draftSync/by_user_id',
                 query_params: { "userId": k.name }
              };

            let adrR = await(this.RemoteDrafts.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: k.name, endkey: k.name+'-\uffff'
                                }));
               
            console.log("replicate from drafts!", adrR)
             let r = adrR.rows.map(function (row) { return row.doc; }); 
             //__DEV__ && console.log("after replicate from drafts!", r)

             let u = await(this.ApplicationDrafts.bulkDocs(r, {new_edits: false}));

           // let s1 = this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optDrafts);
            return u;
          },
          coverUp: async(params) => {
            //console.log("lets start!")
            let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(params)
            };

            let h = await fetch(process.env.API_URL+"/api/creators/shouldUploadCover", options);
            //console.log("h!",h)
            let r = await h.json();
            //console.log("r!", r)


            return r;

            /* return fetch("http://localhost:9090/creators/shouldUploadCover", options)
                .then(res => res.text())
                .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
           // console.log("FILENAME", f)
            
          },
          importEpub: async(params) => {

                  //Snackbar.show({ title: 'Processing ebook...', duration: Snackbar.LENGTH_LONG })
                  let options = {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: params
                  };
                  let h = await fetch(process.env.API_URL+"/api/creators/importEpub", options);
                  //let h = await fetch("http://localhost:9090/creators/importEpub", options);

                  let r = await h.json();



                  return r;

                  /* return fetch("http://localhost:9090/creators/shouldUploadCover", options)
                      .then(res => res.text())
                      .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
                 // console.log("FILENAME", f)
                  
          },
          importContents: async(flow) => {
            let k = await(this.Auth().getLoggedUser());

            let bookId = k.name+'-'+(new Date()).getTime();
            let tags = typeof flow.metadata.subject !== 'string' ? flow.metadata.subject : flow.metadata.subject.split(",");
            if(flow.metadata.language.toLowerCase() == 'en' ||  flow.metadata.language == 'English') {
              flow.metadata.language = 'English';
            } else {
              flow.metadata.language = 'Español'
            }
            let bookToCreate = {
                    title: flow.metadata.title,
                    colors: flow.colors,  
                    description: flow.metadata.description,
                    tags: tags,
                    author: flow.metadata.creator,
                    original_published_date: flow.metadata.date,
                    language: flow.metadata.language,
                    published: flow.metadata.publisher,
                    count_chapters: flow.chapters.length,
                    cover: flow.cover,
                    views: 0,
                    _id: bookId,
                    created_at: Date.now(),
                    userId: k.name,
                    archive: false
                  };

          let n = await(this.ApplicationDrafts.put(bookToCreate, {force: true}));
          let nd = await(this.RemoteDrafts.put(bookToCreate, {force: true}));

          let g = await(this.ApplicationDrafts.get(n.id));
          let index = 0;
          let chaptersToCreate = await(flow.chapters.map(item => {
                                    item._id = bookId+'-chapter-'+(new Date()).getTime()+(index++);
                                    item.position = index;
                                    item.native_content = item.content;
                                    item._rev = undefined;
                                    //index++;
                                    item.bookId = bookId;
                                    item.archive = false;
                                    item.created_at = Date.now();
                                    item.updated_at = Date.now();
                                    item.userId = k.name;
                                    return item;
                                  }));

          //let u = await(this.ApplicationChapters.bulkDocs(chaptersToCreate));
          //console.log("chapters u!", u)

            return {
              book: g,
              chapters: chaptersToCreate
            };

          },
          bulkIt: async(chapters) => {
            let u = await(this.ApplicationChapters.bulkDocs(chapters));
            let c = await(this.RemoteChapters.bulkDocs(chapters));

            return u;
          },
          onSave: async(dok) => {

            dok._rev = undefined;

            let n = await(this.ApplicationDrafts.upsert(dok._id, doc => {
                  doc = dok;
                  return doc;
                }));

            //await(this.ApplicationDrafts.put(doc, {force: true}));

            let g = await(this.ApplicationDrafts.get(dok._id));
            return g;
          },
          create: async(title) => {
            let k = await(this.Auth().getLoggedUser());

            console.log("CREATE DRAFT!!!")
            if(!title){
              title = 'New Project';
            }



                let c = {
                  _id: k.name+'-'+(new Date()).getTime(),
                  userId: k.name,   
                  title: title,
                  archive: false,
                  userId: k.name,
                  created_at: Date.now(),
                  views: 0,
                  count_chapters: 0
                }
                let n = await(this.ApplicationDrafts.put(c, {force: true}));
                //console.log("N!", n)
                let g = await(this.ApplicationDrafts.get(n.id));

                let ch = await this.Work().drafts().chapters().create(c._id);

                return g;


           // let bookId = uuid.v1();
   
          },
          delete: async(id) => {

            let rU = await(this.RemoteDrafts.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                })).catch(e => {return null});


            if(rU == null){
              return null;
            }

            let u = await(this.ApplicationDrafts.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                }));



            let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                }));

            let adR = ad.rows.map(function (row) { row.doc._deleted = true; return row.doc; }); 


            let uC = await(this.ApplicationChapters.bulkDocs(adR));

            let aP = await(this.ApplicationPublished.get(id)).catch(e => {return null});

            if(aP != null){
              let u = await(this.ApplicationPublished.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                }));
            }


            //return u;

            return {
              drafts: u,
              chapters: uC
            };
          },
          // end of all()
          chapters: () => {
            return {
              allDocsIds: async() => {
                
                let k = await(this.Auth().getLoggedUser());

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: k.name, endkey: k.name+'-chapter-\uffff'
                }));
                


                /*if(c == null){
                  console.log("FINDER IS NULL")
                }*/
                
                //let r = ad.rows.map((row) => { return row.doc; }); 
                //console.log("[ad]", r)
                //console.log("[get all books] user:", k.name)
                /*console.log("[all first]", c)
                if(c) {
                  let n = await(this.this.ApplicationChapters.find({

                          fields: ['position', 'bookId', 'title', 'archive', '_id'],
                          selector: {
                            bookId: { $eq: id },
                          },
                        }));
                  console.log("[all next]", n)
                  
                }*/
                //iconsole.log("FIND LOG", c)
                //console.log("chapters!", id)
                console.log("chapters!!!!!", ad.rows)
                let chapters = ad.rows.map(r => r.id.split("-")[0]+'-'+r.id.split("-")[1]);
                return {
                  chapters: _.uniqBy(chapters),
                  total: ad.total_rows,
                  offset: ad.offset
                };
              },
              all: async(id) => {
                
                //console.log("get indexes!!!")
                //var indexesResult = await this.ApplicationChapters.getIndexes();

                //console.log("get indexes $1!!!", indexesResult)
                //let erase = await(indexesResult.indexes.map(async row => { return await(this.ApplicationChapters.deleteIndex(row)) }));  
                //console.log("get indexes $1!!!", erase)
                //console.log("id of!", id)
                let k = await(this.Auth().getLoggedUser());

                /*let c = await(this.ApplicationChapters.find({

                          fields: ['bookId', 'userId', 'position', 'title', 'archive', '_id'],
                          selector: {
                            bookId: {
                              $eq: id
                            },
                            userId: {
                              $eq: k.name
                            }
                            
                          },
                          use_index: '_my_chapters'
                        })).catch(err => null);*/

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  conflicts:true,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                }));
                


                /*if(c == null){
                  console.log("FINDER IS NULL")
                }*/
                
                let r = ad.rows.map((row) => { return row.doc; }); 
                //console.log("[ad]", r)
                //console.log("[get all books] user:", k.name)

                r = _.orderBy(r, ['position'],['asc'])
                /*console.log("[all first]", c)
                if(c) {
                  let n = await(this.ApplicationChapters.find({

                          fields: ['position', 'bookId', 'title', 'archive', '_id'],
                          selector: {
                            bookId: { $eq: id },
                          },
                        }));
                  console.log("[all next]", n)
                  
                }*/
                //iconsole.log("FIND LOG", c)
                //console.log("chapters!", id)

                return {
                  chapters: r,
                  total: ad.total_rows,
                  offset: ad.offset
                };
              },
              allLocal: async(limit, offset) => {
                
                //console.log("get indexes!!!")
                //var indexesResult = await this.ApplicationChapters.getIndexes();

                //console.log("get indexes $1!!!", indexesResult)
                //let erase = await(indexesResult.indexes.map(async row => { return await(this.ApplicationChapters.deleteIndex(row)) }));  
                //console.log("get indexes $1!!!", erase)
                //console.log("id of!", id)
                let k = await(this.Auth().getLoggedUser());

                /*let c = await(this.ApplicationChapters.find({

                          fields: ['bookId', 'userId', 'position', 'title', 'archive', '_id'],
                          selector: {
                            bookId: {
                              $eq: id
                            },
                            userId: {
                              $eq: k.name
                            }
                            
                          },
                          use_index: '_my_chapters'
                        })).catch(err => null);*/

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  //conflicts:true,
                  limit: limit,
                  skip: offset
                }));
                


                /*if(c == null){
                  console.log("FINDER IS NULL")
                }*/
                
                let r = ad.rows.map((row) => { return row.doc; }); 
                //console.log("[ad]", r)
                //console.log("[get all books] user:", k.name)

                r = _.orderBy(r, ['position'],['asc'])
                /*console.log("[all first]", c)
                if(c) {
                  let n = await(this.ApplicationChapters.find({

                          fields: ['position', 'bookId', 'title', 'archive', '_id'],
                          selector: {
                            bookId: { $eq: id },
                          },
                        }));
                  console.log("[all next]", n)
                  
                }*/
                //iconsole.log("FIND LOG", c)
                //console.log("chapters!", id)

                return {
                  chapters: r,
                  total: ad.total_rows,
                  offset: ad.offset
                };
              },
              getPublishedChapters: async(params) => {
                try {


                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                }));
                
                let r;

                if(ad.rows && ad.rows.length == 0){
                  //  __DEV__ && console.log("this props of work" , this.Work().drafts().chapters().allRemote())
                 // Snackbar.show({ title: Languages.replicatingEllipsis[getLang()], duration: Snackbar.LENGTH_SHORT })

                 /* this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                                }).then(res => console.log("resss!", res)).catch(err => console.log("error!", err))*/

                  let adrR = await(this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                                })).catch(e => null);
               


                  if(adrR == null){

                    return;
                  }
                  r = adrR.rows.map(function (row) { row.doc._rev = undefined; return row.doc; }); 

                  //__DEV__ && console.log("docs to here!", r, params)
                  let u = await(this.ApplicationChapters.bulkDocs(r));

                  if(params.title && !params.offline){
                    let k = await(this.Auth().getLoggedUser()).catch(e => null);

                    params.offline = true;
                    //__DEV__ && console.log("to offline!", params, k)
                    let nT = {
                      _id: k.name+'-'+Date.now(),
                      message: params.title+' is now available to read offline.',
                      from: 'Newt',
                      object: params,
                      action: 'read-book-offline',
                      created_at: Date.now(),
                      viewed: false
                    }
                    let pN = await this.ApplicationNotifications.put(nT).catch(e => null);

                    let offPub = await(this.ApplicationPublished.upsert(params._id, doc => {
                                      if(!doc.offline){
                                          doc.offline = true;
                                      }
                                      return doc; 
                                    })).catch(e => null);
                  }
                  
               
                } else {
                  r = ad.rows.map(function (row) { return row.doc; }); 
                }

                r = _.orderBy(r, ['position'],['asc']);

               // console.log("returning!", r)
                return r;
                } catch (e) {
                     console.log('error while establishing connection to message bus', e)
                }
              },
              allRemote: async(id) => {

               // let k = await(this.Auth().getLoggedUser());

                  let adrL = await(this.ApplicationChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                                }));

                  //console.log("get all chapters from:", id, adrL)
                  if(adrL.rows.length > 0){

                   // console.log("Get chapters from local")
                    let r = adrL.rows.map(function (row) { return row.doc; }); 
                    return r;
                  } else {

                   //console.log("Get chapters from remote")

                    let adrR = await(this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                                }));

                    //console.log("list chapters fromm", adrR)
                    let r = adrR.rows.map(function (row) { return row.doc; }); 

                    let u = await(this.ApplicationChapters.bulkDocs(r, {new_edits: false}));

                    //console.log("bulk chapters", u)
                    return r;
                  }
                  
                 
              },
              getDocsWithUserId: async() => {


              /*console.log("fire pouchdb")
                function myMapFunction(doc) {
                  console.log("doc pouchdb", doc)
                      if (doc.userId === 'mq') {
                        if (doc.title === 'A sangre fria') {
                          emit('Pika pi!');
                        } else {
                          emit(doc.name);
                        }
                      }
                    }

                this.RemoteDrafts.query(myMapFunction, {
                    key          : 'Pika pi!',
                    include_docs : true
                  }).then(function (result) {
                    console.log("pouchdb result", result)
                    // handle result
                  }).catch(function (err) {
                    // handle errors
                    console.log("error pouchdb!", err)
                  });
                */
              },
              replicateFrom: async() => {
                let k = await(this.Auth().getLoggedUser());
                let optChapters = {
                         live: false,
                         retry: true,
                         filter: 'chapterSync/by_user_id',
                         query_params: { "userId": k.name }
                      };
                let s1 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters, (err, result) => {

                          if(err){ return false; }
                          return result;
                        }));

                return s1;
              },
              replicateByDocId: async(id) => {
                let k = await(this.Auth().getLoggedUser());

                // Replicate book chapters
                let optChapters = {
                     live: false,
                     retry: true,
                     continuous: false,
                     filter: 'chapterSync/by_both',
                     batch_size: 200,
                     query_params: { "userId": k.name, "bookId": id }
                  };
                let c = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));


                return c;
              },
              //end of all()
              create: async(id) => {
                //console.log("find all!!", fAll)
                //console.log("create from id", id  )
                let k = await(this.Auth().getLoggedUser());
                //console.log("[create book] user: ", k)
                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                })).catch(e => null);
                //console.log("[ad]", ad)

                
                

                let c = {
                  _id: id +'-chapter-'+(new Date()).getTime(),
                  title: 'New Draft',
                  bookId: id,
                  archive: false,
                  position: ad.rows.length,
                  userId: k.name,
                  created_at: Date.now()
                }

                let reCount = await(this.ApplicationDrafts.upsert(id, doc => {
                  //console.log("oN UPSERT!", doc)
                      if(!doc.count_chapters){
                        
                          doc.count_chapters = 0;
                          doc.count_chapters++;
                        
                        
                      } else {
                        doc.count_chapters++;
                      }
                      if(!doc.views){
                        doc.views = 0;
                      }
                      if(ad != null && ad.rows.length > 0){
                          doc.count_chapters = ad.rows.length;
                          doc.count_chapters++;
                        }
                      return doc; 
                    })).catch(e => null);

                let n = await(this.ApplicationChapters.put(c)).catch(e => null);
                if(n == null){
                  let nF = await(this.ApplicationChapters.put(c, {force: true})).catch(e => null);
                }
                //console.log("N!", n)
                let g = await(this.ApplicationChapters.get(n.id));
                return g;
              },
              onMove: async(all_chapters) => {
                //console.log("[API] Move", id)
                //let d = await(this.ApplicationChapters.get(id));
               // console.log("on move chapter ID", position, d)

               // d.position = position;
               //console.log("all chapters", all_chapters)
                let u = await(this.ApplicationChapters.bulkDocs(all_chapters));
                console.log("on move updated!", u)

                /*let m = await(this.ApplicationChapters.upsert(id, doc => {
                  //console.log("oN UPSERT!", doc)
                      doc.position = position;
                      doc._rev = doc._rev;
                      return doc; 
                    }));*/
                    //console.log("bulk docs done!", u)
                return u;
              },
              findOne: async(id) => {
                let g = await(this.ApplicationChapters.get(params._id));
                return g;
              },
              mapDOM: async(element) => {

                if(typeof element === 'undefined'){
                  let blocks = {
                    time: Date.now(),
                    blocks: []
                   };
                   return blocks;
                }
                const json = parse(element, { ...parseDefaults, includePositions: false });

                const formatFromTagNameItems = (o, res) => {
                  var items = res || [];
                  if (o.type == 'text' && o.content.trim() === '') {
                                      items.push(o.content);   // saving `name` value
                                  } 
                  if(o.children){
                    for (var il = o.children.length - 1; il >= 0; il--) {
                                
                                if(o.children[il]){
                                  formatFromTagNameItems(o.children[il], items)
                                }

                              }
                  }



                   
                  return items;
                }

                const formatFromTagName = (o, res, tag) => {
                  var items = res || [];

                  if (o.type == 'text') {

                       let co;
                       if(tag == 'u'){
                        co = '<u>'+o.content+'</u>';
                       } else if(tag == 'i'){
                        co = '<i>'+o.content+'</i>';
                       } else if(tag == 'b' || tag == 'strong'){
                        co = '<b>'+o.content+'</b>';
                       } else {
                        co = o.content;
                       }
                       if(typeof co == 'undefined'){
                        co = ' ';
                       }
                      items.unshift(co);   // saving `name` value

                    } 
                  if(o.type == 'element' && tag == 'img' && o.attributes && o.attributes[0] && o.attributes[0].value){
                    items.unshift({img: o.attributes[0].value})
                  }

                  if(o.children){

                    for (var il = o.children.length - 1; il >= 0; il--) {    
                                if(o.children[il]){

                                  formatFromTagName(o.children[il], items, o.tagName)

                                }
                      }
                  }
                  
                 


                   
                  return items;
                }
                const scrapeContent = (o, res, type) => {
                  var names = res || [];

                      for (var i = o.length - 1; i >= 0; i--) {
                        

                          if (o[i].type == 'text') {

                                names.unshift({ type: 'paragraph', data: { text: o[i].content }});   // saving `name` value
                            }

                          if(o[i].children && typeof o[i].children === 'object') {
                            if(o[i].tagName == 'ul' || o[i].tagName == 'ol'){
                              let t = formatFromTagNameItems(o[i], [])
                              names.unshift({ type: 'list', data: { text: t }});
                            } else if(o[i].tagName == 'p') {
                              let string = '';
                              let pa = formatFromTagName(o[i], '', o[i].tagName);

                               if(pa.length > 0){
                                  pa = pa.map(w => { string += w; return w;})
                                }
                              names.unshift({ type: 'paragraph', data: { text: string }});
                            } else if(o[i].tagName == 'img') {
                              let string = '';
                              let pa = formatFromTagName(o[i], '', o[i].tagName);

                              if(pa && pa[0] && pa[0].img){
                                names.unshift({ type: 'image', data: { 
                                  "file": {
                                    "url": pa[0].img,
                                  },
                                    "caption" : "",
                                    "withBorder" : false,
                                    "stretched" : false,
                                    "withBackground" : false
                                  }
                                });
                              }

                            } else {
                              scrapeContent(o[i].children, names);
                            }
                             
                              
                              

  // processing nested `child` object

                          } 


                      }
                      return names;
                  }
                let allTypes = scrapeContent(json, []);

               /* function* flatten(array){
                     for(const el of array){
                       yield el;
                       yield* flatten(el.children);
                     }
                  }
                for(const el of flatten(yourdata)){
                      //...
                   }*/

                const parseElementDOM = (element) => {
                    if(typeof element === 'undefined'){
                      return;
                    }
                    if(element.type){

                    }
                  }

               

               if(typeof json === 'undefined'){
                return;
               }

               let blocks = {
                time: Date.now(),
                blocks: allTypes
               };

               

              return blocks;
              },
              parseElementDOM: (element) => {
                if(typeof element === 'undefined'){
                  return;
                }
                if(element.type){

                }
              },
              addImgContent: async(params) => {
                  //console.log("lets start!")
                  let options = {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(params)
                  };
                  let h = await fetch(process.env.API_URL+"/api/creators/shouldUploadContentMedia", options);
                  //console.log("h!",h)
                  let r = await h.json();
                 // console.log("r!", r)


                  return r;

                  /* return fetch("http://localhost:9090/creators/shouldUploadCover", options)
                      .then(res => res.text())
                      .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
                 // console.log("FILENAME", f)
                  
                },
              save: async(params) => {
                //console.log("params save", params.content.length)
                let d = await(this.ApplicationChapters.get(params._id));
                //console.log("dddd!", d)
                /*let n = await(this.ApplicationChapters.upsert(d._id, doc => {
                  if(params.content){
                    doc.content = params.content;
                  }
                  if(params.title){
                    doc.title = params.title;
                  }
                }));
                return n;*/
                let u = await(this.ApplicationChapters.upsert(d._id, doc => {
                  //console.log("DOC HERE!", doc)
                  if(params.native_content && params.native_content != null && params.native_content.length > 0){
                   // console.log("content changed")
                    doc.native_content = params.native_content;
                  }
                  if(params.title && params.title != null){
                    doc.title = params.title;
                  }
                  if(params._deleted && params._deleted == true){
                    //console.log("DELETING CHAPTER!")
                    doc._deleted = true;
                  }
                  return doc;
                }));

                
                return u;
                //console.log("get document", d)
                //let n = await(this.ApplicationChapters.put(c, {force: true}));
                //return n;
              },
              saveBulk: async(bulk) => {
                //console.log("params save", params.content.length)
                if(bulk){
                  //console.log("[save bulk] bulk: ", bulk)

                bulk.forEach( chapter => { chapter.unsaved = null; chapter.updated_at = Date.now() });

                let u = await(this.ApplicationChapters.bulkDocs(bulk));
                return u;
                } else {
                  return null;
                }

              },
              
              //end of create()
            }
          }
          // end of chapters()
        }
       },

     }
   }
   /**
   * Auth
   * @returns functions 
   **/
   Auth = () => {
     //console.log("Auth this", await(this))
    return {
      /**
       * Log in
       * @param {username} string
       * @param {password} string
       **/
      signIn: (username, password) => {
          return this.RemoteStorage.logIn(username, password);
         /* return fetch(this.url +'/oauth/token', data)
                  .then(response => response.json());*/j
      },
      /**
       * Sign Up
       * @param {first_name} string
       * @param {last_name} string
       * @param {email} string
       * @param {password} string
       **/
      signUp: (name, email, username, password) => {

          return this.RemoteStorage.signUp(username, password, {
                  metadata : {
                      email : email,
                      full_name : name,
                      createdAt: Date.now(),
                      platforms: ['desktop']
                      //likes : ['harry potter', 'la tregua', 'forrest gump\''],
                    }
               });
      },
      updateUser: async(state) => {
        //console.log("state!", state)

        let k = await(this.Auth().getLoggedUser());

        //console.log("user K", k)

        let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      full_name: state.full_name,
                      email: state.email,
                      avatar: state.avatar ? state.avatar : null
                    }
                  }))

        let aU = await(this.ApplicationUsers.put(state, {force:true}));
        let aS = await(this.ApplicationSettings.put(state, {force:true}));

        return true;
      },
      changePassword: async(state) => {

        let k = await(this.Auth().getLoggedUser());


        let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      full_name: state.full_name,
                      email: state.email,
                    }
                  }))

        let aU = await(this.ApplicationUsers.put(state, {force:true}));
        let aS = await(this.ApplicationUsers.put(state, {force:true}));

        return true;
      },
      /**
       * Get information about user on API
       **/
      me: () => {
          let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }

          return fetch(this.url +'/me', data)
                  .then(response => response.json());
      },
      getRemoteUser: async(username) => {

        return this.RemoteStorage.getUser(username);
      },
      getLocalUser: async(username) => {
       // console.log("get local user!", username, LOCAL_DB_USERS)
        

        //let s = await(this.ApplicationUsers.allDocs({include_docs: true}))
        //console.log("ALLUSERS", s)

        let u = await(this.ApplicationUsers.get('org.couchdb.user:'+username)).catch(e => null);

        if(u == null){


          let ur = await(this.Auth().getRemoteUser(username)).catch(e => null);



          if(ur != null){
            let p = await(this.ApplicationUsers.put(ur, {force:true}));

                u = await(this.ApplicationUsers.get(username)).catch(e => null);
            return u;
          } else {
            return {
              type: 'error',
              message: 'Could not find users that matches: '+username
            }
          }
        } else {

          return u;
        }

        return null;

      },
      getLoggedUser: async() => {
        //__DEV__ && console.log("Get logged user!")
        // roles.indexOf('_admin') === -1 
        let k = await(this.Auth().getKey());
        let s = await(this.ApplicationSettings.allDocs({include_docs: true}))
        let a = await(_.filter(s.rows, item => {
          // console.log("item!", item)
          if(item.doc){
            return item.doc.name === k;
          }
          
        })[0]);
        
       // console.log("single", k)

        //console.log("user settings", s)

        //console.log("user!", u)

        if(typeof a !== 'undefined' && a != null && a.doc != null){
          return a.doc;
        } else {
         // console.log("u undefined!", u)
          let u = await(this.Auth().getRemoteUser(k)).catch(e => null);
          if(u == null){
            // User is not logged properly in the app.
            return false;
          }
          return u;
        }
        
        return k;
      },
      getCredentials: async() => {
        //__DEV__ && console.log("Get logged user!")
        // roles.indexOf('_admin') === -1 
        let k = await(this.Auth().getLoggedUser());

        let re = {
          user: k.name,
          pass: k.p_t
        }

        return re;
      },
      getSession: async() => {
        return this.RemoteStorage.getSession();
      },
      /**
       * Save data
       * @param {data} object
       * @param {email} item/string
       * @param {last_name} item/string
       * @param {first_name} item/string
       * @param {identifier} item/integer
       * @param {type} item/string
       **/
      saveMe: async(data) => {

        let d = data;
        //let p = await(this.ApplicationSettings.get(data._id).then(res => { return res }));
        let p = await(this.ApplicationSettings.allDocs({include_docs: true}))
        //await(this.ApplicationSettings.remove(data._id, data._rev));

        
        //console.log("remove!", r)

        let a = _.filter(p.rows, item => {

          return item.doc.name === d.name;
        })[0];
 

        if(typeof a === 'undefined'){
           
          let n = await(this.ApplicationSettings.put(d, {force: true}));
          let g = await(this.ApplicationSettings.get(d._id))

          return g;
        } else {

          return a.doc; 
        }
        /*
        .then(r => {
          console.log("savedd", r)
          return;
        }).catch(e => {
          this.ApplicationStorage.put(d)
          console.log("wrong", e)
        }))
        */
        
      },
      saveLocalUser: async(data) => {
        let d = data;
        console.log("to save user!", data)
        let n = await(this.ApplicationSettings.put(d, {force: true}));
        console.log("to save user put!", n)
        let g = await(this.ApplicationSettings.get(d._id))

        return g;
      },
      removeAllUsers: async() => {

        await(this.ApplicationSettings.allDocs().then(result => {
            // Promise isn't supported by all browsers; you may want to use bluebird
            return Promise.all(result.rows.map(row => {
              return this.ApplicationSettings.remove(row.id, row.value.rev);
            }));
          }).then(r => {
            // done!
          }).catch(console.log.bind(console)));
      },
      setKey: async(user) => {

        let f = await(localStorage.setItem('userKey', user));
        let r = await(localStorage.getItem('userKey'));

        return r;
      },
      getKey: async() => { 
        //let r = await(localStorage.removeItem('userKey'));
        //console.log("remove keys!", r)
        let f = await(localStorage.getItem('userKey'));
        //console.log("get key", f) 
      // await(localStorage.removeItem('userKey'));
        return f;
      },
      setProgressBok: async(book, index, scrollPosition) => { 

        if(!book || !index || index == 0){
          return;
        }


        

        let k = await(this.Auth().getLoggedUser());

        if(!k.books){
          k.books = [];
        }
        
        let indexBook = _.findIndex(k.books, ['bookId', book._id]);



        if(indexBook == -1){
          k.books.push({
            _id: book._id,
            _rev: book._rev,
            index: index || 1,
            position: scrollPosition || 0,
            title: book.title,
            tags: book.tags || null
          })
        } else {
          k.books[indexBook].index = index || 1;
          k.books[indexBook].position = scrollPosition || 0;
          if(!k.books[indexBook].title){
            k.books[indexBook].title = book.title;
          }
          if(!k.books[indexBook].tags && book.tags){
            k.books[indexBook].tags = book.tags || null;
          }
          
        }

        

       // let indexBook2 = _.findIndex(k.books, ['bookId', book._id]);

        //console.log("index of book!", k.books[indexBook2], indexBook2)
       //& console.log("user K", k, k.books)

       if(book.count_chapters == index){
        let nT = {
                      _id: k.name+'-'+Date.now(),
                      message: 'You completed '+book.title+'. Congratulations!',
                      from: 'Newt',
                      object: book,
                      action: 'read-book-offline-completed',
                      created_at: Date.now(),
                      viewed: false
                    }
                    let pN = await this.ApplicationNotifications.put(nT).catch(e => null);
       }
      let n = await(this.ApplicationPublished.upsert(book._id, doc => {
                  doc.progress = index;
                  doc.position = scrollPosition;

                  if(book.count_chapters == index){
                    doc.completedReading   = true;
                  }
                  return doc;
                }));

      let aU = await(this.ApplicationUsers.put(k, {force:true}));
      let aS = await(this.ApplicationSettings.put(k, {force:true}));

      let session = await(this.Auth().getSession());


        if(session && session.userCtx.name != null){
         // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
          let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      books: k.books
                    }
                  }))
         //Ω return;
        } else {
         // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
        }

       

        

       // console.log("put!", n, rS, aU, aS)

        return;
      },
      setReadingTheme: async(theme) => { 

        if(!theme){
          return;
        }
        //console.log("move on!")

        

        let k = await(this.Auth().getLoggedUser());
        //console.log("k books!", !k.books)

       // let indexBook2 = _.findIndex(k.books, ['bookId', book._id]);

        //console.log("index of book!", k.books[indexBook2], indexBook2)
       //& console.log("user K", k, k.books)

        k.readingTheme = theme;
        let session = await(this.Auth().getSession());
        if(session && session.userCtx.name != null){
         // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
          let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      readingTheme: theme
                    }
                  }))
         //Ω return;
        } else {
          //Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
        }

       

        let aU = await(this.ApplicationUsers.put(k, {force:true}));
        let aS = await(this.ApplicationSettings.put(k, {force:true}));

       // console.log("put!", n, rS, aU, aS)

        return;
      },
      getMe: (user) => {
 
      },
      avatarUp: async(params) => {

            let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(params)
            };


            let h = await fetch(process.env.API_URL+"/api/creators/shouldUploadAvatar", options);

            let r = await h.json();



            return r;

            /* return fetch("http://localhost:9090/creators/shouldUploadCover", options)
                .then(res => res.text())
                .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
           // console.log("FILENAME", f)
            
          },
      /** 
       * Log out user from API
       * @returns boolean
       **/
      signOut: async() => {
        let r = await(localStorage.removeItem('userKey'));
        let l = await(this.RemoteStorage.logOut());
        let c = await(this.ApplicationChapters.destroy());
        let d = await(this.ApplicationDrafts.destroy());
        let s = await(this.ApplicationSettings.destroy());
        let o = await(this.ApplicationStorage.destroy());
        let f = await(this.OpenedWorks.destroy());
        let p = await(this.ApplicationPublished.destroy());
        let n = await(this.ApplicationNotifications.destroy());
        return r;
      },
      update: (toUpdate) =>  axios.put(url,toUpdate),
      create: (toCreate) =>  axios.put(url,toCreate),
      delete: ({ id }) =>  axios.delete(`${url}/${id}`)
    }
  }
}
export default API;