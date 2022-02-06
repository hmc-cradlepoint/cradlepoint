MongoSh Commands (needs DBadmin permission on 'cradlepoint' to run)
Validation currently only produces warnings, does not throw errors.
``` 
\\ Use this to update a collection's validation rules
db.runCommand({
  "collMod": "device",
  "validator": "Copy Json Validation rules here",
  "validationAction": "warn", 
  "validationLevel": "strict"
});

\\ Use To see all validation rules in a database
db.getCollectionInfos()
```
Wasn't sure what filetype to use for the files in this dir, but they describe the validation rules for each collection.
