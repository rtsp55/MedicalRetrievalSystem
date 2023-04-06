import os
import math
import pickle

from google.cloud import storage

from index import InvertedIndex
from util import IdMap, preprocess_text

storage_client = storage.Client()
bucket = storage_client.bucket("gcf-sources-436560475999-asia-southeast2")


class BSBIIndex:
    
    def __init__(self, output_dir, postings_encoding, index_name="main_index"):
        self.term_id_map = IdMap()
        self.doc_id_map = IdMap()
        self.output_dir = output_dir
        self.index_name = index_name
        self.postings_encoding = postings_encoding

    def load(self):

        with bucket.blob(os.path.join(self.output_dir, 'terms.dict')).open('rb') as f:
            self.term_id_map = pickle.load(f)
        with bucket.blob(os.path.join(self.output_dir, 'docs.dict')).open('rb') as f:
            self.doc_id_map = pickle.load(f)

    def retrieve_bm25(self, query, k=10, k1=1.5, b=0.75):
       
        
        self.load()

        
        scores = {}
        query = preprocess_text(query)
        
        with InvertedIndex(self.index_name, self.postings_encoding, directory=self.output_dir) as index:
            for word in query:
                if word not in self.term_id_map:
                    continue
                term_id = self.term_id_map[word]

                
                idf_score = math.log(
                    len(index.doc_length) / index.postings_dict[term_id][1])

                postings_list = index.get_postings_list(term_id)
                for i in range(len(postings_list[0])):
                    doc_id, tf = postings_list[0][i], postings_list[1][i]
                    doc_name = self.doc_id_map[doc_id]

                    
                    bm25_score = idf_score
                    bm25_score *= (tf * (k1 + 1))
                    bm25_score /= (k1 * ((1 - b) + b *
                                   (index.doc_length[doc_id] / index.avg_doc_length)) + tf)

                    if doc_name not in scores:
                        scores[doc_name] = 0

                    scores[doc_name] = scores[doc_name] + bm25_score

        
        return [(doc_name, score) for (score, doc_name) in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]]
class VBEPostings:

    @staticmethod
    def vb_decode(encoded_bytestream):
        
        numbers = []
        n = 0

        for i in range(len(encoded_bytestream)):
            if encoded_bytestream[i] < 128:
                n = 128 * n + encoded_bytestream[i]
            else:
                n = 128 * n + encoded_bytestream[i] - 128
                numbers.append(n)
                n = 0

        return numbers

    @staticmethod
    def decode(encoded_postings_list):
       
        gap_list = VBEPostings.vb_decode(encoded_postings_list)

        postings_list = [gap_list[0]]
        for i in range(1, len(gap_list)):
            postings_list.append(postings_list[i-1] + gap_list[i])

        return postings_list

    @staticmethod
    def decode_tf(encoded_tf_list):
        
        return VBEPostings.vb_decode(encoded_tf_list)
import os
import pickle

from google.cloud import storage

storage_client = storage.Client()
bucket = storage_client.bucket("gcf-sources-436560475999-asia-southeast2")


class InvertedIndex:

    def __init__(self, index_name, postings_encoding, directory=''):
   

        self.index_file_path = os.path.join(directory, index_name+'.index')
        self.metadata_file_path = os.path.join(directory, index_name+'.dict')

        self.postings_encoding = postings_encoding
        self.directory = directory

        self.postings_dict = {}
        self.terms = []

        self.doc_length = {}
        self.avg_doc_length = 0

    def __enter__(self):

        self.index_file = bucket.blob(self.index_file_path).open('rb')

        with bucket.blob(self.metadata_file_path).open('rb') as f:
            self.postings_dict, self.terms, self.doc_length = pickle.load(f)
            self.term_iter = self.terms.__iter__()

        self.avg_doc_length = sum(
            self.doc_length.values()) / len(self.doc_length)

        return self

    def __exit__(self, *_):
      
        # Menutup index file
        self.index_file.close()

        # Menyimpan metadata (postings dict dan terms) ke file metadata dengan bantuan pickle
        with bucket.blob(self.metadata_file_path).open('wb') as f:
            pickle.dump([self.postings_dict, self.terms, self.doc_length], f)

    def get_postings_list(self, term):
       
        try:
            posting = self.postings_dict[term]

            self.index_file.seek(posting[0])

            encoded_postings_list = self.index_file.read(posting[2])
            encoded_tf_list = self.index_file.read(posting[3])

            postings_list = self.postings_encoding.decode(
                encoded_postings_list)
            tf_list = self.postings_encoding.decode_tf(encoded_tf_list)

            return (postings_list, tf_list)
        except:
            return []
import os
from string import punctuation

import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer

root = os.path.dirname(os.path.abspath(__file__))
download_dir = os.path.join(root, 'nltk_data')
os.chdir(download_dir)
nltk.data.path.append(download_dir)

stemmer = SnowballStemmer('english')
stop_words = stopwords.words('english')

punctuation = list(punctuation)


class IdMap:
   

    def __init__(self):
        
        self.str_to_id = {}
        self.id_to_str = []

    def __len__(self):
        
        return len(self.id_to_str)

    def __get_str(self, i):
        
        return self.id_to_str[i]

    def __get_id(self, s):
        
        if s in self.str_to_id:
            return self.str_to_id[s]

        new_id = len(self.id_to_str)

        self.str_to_id[s] = new_id
        self.id_to_str.append(s)

        return new_id

    def __getitem__(self, key):
        
        if type(key) is int:
            return self.__get_str(key)
        elif type(key) is str:
            return self.__get_id(key)
        else:
            raise TypeError


def preprocess_text(text):  
    
    tokenized_text = word_tokenize(text)
    stemmed_text = [stemmer.stem(word) for word in tokenized_text]
    stopword_removed_text = [
        word for word in stemmed_text if word not in stop_words and word not in punctuation]

    return stopword_removed_text
