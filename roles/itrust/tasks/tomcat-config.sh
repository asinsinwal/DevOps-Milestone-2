#!/bin/bash

#sudo mv apache-tomcat-9.0.0.M26 tomcat9
echo "export CATALINA_HOME="/opt/tomcat9/apache-tomcat-9.0.0.M26"" >> /etc/environment
echo "export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-i386"" >> /etc/environment
echo "export JRE_HOME="/usr/lib/jvm/java-8-openjdk-i386/jre"" >> /etc/environment
source ~/.bashrc