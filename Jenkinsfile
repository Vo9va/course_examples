pipeline {
    agent any
    triggers { pollSCM('* * * * *') }

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
}
