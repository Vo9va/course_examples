pipeline {
    agent any

    tools {
        nodejs 'nodejs 18.15.0'
      }

    triggers { pollSCM('') }
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
        stage('Build'){
            steps{
            echo 'Building dependencies'
            sh 'npm install'
            }
        }
        stage('Install clamav on ec2 instances') {
              steps {
                echo 'Starting unit tests'
                sh 'npm testf'
              }
            }
    }
}
