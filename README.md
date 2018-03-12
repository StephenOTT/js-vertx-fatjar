# js-vertx-fatjar
A boilerplate project for Vert.x using Javascript and gradle to generate fatjars

# Quickstart

1. Add NPM Dependencies: `./gradle npmInstall` (reads from [package.json](./package.json))

1. Add RubyGem Dependencies: `./gradle bundleInstall` (reads from [Gemfile](./Gemfile))

1. Run the app: `./gradlew run`.  Once you are done working within gradle, you can build the FatJar.  The Run task uses the [vertx-config.json](./vertx-config.json) as the entry verticle's (MyJavaScriptVerticle.js) config file.

1. Build FatJar: `./gradlew shadowJar` which will build the fatJar in `./build/libs/js-vertx-fatjar-0.1.0-fat.jar`

1. You can run the FatJar in a Java 8+ environment by running: `java -jar /path/to/js-vertx-fatjar-0.1.0-fat.jar -conf path/to/vertx-config.json`.

    Note that a config.json value is required.  If the file is a empty object (such as `{}`) or is omitted, the Vertx instance will be stopped.

## Sample Console Output

```console
Watched paths: [/Users/MyUser/Documents/GitHub/js-vertx-fatjar/./app]
Starting the vert.x application in redeploy mode
Starting vert.x application...
fa10a5e9-6baa-4a3c-b8bb-e6381621dce2-redeploy
config.json contents:
{"mykey":"myvalue"}
ruby_gems absolute path: /Users/MyUser/Documents/GitHub/js-vertx-fatjar/build/resources/main/ruby_gems
Starting primary verticle
Succeeded in deploying verticle
Starting 3 Verticle
true <-- Outputted from verticles/MyJavaScriptVerticle2.js to show that lodash was loaded
Starting 2 Verticle
2018-03-13 16:24:41 -0400 <-- Outputted from Ruby
2018-03-13 11:00:00 -0400 <-- Outputted from Ruby
2018-03-13 09:15:00 -0400 <-- Outputted from Ruby
```

You might also see warnings with messages such as:

```
Thread Thread[vert.x-eventloop-thread-1,5,main] has been blocked for 3529 ms, time limit is 2000
Thread Thread[vert.x-eventloop-thread-1,5,main] has been blocked for 4533 ms, time limit is 2000
Thread Thread[vert.x-eventloop-thread-1,5,main] has been blocked for 5536 ms, time limit is 2000
io.vertx.core.VertxException: Thread blocked
```

These tend to occur when Vertx instance is first starting up, and the machine is slow.


# Goals

1. Create a project structure that is as close to a docker vertx cli structure as possible.  Example: not using `src/main/resources`.

# Install NPM Dependencies:

See the package.json file in project root.

Uses: https://github.com/srs/gradle-node-plugin.
See the Github repo for additional plugin support for Yarn, Grunt, and Gulp. 

To download dependencies run: `./gradle npmInstall`
A `node_modules` folder will be added to the project root.  This folder is in the `.gitignore` file.  When you run the build the following will run:

```groovy
processResources {
  from 'app'
  from ('node_modules') {into 'node_modules'}
}
```

The above will create a `node_modules` folder in the build's root (inside of the `app` folder).

@TODO:
- [ ] Add npmInstall and Update tasks into Run and Build tasks


# Notes:

1. Logging Levels for JUL: https://docs.oracle.com/javase/8/docs/api/java/util/logging/Level.html

1. Add gradle dep for jRuby Bundler and then use task to run a Bundler install command.

1. Getting the current ClassLoader: https://github.com/vert-x3/vertx-lang-js/commit/d4323889e71b21e35a873a73fb939eba53c2d0de#diff-a5533d7f2941dd2c95a4d7a28f1106afR294
https://docs.oracle.com/javase/7/docs/api/java/lang/ClassLoader.html#getResource(java.lang.String)

1. Active issue for simplify the GEM_PATH lookup: https://github.com/vert-x3/vertx-lang-js/issues/73

1. Does the use of the GEM_PATH using the absolute path classloader feature make the usage of static cached files not relevant? Do NPM files get cached?  What are the pros and cons?  see: http://vertx.io/docs/vertx-web/java/#_disabling_file_caching_on_disk for additional chaching docs about vertx.

1. Nashorn classloader docs: https://github.com/DaniHaag/snippets/wiki/Nashorn
