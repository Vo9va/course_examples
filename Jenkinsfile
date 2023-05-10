pipeline {
    agent any

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
        stage('install clamac') {
              steps {
                echo 'Starting unit tests'
                sh 'ansible-playbook -i host.txt install-clamac.yml --check'
              }
        }
    }
}
