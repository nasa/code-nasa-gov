# IMPORTANT: A daily cronjob on tiprod runs this script 

import json
import requests
from datetime import datetime
from subprocess import Popen, PIPE

# User-set constants
CODE_URL = 'https://raw.githubusercontent.com/nasa/Open-Source-Catalog/master/code.json'
CATALOG_OUT_LOCATION = '/var/www/code/docroot/data/catalog.json'
CATALOG_BACKUP_DIR = '/var/www/code/docroot/catalog_backups'
CURRENT_CATALOG_FILE = '/var/www/code/docroot/data/catalog.json'

# Computed constants
CATALOG_BACKUP_FILE = '/catalog.json.' + datetime.today().strftime('%Y-%m-%d')
CATALOG_BACKUP_FULL_PATH = CATALOG_BACKUP_DIR + CATALOG_BACKUP_FILE

# Helper to extract all contributor data from code.json format to catalog.json 
# format
def getContribs(full_contribs):
	
	out_contribs = []
	
	for c in full_contribs:
		try:
			if c['name']:
				out_contribs += [ c['name'] ]
		except: pass
		try:
			if c['email']:
				out_contribs += [ c['email'] ]
		except: pass
		try:
			if c['github']:
				out_contribs += [ c['github'] ]
		except: pass

	return out_contribs

res = requests.get(CODE_URL)
code_projs = res.json()['releases']

cat_projs = []

# Iterate through all projects from code.json
for p in code_projs:
	
	new_proj = {}
	
    # Check if project is open source 
	if p['permissions']['usageType'] == 'openSource':

		new_proj['Update_Date'] = p['date']['metadataLastUpdated']
		new_proj['Description'] = p['description']
		new_proj['Public Code Repo'] = p['repositoryURL']
		new_proj['NASA Center'] = p['organization']
		new_proj['Contributors'] = getContribs(p['contributors'])
		new_proj['Labor_Hours'] = p['laborHours']
		new_proj['Categories'] = p['tags']
		new_proj['Languages'] = []
		new_proj['Software'] = p['name']
		new_proj['License'] = [ l['name'] for l in p['permissions']['licenses'] ] 
		
		try:
			new_proj['Categories_NLP'] = p['sti_keywords_passed_thresholds']

		except:
			new_proj['Categories_NLP'] = []

		try:
			new_proj['External Link'] = p['homepageURL']
		except:
			try:
				new_proj['External Link'] = p['disclaimerURL']
			except: 
				new_proj['External Link'] = ""
		
		cat_projs += [new_proj]

# Check if new catalog items successfuly generated
if len(cat_projs) > 500:
	
	# Move old catalog.json to backup dir
	process = Popen(['cp', CURRENT_CATALOG_FILE, CATALOG_BACKUP_FULL_PATH], stdout=PIPE, stderr=PIPE)
	stdout, stderr = process.communicate()
	print (stderr)

	# Write out new catalog.json
	f = open(CURRENT_CATALOG_FILE, 'w+')
	f.write(json.dumps(cat_projs, indent=4))
	f.close()

