###############################
#           Env               #

import sys
from BCBio import GFF
from sqlalchemy import create_engine
import numpy as np
import pandas as pd
import json
import re
import ast

#import config
#import vcf

#to time the program:
import time

###################
#    SQL Engine   #

#engine = create_engine('sqlite:////Users/caryn/Dropbox/Project_jsLearn/simple_genes/michael.db')
#connect = engine.connect().connection

###############################
#          Methods            #

def get_vcf_reader():
	return vcf.Reader(open('/Users/caryn/Dropbox/Project_RiceGeneticVariation/data/rice_chr2_3.vcf.gz', 'r'))

def parse_input( gene_str ):
	g_split = gene_str.split('g')[0]
	chrom_split = g_split.split('Os')[1]
	return chrom_split

def create_sql_query ( input_str ):
	input_json = ast.literal_eval(input_str)
	print input_json['select']



###############################
#            Main             #

if __name__ == '__main__':
	#file, json = sys.argv
	json = '{"select" : "all_genes","category" : "target", "snpeff" : ["START","INTRON","NSC"], "landrace" : ["japonica","tropical_japonica","indica","aus"]}'
	create_sql_query(json)