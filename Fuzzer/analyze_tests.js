var Random = require('random-js')
    fs = require('fs')
    xml2js = require('xml2js')
var Promise = require("bluebird");
var recursive = require("recursive-readdir")
var parser = new xml2js.Parser();

function main()
{
    var args = process.argv.slice(2);

    if( args.length == 0 )
    {
        console.error("Enter folder path as first argument.");
        process.exit(1); //TODO
        filePath = "/var/lib/jenkins/jobs/Itrust/workspace/iTrust/target/surefire-reports";
    }else{
        filePath = args[0];
    }

    useless_tests_file =  "useless_tests.txt"

    analyze(filePath, function(passed_testcases){
        if (!fs.existsSync(useless_tests_file)) {
            var testcaseString = passed_testcases.map(function(v){
                return v}).join('\n');
            fs.writeFileSync(useless_tests_file, testcaseString);
        }else{
            var useless_tests = fs.readFileSync(useless_tests_file).toString().split("\n");
            var newContent = "";
            for(var i=0; i < useless_tests.length; i++) {
                if (passed_testcases.indexOf(useless_tests[i]) != -1)
                    newContent+=useless_tests[i]+"\n"; //+ is better than concat in terms of speed.
            }
            fs.writeFileSync(useless_tests_file, newContent);
        }
    });
    
}

function analyze(test_results_folder, callback){
    recursive(test_results_folder, function(err, files){
        if (err){
            console.error("Could not retrieve files from : "+filePath, err);
        }
        else{
            testFiles = files.filter(function(e){
                return e.endsWith(".xml");
            });
            var i = 0;
            var output_passed_testcases = [];
            promiseWhile(function(){
                return i < testFiles.length;
            }, function(){
                return new Promise(function(resolve, reject){
                    analyzeTestSuiteReport(testFiles[i], function(testcases){
                        i=i+1;
                        output_passed_testcases = output_passed_testcases.concat(testcases)
                        resolve();
                    });
                });
            }).then(function(){
                callback(output_passed_testcases);
            })
        }
    });
}

function analyzeTestSuiteReport(testsuite_report_xml, callback){
    var data = fs.readFileSync(testsuite_report_xml)
    var value = parser.parseString(data);
    parser.parseString(data, function (err, result) {
    passed_testcases = []
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
        {
            var testcase = result.testsuite.testcase[i];
            if (testcase.hasOwnProperty('failure') || testcase.hasOwnProperty("error"))
            {
                // console.log (testcase['$'].classname+"."+testcase['$'].name);
            }
            else
            {
                console.log (testcase['$'].classname+"."+testcase['$'].name)
                passed_testcases.push(testcase['$'].classname+"."+testcase['$'].name)
            }
        }
        callback(passed_testcases);
        // return passed_testcases;
    });
}

main();
// exports = mutationTesting;
exports.main = main;

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

var promiseWhile = function(condition, action) {
    var resolver = Promise.defer();

    var loop = function() {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };

    process.nextTick(loop);

    return resolver.promise;
};