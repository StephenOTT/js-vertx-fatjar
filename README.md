# js-vertx-fatjar
A boilerplate project for Vert.x using Javascript and gradle to generate fatjars

## What does this thing do?!

This is a Vertx.io boilerplate project that uses Gradle as a build system to run Vertx instances for development, and create FatJar executables for production use.  The repo includes a Dockerfile showing how to deploy the FatJar in a Docker environment.

Why does this matter?  Well, because it is a Javascript Vertx verticles deployment.  Meaning that you dont have to write Java. You can use your JavaScript knowledge and take full advanage of Vertx and the "extras" and Java provides.  It also includes a Ruby verticle for showing how to leverage the Vertx Polyglot capabilities.

Anything else?  Yes... Because we are using the [gradle](https://gradle.org) build system we also the get to leverage NPM, Yarn, Gulp, and Bower for JS dependencies.  Currently NPM is setup and you can control the dependencies with the package.json file, just like a regular Node project.  The Ruby dependencies are downloaded with the Bundler gem and RubyGems.  You can update the Gemfile file with the dependencies for Ruby verticles.

This gives us a really powerful build system, multi-language dependency mamagement system, and deployment system, wrapped in a relatively simple setup.  We get JS/NPM + Ruby/RubyGems + Java/Maven all wrapped in a nice to use package, and we can package our build into a single FatJar.

Check out the `app` folder and the `app/MyJavaScriptVerticle.js` entry verticle, and... Get Started Right Now!!

### Vertx CLI Docker alternative

See: 
https://github.com/DigitalState/camunda-worker-vertx/tree/master/worker for an example of a Docker based Vertx CLI example of the same poject.  This does not use Gradle and is more pure Vetx + Vertx Stack Manager + Docker.  
See:
https://github.com/DigitalState/camunda-worker-vertx/tree/feature-ruby-rubygems-stackmanager/worker for a Ruby variation that downloads the Gems through the Dockerfile from RubyGems.


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

```console
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


# Dockerfile usage

Inlcuded in this project is a dockerfile that can be used to build an image with the FatJar.

The dockerfile depends on the `./build/lib/js-vertx-fatjar-0.1.0-fat.jar` and `./vertx-config.json` files.

Once you have the FatJar generated, you can run the following from the root of the project:

1. `docker build -t fatjar/js-vertx .`
    which will result in the following:
    ```console
    Sending build context to Docker daemon  64.01MB
    Step 1/12 : FROM java:8-jre
    ---> e44d62cf8862
    Step 2/12 : ENV VERTICLE_FILE js-vertx-fatjar-0.1.0-fat.jar
    ---> Using cache
    ---> 9a290df84557
    Step 3/12 : ENV CONFIG_JSON_FILE vertx-config.json
    ---> Using cache
    ---> 713eefc4a516
    Step 4/12 : ENV VERTICLE_HOME /usr/verticles
    ---> Using cache
    ---> 559a89eb1858
    Step 5/12 : EXPOSE 8080
    ---> Using cache
    ---> d5f72273653d
    Step 6/12 : EXPOSE 8081
    ---> Running in 38a8cbe565e1
    Removing intermediate container 38a8cbe565e1
    ---> e3767329bfb6
    Step 7/12 : EXPOSE 8086
    ---> Running in 23bdc14cf854
    Removing intermediate container 23bdc14cf854
    ---> 386c166d44c6
    Step 8/12 : COPY build/libs/$VERTICLE_FILE $VERTICLE_HOME/
    ---> 2b6e1847dd65
    Step 9/12 : COPY $CONFIG_JSON_FILE $VERTICLE_HOME/
    ---> 515b29356808
    Step 10/12 : WORKDIR $VERTICLE_HOME
    Removing intermediate container 8c216df18942
    ---> 5cf7ff914391
    Step 11/12 : ENTRYPOINT ["sh", "-c"]
    ---> Running in 042e70e58e06
    Removing intermediate container 042e70e58e06
    ---> ed865eba45b8
    Step 12/12 : CMD ["exec java -jar $VERTICLE_FILE -conf $CONFIG_JSON_FILE"]
    ---> Running in 7a227e7bcb5e
    Removing intermediate container 7a227e7bcb5e
    ---> 9d476cdb9ddf
    Successfully built 9d476cdb9ddf
    Successfully tagged fatjar/js-vertx:latest
    ``` 
2. `docker run fatjar/js-vertx`
    which will result in the following:
    ```console
    config.json contents:
    {"mykey":"myvalue"}
    ruby_gems absolute path: file:/usr/verticles/js-vertx-fatjar-0.1.0-fat.jar!/ruby_gems
    Starting primary verticle
    Succeeded in deploying verticle
    true
    Starting 2 Verticle
    Starting 3 Verticle
    2018-03-13 17:04:58 -0400
    2018-03-13 11:00:00 -0400
    2018-03-13 09:15:00 -0400
    ```

You can also go to:

1. `localhost:8080` (being served by `./MyJavaScriptVerticle.js`)
1. `localhost:8081` (being served by `./app/verticles/vert2/MyJavaScriptVerticle2.js`)
1. `localhost:8086` (being served by `./app/verticles/vert3/MyJavaScriptVerticle3.js`)

# Notes:

1. Logging Levels for JUL: https://docs.oracle.com/javase/8/docs/api/java/util/logging/Level.html

1. Add gradle dep for jRuby Bundler and then use task to run a Bundler install command.

1. Getting the current ClassLoader: https://github.com/vert-x3/vertx-lang-js/commit/d4323889e71b21e35a873a73fb939eba53c2d0de#diff-a5533d7f2941dd2c95a4d7a28f1106afR294
https://docs.oracle.com/javase/7/docs/api/java/lang/ClassLoader.html#getResource(java.lang.String)

1. Active issue for simplify the GEM_PATH lookup: https://github.com/vert-x3/vertx-lang-js/issues/73

1. Does the use of the GEM_PATH using the absolute path classloader feature make the usage of static cached files not relevant? Do NPM files get cached?  What are the pros and cons?  see: http://vertx.io/docs/vertx-web/java/#_disabling_file_caching_on_disk for additional chaching docs about vertx.

1. Nashorn classloader docs: https://github.com/DaniHaag/snippets/wiki/Nashorn
