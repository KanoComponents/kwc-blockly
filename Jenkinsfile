#!groovy

@Library('kanolib') _

pipeline {
    agent {
        label 'ubuntu_18.04'
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            step([$class: 'CheckStylePublisher', pattern: 'eslint.xml'])
        }
        regression {
            notify_culprits currentBuild.result
        }
    }
    stages {
        // pulls down locally the sources for the component
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('tools') {
            steps {
                script {
                    def NODE_PATH = tool name: 'Node 8.11.2', type: 'nodejs'
                    env.PATH = "${env.PATH}:${NODE_PATH}/bin"
                    def YARN_PATH = tool name: 'yarn', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${env.PATH}:${YARN_PATH}/bin"
                }
            }
        }
        // Install the bower dependencies of the component
        stage('install dependencies') {
            steps {
                sshagent(['read-only-github']) {
                    script {
                        sh "yarn"
                    }
                }
            }
        }
        // Lints, the component
        stage('checkstyle') {
            steps {
                script {
                    sh "yarn checkstyle-ci || exit 0"
                }
            }
        }
        stage('test') {
            steps {
                script {
                    install_chrome_dependencies()
                    sh "yarn test-ci"
                }
            }
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }
}
