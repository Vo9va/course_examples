node {
    properties([
        parameters([
            choice(choices: ['capitalix', 'tradeEU', 'nrdx', 'wc1'], description: 'Select Brand', name: 'BRAND'),
            choice(choices: ['dev', 'stage', 'prod'], description: 'Select Environment', name: 'ENVIRONMENT'),
            booleanParam(defaultValue: true, description: 'Run UI Tests', name: 'RUN_DESKTOP_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Desktop Tests', name: 'RUN_MOBILE_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Mobile Tests', name: 'RUN_APPLICATION_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Backoffice Tests', name: 'RUN_BO_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Backoffice Tests', name: 'RUN_BO_API'),
            booleanParam(defaultValue: true, description: 'Run Backoffice Tests', name: 'RUN_FO_API'),
        ])
    ])

    stage('Install Node.js 20') {
        script {
            def nodeJSHome = tool 'nodeJS 20.10.0'
            env.PATH = "${nodeJSHome}/bin:${env.PATH}"
        }
    }

    stage('Checkout one project') {
        checkout scmGit(branches: [[name: '*/main']],
                        userRemoteConfig: [
                            [ url: 'https://github.com/Vo9va/course_examples.git' ]
                        ])
        sh 'echo checkout main'
    }

    stage('Install Dependencies') {
        script {
            currentBuild.displayName = "${params.BRAND}"
            currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            sh "npm install"
        }
    }

    parallel(
        "Desktop Tests": {
            stage('Run Desktop test') {
                if (params.RUN_DESKTOP_TESTS.toBoolean()) {
                    echo 'Run Desktop test'
                }
            }
        },
        "Web Mobile Tests": {
            stage('Run Web Mobile test') {
                if (params.RUN_MOBILE_TESTS.toBoolean()) {
                    echo 'Run Web Mobile test'
                }
            }
        },
        "Application Tests": {
            stage('Run Application test') {
                if (params.RUN_APPLICATION_TESTS.toBoolean()) {
                    echo 'Run Application test'
                }
            }
        },
        "BO Tests": {
            stage('Run BO test') {
                if (params.RUN_BO_TESTS.toBoolean()) {
                    echo 'Run BO test'
                }
            }
        }
    )

    stage('Checkout one project') {
        checkout scmGit(branches: [[name: '*/main']],
                        userRemoteConfig: [
                            [ url: 'https://github.com/Vo9va/course_examples.git' ]
                        ])
        sh 'echo checkout main'
    }

    stage('Install Dependencies') {
        script {
            currentBuild.displayName = "${params.BRAND}"
            currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            sh "npm install"
        }
    }

    parallel(
        "fo api": {
            stage('Run Desktop test') {
                if (params.RUN_BO_API.toBoolean()) {
                    echo 'Run Desktop test'
                }
            }
        },
        "bo api": {
            stage('Run Web Mobile test') {
                if (params.RUN_FO_API.toBoolean()) {
                    echo 'Run Web Mobile test'
                }
            }
        }
    )
}
