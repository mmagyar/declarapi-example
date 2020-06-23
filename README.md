# Declarapi example

An example project using [declarapi](https://github.com/mmagyar/declarapi).


## How to install?

```
npm install
```

Generate the API code:

```
npm run generate -- src/api-schema/api-schema.json ./src/generated-code && rm ./src/generated-code/api-schema-client.ts
```


## How to run?

```
npm run start
```

Now you can access the server at http://localhost:8080/


## How to develop?

```
npm run dev
```

This will start the server and recompile/reload it every time you change the code.


## How to test?

```
./test.sh
```

This will start the server on port 9876, run the tests and stop the server.
