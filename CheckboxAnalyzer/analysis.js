var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var recursive = require("recursive-readdir");
var path = require('path');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["/Users/a_sinsinwal/TempGit/checkbox.io/server-side/"];
		// args = ['CheckboxAnalyzer/analysis.js']
	}
	var filePath = args[0];

	//ignore node_modules
	function ignoreFunc(file, stats) {
		// `file` is the absolute path to the file, and `stats` is an `fs.Stats`
		// object returned from `fs.lstat()`.
		return stats.isDirectory() && path.basename(file) == "node_modules";
	  }
	
	// analyze(filePath);
	recursive(filePath, [ignoreFunc], function(err, files){
        if (err){
            console.error("Could not retrieve files from : "+filePath, err);
        }
        else{
                jsFiles = files.filter(function(e){
                return e.endsWith(".js");
                });
				console.log(jsFiles);
				for (var i = 0; i < jsFiles.length; i++){
					analyze(jsFiles[i]);
				}
				// Report
				for( var node in builders )
				{
					var builder = builders[node];
					builder.report();
				}
            }
        }
	);

	// Report
	// for( var node in builders )
	// {
	// 	var builder = builders[node];
	// 	builder.report();
	// }
}



var builders = {};

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,
	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;
	// The max depth of scopes (nested ifs, loops, etc)
	this.MaxNestingDepth    = 0;
	// The max number of conditions if one decision statement.
	this.MaxConditions      = 0;

	//To Store File Name
	this.FileName = "";

	//Detect long method
	this.LongMethod = false;
	this.EndLine = 0;

	//More than one sync calls
	this.MoreThanOneSyncCalls = false;

	//Detect Long Message Chains
	this.LongMessageChains = false;

	//Big O More Than Three
	this.BigOMoreThanThree = false;

	this.report = function()
	{
		console.log(
		   (
		   	"{0}(): {1}\n" +
		   	"============\n" +
				"MoreThanOneSyncCalls: {2}\n" +
				"LongMethod: {3}\n"+
				"LongMessageChains: {4}\n"+
				"BigOMoreThanThree: {5}\n"
			)
			.format(this.FunctionName, this.FileName,
				    this.MoreThanOneSyncCalls, this.LongMethod, this.LongMessageChains, this.BigOMoreThanThree)
		);

		if(this.BigOMoreThanThree || this.MoreThanOneSyncCalls || this.LongMessageChains || this.LongMethod){
			process.exit(10);
		}
	}

};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "Strings {2}\n"
			).format( this.FileName, this.ImportCount, this.Strings ));
	}
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function analyze(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// // A file level-builder:
	// var fileBuilder = new FileBuilder();
	// fileBuilder.FileName = filePath;
	// fileBuilder.ImportCount = 0;
	// builders[filePath] = fileBuilder;
	// var importNumber = 0;

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') 
		{
			var builder = new FunctionBuilder();
			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			builder.ParameterCount = node.params.length;
			builder.FileName = filePath;
			builder.EndLine = node.loc.end.line;
			builder.LongMethod = builder.EndLine - builder.StartLine > 120 ? true: false;
			syncCallsCount = 0;

			traverseWithParents(node, function (function_body){

				if (function_body.type === 'IfStatement'){
					builder.SimpleCyclomaticComplexity += 1;
					traverseWithParents(function_body, function (statement){
						if (statement.type === 'LogicalExpression'){
							builder.MaxConditions += 1;
						}
					});
					builder.MaxConditions += 1;
				}

				if(isLoop(function_body)){
					traverseWithParents(function_body.body, function(level2_loop){
						if(isLoop(level2_loop)){
							traverseWithParents(level2_loop.body, function(level3_loop){
								if(isLoop(level3_loop)){
									builder.BigOMoreThanThree = true;
									traverseWithParents(level3_loop.body, function(level4_loop){
										if(isLoop(level4_loop)){
											builder.BigOMoreThanThree = true;
										}
									});	
								}
							});
						}
					});
				}

				if (function_body.type === 'CallExpression') 
				{
					if (function_body.callee.property && function_body.callee.property.name.indexOf('Sync') != -1)
					{
						syncCallsCount++;
					}
				}

				if (function_body.type === 'MemberExpression') 
				{
					if(function_body.object && (function_body.object.type === 'MemberExpression' ||
					 function_body.object.type === 'CallExpression')){
						var innerEpression = function_body.object;
					 }else if(function_body.callee && (function_body.callee.type === 'MemberExpression' ||
					function_body.callee.type === 'CallExpression')){
						var innerEpression = function_body.callee;
					}
					if(innerEpression){
						if(innerEpression.object && (innerEpression.object.type === 'MemberExpression' ||
						innerEpression.object.type === 'CallExpression')){
						   var evenInner = innerEpression.object;
						}else if(innerEpression.callee && (innerEpression.callee.type === 'MemberExpression' ||
						innerEpression.callee.type === 'CallExpression')){
						   var evenInner = innerEpression.callee;
					   }
					   if(evenInner){
							if(evenInner.object && (evenInner.object.type === 'MemberExpression' ||
							evenInner.object.type === 'CallExpression')){
								builder.LongMessageChains = true;
							}else if(evenInner.callee && (evenInner.callee.type === 'MemberExpression' ||
							evenInner.callee.type === 'CallExpression')){
								builder.LongMessageChains = true;
							}   
					   }	
					} 
				}
			});
			builder.MoreThanOneSyncCalls = syncCallsCount > 1?true: false;
			if(builder.BigOMoreThanThree || builder.LongMessageChains || builder.LongMethod || builder.MoreThanOneSyncCalls)
				builders[builder.FunctionName] = builder;
		}
	});

}

// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}


// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Looping Conditon
function isLoop(node)
{
	if( node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}


// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();

function Crazy (argument) 
{

	var date_bits = element.value.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
	var new_date = null;
	if(date_bits && date_bits.length == 4 && parseInt(date_bits[2]) > 0 && parseInt(date_bits[3]) > 0)
    new_date = new Date(parseInt(date_bits[1]), parseInt(date_bits[2]) - 1, parseInt(date_bits[3]));

    var secs = bytes / 3500;

      if ( secs < 59 )
      {
          return secs.toString().split(".")[0] + " seconds";
      }
      else if ( secs > 59 && secs < 3600 )
      {
          var mints = secs / 60;
          var remainder = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var szmin;
          if ( mints > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          return mints.toString().split(".")[0] + " " + szmin + " " +
remainder.toString() + " seconds";
      }
      else
      {
          var mints = secs / 60;
          var hours = mints / 60;
          var remainders = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var remainderm = parseInt(mints.toString().split(".")[0]) -
(parseInt(hours.toString().split(".")[0]) * 60);
          var szmin;
          if ( remainderm > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          var szhr;
          if ( remainderm > 1 )
          {
              szhr = "hours";
          }
          else
          {
              szhr = "hour";
              for ( i = 0 ; i < cfield.value.length ; i++)
				  {
				    var n = cfield.value.substr(i,1);
				    if ( n != 'a' && n != 'b' && n != 'c' && n != 'd'
				      && n != 'e' && n != 'f' && n != 'g' && n != 'h'
				      && n != 'i' && n != 'j' && n != 'k' && n != 'l'
				      && n != 'm' && n != 'n' && n != 'o' && n != 'p'
				      && n != 'q' && n != 'r' && n != 's' && n != 't'
				      && n != 'u' && n != 'v' && n != 'w' && n != 'x'
				      && n != 'y' && n != 'z'
				      && n != 'A' && n != 'B' && n != 'C' && n != 'D'
				      && n != 'E' && n != 'F' && n != 'G' && n != 'H'
				      && n != 'I' && n != 'J' && n != 'K' && n != 'L'
				      && n != 'M' && n != 'N' &&  n != 'O' && n != 'P'
				      && n != 'Q' && n != 'R' && n != 'S' && n != 'T'
				      && n != 'U' && n != 'V' && n != 'W' && n != 'X'
				      && n != 'Y' && n != 'Z'
				      && n != '0' && n != '1' && n != '2' && n != '3'
				      && n != '4' && n != '5' && n != '6' && n != '7'
				      && n != '8' && n != '9'
				      && n != '_' && n != '@' && n != '-' && n != '.' )
				    {
				      window.alert("Only Alphanumeric are allowed.\nPlease re-enter the value.");
				      cfield.value = '';
				      cfield.focus();
				    }
				    cfield.value =  cfield.value.toUpperCase();
				  }
				  return;
          }
          return hours.toString().split(".")[0] + " " + szhr + " " +
mints.toString().split(".")[0] + " " + szmin;
      }
  }
 exports.main = main;