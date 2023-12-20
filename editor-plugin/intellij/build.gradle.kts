plugins {
    id("java")
    id("org.jetbrains.intellij") version "1.16.1"
}

group = "org.neo4j.intellij.lsp"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

intellij {
    version.set("2023.3")
    type.set("IU")
    plugins.set(listOf("JavaScript"))
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "17"
        targetCompatibility = "17"
    }

    clean {
        doFirst {
            exec {
                commandLine("bash", "-c", "rm -rf *.js")
            }
        }
    }

    prepareSandbox {
        doFirst {
            exec {
                commandLine("bash", "-c", "cd ../.. && npm run build && cp packages/language-server/dist/cypher-language-server.js ./editor-plugin/intellij")
            }
        }
        from(".") {
            include("*.js")
            into("cypher-lsp-support")
        }
    }

    patchPluginXml {
        sinceBuild.set("233")
        untilBuild.set("241.*")
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
