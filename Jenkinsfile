pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    stages {
        stage('Checkout') {
            steps {
               checkout scmGit(branches: [[name: '*/main']],
                               extensions:[],)
                               userRemoteConfig:[[
                                   url: 'git@github.com:Vo9va/course_examples.git'
                               ]]
                sh 'echo Hello World'
            }
        }
        stage('Build'){
            steps{
            sh 'echo erytrtrytrtt'
            }
        }
    }
}
