# CSC-519-DevOps-Project-Milestone II

## Team Details:

| Team Member             | Unity ID      | 
| ------------------------|:-------------:| 
| Omkar Joshi             | onjoshi       |  
| Animesh Sinsinwal       | assinsin      |   
| Sneha Kulkarni          | skkulkar      |



## Ansible Scripts:
1. Driver script which installs Jenkins, creates and triggers build jobs for Checkbox.io and iTrust. [provision_jenkins.yml](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/provision_jenkins.yml) 
2. The ansible script for automating the build and perform test for Checkbox.io is contained in the file [provision_checkbox.yml](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/roles/checkbox/tasks/main.yml)
3. The ansible script for automating the build and perform test for iTrust is contained in the file [provision_iTrust.yml](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/roles/itrust/tasks/main.yml)

## Task 1 - Test suites, coverage, and test results:
We have extended the build definitions of ITrust to report code coverage and test results:- 
#### Coverage Screenshot
For code coverage we have used **_jacoco_** plugin
![ScreenShot_Coverage](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Code_Coverage.png)
#### Test Results Screenshot
For unit tests we have used **_Junit_** plugin
![ScreenShot_TestResults](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Test_Results.png)

## Task 2 - Commit fuzzer:
For Fuzzer code file - [Click Here](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Fuzzer/main.js)
#### 100 Commits Screenshot
![Commit_Fuzzer](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Summary.png)

## Task 3 - Uselesss test detector:
For Detector code file - [Click Here](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Fuzzer/analyze_tests.js)
#### Useless Test Cases (Count 505)
Look into file for all useless tests - [Useless_Test_Text_File](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/useless_tests.txt)


## Task 4 - Analysis and build failure:
![Build_Failure](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Checkbox_Build_Output.png)

## Task 5 - Screencast:
Here is a link to our [screencast](https://drive.google.com/open?id=0B3MiIrLYZHU5WURqcjFXUF9FaEk)


## Experiences and issues faced while setting up the system:

* We first took ITrust and developed the fuzzer test, where we faces issues while executing the post build command.
  According to the build results, we could see that test cases got passed, failed and skipped due to errors. It was difficult to debug through the errors part, as it shouldn't occur in the ideal case.

* We checked the regex for commits part, where we found out that the "STRING" values that we changed, were actually making the test cases skip. Reason is that mandatory variables needed for a test case to perform, were made void in the commits.

* We modified 'analysis.js' in Checkbox Analyzer, where we pushed the process to exit(10), which made our jenkins build fail.


## Contribution:

| Team Member                                                                        | Performed By           | 
| -----------------------------------------------------------------------------------|:----------------------:| 
| 1. Ansible scripts and Jenkins Build Test for Checkbox.io                          | Animesh Sinsinwal      | 
| 2. Ansible scripts and Jenkins Build / Fuzzer for iTrust                           | Omkar Joshi            |  
| 3. Jenkins automation upto post-build action and integration                       | Sneha Kulkarni         | 


