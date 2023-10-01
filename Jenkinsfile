pipeline {
    agent any
    tools {nodejs "nodeJs 16.16.0"}
    triggers {pollSCM('* * * * *')}
    stages {
        stage('Checkout') {
            steps {
               checkout scmGit(branches: [[name: '*/main']],
                               userRemoteConfig: [
                                   [ url: 'https://github.com/Vo9va/course_examples.git' ]
                               ])
                sh 'echo checkout main'
            }
        }
        stage('Build dependencies'){
            steps{
            echo 'Building dependencies'
            sh 'npm install'
            }
        }
        stage('Run test') {
             steps {
               echo 'Start tests'
               sh 'npm test'
              }
        }
    }
}
