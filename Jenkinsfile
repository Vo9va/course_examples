import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

node {
    // Указывает Jenkins использовать конкретную конфигурацию Node.js, добавляя её в PATH
    nodejs(nodeJSInstallationName: 'nodeJS 20.10.0') {
        sh 'node --version'
        sh 'npm --version'

    properties([
        parameters([
            choice(choices: ['capitalix', 'tradeEU', 'nrdx', 'wc1'], description: 'Select Brand', name: 'BRAND'),
            choice(choices: ['dev', 'stage', 'prod'], description: 'Select Environment', name: 'ENVIRONMENT'),
            booleanParam(defaultValue: true, description: 'Run UI Tests', name: 'RUN_DESKTOP_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Desktop Tests', name: 'RUN_MOBILE_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Mobile Tests', name: 'RUN_APPLICATION_TESTS'),
            booleanParam(defaultValue: true, description: 'Run Backoffice Tests', name: 'RUN_BO_TESTS'),
            booleanParam(defaultValue: true, description: 'Run FO API Tests', name: 'RUN_FO_API_TESTS'),
            booleanParam(defaultValue: true, description: 'Run BO API Tests', name: 'RUN_BO_API_TESTS'),
        ])
    ])

    stage('Checking out from Git for UI') {
        checkout scmGit(branches: [[name: '*/main']],
                                            userRemoteConfig: [
                                                [ url: 'https://github.com/Vo9va/course_examples.git' ]
                                            ])
        if (params.RUN_DESKTOP_TESTS.toBoolean() || params.RUN_MOBILE_TESTS.toBoolean() || params.RUN_APPLICATION_TESTS.toBoolean() || params.RUN_BO_TESTS.toBoolean()) {
            script {
                currentBuild.displayName = "${params.BRAND}"
                currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            }
            echo 'Checking out from Git for UI'
        } else {
            Utils.markStageSkippedForConditional('Checking out from Git for UI')
            echo 'Checking out from Git for UI is skipped'
        }
    }
    stage('Building dependencies for UI') {
        if (params.RUN_DESKTOP_TESTS.toBoolean() || params.RUN_MOBILE_TESTS.toBoolean() || params.RUN_APPLICATION_TESTS.toBoolean() || params.RUN_BO_TESTS.toBoolean()) {
             echo 'Building dependencies for UI'
             sh 'npm install'
        } else {
            Utils.markStageSkippedForConditional('Building dependencies for UI')
            echo 'Building dependencies for UI is skipped'
        }
    }
        parallel(
                "Desktop Tests": {
                    stage('Run Desktop tests') {
                        script {
                            if (params.RUN_DESKTOP_TESTS.toBoolean()) {
                                echo 'Run Desktop tests'
                                sh "REPORT=true MAX_INSTANCES=5 npm run ${params.BRAND}.desktop.${params.ENVIRONMENT}"
                            } else {
                                Utils.markStageSkippedForConditional('Run Desktop tests')
                                echo 'Desktop tests are skipped'
                            }
                        }
                    }
                },
                "Web Mobile Tests": {
                    stage('Run Web Mobile tests') {
                        script {
                            if (params.RUN_MOBILE_TESTS.toBoolean()) {
                                echo 'Running Web Mobile tests'
                                sh "REPORT=true MAX_INSTANCES=5 npm run ${params.BRAND}.mobile.${params.ENVIRONMENT}"
                            } else {
                                Utils.markStageSkippedForConditional('Run Web Mobile tests')
                                echo 'Web Mobile tests are skipped'
                            }
                        }
                    }
                },
                "Application Tests": {
                    stage('Run Application tests') {
                        script {
                            if (params.RUN_APPLICATION_TESTS.toBoolean()) {
                                echo 'Run Application tests'
                                sh "REPORT=true npm run app.${params.BRAND}.mobile.${params.ENVIRONMENT}"
                            } else {
                                Utils.markStageSkippedForConditional('Run Application tests')
                                echo 'Application tests are skipped'
                            }
                        }
                    }
                },
                "BO Tests": {
                    stage('Run BO tests') {
                        script {
                            if (params.RUN_BO_TESTS.toBoolean()) {
                                echo 'Run BO tests'
                                sh "REPORT=true npm run bo.${params.BRAND}.${params.ENVIRONMENT}"
                            } else {
                                Utils.markStageSkippedForConditional('Run BO tests')
                                echo 'BO tests are skipped'
                            }
                        }
                    }
                }
        )
    stage('Checking out from Git for API') {
        if (params.RUN_FO_API_TESTS.toBoolean() || params.RUN_BO_API_TESTS.toBoolean()) {
            script {
                currentBuild.displayName = "${params.BRAND}"
                currentBuild.description = "BRAND=${params.BRAND}, ENV=${params.ENVIRONMENT}"
            }
            echo 'Checking out from Git for API'
            checkout scmGit(branches: [[name: '*/main']],
                                    userRemoteConfig: [
                                        [ url: 'https://github.com/Vo9va/course_examples.git' ]
                                    ])
        } else {
            Utils.markStageSkippedForConditional('Checking out from Git for API')
            echo 'Checking out from Git for API is skipped'
        }
    }
    stage('Building dependencies for API') {
        if (params.RUN_FO_API_TESTS.toBoolean() || params.RUN_BO_API_TESTS.toBoolean()) {
             echo 'Building dependencies for API'
             sh 'npm install'
        } else {
            Utils.markStageSkippedForConditional('Building dependencies for API')
            echo 'Building dependencies for API is skipped'
        }
    }
                stage('Run FO API Tests') {
                    script {
                        if (params.RUN_FO_API_TESTS.toBoolean()) {
                            echo 'Running FO API Tests'
                            sh "REPORT=true npm run ${params.BRAND}.${params.ENVIRONMENT}"
                        } else {
                            Utils.markStageSkippedForConditional('Run FO API Tests')
                            echo 'FO API tests are skipped'
                        }
                    }
                }
                stage('Run BO API Tests') {
                    script {
                        if (params.RUN_BO_API_TESTS.toBoolean()) {
                            echo 'Running BO API Tests'
                            sh "REPORT=true npm run bo.${params.BRAND}.${params.ENVIRONMENT}"
                        } else {
                            Utils.markStageSkippedForConditional('Run BO API Tests')
                            echo 'BO API tests are skipped'
                        }
                    }
                }
  }
}
