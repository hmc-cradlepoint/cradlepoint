#!/bin/bash

# Fill in DB Credentials
# USER=
# PASS=

# SSH to Mongo & Delete all data
ssh -tt clinic2021@134.173.43.35 << EOF
  mongosh -u $USER -p $PASS
  use cradlepoint
  db.device.deleteMany({})
  db.engagements.deleteMany({})
  db.result.deleteMany({})
  db.testCases.deleteMany({})
  db.testPlan.deleteMany({})
  db.tests.deleteMany({})
EOF

# NOTE: To define and use a var in the above format, make sure to escape \$VARNAME