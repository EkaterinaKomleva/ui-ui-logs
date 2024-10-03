UI_UI_LOGS
parses log files and draws graphs


USAGE
In the terminal window do:

node server.js
Wait for several seconds. Then open in the browser:

http://localhost:3000/


DESCRIPTION
There are four report files in this repo. Each of them was exported from kibana and includes period of time 3 days. It is importand because the application counts amount of days. If you want to update data you should delete old reports from the repo and export the new ones (the step is 3 days) and name them as "report_(number of report)".

THE LINK FOR EXPORTING DATA
https://iris-production.kb.europe-west4.gcp.elastic-cloud.com:9243/app/r/s/n3c0p