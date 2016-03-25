###############################
#           Env               #

import sys
from BCBio import GFF
from sqlalchemy import create_engine
from pandas.io import sql
import pandas as pd
import numpy as np
import json
import re
import ast

import config
#import vcf

#to time the program:
import time

###################
#    SQL Engine   #

engine = create_engine('sqlite:////Users/caryn/Dropbox/Project_jsLearn/simple_genes/michael.db')
connect = engine.connect().connection

###############################
#          Methods            #

def sql_query():
	"""this returns a pandas data frame"""
	sql_st = '''SELECT gm1.gene_locus as regulator, net.regulator as netID_regulator, \
                    gm2.gene_locus as target, net.target as netID_target \
					FROM interaction_network as net \
					INNER JOIN gene_model as gm1 ON (net.regulator = gm1.id) \
					INNER JOIN gene_model as gm2 ON (net.target = gm2.id) \
					LIMIT 50'''
	data = sql.read_sql(sql_st, con=connect)
	return data

#get the MSU data for each of the targets
def parse_input( gene_str ):
	g_split = gene_str.split('g')[0]
	chrom_split = g_split.split('Os')[1]
	return chrom_split

def get_MSU_info ( gene ):
	chromNumber = parse_input(gene)
	#print chromNumber
	infoFile = config.CHROM_INFO_PATH[chromNumber]
	info = open(infoFile, 'r')
	gene_info = []
	myregex = r".*\s" + re.escape(gene) + r"\s.*"
	for line in info:
		if re.match(myregex, line):
			gene_info.append(line)
	#error message for not found:
	if (len(gene_info) == 0):
		error = "Gene not found."
		return error
	
	#check for multiple isoform information
	#print len(gene_info)
	if (len(gene_info) > 1):
		maxlen = 0
		gene_info_keep = []
		#get the lengths of all the gene isoforms
		for line in gene_info:
			splitline = line.split('\t')
			length = int(splitline[4]) - int(splitline[3])
			if (length > maxlen):
				maxlen = length
				gene_info_keep = [line]
		gene_info_keep =  gene_info_keep[0].split('\t')
		return gene_info_keep
	
	#if there are no isoforms, return gene_info
	gene_info = gene_info[0].split('\t')
	return gene_info

def get_start_stop ( info_line ):
	splitline = info_line[0].split('\t')
	info = {
		"chrom" : splitline[0],
		"gene_id" : splitline[1],
		"start" : int(splitline[3]),
		"end" : int(splitline[4]),
		"annotation" : splitline[9]
	}
	return info

#Get the Provean prediction 
def get_PROVEAN_scores (gene) :
	provean = open(config.PROVEAN, 'r')
	provean_info = []
	myregex = r"(.*)" + re.escape(gene) + r"(.*)"
	for line in provean:
		if re.match(myregex, line):
			provean_info.append(line)
	if (len(provean_info) == 0):
		return 1
	provean_info = provean_info[0].split('\n')[0]
	provean_list = provean_info.split('\t')
	return provean_list

#add these together and make into a JSON fro JS

def json_by_gene ( gene ):
	#get MSU info, this is a list
	msu = get_MSU_info(gene)

	#get provean info, this is a list
	provean = get_PROVEAN_scores(gene)
	if (provean == 1) :
		results = {
			"gene_id" : gene,
			"msu_gene_id" : msu[1],
			"chrom" : msu[0],
			"start" : msu[3],
			"end" : msu[4],
			"annotation" : msu[9],
			"provean_delscores" : "gene not found",
			"provean_mutations" : "gene not found"
		}
	else:
		results = {
			"gene_id" : gene,
			"msu_gene_id" : msu[1],
			"chrom" : msu[0],
			"start" : msu[3],
			"end" : msu[4],
			"annotation" : msu[9],
			"provean_delscores" : provean[7],
			"provean_mutations" : provean[6]
		}
	return results



def create_json (sql_result) :
	results = []
	for index, row in sql_result.iterrows():
		regulator = row['regulator']
		#print regulator
		target = row['target']
		#print target
		interaction = {
			"regulator" : regulator,
			"netID_regulator" : row['netID_regulator'],
			"target" : target,
			"netID_target" : row['netID_target']
		}
		#regulator stuff
		reg = json_by_gene(regulator)
		targ = json_by_gene(target)
		interaction["regulator_info"] = reg
		interaction["target_info"] = targ
		results.append(interaction)
	res_json = json.dumps(results)
	return res_json



###############################
#            Main             #

if __name__ == '__main__':
	#file, json = sys.argv
	sql_res = sql_query()
	final = create_json(sql_res)
	print final

	sys.stdout.flush()

