UI_UI_LOGS
parses log files and draws graphs


USAGE
In the terminal window do:

node server.js
Wait for several seconds. Then open in the browser:

http://localhost:3000/


DESCRIPTION
The application works with exporting .csv files from Kibana. If you want to see the statistics, you need to go to the Kibana website. The link is given below. The filter is already configured. You only have to choose the dates. Unfortunately, Kibana cannot export files that are too large, as it reduces them, so you need to export reports in 3 days call them "report_(report number)" and put them into the current directory. This is important because the application counts the number of days and searches in the format.csv by their names.

THE LINK FOR EXPORTING DATA
https://iris-production.kb.europe-west4.gcp.elastic-cloud.com:9243/app/r/s/n3c0p
