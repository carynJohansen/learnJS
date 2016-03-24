###############################
#           Env               #

import sys
from BCBio import GFF
from sqlalchemy import create_engine
import numpy as np
import pandas as pd
import json
import re

#import config
import vcf

#to time the program:
import time

###################
#    SQL Engine   #

engine = create_engine('sqlite:////Users/caryn/Dropbox/Project_jsLearn/simple_genes/michael.db')
connect = engine.connect().connection

###############################
#          Methods            #

def get_vcf_reader():
	return vcf.Reader(open('/Users/caryn/Dropbox/Project_RiceGeneticVariation/data/rice_chr2_3.vcf.gz', 'r'))


###############################
#            Main             #

if __name__ == '__main__':
	file, json = sys.argv