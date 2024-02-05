pipeline {
    agent any
    tools { nodejs "nodeJS 20.10.0" }
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
//             stage('Build dependencies'){
//                 steps{
//                 echo 'Building dependencies'
//                 sh 'npm install'
//                 }
//             }
//             stage('Run test') {
//                  steps {
//                    echo 'Start tests'
//                    sh 'npm test'
//                   }
         }
    }
}
