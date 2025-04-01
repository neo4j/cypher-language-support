plugins {
    id("org.jetbrains.intellij.platform") version "2.1.0"
}

repositories {
    mavenCentral()

    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdeaUltimate("2024.2.3")
        bundledPlugin("JavaScript")
        instrumentationTools()
    }
}

group = "org.neo4j.intellij.lsp"
version = "1.1-SNAPSHOT"

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }

    clean {
        doFirst {
            exec {
                commandLine("bash", "-c", "rm -rf *.js")
            }
        }
    }

    task("bundleServer") {
        val outputFile = file("../language-server/dist/cypher-language-server.js")
        val targetDir = file(".")

        inputs.file(outputFile)
        outputs.file(targetDir.resolve("cypher-language-server.js"))

        doLast {
            exec {
                workingDir = file("../language-server")
                commandLine = listOf("bash", "-c", "npm run bundle")
            }

            copy {
                from(outputFile)
                into(targetDir)
            }
        }
    }

    prepareSandbox {
        dependsOn("bundleServer")

        from(".") {
            include("*.js")
            into("neo4j-for-intellij")
        }
    }

    buildPlugin {
        dependsOn(prepareSandbox)
    }

    runIde {
        dependsOn(buildPlugin, prepareSandbox)

        debugOptions {
           enabled = false
           port = 8000
           server = true
           suspend = true
       }
    }

    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        // alpha, beta or eap
        channels.set(listOf("beta"))
        token.set(System.getenv("PUBLISH_TOKEN"))
    }
}
