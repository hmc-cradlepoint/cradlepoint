#!/bin/bash

# Fill in DB Credentials
# USER=
# PASS=

# Get Data
devices=$(<data/devices.json)
engagements=$(<data/engagements.json)
results=$(<data/results.json)
testCases=$(<data/testCases.json)
testPlans=$(<data/testPlans.json)
tests=$(<data/tests.json)

# SSH to Mongo & Delete all data
ssh -tt clinic2021@134.173.43.35 << EOF
  mongosh -u $USER -p $PASS
  use cradlepoint
  db.device.insertMany($devices, {})
  db.engagements.insertMany($engagements, {})
  db.result.insertMany($results, {})
  db.testCases.insertMany($testCases, {})
  db.testPlan.insertMany($testPlans, {})
  db.tests.insertMany($tests, {})
EOF



# NOTE: To define and use a var in the above format, make sure to escape \$VARNAME
