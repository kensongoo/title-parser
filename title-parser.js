#!/usr/bin/env node

var program = require('commander');
var assert = require('assert');
var debug = require('debug');
var jsdom = require('jsdom');
var _ = require('lodash');
var htmlencode = require('htmlencode').htmlEncode;
var trim = require('trim');

program
  .version('0.0.1')
  .option('-u, --url <urlPath>', 'Target url path')
  .option('-r, --rootElement <rootElementId>', 'Root element id')

program
  .command('get')
  // .description('run setup commands for all envs')
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(options){
      console.log(program.url);
      console.log(program.rootElement);
      openWebPage(program.url, program.rootElement);
  });
 
program.parse(process.argv);

function getListOfPageUrl(url, rootElement, cb) {
  var urls = [];

  jsdom.env({
    url: url,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      var $ = window.$;
      $(rootElement).each(function() {
        $(this).attr('href') && urls.push($(this).attr('href'));
      });

      cb(urls);
    }
  });
}

function getTitle(url, cb) {
  jsdom.env({
    url: url,
    done: function (errors, window) {
      if (window && window.document) {
        cb(window.document.title);  
      }
      else {
        cb(null);
      }
    }
  }); 
}

function openWebPage(url, rootElement) {
  getListOfPageUrl(url, rootElement, function(urls) {
    _.each(urls, function(item, key) {
      (function() {

          item = item.match(/http:/) ? item : 'http:'+ item;

          getTitle(item, function(title) {
            console.log(item);
            console.log(htmlencode(trim(title)));
            console.log('');
          });
      })(item);
    });  
  });
}
