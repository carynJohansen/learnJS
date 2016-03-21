###############################
#           Env               #

import sys
from BCBio import GFF
import numpy as np
import pandas as pd
import json
import re
import json

#import config
import vcf

#import configuration script
import config

###############################
#          Methods            #

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
		print 1
		sys.exit()
	
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

		gene_info_keep = gene_info_keep[0].split('\n')[0]
		gene_info_list = gene_info_keep.split('\t')
		return gene_info_list
	
	#if there are no isoforms, return gene_info
	gene_info = gene_info[0].split('\n')[0]
	gene_info_list = gene_info.split('\t')

	return gene_info_list

def get_PROVEAN_scores (gene) :
	provean = open(config.PROVEAN, 'r')
	provean_info = []
	myregex = r"(.*)" + re.escape(gene) + r"(.*)"
	for line in provean:
		if re.match(myregex, line):
			provean_info.append(line)
	provean_info = provean_info[0].split('\n')[0]
	provean_list = provean_info.split('\t')

	return provean_list

def compose_gene_dict (gene) :
	provean_list = get_PROVEAN_scores(gene)
	msu_info = get_MSU_info(gene)
	
	gene_dict = {
		"chromosome" : msu_info[0],
		"gene" : msu_info[1],
		"start" : msu_info[3],
		"end" : msu_info[4],
		"annotation" : msu_info[9],
		"p_transcript_id" : provean_list[0],
		"p_minimumScore" : provean_list[1],
		"p_sumScore" : provean_list[2],
		"p_deleteriousCount" : int(provean_list[3]),
		"p_proteinLength" : int(provean_list[4]),
		"p_proportionDeleterious" : provean_list[5],
		"p_deleteriousMutations" : provean_list[6],
		"p_deleteriousScores" : provean_list[7]
	}
	return gene_dict


###############################
#            Main             #

if __name__ == '__main__':
	file, gene = sys.argv
	
	gene_info = compose_gene_dict(gene)
	print gene_info
	sys.stdout.flush()
