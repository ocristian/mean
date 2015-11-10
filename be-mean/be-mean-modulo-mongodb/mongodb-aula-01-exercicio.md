# MongoDB - Aula 01 - Exercício
autor: Cristian R. Silva

## Importando os restaurantes

```
mongoimport --db be-mean --collection restaurantes --drop --file restaurantes.json 
2015-11-10T00:07:21.574-0200    connected to: localhost
2015-11-10T00:07:21.575-0200    dropping: be-mean.restaurantes
2015-11-10T00:07:23.081-0200    imported 25359 documents
```

## Contando os restaurantes

    ```
    db.restaurantes.find({}).count()
    25359
    ```

