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
#### Coverage Screenshot
![ScreenShot_Coverage](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Code_Coverage.png)
#### Test Results Screenshot
![ScreenShot_TestResults](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Test_Results.png)

## Task 2 - Commit fuzzer:
For Fuzzer code file - [Click Here](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Fuzzer/main.js)
#### 100 Commits Screenshot
![Commit_Fuzzer](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Itrust_Summary.png)

## Task 3 - Uselesss test detector:
For Detector code file - [Click Here](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Fuzzer/analyze_tests.js)
![Useless_Test]()


## Task 4 - Analysis and build failure:
![Build_Failure](https://github.ncsu.edu/onjoshi/DevOps_M2/blob/master/Screenshots/Checkbox_Build_Output.png)

## Task 5 - Screencast:
Here is a link to our [screencast]()


## Experiences and issues faced while setting up the system:

* Credentials for iTrust: 
iTrust requires credentials to even clone the repository. We had to handle this issue separately because we could not put these in any of the files either. Thus, we had to take the credentials through an appropriate channel and handle all the files accordingly.Since, there is no module readily avaialble to carry out these tasks, this was a major issue that took considerable amount of time to solve.

* iTrust has too many dependencies. This required significant amount of research and we invested time in setting up the   dependencies appropriately.

* The iTrust documentation has been written in such a way that it is from an end user's perspective, rather than of being of much help to a developer. Thus, we had to find command line modules for all the functionalities.

* There is not enough documentation for hosting a virtual machine inside another virtual machine. This was an obstacle too.

* Since we are hosting a Virtual Machine within a Virtual Machine, we face memory provisioning issues as well.

* Different version of Ubuntu have different requirements. We had to modify ansible scripts accordingly to handle the issues faced due to this.

* Making all the ansible tasks idempotent was a big challenge as a lot of tasks required executing direct shell commands. We have thus, put in efforts to ensure that our tasks are idempotent as far as possible by avoiding using modules like the shell module and so on.



## Contribution:


| Team Member                                                                        | Performed By           | 
| -----------------------------------------------------------------------------------|:----------------------:| 
| 1. Ansible scripts and Jenkins Build Test for Checkbox.io                          | Animesh Sinsinwal      | 
| 2. Ansible scripts and Jenkins Build / Fuzzer for iTrust                           | Omkar Joshi            |  
| 3. Jenkins automation upto post-build action and integration                       | Sneha Kulkarni         | 


