var Random = require('random-js')
    fs = require('fs')
    var recursive = require("recursive-readdir");

function main()
{

    // fuzzer.seed(0);

    var args = process.argv.slice(2);

    if( args.length == 0 )
    {
        console.error("Enter folder path as first argument.");
        // process.exit(1); //TODO
        filePath = "/var/lib/jenkins/jobs/Itrust/workspace/iTrust/src/main";
    }else{
        filePath = args[0];
    }
    
    recursive(filePath, function(err, files){
        if (err){
            console.error("Could not retrieve files from : "+filePath, err);
        }
        else{
                javaFiles = files.filter(function(e){
                return e.endsWith(".java");
                });
                // console.log(javaFiles);
                var randomJavaFiles = fuzzer.random.sample(javaFiles, 25);
                // console.log(randomJavaFiles);
                mutateFiles(randomJavaFiles);
            }
        }
    );
    // mutationTesting(['test.md','/var/lib/jenkins/jobs/Itrust/workspace/iTrust/src/main/edu/ncsu/csc/itrust/action/PayBillAction.java'],1000);
    // mutationTesting(['test.md','Simple.md'],1000);

}

var fuzzer = 
{
    random : new Random(Random.engines.mt19937().autoSeed()),
    
    seed: function (kernel)
    {
        fuzzer.random = new Random(Random.engines.mt19937().seed(kernel));
    },

    mutate:
    {
        string: function(val)
        {
            output = val;
            // // MUTATE IMPLEMENTATION HERE
            // var array = val.split('');

            // if( fuzzer.random.bool(0.05) )
            // {
            //     // REVERSE
            // }
            // // delete random characters
            // if( fuzzer.random.bool(0.25) )
            // {
            //     //fuzzer.random.integer(0,99)
            //     array.splice(fuzzer.random.integer(0, array.length), fuzzer.random.integer(1, 1000));
                
            // }
            if( fuzzer.random.bool(0.5) )
            {
                output = val.replace(new RegExp('"'), '"TEMP')    
            }
            if( fuzzer.random.bool(0.5) )
            {
                output = val.replace(new RegExp("== null", 'g'), "!= null")    
            }
            return output;
        }
    }
};

function mutateFiles(paths)
{
    for(var i = 0; i < paths.length; i++){
        var fileText = fs.readFileSync(paths[i],'utf-8');
        mutatedString = fuzzer.mutate.string(fileText);
        if(mutatedString === fileText)
            console.log("Not Changed");
        else
            console.log("Changed");
        fs.writeFileSync(paths[i], mutatedString); 
    }
}

// function mutationTesting(paths,iterations)
// {    
//     var failedTests = [];
//     var reducedTests = [];
//     var passedTests = 0;
    
//     // var markDownA = fs.readFileSync(paths[0],'utf-8');
//     var markDownB = fs.readFileSync(paths[1],'utf-8');
//     mutuatedString = fuzzer.mutate.string(markDownB);

//     fs.writeFileSync(paths[1], mutuatedString);

//     // for (var i = 0; i < iterations; i++) {

//     //     let mutuatedString = fuzzer.mutate.string(markDownB);
        
//     //     // try
//     //     // {
//     //     //     marqdown.render(mutuatedString);
//     //     //     passedTests++;
//     //     // }
//     //     // catch(e)
//     //     // {
//     //     //     failedTests.push( {input:mutuatedString, stack: e.stack} );
//     //     // }
//     // }

//     reduced = {};
//     // RESULTS OF FUZZING
//     for( var i =0; i < failedTests.length; i++ )
//     {
//         var failed = failedTests[i];

//         var trace = stackTrace.parse( failed.stack );
//         var msg = failed.stack.split("\n")[0];
//         console.log( msg, trace[0].methodName, trace[0].lineNumber );

//         // let key = trace[0].methodName + "." + trace[0].lineNumber;
//         // if( !reduced.hasOwnProperty( key ) )
//         {
//         }
//     }

//     // console.log( "passed {0}, failed {1}, reduced {2}".format(passedTests, failedTests.length, reducedTests.length) );
    
//     // for( var key in reduced )
//     // {
//     //     console.log( reduced[key] );
//     // }

// }

main();
// exports = mutationTesting;
exports.fuzzer = fuzzer;
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