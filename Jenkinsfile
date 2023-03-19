pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    stages {

        stage('checkout') {
          steps {
            checkout scmGit(branches: [[name: '*/main']],
                            extensions: [],
                            userRemoteConfigs: [[
                                url: 'git@github.com:Vo9va/course_examples.git'
                                ]]
            )
          }
        }

        stage('Build') {
              steps {
                echo 'Building dependencies'
                sh 'npm install'
              }
            }

        stage('Test') {
              when {
                expression {
                  params.env == "dev"
                 }
              }
              steps {
                echo 'Starting unit tests'
                sh 'npm test'
              }
            }
}
