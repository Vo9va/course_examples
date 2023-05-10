pipeline {
    agent any

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
        stage('Hello1') {
            steps {
               ansiblePlaybook credentialsId: 'github-ssh-id', disableHostKeyChecking: true, installation: 'ansible', inventory: 'hosts.txt', playbook: 'install-clamac.yml'
            }
        }
    }
}
