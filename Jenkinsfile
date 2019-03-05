#!groovy

@Library('kanolib') _

pipeline {
    agent {
        label 'ubuntu_18.04_with_docker'
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
            step([$class: 'CheckStylePublisher', pattern: 'eslint.xml'])
            script {
                github.updatePRWithCoverageData file: 'coverage/coverage-summary.md'
                jira.updateIssuesStatus('SX')
            }
        }
        regression {
            script {
                email.notifyCulprits()
            }
        }
        fixed {
            script {
                email.notifyCulprits()
            }
        }
    }
    stages {
        // pulls down locally the sources for the component
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        // Install the bower dependencies of the component
        stage('install dependencies') {
            steps {
                sshagent(['read-only-github']) {
                    script {
                        docker.image('node:8-alpine').inside {
                            sh "yarn"
                        }
                    }
                }
            }
        }
        // Lints, the component
        stage('checkstyle') {
            steps {
                script {
                    docker.image('node:8-alpine').inside {
                        sh "yarn lint-ci || exit 0"
                    }
                }
            }
        }
        stage('test') {
            steps {
                script {
                    docker.image('kanocomputing/puppeteer').inside('--cap-add=SYS_ADMIN') {
                        sh "yarn test-ci"
                        sh "yarn coverage-ci"
                    }
                }
            }
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES')
    }
}
