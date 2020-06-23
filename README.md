# Declarapi example

An example project using [declarapi](https://github.com/mmagyar/declarapi).


## How to install?

```
npm install
```

Git clone https://github.com/mmagyar/declarapi next to this repo, cd there and run:

```
npm run generate:dev ../declarapi-example/src/api-schema/api-schema.json ../declarapi-example/src/generated-code
```

This will generate the API code in `src/generated-code`.


## How to run?

```
npm run start
```

Now you can access the server at http://localhost:8080/


## How to test?

```
./test.sh
```

This will start the server on port 9876, run the tests and stop the server.
