var express = require('express')
  , poweredBy = require('connect-powered-by');

module.exports = function() {
  if ('development' == this.env && false) {
    this.use(express.logger());
  }

  this.use(poweredBy('Locomotive'));
  this.use(express.favicon());
  this.use(express.static(__dirname + '/../../public'));
  this.use(express.urlencoded());
  this.use(express.multipart());
  this.use(express.methodOverride());
  this.use(this.router);
  this.use(express.errorHandler());
}
