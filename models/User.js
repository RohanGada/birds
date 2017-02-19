var mongoose = require('mongoose');
var _ = require('lodash');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
      id:String,
      teamId:Number,
      email:String,
      firstName:String,
      lastName:String,
      role:String,
      timezone:String,
      profileImage:String,
      locale:String,
      company_role:String,
      token:String
});

module.exports = mongoose.model('User', UserSchema);
var models = {
    saveData: function(data, callback) {
      var user = this(data);
      user.save(function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    },
    editData: function(data, callback) {
      this.findOneAndUpdate({
        _id: data._id
      }, {
        $set: data
      }, {
        new: true
      }).exec(function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    },
    findByUserId:function (data,callback) {
      this.findOne({
        id:data.userId
      }).exec(function (err,data) {
        if(err){
          callback(err,null);
        }else if(data){
          callback(null,data);
        }else{
          callback(null,{});
        }
      });
    },
    findTeamHR: function (data,callback) {
      this.findOne({
        teamId:data.teamId,
        company_role:'HR'
      }).exec(function (err,data) {
        if(err){
          callback(err,null);
        }else if(data){
          callback(null,data);
        }else{
          callback(null,{});
        }
      });
    },
    deleteData: function(data, callback) {
      this.findOneAndRemove({
        _id: data._id
      }).exec(function(err, data) {
        if (err) {
          callback(err, null);
        } else if (data) {
          callback(null, data);
        } else {
          callback('Document not found', null);
        }
      });
    },
    deleteDataByFlockUserId: function(data, callback) {
      // console.log(data);
      this.findOneAndRemove({
        id: data.userId
      }).exec(function(err, data) {
        if (err) {
          callback(err, null);
        } else if (data) {
          callback(null, data);
        } else {
          callback('Document not found', null);
        }
      });
    },
    getAll: function (data,callback) {
      this.find({},{},{},function (err,data) {
        if(err){
          callback(err,null);
        }else if(data){
          callback(null,data);
        }else{
          callback("Document not found",null);
        }
      });
    },
    getOne: function (data,callback) {
      this.findOne({
        _id:data._id
      }).exec(function (err,data) {
        if(err){
          callback(err,null);
        }else if(data){
          callback(null,data);
        }else{
          callback("Document not found",null);
        }
      });
    }
};

module.exports = _.assign(module.exports, models);
