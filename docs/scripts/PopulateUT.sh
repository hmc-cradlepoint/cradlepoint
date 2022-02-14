#!/bin/bash

# Fill in DB Credentials
USER=admin
PASS=correcthorsebatteryalien

# Store Test Data Vars
value=$(<data/userType.json)
echo "$value"

# SSH to Mongo & Delete all data
ssh -tt clinic2021@134.173.43.35 << EOF
  mongosh -u $USER -p $PASS
  use cradlepoint
  db.userTypes.find()
  db.userTypes.insertMany($value , {})
  db.userTypes.find()
EOF

# NOTE: To define and use a var in the above format, make sure to escape \$VARNAME