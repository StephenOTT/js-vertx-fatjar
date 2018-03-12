# js-vertx-fatjar
A boilerplate project for Vert.x using Javascript and gradle to generate fatjars

# Quickstart

1. Add NPM Dependencies: `./gradle npmInstall`

1. Add RubyGem Dependencies: `./gradle bundleInstall`

1. Run the app: `./gradlew run`

1. Build FatJar: `./gradlew shadowJar` which will build the fatJar in `./build/libs/js-vertx-fatjar-0.1.0-fat.jar`

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

1. Does the use of the GEM_PATH using the absolute path classloader feature make the usage of static cached files not relevant? Do NPM files get cached?  What are the pros and cons?