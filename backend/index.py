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
