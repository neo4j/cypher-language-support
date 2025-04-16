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

    prepareSandbox {
        doFirst {
            exec {
                commandLine("bash", "-c", "cd ../.. && pnpm build && cp packages/language-server/dist/cypher-language-server.js ./editor-plugin/intellij")
            }
        }
        from(".") {
            include("*.js")
            into("cypher-lsp-support")
        }
    }

    patchPluginXml {
        sinceBuild.set("242")
        untilBuild.set("242.*")
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
